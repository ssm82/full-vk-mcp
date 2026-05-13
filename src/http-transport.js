import express from 'express';
import { randomUUID } from 'crypto';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { createMcpServer } from './server-factory.js';

const PORT = parseInt(process.env.VK_MCP_PORT || process.env.PORT, 10) || 3000;
const HOST = process.env.VK_MCP_HOST || '127.0.0.1';
const AUTH_TOKEN = process.env.VK_MCP_AUTH_TOKEN || null;

function isInitializeRequest(body) {
  if (!body) return false;
  if (Array.isArray(body)) {
    return body.some(item => item?.method === 'initialize');
  }
  return body.method === 'initialize';
}

function safeClose(resource) {
  try {
    const result = resource?.close?.();
    if (result && typeof result.catch === 'function') {
      result.catch(() => {});
    }
  } catch {
    // Ignore close errors
  }
}

function authMiddleware(req, res, next) {
  if (!AUTH_TOKEN) return next();

  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (token !== AUTH_TOKEN) {
    res.status(401).json({
      jsonrpc: '2.0',
      error: { code: -32001, message: 'Unauthorized' },
      id: null,
    });
    return;
  }

  next();
}

function corsMiddleware(req, res, next) {
  const origin = process.env.VK_MCP_CORS_ORIGIN || '*';

  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, Mcp-Session-Id, mcp-session-id'
  );
  res.setHeader('Access-Control-Expose-Headers', 'Mcp-Session-Id');

  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }

  next();
}

export async function startHttpServer() {
  const isLoopback = HOST === '127.0.0.1' || HOST === 'localhost' || HOST === '::1';

  if (!isLoopback && !AUTH_TOKEN) {
    console.error('[VK MCP] FATAL: VK_MCP_AUTH_TOKEN is required when binding to non-loopback address.');
    process.exit(1);
  }

  const app = express();

  app.use(corsMiddleware);
  app.use(express.json({ limit: '4mb' }));

  app.get('/', (req, res) => {
    res.json({
      name: 'vk-mcp-server',
      transport: 'streamable-http',
      endpoints: {
        mcp: '/mcp',
        sse: '/sse',
        health: '/health',
      },
    });
  });

  app.get('/health', (req, res) => {
    res.json({ status: 'ok', name: 'vk-mcp' });
  });

  const httpSessions = new Map();

  app.post('/mcp', authMiddleware, async (req, res) => {
    const sessionId = req.headers['mcp-session-id'];

    try {
      let session = null;

      if (sessionId && httpSessions.has(sessionId)) {
        session = httpSessions.get(sessionId);
      } else if (!sessionId && isInitializeRequest(req.body)) {
        const server = await createMcpServer();

        const transport = new StreamableHTTPServerTransport({
          sessionIdGenerator: () => randomUUID(),
          onsessioninitialized: (newSessionId) => {
            httpSessions.set(newSessionId, {
              transport,
              server,
            });

            console.error(`[VK MCP] HTTP session initialized: ${newSessionId}`);
          },
        });

        transport.onclose = () => {
          const closedSessionId = transport.sessionId;

          if (closedSessionId) {
            httpSessions.delete(closedSessionId);
            console.error(`[VK MCP] HTTP session closed: ${closedSessionId}`);
          }

          safeClose(server);
        };

        await server.connect(transport);

        session = {
          transport,
          server,
        };
      } else {
        res.status(400).json({
          jsonrpc: '2.0',
          error: {
            code: -32000,
            message: 'Bad Request: missing or invalid Mcp-Session-Id',
          },
          id: null,
        });
        return;
      }

      await session.transport.handleRequest(req, res, req.body);
    } catch (error) {
      console.error('[VK MCP] POST /mcp error:', error.message);

      if (!res.headersSent) {
        res.status(500).json({
          jsonrpc: '2.0',
          error: { code: -32603, message: 'Internal error' },
          id: null,
        });
      }
    }
  });

  app.get('/mcp', authMiddleware, async (req, res) => {
    const sessionId = req.headers['mcp-session-id'];
    const session = sessionId ? httpSessions.get(sessionId) : null;

    if (!session) {
      res.status(400).json({
        jsonrpc: '2.0',
        error: {
          code: -32000,
          message: 'Bad Request: missing or invalid Mcp-Session-Id',
        },
        id: null,
      });
      return;
    }

    try {
      await session.transport.handleRequest(req, res);
    } catch (error) {
      console.error('[VK MCP] GET /mcp error:', error.message);

      if (!res.headersSent) {
        res.status(500).json({
          jsonrpc: '2.0',
          error: { code: -32603, message: 'Internal error' },
          id: null,
        });
      }
    }
  });

  app.delete('/mcp', authMiddleware, async (req, res) => {
    const sessionId = req.headers['mcp-session-id'];
    const session = sessionId ? httpSessions.get(sessionId) : null;

    if (!session) {
      res.status(400).json({
        jsonrpc: '2.0',
        error: {
          code: -32000,
          message: 'Bad Request: missing or invalid Mcp-Session-Id',
        },
        id: null,
      });
      return;
    }

    try {
      await session.transport.handleRequest(req, res);
    } catch (error) {
      console.error('[VK MCP] DELETE /mcp error:', error.message);

      if (!res.headersSent) {
        res.status(500).json({
          jsonrpc: '2.0',
          error: { code: -32603, message: 'Internal error' },
          id: null,
        });
      }
    }
  });

  const sseSessions = new Map();

  app.get('/sse', authMiddleware, async (req, res) => {
    try {
      const transport = new SSEServerTransport('/messages', res);
      const server = await createMcpServer();

      sseSessions.set(transport.sessionId, {
        transport,
        server,
      });

      console.error(`[VK MCP] SSE session initialized: ${transport.sessionId}`);

      res.on('close', () => {
        sseSessions.delete(transport.sessionId);
        safeClose(transport);
        safeClose(server);
        console.error(`[VK MCP] SSE session closed: ${transport.sessionId}`);
      });

      await server.connect(transport);
    } catch (error) {
      console.error('[VK MCP] GET /sse error:', error.message);
      if (!res.headersSent) res.status(500).end();
    }
  });

  app.post('/messages', authMiddleware, async (req, res) => {
    const sessionId = req.query.sessionId;
    const session = sseSessions.get(sessionId);

    if (!session) {
      res.status(404).json({
        jsonrpc: '2.0',
        error: { code: -32001, message: 'Session not found' },
        id: null,
      });
      return;
    }

    try {
      await session.transport.handlePostMessage(req, res, req.body);
    } catch (error) {
      console.error('[VK MCP] POST /messages error:', error.message);

      if (!res.headersSent) {
        res.status(500).json({
          jsonrpc: '2.0',
          error: { code: -32603, message: 'Internal error' },
          id: null,
        });
      }
    }
  });

  app.listen(PORT, HOST, () => {
    console.error(`[VK MCP] HTTP transport listening on http://${HOST}:${PORT}`);
    console.error(`[VK MCP]   Streamable HTTP: http://${HOST}:${PORT}/mcp`);
    console.error(`[VK MCP]   SSE legacy:       http://${HOST}:${PORT}/sse`);
    console.error(`[VK MCP]   Health:           http://${HOST}:${PORT}/health`);

    if (AUTH_TOKEN) {
      console.error('[VK MCP]   Auth: Bearer token required');
    } else {
      console.error('[VK MCP]   Auth: DISABLED');
    }
  });
}
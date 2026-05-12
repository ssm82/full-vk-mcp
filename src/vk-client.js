export class VKClient {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.apiVersion = '5.199';
    this.baseUrl = 'https://api.vk.com/method';
  }

  async call(method, params = {}, { timeoutMs = 30000 } = {}) {
    const normalized = {};
    for (const [k, v] of Object.entries(params)) {
      if (v === undefined || v === null) continue;
      if (typeof v === 'boolean') {
        normalized[k] = v ? '1' : '0';
      } else if (Array.isArray(v)) {
        normalized[k] = v.join(',');
      } else {
        normalized[k] = String(v);
      }
    }

    const body = new URLSearchParams({
      ...normalized,
      access_token: this.accessToken,
      v: this.apiVersion,
    });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(`${this.baseUrl}/${method}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
        signal: controller.signal,
      });

      const text = await response.text();

      if (!response.ok) {
        const safeText = text.replace(this.accessToken, '***');
        throw new Error(`VK HTTP Error ${response.status}: ${safeText}`);
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        const safeText = text.replace(this.accessToken, '***');
        throw new Error(`VK API returned non-JSON response: ${safeText}`);
      }

      if (data.error) {
        const code = data.error.error_code;
        const msg = data.error.error_msg;
        throw new Error(`VK API Error ${code}: ${msg}`);
      }

      return data.response;
    } catch (err) {
      if (err.name === 'AbortError') {
        throw new Error(`VK API timeout after ${timeoutMs}ms for method ${method}`);
      }
      throw err;
    } finally {
      clearTimeout(timeout);
    }
  }
}

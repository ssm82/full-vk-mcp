#!/usr/bin/env node
/**
 * VK MCP Server
 *
 * Model Context Protocol server для VK (ВКонтакте) API
 * Позволяет AI-ассистентам взаимодействовать с VK через стандартизированный интерфейс
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// ============================================
// VK CLIENT
// ============================================

const VK_API_VERSION = '5.199';
const VK_API_BASE = 'https://api.vk.com/method';

class VKClient {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.apiVersion = VK_API_VERSION;
  }

  async call(method, params = {}) {
    const body = new URLSearchParams({
      ...params,
      access_token: this.accessToken,
      v: this.apiVersion,
    });

    const response = await fetch(`${VK_API_BASE}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(`VK API Error ${data.error.error_code}: ${data.error.error_msg}`);
    }

    return data.response;
  }

  // Users
  usersGet(params) { return this.call('users.get', params); }

  // Wall
  wallGet(params) { return this.call('wall.get', params); }
  wallGetById(params) { return this.call('wall.getById', params); }
  wallPost(params) { return this.call('wall.post', params); }
  wallEdit(params) { return this.call('wall.edit', params); }
  wallDelete(params) { return this.call('wall.delete', params); }
  wallCreateComment(params) { return this.call('wall.createComment', params); }

  // Groups
  groupsGet(params) { return this.call('groups.get', { ...params, extended: 1 }); }
  groupsGetById(params) { return this.call('groups.getById', params); }

  // Friends
  friendsGet(params) { return this.call('friends.get', params); }

  // Newsfeed
  newsfeedGet(params) { return this.call('newsfeed.get', params); }

  // Stats
  statsGet(params) { return this.call('stats.get', params); }

  // Photos
  photosGet(params) { return this.call('photos.get', params); }
  photosGetAll(params) { return this.call('photos.getAll', params); }
  photosGetAlbums(params) { return this.call('photos.getAlbums', params); }
  photosGetAlbum(params) { return this.call('photos.getAlbum', params); }
  photosGetById(params) { return this.call('photos.getById', params); }
  photosGetComments(params) { return this.call('photos.getComments', params); }
  photosGetTags(params) { return this.call('photos.getTags', params); }
  photosGetNewTags(params) { return this.call('photos.getNewTags', params); }
  photosSearch(params) { return this.call('photos.search', params); }
  photosGetWallUploadServer(params) { return this.call('photos.getWallUploadServer', params); }
  photosGetMessagesUploadServer(params) { return this.call('photos.getMessagesUploadServer', params); }
  photosGetOwnerPhotoUploadServer(params) { return this.call('photos.getOwnerPhotoUploadServer', params); }
  photosGetChatUploadServer(params) { return this.call('photos.getChatUploadServer', params); }
  photosSaveWallPhoto(params) { return this.call('photos.saveWallPhoto', params); }
  photosSaveMessagesPhoto(params) { return this.call('photos.saveMessagesPhoto', params); }
  photosSaveOwnerPhoto(params) { return this.call('photos.saveOwnerPhoto', params); }
  photosSave(params) { return this.call('photos.save', params); }
  photosEdit(params) { return this.call('photos.edit', params); }
  photosMove(params) { return this.call('photos.move', params); }
  photosDelete(params) { return this.call('photos.delete', params); }
  photosRestore(params) { return this.call('photos.restore', params); }
  photosCreateAlbum(params) { return this.call('photos.createAlbum', params); }
  photosEditAlbum(params) { return this.call('photos.editAlbum', params); }
  photosDeleteAlbum(params) { return this.call('photos.deleteAlbum', params); }
  photosCreateComment(params) { return this.call('photos.createComment', params); }
  photosEditComment(params) { return this.call('photos.editComment', params); }
  photosDeleteComment(params) { return this.call('photos.deleteComment', params); }
  photosPutTag(params) { return this.call('photos.putTag', params); }
  photosRemoveTag(params) { return this.call('photos.removeTag', params); }
  photosReport(params) { return this.call('photos.report', params); }
  photosReportComment(params) { return this.call('photos.reportComment', params); }

  // Video
  videoGet(params) { return this.call('video.get', params); }
  videoGetAlbums(params) { return this.call('video.getAlbums', params); }
  videoGetAlbum(params) { return this.call('video.getAlbum', params); }
  videoGetComments(params) { return this.call('video.getComments', params); }
  videoGetTags(params) { return this.call('video.getTags', params); }
  videoGetNewTags(params) { return this.call('video.getNewTags', params); }
  videoGetById(params) { return this.call('video.getById', params); }
  videoSearch(params) { return this.call('video.search', params); }
  videoGetAlbumById(params) { return this.call('video.getAlbumById', params); }
  videoGetCatalog(params) { return this.call('video.getCatalog', params); }
  videoGetCatalogSection(params) { return this.call('video.getCatalogSection', params); }
  videoReorderAlbums(params) { return this.call('video.reorderAlbums', params); }
  videoReorderVideos(params) { return this.call('video.reorderVideos', params); }
  videoAddToAlbum(params) { return this.call('video.addToAlbum', params); }
  videoRemoveFromAlbum(params) { return this.call('video.removeFromAlbum', params); }

  // Audio
  audioGet(params) { return this.call('audio.get', params); }
  audioGetById(params) { return this.call('audio.getById', params); }
  audioGetLyrics(params) { return this.call('audio.getLyrics', params); }
  audioSearch(params) { return this.call('audio.search', params); }
  audioGetPopular(params) { return this.call('audio.getPopular', params); }
  audioGetRadio(params) { return this.call('audio.getRadio', params); }
  audioGetCount(params) { return this.call('audio.getCount', params); }

  // Docs
  docsGet(params) { return this.call('docs.get', params); }
  docsGetById(params) { return this.call('docs.getById', params); }
  docsSearch(params) { return this.call('docs.search', params); }
  docsGetTypes(params) { return this.call('docs.getTypes', params); }
  docsGetWallUploadServer(params) { return this.call('docs.getWallUploadServer', params); }
  docsGetMessagesUploadServer(params) { return this.call('docs.getMessagesUploadServer', params); }

  // Users
  usersGetFollowers(params) { return this.call('users.getFollowers', params); }
  usersGetSubscriptions(params) { return this.call('users.getSubscriptions', params); }
  usersSearch(params) { return this.call('users.search', params); }
  usersIsAppUser(params) { return this.call('users.isAppUser', params); }
  usersGetNearby(params) { return this.call('users.getNearby', params); }
  usersReport(params) { return this.call('users.report', params); }

  // Account
  accountGetInfo(params) { return this.call('account.getInfo', params); }
  accountGetPushSettings(params) { return this.call('account.getPushSettings', params); }
  accountGetCounters(params) { return this.call('account.getCounters', params); }
  accountGetAppPermissions(params) { return this.call('account.getAppPermissions', params); }
  accountGetBalance(params) { return this.call('account.getBalance', params); }

  // Groups
  groupsGetMembers(params) { return this.call('groups.getMembers', params); }
  groupsGetRequests(params) { return this.call('groups.getRequests', params); }
  groupsGetSettings(params) { return this.call('groups.getSettings', params); }
  groupsGetLongPollServer(params) { return this.call('groups.getLongPollServer', params); }
  groupsGetLongPollSettings(params) { return this.call('groups.getLongPollSettings', params); }
  groupsGetAddresses(params) { return this.call('groups.getAddresses', params); }
  groupsGetTokenPermissions(params) { return this.call('groups.getTokenPermissions', params); }

  // Friends
  friendsGetOnline(params) { return this.call('friends.getOnline', params); }
  friendsGetMutual(params) { return this.call('friends.getMutual', params); }
  friendsGetRequests(params) { return this.call('friends.getRequests', params); }
  friendsAreFriends(params) { return this.call('friends.areFriends', params); }
  friendsGetRecent(params) { return this.call('friends.getRecent', params); }
  friendsSearch(params) { return this.call('friends.search', params); }
  friendsGetSuggestions(params) { return this.call('friends.getSuggestions', params); }
  friendsGetAppUsers(params) { return this.call('friends.getAppUsers', params); }
  friendsGetAll(params) { return this.call('friends.getAll', params); }

  // Newsfeed
  newsfeedGetComments(params) { return this.call('newsfeed.getComments', params); }
  newsfeedGetReposts(params) { return this.call('newsfeed.getReposts', params); }
  newsfeedGetSuggestedSources(params) { return this.call('newsfeed.getSuggestedSources', params); }
  newsfeedSearch(params) { return this.call('newsfeed.search', params); }
  newsfeedGetBanned(params) { return this.call('newsfeed.getBanned', params); }

  // Likes
  likesGetList(params) { return this.call('likes.getList', params); }
  likesIsLiked(params) { return this.call('likes.isLiked', params); }

  // Utils
  utilsGetShortLink(params) { return this.call('utils.getShortLink', params); }
  utilsGetServerTime(params) { return this.call('utils.getServerTime', params); }
  utilsResolveScreenName(params) { return this.call('utils.resolveScreenName', params); }
  utilsGetLinkStats(params) { return this.call('utils.getLinkStats', params); }
  utilsCheckLink(params) { return this.call('utils.checkLink', params); }

  // Database
  databaseGetCountries(params) { return this.call('database.getCountries', params); }
  databaseGetRegions(params) { return this.call('database.getRegions', params); }
  databaseGetCities(params) { return this.call('database.getCities', params); }
  databaseGetSchools(params) { return this.call('database.getSchools', params); }
  databaseGetFaculties(params) { return this.call('database.getFaculties', params); }
  databaseGetChairs(params) { return this.call('database.getChairs', params); }

  // Wall
  wallGetComment(params) { return this.call('wall.getComment', params); }
  wallGetReposts(params) { return this.call('wall.getReposts', params); }

  // Messages
  messagesGet(params) { return this.call('messages.get', params); }
  messagesGetConversations(params) { return this.call('messages.getConversations', params); }
  messagesGetById(params) { return this.call('messages.getById', params); }
  messagesSearch(params) { return this.call('messages.search', params); }
  messagesGetDialogs(params) { return this.call('messages.getDialogs', params); }
  messagesLastActivity(params) { return this.call('messages.lastActivity', params); }
  messagesGetHistory(params) { return this.call('messages.getHistory', params); }

  // Market
  marketGetAlbums(params) { return this.call('market.getAlbums', params); }
  marketGetAlbum(params) { return this.call('market.getAlbum', params); }
  marketGetItems(params) { return this.call('market.getItems', params); }
  marketGetItemsById(params) { return this.call('market.getItemsById', params); }
  marketSearch(params) { return this.call('market.search', params); }
  marketGetOrder(params) { return this.call('market.getOrder', params); }
  marketGetOrders(params) { return this.call('market.getOrders', params); }
  marketGetOrderItems(params) { return this.call('market.getOrderItems', params); }

  // Notes
  notesGetById(params) { return this.call('notes.getById', params); }

  // Pages
  pagesGetHistory(params) { return this.call('pages.getHistory', params); }
  pagesGetTitles(params) { return this.call('pages.getTitles', params); }
  pagesGetVersions(params) { return this.call('pages.getVersions', params); }

  // Status
  statusGet(params) { return this.call('status.get', params); }

  // Storage
  storageGet(params) { return this.call('storage.get', params); }
  storageGetKeys(params) { return this.call('storage.getKeys', params); }

  // Gifts
  giftsGet(params) { return this.call('gifts.get', params); }

  // Notifications
  notificationsGetSubscriptions(params) { return this.call('notifications.getSubscriptions', params); }

  // Board
  boardGet(params) { return this.call('board.get', params); }
  boardGetComments(params) { return this.call('board.getComments', params); }

  // Fave
  faveGetPosts(params) { return this.call('fave.getPosts', params); }
  faveGetPhotos(params) { return this.call('fave.getPhotos', params); }
  faveGetVideos(params) { return this.call('fave.getVideos', params); }
  faveGetLinks(params) { return this.call('fave.getLinks', params); }

  // Apps
  appsGet(params) { return this.call('apps.get', params); }
  appsGetCatalog(params) { return this.call('apps.getCatalog', params); }
  appsIsInstalled(params) { return this.call('apps.isInstalled', params); }

  // Widgets
  widgetsGetComments(params) { return this.call('widgets.getComments', params); }
  widgetsGetPosts(params) { return this.call('widgets.getPosts', params); }
  widgetsGetWidget(params) { return this.call('widgets.getWidget', params); }

  // Stats
  statsGetPostReach(params) { return this.call('stats.getPostReach', params); }
  statsGetVisitors(params) { return this.call('stats.getVisitors', params); }

  // Polls
  pollsGet(params) { return this.call('polls.get', params); }

  // Secure
  secureGetAppBalance(params) { return this.call('secure.getAppBalance', params); }
  secureGetMobileAppsList(params) { return this.call('secure.getMobileAppsList', params); }
  secureGetUserHistory(params) { return this.call('secure.getUserHistory', params); }
  secureGetUsersHits(params) { return this.call('secure.getUsersHits', params); }
  secureCheckToken(params) { return this.call('secure.checkToken', params); }

  // LeadForms
  leadformsGet(params) { return this.call('leadforms.get', params); }
  leadformsGetById(params) { return this.call('leadforms.getById', params); }

  // Asr
  asrDecode(params) { return this.call('asr.decode', params); }

  // Streaming
  streamingGetServerUrl(params) { return this.call('streaming.getServerUrl', params); }

  // Orders
  ordersGet(params) { return this.call('orders.get', params); }
  ordersGetById(params) { return this.call('orders.getById', params); }

  async uploadPhoto(uploadUrl, imageSource) {
    let blob;
    let filename = 'photo.jpg';

    if (imageSource.startsWith('http://') || imageSource.startsWith('https://')) {
      const resp = await fetch(imageSource);
      if (!resp.ok) throw new Error(`Failed to download image: ${resp.status}`);
      const contentType = resp.headers.get('content-type') || 'image/jpeg';
      const ext = contentType.includes('png') ? 'png' : contentType.includes('gif') ? 'gif' : 'jpg';
      filename = `photo.${ext}`;
      blob = await resp.blob();
    } else {
      const { readFile } = await import('node:fs/promises');
      const buffer = await readFile(imageSource);
      const ext = imageSource.split('.').pop() || 'jpg';
      filename = `photo.${ext}`;
      blob = new Blob([buffer], { type: `image/${ext === 'jpg' ? 'jpeg' : ext}` });
    }

    const formData = new FormData();
    formData.append('photo', blob, filename);

    const resp = await fetch(uploadUrl, { method: 'POST', body: formData });
    const data = await resp.json();

    if (!data.photo || data.photo === '[]') {
      throw new Error('Photo upload failed: empty response from VK upload server');
    }

    return data;
  }
}

// ============================================
// SETUP
// ============================================

const VK_ACCESS_TOKEN = process.env.VK_ACCESS_TOKEN;

if (!VK_ACCESS_TOKEN) {
  console.error('Error: VK_ACCESS_TOKEN environment variable is required');
  console.error('Get your token at: https://vk.com/dev');
  process.exit(1);
}

const vk = new VKClient(VK_ACCESS_TOKEN);

// ============================================
// TOOL DEFINITIONS
// ============================================

const tools = [
  {
    name: 'vk_users_get',
    description: 'Get information about VK users by their IDs or screen names',
    inputSchema: {
      type: 'object',
      properties: {
        user_ids: { type: 'string', description: 'Comma-separated user IDs or screen names' },
        fields: { type: 'string', description: 'Profile fields to return' },
      },
    },
  },
  {
    name: 'vk_wall_get',
    description: 'Get posts from a user or community wall',
    inputSchema: {
      type: 'object',
      properties: {
        owner_id: { type: 'number', description: 'Wall owner ID (negative for community)' },
        domain: { type: 'string', description: 'Short address of user or community' },
        count: { type: 'number', description: 'Number of posts (1-100)' },
        offset: { type: 'number', description: 'Offset for pagination' },
        filter: { type: 'string', description: 'Filter: all, owner, others, postponed, suggests', enum: ['all', 'owner', 'others', 'postponed', 'suggests'] },
      },
    },
  },
  {
    name: 'vk_wall_post',
    description: 'Publish a new post on a wall',
    inputSchema: {
      type: 'object',
      properties: {
        owner_id: { type: 'number', description: 'Wall owner ID' },
        message: { type: 'string', description: 'Post text content' },
        from_group: { type: 'boolean', description: 'Post on behalf of community' },
        attachments: { type: 'string', description: 'Comma-separated attachments (e.g. photo123_456,link)' },
        publish_date: { type: 'number', description: 'Unix timestamp for scheduled post (must be within 2 weeks)' },
        guid: { type: 'string', description: 'Unique identifier to prevent duplicate posts' },
      },
      required: ['message'],
    },
  },
  {
    name: 'vk_wall_create_comment',
    description: 'Add a comment to a wall post',
    inputSchema: {
      type: 'object',
      properties: {
        owner_id: { type: 'number', description: 'Wall owner ID' },
        post_id: { type: 'number', description: 'Post ID' },
        message: { type: 'string', description: 'Comment text' },
      },
      required: ['owner_id', 'post_id', 'message'],
    },
  },
  {
    name: 'vk_wall_get_by_id',
    description: 'Get posts by their IDs',
    inputSchema: {
      type: 'object',
      properties: {
        posts: { type: 'string', description: 'Comma-separated post IDs in format {owner_id}_{post_id} (e.g. -123_456)' },
        fields: { type: 'string', description: 'Additional profile fields to return' },
      },
      required: ['posts'],
    },
  },
  {
    name: 'vk_wall_edit',
    description: 'Edit an existing wall post',
    inputSchema: {
      type: 'object',
      properties: {
        owner_id: { type: 'number', description: 'Wall owner ID' },
        post_id: { type: 'number', description: 'Post ID to edit' },
        message: { type: 'string', description: 'New post text' },
        attachments: { type: 'string', description: 'Comma-separated attachments' },
      },
      required: ['post_id'],
    },
  },
  {
    name: 'vk_wall_delete',
    description: 'Delete a wall post',
    inputSchema: {
      type: 'object',
      properties: {
        owner_id: { type: 'number', description: 'Wall owner ID' },
        post_id: { type: 'number', description: 'Post ID to delete' },
      },
      required: ['post_id'],
    },
  },
  {
    name: 'vk_photos_upload_wall',
    description: 'Upload a photo to a community or user wall (3-step process: get upload server, upload file, save). Returns attachment string for use in wall.post/wall.edit.',
    inputSchema: {
      type: 'object',
      properties: {
        group_id: { type: 'number', description: 'Community ID (positive number, without minus sign)' },
        image: { type: 'string', description: 'Image URL (http/https) or absolute local file path' },
        caption: { type: 'string', description: 'Photo caption' },
      },
      required: ['image'],
    },
  },
  {
    name: 'vk_groups_get',
    description: 'Get list of communities the user is a member of',
    inputSchema: {
      type: 'object',
      properties: {
        user_id: { type: 'number', description: 'User ID' },
        filter: { type: 'string', description: 'Filter by type' },
        fields: { type: 'string', description: 'Community fields' },
        count: { type: 'number', description: 'Number of communities' },
      },
    },
  },
  {
    name: 'vk_groups_get_by_id',
    description: 'Get community info by ID or short name',
    inputSchema: {
      type: 'object',
      properties: {
        group_ids: { type: 'string', description: 'Comma-separated group IDs' },
        fields: { type: 'string', description: 'Community fields' },
      },
    },
  },
  {
    name: 'vk_friends_get',
    description: 'Get list of user friends',
    inputSchema: {
      type: 'object',
      properties: {
        user_id: { type: 'number', description: 'User ID' },
        order: { type: 'string', enum: ['hints', 'random', 'name'] },
        fields: { type: 'string', description: 'Profile fields' },
        count: { type: 'number', description: 'Number of friends' },
      },
    },
  },
  {
    name: 'vk_newsfeed_get',
    description: 'Get user newsfeed',
    inputSchema: {
      type: 'object',
      properties: {
        filters: { type: 'string', description: 'Filter by type: post, photo, video' },
        count: { type: 'number', description: 'Number of items' },
        start_from: { type: 'string', description: 'Pagination cursor' },
      },
    },
  },
  {
    name: 'vk_stats_get',
    description: 'Get community statistics (admin only)',
    inputSchema: {
      type: 'object',
      properties: {
        group_id: { type: 'number', description: 'Community ID' },
        interval: { type: 'string', enum: ['day', 'week', 'month', 'year', 'all'] },
        intervals_count: { type: 'number', description: 'Number of intervals' },
      },
      required: ['group_id'],
    },
  },
  {
    name: 'vk_photos_get',
    description: 'Get photos from albums',
    inputSchema: {
      type: 'object',
      properties: {
        owner_id: { type: 'number', description: 'Album owner ID' },
        album_id: { type: 'string', description: 'Album ID or: wall, profile, saved' },
        count: { type: 'number', description: 'Number of photos' },
      },
    },
  },
  {
    name: 'vk_photos_get_all',
    description: 'Get all photos of a user or community',
    inputSchema: {
      type: 'object',
      properties: {
        owner_id: { type: 'number', description: 'Owner ID' },
        album_id: { type: 'string', description: 'Album ID' },
        count: { type: 'number', description: 'Number of photos' },
        offset: { type: 'number', description: 'Offset' },
      },
    },
  },
  {
    name: 'vk_photos_get_albums',
    description: 'Get photo albums',
    inputSchema: {
      type: 'object',
      properties: {
        owner_id: { type: 'number', description: 'Owner ID' },
        count: { type: 'number', description: 'Number of albums' },
        offset: { type: 'number', description: 'Offset' },
      },
    },
  },
  {
    name: 'vk_photos_get_album',
    description: 'Get photos by album ID',
    inputSchema: {
      type: 'object',
      properties: {
        owner_id: { type: 'number', description: 'Owner ID' },
        album_id: { type: 'number', description: 'Album ID' },
        count: { type: 'number', description: 'Number of photos' },
        offset: { type: 'number', description: 'Offset' },
      },
    },
  },
  {
    name: 'vk_photos_get_by_id',
    description: 'Get photos by their IDs',
    inputSchema: {
      type: 'object',
      properties: {
        photos: { type: 'string', description: 'Comma-separated photo IDs in format {owner_id}_{photo_id}' },
      },
      required: ['photos'],
    },
  },
  {
    name: 'vk_photos_get_comments',
    description: 'Get comments on a photo',
    inputSchema: {
      type: 'object',
      properties: {
        owner_id: { type: 'number', description: 'Photo owner ID' },
        photo_id: { type: 'number', description: 'Photo ID' },
        count: { type: 'number', description: 'Number of comments' },
      },
    },
  },
  {
    name: 'vk_photos_get_tags',
    description: 'Get tags on a photo',
    inputSchema: {
      type: 'object',
      properties: {
        owner_id: { type: 'number', description: 'Photo owner ID' },
        photo_id: { type: 'number', description: 'Photo ID' },
      },
    },
  },
  {
    name: 'vk_photos_get_new_tags',
    description: 'Get new photo tags',
    inputSchema: {
      type: 'object',
      properties: {
        count: { type: 'number', description: 'Number of tags' },
        offset: { type: 'number', description: 'Offset' },
      },
    },
  },
  {
    name: 'vk_photos_search',
    description: 'Search for photos',
    inputSchema: {
      type: 'object',
      properties: {
        q: { type: 'string', description: 'Search query' },
        lat: { type: 'number', description: 'Latitude' },
        long: { type: 'number', description: 'Longitude' },
        start_time: { type: 'number', description: 'Start time (Unix timestamp)' },
        end_time: { type: 'number', description: 'End time (Unix timestamp)' },
        count: { type: 'number', description: 'Number of photos' },
        offset: { type: 'number', description: 'Offset' },
      },
    },
  },
  {
    name: 'vk_photos_get_wall_upload_server',
    description: 'Get wall photo upload server URL',
    inputSchema: {
      type: 'object',
      properties: {
        group_id: { type: 'number', description: 'Community ID' },
      },
    },
  },
  {
    name: 'vk_photos_get_messages_upload_server',
    description: 'Get messages photo upload server URL',
    inputSchema: {
      type: 'object',
      properties: {
        group_id: { type: 'number', description: 'Community ID' },
      },
    },
  },
  {
    name: 'vk_photos_get_owner_photo_upload_server',
    description: 'Get owner photo upload server URL',
    inputSchema: {
      type: 'object',
      properties: {
        owner_id: { type: 'number', description: 'Owner ID' },
      },
    },
  },
  {
    name: 'vk_photos_get_chat_upload_server',
    description: 'Get chat photo upload server URL',
    inputSchema: {
      type: 'object',
      properties: {
        chat_id: { type: 'number', description: 'Chat ID' },
      },
    },
  },
  {
    name: 'vk_video_get',
    description: 'Get videos',
    inputSchema: {
      type: 'object',
      properties: {
        owner_id: { type: 'number', description: 'Video owner ID' },
        videos: { type: 'string', description: 'Comma-separated video IDs' },
        album_id: { type: 'number', description: 'Album ID' },
        count: { type: 'number', description: 'Number of videos' },
        offset: { type: 'number', description: 'Offset' },
      },
    },
  },
  {
    name: 'vk_video_get_albums',
    description: 'Get video albums',
    inputSchema: {
      type: 'object',
      properties: {
        owner_id: { type: 'number', description: 'Owner ID' },
        count: { type: 'number', description: 'Number of albums' },
        offset: { type: 'number', description: 'Offset' },
      },
    },
  },
  {
    name: 'vk_video_get_album',
    description: 'Get videos from album',
    inputSchema: {
      type: 'object',
      properties: {
        owner_id: { type: 'number', description: 'Owner ID' },
        album_id: { type: 'number', description: 'Album ID' },
        count: { type: 'number', description: 'Number of videos' },
        offset: { type: 'number', description: 'Offset' },
      },
    },
  },
  {
    name: 'vk_video_get_comments',
    description: 'Get comments on a video',
    inputSchema: {
      type: 'object',
      properties: {
        video_id: { type: 'number', description: 'Video ID' },
        owner_id: { type: 'number', description: 'Video owner ID' },
        count: { type: 'number', description: 'Number of comments' },
      },
    },
  },
  {
    name: 'vk_video_get_tags',
    description: 'Get tags on a video',
    inputSchema: {
      type: 'object',
      properties: {
        video_id: { type: 'number', description: 'Video ID' },
        owner_id: { type: 'number', description: 'Video owner ID' },
      },
    },
  },
  {
    name: 'vk_video_get_new_tags',
    description: 'Get new video tags',
    inputSchema: {
      type: 'object',
      properties: {
        count: { type: 'number', description: 'Number of tags' },
        offset: { type: 'number', description: 'Offset' },
      },
    },
  },
  {
    name: 'vk_video_get_by_id',
    description: 'Get videos by their IDs',
    inputSchema: {
      type: 'object',
      properties: {
        videos: { type: 'string', description: 'Comma-separated video IDs in format {owner_id}_{video_id}' },
      },
      required: ['videos'],
    },
  },
  {
    name: 'vk_video_search',
    description: 'Search for videos',
    inputSchema: {
      type: 'object',
      properties: {
        q: { type: 'string', description: 'Search query' },
        filters: { type: 'string', description: 'Filter: youtube, vimeo' },
        count: { type: 'number', description: 'Number of videos' },
        offset: { type: 'number', description: 'Offset' },
      },
    },
  },
  {
    name: 'vk_video_get_album_by_id',
    description: 'Get video album by ID',
    inputSchema: {
      type: 'object',
      properties: {
        album_id: { type: 'number', description: 'Album ID' },
        owner_id: { type: 'number', description: 'Owner ID' },
      },
    },
  },
  {
    name: 'vk_video_get_catalog',
    description: 'Get video catalog',
    inputSchema: {
      type: 'object',
      properties: {
        section: { type: 'string', description: 'Section ID' },
        count: { type: 'number', description: 'Number of videos' },
        from: { type: 'string', description: 'From section' },
      },
    },
  },
  {
    name: 'vk_video_get_catalog_section',
    description: 'Get video catalog section',
    inputSchema: {
      type: 'object',
      properties: {
        section_id: { type: 'string', description: 'Section ID' },
        count: { type: 'number', description: 'Number of videos' },
      },
    },
  },
  {
    name: 'vk_audio_get',
    description: 'Get audio files',
    inputSchema: {
      type: 'object',
      properties: {
        owner_id: { type: 'number', description: 'Audio owner ID' },
        album_id: { type: 'number', description: 'Album ID' },
        count: { type: 'number', description: 'Number of audios' },
        offset: { type: 'number', description: 'Offset' },
      },
    },
  },
  {
    name: 'vk_audio_get_by_id',
    description: 'Get audios by their IDs',
    inputSchema: {
      type: 'object',
      properties: {
        audios: { type: 'string', description: 'Comma-separated audio IDs in format {owner_id}_{audio_id}' },
      },
      required: ['audios'],
    },
  },
  {
    name: 'vk_audio_get_lyrics',
    description: 'Get lyrics text',
    inputSchema: {
      type: 'object',
      properties: {
        lyrics_id: { type: 'number', description: 'Lyrics ID' },
      },
      required: ['lyrics_id'],
    },
  },
  {
    name: 'vk_audio_search',
    description: 'Search for audios',
    inputSchema: {
      type: 'object',
      properties: {
        q: { type: 'string', description: 'Search query' },
        count: { type: 'number', description: 'Number of audios' },
        offset: { type: 'number', description: 'Offset' },
      },
    },
  },
  {
    name: 'vk_audio_get_popular',
    description: 'Get popular audios',
    inputSchema: {
      type: 'object',
      properties: {
        only_eng: { type: 'boolean', description: 'Only english' },
        count: { type: 'number', description: 'Number of audios' },
        offset: { type: 'number', description: 'Offset' },
      },
    },
  },
  {
    name: 'vk_audio_get_radio',
    description: 'Get radio stations',
    inputSchema: {
      type: 'object',
      properties: {
        count: { type: 'number', description: 'Number of stations' },
        offset: { type: 'number', description: 'Offset' },
      },
    },
  },
  {
    name: 'vk_audio_get_count',
    description: 'Get audio count for user',
    inputSchema: {
      type: 'object',
      properties: {
        owner_id: { type: 'number', description: 'User ID' },
      },
    },
  },
  {
    name: 'vk_docs_get',
    description: 'Get user documents',
    inputSchema: {
      type: 'object',
      properties: {
        count: { type: 'number', description: 'Number of docs' },
        offset: { type: 'number', description: 'Offset' },
        type: { type: 'number', description: 'Doc type: 1-text, 2-archive, 3-gif, 4-image, 5-audio, 6-video, 7-eBook, 8-corporate' },
      },
    },
  },
  {
    name: 'vk_docs_get_by_id',
    description: 'Get documents by their IDs',
    inputSchema: {
      type: 'object',
      properties: {
        docs: { type: 'string', description: 'Comma-separated doc IDs in format {owner_id}_{doc_id}' },
      },
      required: ['docs'],
    },
  },
  {
    name: 'vk_docs_search',
    description: 'Search for documents',
    inputSchema: {
      type: 'object',
      properties: {
        q: { type: 'string', description: 'Search query' },
        count: { type: 'number', description: 'Number of docs' },
      },
      required: ['q'],
    },
  },
  {
    name: 'vk_docs_get_types',
    description: 'Get document types',
    inputSchema: {
      type: 'object',
      properties: {
        owner_id: { type: 'number', description: 'Owner ID' },
      },
    },
  },
  {
    name: 'vk_docs_get_wall_upload_server',
    description: 'Get wall document upload server URL',
    inputSchema: {
      type: 'object',
      properties: {
        group_id: { type: 'number', description: 'Community ID' },
      },
    },
  },
  {
    name: 'vk_docs_get_messages_upload_server',
    description: 'Get messages document upload server URL',
    inputSchema: {
      type: 'object',
      properties: {
        type: { type: 'string', description: 'Doc type' },
      },
    },
  },
  {
    name: 'vk_users_get_followers',
    description: "Get user's followers",
    inputSchema: {
      type: 'object',
      properties: {
        user_id: { type: 'number', description: 'User ID' },
        count: { type: 'number', description: 'Number of followers' },
        offset: { type: 'number', description: 'Offset' },
        fields: { type: 'string', description: 'Profile fields' },
      },
    },
  },
  {
    name: 'vk_users_get_subscriptions',
    description: "Get user's subscriptions",
    inputSchema: {
      type: 'object',
      properties: {
        user_id: { type: 'number', description: 'User ID' },
      },
    },
  },
  {
    name: 'vk_users_search',
    description: 'Search for users',
    inputSchema: {
      type: 'object',
      properties: {
        q: { type: 'string', description: 'Search query' },
        fields: { type: 'string', description: 'Profile fields' },
        count: { type: 'number', description: 'Number of users' },
        offset: { type: 'number', description: 'Offset' },
      },
    },
  },
  {
    name: 'vk_users_is_app_user',
    description: 'Check if user installed the app',
    inputSchema: {
      type: 'object',
      properties: {
        user_id: { type: 'number', description: 'User ID' },
      },
    },
  },
  {
    name: 'vk_users_get_nearby',
    description: 'Get users nearby',
    inputSchema: {
      type: 'object',
      properties: {
        latitude: { type: 'number', description: 'Latitude' },
        longitude: { type: 'number', description: 'Longitude' },
        count: { type: 'number', description: 'Number of users' },
        radius: { type: 'number', description: 'Search radius in meters (default 500, max 10000)' },
      },
    },
  },
  {
    name: 'vk_account_get_info',
    description: 'Get account info',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'vk_account_get_push_settings',
    description: 'Get push notification settings',
    inputSchema: {
      type: 'object',
      properties: {
        device_id: { type: 'string', description: 'Device ID' },
      },
    },
  },
  {
    name: 'vk_account_get_counters',
    description: 'Get account counters',
    inputSchema: {
      type: 'object',
      properties: {
        filter: { type: 'string', description: 'Comma-separated counters to get' },
      },
    },
  },
  {
    name: 'vk_account_get_app_permissions',
    description: 'Get user permissions for app',
    inputSchema: {
      type: 'object',
      properties: {
        user_id: { type: 'number', description: 'User ID' },
      },
    },
  },
  {
    name: 'vk_account_get_balance',
    description: 'Get account balance',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'vk_groups_get_members',
    description: 'Get community members',
    inputSchema: {
      type: 'object',
      properties: {
        group_id: { type: 'string', description: 'Community ID or short name' },
        count: { type: 'number', description: 'Number of members' },
        offset: { type: 'number', description: 'Offset' },
        fields: { type: 'string', description: 'Profile fields' },
        filter: { type: 'string', description: 'Filter: admins, moder, users' },
      },
    },
  },
  {
    name: 'vk_groups_get_requests',
    description: 'Get join requests for community',
    inputSchema: {
      type: 'object',
      properties: {
        group_id: { type: 'number', description: 'Community ID' },
        count: { type: 'number', description: 'Number of requests' },
        offset: { type: 'number', description: 'Offset' },
        fields: { type: 'string', description: 'Profile fields' },
      },
    },
  },
  {
    name: 'vk_groups_get_settings',
    description: 'Get community settings',
    inputSchema: {
      type: 'object',
      properties: {
        group_id: { type: 'number', description: 'Community ID' },
      },
    },
  },
  {
    name: 'vk_groups_get_long_poll_server',
    description: 'Get Long Poll server URL for community',
    inputSchema: {
      type: 'object',
      properties: {
        group_id: { type: 'number', description: 'Community ID' },
      },
    },
  },
  {
    name: 'vk_groups_get_long_poll_settings',
    description: 'Get Long Poll settings for community',
    inputSchema: {
      type: 'object',
      properties: {
        group_id: { type: 'number', description: 'Community ID' },
      },
    },
  },
  {
    name: 'vk_groups_get_addresses',
    description: 'Get community addresses',
    inputSchema: {
      type: 'object',
      properties: {
        group_id: { type: 'number', description: 'Community ID' },
        address_ids: { type: 'string', description: 'Comma-separated address IDs' },
        latitude: { type: 'number', description: 'Latitude' },
        longitude: { type: 'number', description: 'Longitude' },
        count: { type: 'number', description: 'Number of addresses' },
        offset: { type: 'number', description: 'Offset' },
      },
    },
  },
  {
    name: 'vk_groups_get_token_permissions',
    description: 'Get community token permissions',
    inputSchema: {
      type: 'object',
      properties: {
        group_id: { type: 'number', description: 'Community ID' },
      },
    },
  },
  {
    name: 'vk_friends_get_online',
    description: 'Get online friends',
    inputSchema: {
      type: 'object',
      properties: {
        user_id: { type: 'number', description: 'User ID' },
        count: { type: 'number', description: 'Number of friends' },
        offset: { type: 'number', description: 'Offset' },
      },
    },
  },
  {
    name: 'vk_friends_get_mutual',
    description: 'Get mutual friends',
    inputSchema: {
      type: 'object',
      properties: {
        source_uid: { type: 'number', description: 'Source user ID' },
        target_uid: { type: 'number', description: 'Target user ID' },
        count: { type: 'number', description: 'Number of friends' },
        offset: { type: 'number', description: 'Offset' },
      },
    },
  },
  {
    name: 'vk_friends_get_requests',
    description: 'Get friend requests',
    inputSchema: {
      type: 'object',
      properties: {
        offset: { type: 'number', description: 'Offset' },
        count: { type: 'number', description: 'Number of requests' },
        fields: { type: 'string', description: 'Profile fields' },
        sort: { type: 'string', description: 'Sort: random, mutual' },
      },
    },
  },
  {
    name: 'vk_friends_are_friends',
    description: 'Check friendship status',
    inputSchema: {
      type: 'object',
      properties: {
        user_ids: { type: 'string', description: 'Comma-separated user IDs' },
      },
    },
  },
  {
    name: 'vk_friends_get_recent',
    description: 'Get recently added friends',
    inputSchema: {
      type: 'object',
      properties: {
        count: { type: 'number', description: 'Number of friends' },
      },
    },
  },
  {
    name: 'vk_friends_search',
    description: 'Search for friends',
    inputSchema: {
      type: 'object',
      properties: {
        user_id: { type: 'number', description: 'User ID' },
        q: { type: 'string', description: 'Search query' },
        count: { type: 'number', description: 'Number of friends' },
        offset: { type: 'number', description: 'Offset' },
      },
    },
  },
  {
    name: 'vk_friends_get_suggestions',
    description: 'Get friend suggestions',
    inputSchema: {
      type: 'object',
      properties: {
        count: { type: 'number', description: 'Number of suggestions' },
        offset: { type: 'number', description: 'Offset' },
        fields: { type: 'string', description: 'Profile fields' },
      },
    },
  },
  {
    name: 'vk_friends_get_app_users',
    description: 'Get friends that use the app',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'vk_friends_get_all',
    description: 'Get all friends (extended)',
    inputSchema: {
      type: 'object',
      properties: {
        user_id: { type: 'number', description: 'User ID' },
        fields: { type: 'string', description: 'Profile fields' },
        name_case: { type: 'string', description: 'Name case: nom, gen, dat, acc, ins, abl' },
      },
    },
  },
  {
    name: 'vk_newsfeed_get_comments',
    description: 'Get comments from newsfeed',
    inputSchema: {
      type: 'object',
      properties: {
        count: { type: 'number', description: 'Number of comments' },
        offset: { type: 'number', description: 'Offset' },
        filters: { type: 'string', description: 'Filters: post, photo, video' },
      },
    },
  },
  {
    name: 'vk_newsfeed_get_reposts',
    description: 'Get reposts from newsfeed',
    inputSchema: {
      type: 'object',
      properties: {
        owner_id: { type: 'number', description: 'Owner ID' },
        post_id: { type: 'number', description: 'Post ID' },
        count: { type: 'number', description: 'Number of reposts' },
        offset: { type: 'number', description: 'Offset' },
      },
    },
  },
  {
    name: 'vk_newsfeed_get_suggested_sources',
    description: 'Get suggested sources for newsfeed',
    inputSchema: {
      type: 'object',
      properties: {
        count: { type: 'number', description: 'Number of sources' },
        offset: { type: 'number', description: 'Offset' },
      },
    },
  },
  {
    name: 'vk_newsfeed_search',
    description: 'Search newsfeed',
    inputSchema: {
      type: 'object',
      properties: {
        q: { type: 'string', description: 'Search query' },
        count: { type: 'number', description: 'Number of posts' },
        offset: { type: 'number', description: 'Offset' },
      },
    },
  },
  {
    name: 'vk_newsfeed_get_banned',
    description: 'Get users banned from newsfeed',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'vk_likes_get_list',
    description: 'Get likes list',
    inputSchema: {
      type: 'object',
      properties: {
        type: { type: 'string', description: 'Object type: post, photo, video, audio, doc, sitepage' },
        owner_id: { type: 'number', description: 'Owner ID' },
        item_id: { type: 'number', description: 'Item ID' },
        count: { type: 'number', description: 'Number of likes' },
        offset: { type: 'number', description: 'Offset' },
        filters: { type: 'string', description: 'Filters: likes, copies' },
      },
    },
  },
  {
    name: 'vk_likes_is_liked',
    description: 'Check if user liked object',
    inputSchema: {
      type: 'object',
      properties: {
        type: { type: 'string', description: 'Object type: post, photo, video, audio, doc, sitepage' },
        owner_id: { type: 'number', description: 'Owner ID' },
        item_id: { type: 'number', description: 'Item ID' },
      },
    },
  },
  {
    name: 'vk_utils_get_short_link',
    description: 'Convert URL to short link',
    inputSchema: {
      type: 'object',
      properties: {
        url: { type: 'string', description: 'URL to convert' },
      },
      required: ['url'],
    },
  },
  {
    name: 'vk_utils_get_server_time',
    description: 'Get VK server time',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'vk_utils_resolve_screen_name',
    description: 'Resolve screen name to user or community',
    inputSchema: {
      type: 'object',
      properties: {
        screen_name: { type: 'string', description: 'Screen name to resolve' },
      },
      required: ['screen_name'],
    },
  },
  {
    name: 'vk_utils_get_link_stats',
    description: 'Get link click statistics',
    inputSchema: {
      type: 'object',
      properties: {
        key: { type: 'string', description: 'Short link key' },
        interval: { type: 'string', description: 'Interval: day, week, month, forever' },
        intervals_count: { type: 'number', description: 'Number of intervals' },
      },
    },
  },
  {
    name: 'vk_utils_check_link',
    description: 'Check if link is blocked',
    inputSchema: {
      type: 'object',
      properties: {
        url: { type: 'string', description: 'URL to check' },
      },
      required: ['url'],
    },
  },
  {
    name: 'vk_database_get_countries',
    description: 'Get list of countries',
    inputSchema: {
      type: 'object',
      properties: {
        need_all: { type: 'boolean', description: 'Return all countries' },
        code: { type: 'string', description: 'Country code' },
        count: { type: 'number', description: 'Number of countries' },
        offset: { type: 'number', description: 'Offset' },
      },
    },
  },
  {
    name: 'vk_database_get_regions',
    description: 'Get regions by country',
    inputSchema: {
      type: 'object',
      properties: {
        country_id: { type: 'number', description: 'Country ID' },
        q: { type: 'string', description: 'Search query' },
        count: { type: 'number', description: 'Number of regions' },
      },
    },
  },
  {
    name: 'vk_database_get_cities',
    description: 'Get cities',
    inputSchema: {
      type: 'object',
      properties: {
        country_id: { type: 'number', description: 'Country ID' },
        region_id: { type: 'number', description: 'Region ID' },
        q: { type: 'string', description: 'Search query' },
        need_all: { type: 'boolean', description: 'Return all cities' },
        count: { type: 'number', description: 'Number of cities' },
        offset: { type: 'number', description: 'Offset' },
      },
    },
  },
  {
    name: 'vk_database_get_schools',
    description: 'Get schools by city',
    inputSchema: {
      type: 'object',
      properties: {
        city_id: { type: 'number', description: 'City ID' },
        q: { type: 'string', description: 'Search query' },
        count: { type: 'number', description: 'Number of schools' },
      },
    },
  },
  {
    name: 'vk_database_get_faculties',
    description: 'Get faculties by university',
    inputSchema: {
      type: 'object',
      properties: {
        university_id: { type: 'number', description: 'University ID' },
        count: { type: 'number', description: 'Number of faculties' },
        offset: { type: 'number', description: 'Offset' },
      },
    },
  },
  {
    name: 'vk_database_get_chairs',
    description: 'Get chairs by faculty',
    inputSchema: {
      type: 'object',
      properties: {
        faculty_id: { type: 'number', description: 'Faculty ID' },
        count: { type: 'number', description: 'Number of chairs' },
        offset: { type: 'number', description: 'Offset' },
      },
    },
  },
  {
    name: 'vk_wall_get_comment',
    description: 'Get comment on wall post',
    inputSchema: {
      type: 'object',
      properties: {
        comment_id: { type: 'number', description: 'Comment ID' },
        owner_id: { type: 'number', description: 'Comment owner ID' },
      },
    },
  },
  {
    name: 'vk_wall_get_reposts',
    description: 'Get reposts of post',
    inputSchema: {
      type: 'object',
      properties: {
        owner_id: { type: 'number', description: 'Post owner ID' },
        post_id: { type: 'number', description: 'Post ID' },
        count: { type: 'number', description: 'Number of reposts' },
        offset: { type: 'number', description: 'Offset' },
      },
    },
  },
  {
    name: 'vk_messages_get',
    description: 'Get messages',
    inputSchema: {
      type: 'object',
      properties: {
        offset: { type: 'number', description: 'Offset' },
        count: { type: 'number', description: 'Number of messages' },
        time_offset: { type: 'number', description: 'Time offset' },
      },
    },
  },
  {
    name: 'vk_messages_get_conversations',
    description: 'Get conversations',
    inputSchema: {
      type: 'object',
      properties: {
        offset: { type: 'number', description: 'Offset' },
        count: { type: 'number', description: 'Number of conversations' },
        filter: { type: 'string', description: 'Filter: all, unread' },
        extended: { type: 'boolean', description: 'Return extended response' },
      },
    },
  },
  {
    name: 'vk_messages_get_by_id',
    description: 'Get messages by their IDs',
    inputSchema: {
      type: 'object',
      properties: {
        message_ids: { type: 'string', description: 'Comma-separated message IDs' },
      },
      required: ['message_ids'],
    },
  },
  {
    name: 'vk_messages_search',
    description: 'Search messages',
    inputSchema: {
      type: 'object',
      properties: {
        q: { type: 'string', description: 'Search query' },
        count: { type: 'number', description: 'Number of messages' },
        offset: { type: 'number', description: 'Offset' },
      },
    },
  },
  {
    name: 'vk_messages_get_dialogs',
    description: 'Get message dialogs',
    inputSchema: {
      type: 'object',
      properties: {
        offset: { type: 'number', description: 'Offset' },
        count: { type: 'number', description: 'Number of dialogs' },
        unread: { type: 'boolean', description: 'Get only unread' },
      },
    },
  },
  {
    name: 'vk_messages_last_activity',
    description: 'Get last activity in messages',
    inputSchema: {
      type: 'object',
      properties: {
        user_id: { type: 'number', description: 'User ID' },
      },
    },
  },
  {
    name: 'vk_messages_get_history',
    description: 'Get message history',
    inputSchema: {
      type: 'object',
      properties: {
        user_id: { type: 'number', description: 'User ID' },
        offset: { type: 'number', description: 'Offset' },
        count: { type: 'number', description: 'Number of messages' },
        start_message_id: { type: 'number', description: 'Start message ID' },
      },
    },
  },
  {
    name: 'vk_market_get_albums',
    description: 'Get market albums',
    inputSchema: {
      type: 'object',
      properties: {
        owner_id: { type: 'number', description: 'Owner ID (community for market)' },
        count: { type: 'number', description: 'Number of albums' },
        offset: { type: 'number', description: 'Offset' },
      },
    },
  },
  {
    name: 'vk_market_get_album',
    description: 'Get market album by ID',
    inputSchema: {
      type: 'object',
      properties: {
        owner_id: { type: 'number', description: 'Owner ID' },
        album_id: { type: 'number', description: 'Album ID' },
      },
    },
  },
  {
    name: 'vk_market_get_items',
    description: 'Get market items',
    inputSchema: {
      type: 'object',
      properties: {
        owner_id: { type: 'number', description: 'Owner ID' },
        album_id: { type: 'number', description: 'Album ID' },
        count: { type: 'number', description: 'Number of items' },
        offset: { type: 'number', description: 'Offset' },
      },
    },
  },
  {
    name: 'vk_market_get_items_by_id',
    description: 'Get market items by their IDs',
    inputSchema: {
      type: 'object',
      properties: {
        item_ids: { type: 'string', description: 'Comma-separated item IDs in format {owner_id}_{item_id}' },
      },
    },
  },
  {
    name: 'vk_market_search',
    description: 'Search market items',
    inputSchema: {
      type: 'object',
      properties: {
        q: { type: 'string', description: 'Search query' },
        count: { type: 'number', description: 'Number of items' },
        offset: { type: 'number', description: 'Offset' },
      },
    },
  },
  {
    name: 'vk_market_get_order',
    description: 'Get market order',
    inputSchema: {
      type: 'object',
      properties: {
        order_id: { type: 'number', description: 'Order ID' },
        user_id: { type: 'number', description: 'User ID' },
      },
    },
  },
  {
    name: 'vk_market_get_orders',
    description: 'Get market orders',
    inputSchema: {
      type: 'object',
      properties: {
        count: { type: 'number', description: 'Number of orders' },
        offset: { type: 'number', description: 'Offset' },
      },
    },
  },
  {
    name: 'vk_market_get_order_items',
    description: 'Get items in market order',
    inputSchema: {
      type: 'object',
      properties: {
        order_id: { type: 'number', description: 'Order ID' },
      },
    },
  },
  {
    name: 'vk_notes_get_by_id',
    description: 'Get note by ID',
    inputSchema: {
      type: 'object',
      properties: {
        note_id: { type: 'number', description: 'Note ID' },
        owner_id: { type: 'number', description: 'Note owner ID' },
      },
    },
  },
  {
    name: 'vk_pages_get_history',
    description: 'Get wiki page history',
    inputSchema: {
      type: 'object',
      properties: {
        page_id: { type: 'number', description: 'Page ID' },
        group_id: { type: 'number', description: 'Community ID' },
        user_id: { type: 'number', description: 'User ID' },
      },
    },
  },
  {
    name: 'vk_pages_get_titles',
    description: 'Get wiki page titles',
    inputSchema: {
      type: 'object',
      properties: {
        group_id: { type: 'number', description: 'Community ID' },
      },
    },
  },
  {
    name: 'vk_pages_get_versions',
    description: 'Get wiki page versions',
    inputSchema: {
      type: 'object',
      properties: {
        page_id: { type: 'number', description: 'Page ID' },
        group_id: { type: 'number', description: 'Community ID' },
      },
    },
  },
  {
    name: 'vk_status_get',
    description: 'Get user status',
    inputSchema: {
      type: 'object',
      properties: {
        user_id: { type: 'number', description: 'User ID' },
        group_id: { type: 'number', description: 'Community ID' },
      },
    },
  },
  {
    name: 'vk_storage_get',
    description: 'Get value from key-value storage',
    inputSchema: {
      type: 'object',
      properties: {
        key: { type: 'string', description: 'Storage key' },
        user_id: { type: 'number', description: 'User ID' },
      },
      required: ['key'],
    },
  },
  {
    name: 'vk_storage_get_keys',
    description: 'Get storage keys',
    inputSchema: {
      type: 'object',
      properties: {
        user_id: { type: 'number', description: 'User ID' },
        count: { type: 'number', description: 'Number of keys' },
        offset: { type: 'number', description: 'Offset' },
      },
    },
  },
  {
    name: 'vk_gifts_get',
    description: 'Get user gifts',
    inputSchema: {
      type: 'object',
      properties: {
        user_id: { type: 'number', description: 'User ID' },
        count: { type: 'number', description: 'Number of gifts' },
        offset: { type: 'number', description: 'Offset' },
      },
    },
  },
  {
    name: 'vk_notifications_get_subscriptions',
    description: 'Get notifications subscriptions',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'vk_board_get',
    description: 'Get discussion board topics',
    inputSchema: {
      type: 'object',
      properties: {
        group_id: { type: 'number', description: 'Community ID' },
        topic_ids: { type: 'string', description: 'Comma-separated topic IDs' },
        count: { type: 'number', description: 'Number of topics' },
        offset: { type: 'number', description: 'Offset' },
      },
    },
  },
  {
    name: 'vk_board_get_comments',
    description: 'Get board topic comments',
    inputSchema: {
      type: 'object',
      properties: {
        group_id: { type: 'number', description: 'Community ID' },
        topic_id: { type: 'number', description: 'Topic ID' },
        count: { type: 'number', description: 'Number of comments' },
        offset: { type: 'number', description: 'Offset' },
      },
    },
  },
  {
    name: 'vk_fave_get_posts',
    description: 'Get favorite posts',
    inputSchema: {
      type: 'object',
      properties: {
        count: { type: 'number', description: 'Number of posts' },
        offset: { type: 'number', description: 'Offset' },
      },
    },
  },
  {
    name: 'vk_fave_get_photos',
    description: 'Get favorite photos',
    inputSchema: {
      type: 'object',
      properties: {
        count: { type: 'number', description: 'Number of photos' },
        offset: { type: 'number', description: 'Offset' },
      },
    },
  },
  {
    name: 'vk_fave_get_videos',
    description: 'Get favorite videos',
    inputSchema: {
      type: 'object',
      properties: {
        count: { type: 'number', description: 'Number of videos' },
        offset: { type: 'number', description: 'Offset' },
      },
    },
  },
  {
    name: 'vk_fave_get_links',
    description: 'Get favorite links',
    inputSchema: {
      type: 'object',
      properties: {
        count: { type: 'number', description: 'Number of links' },
        offset: { type: 'number', description: 'Offset' },
      },
    },
  },
  {
    name: 'vk_apps_get',
    description: 'Get apps',
    inputSchema: {
      type: 'object',
      properties: {
        app_id: { type: 'number', description: 'App ID' },
        app_ids: { type: 'string', description: 'Comma-separated app IDs' },
        platform: { type: 'string', description: 'Platform: ios, android, web' },
      },
    },
  },
  {
    name: 'vk_apps_get_catalog',
    description: 'Get apps catalog',
    inputSchema: {
      type: 'object',
      properties: {
        sort: { type: 'string', description: 'Sort: popularity, date' },
        count: { type: 'number', description: 'Number of apps' },
        offset: { type: 'number', description: 'Offset' },
        platform: { type: 'string', description: 'Platform: ios, android, web' },
        filter: { type: 'string', description: 'Filter: installed' },
      },
    },
  },
  {
    name: 'vk_apps_is_installed',
    description: 'Check if app is installed by user',
    inputSchema: {
      type: 'object',
      properties: {
        user_id: { type: 'number', description: 'User ID' },
      },
    },
  },
  {
    name: 'vk_widgets_get_comments',
    description: 'Get comments for widget',
    inputSchema: {
      type: 'object',
      properties: {
        widget_api_id: { type: 'number', description: 'Widget API ID' },
        url: { type: 'string', description: 'Page URL' },
        count: { type: 'number', description: 'Number of comments' },
      },
    },
  },
  {
    name: 'vk_widgets_get_posts',
    description: 'Get posts for widget',
    inputSchema: {
      type: 'object',
      properties: {
        widget_api_id: { type: 'number', description: 'Widget API ID' },
        url: { type: 'string', description: 'Page URL' },
        count: { type: 'number', description: 'Number of posts' },
      },
    },
  },
  {
    name: 'vk_widgets_get_widget',
    description: 'Get widget',
    inputSchema: {
      type: 'object',
      properties: {
        widget_api_id: { type: 'number', description: 'Widget API ID' },
        url: { type: 'string', description: 'Page URL' },
      },
    },
  },
  {
    name: 'vk_stats_get_post_reach',
    description: 'Get post reach statistics',
    inputSchema: {
      type: 'object',
      properties: {
        owner_id: { type: 'number', description: 'Post owner ID' },
        post_id: { type: 'number', description: 'Post ID' },
      },
    },
  },
  {
    name: 'vk_stats_get_visitors',
    description: 'Get visitors statistics',
    inputSchema: {
      type: 'object',
      properties: {
        group_id: { type: 'number', description: 'Community ID' },
        count: { type: 'number', description: 'Number of visitors' },
        offset: { type: 'number', description: 'Offset' },
      },
    },
  },
  {
    name: 'vk_polls_get',
    description: 'Get poll by ID',
    inputSchema: {
      type: 'object',
      properties: {
        poll_id: { type: 'number', description: 'Poll ID' },
        owner_id: { type: 'number', description: 'Poll owner ID' },
      },
    },
  },
  {
    name: 'vk_secure_get_app_balance',
    description: 'Get application balance',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'vk_secure_get_mobile_apps_list',
    description: 'Get mobile apps list',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'vk_secure_get_user_history',
    description: 'Get user transaction history',
    inputSchema: {
      type: 'object',
      properties: {
        user_id: { type: 'number', description: 'User ID' },
        count: { type: 'number', description: 'Number of transactions' },
        offset: { type: 'number', description: 'Offset' },
      },
    },
  },
  {
    name: 'vk_secure_get_users_hits',
    description: 'Get user hits statistics',
    inputSchema: {
      type: 'object',
      properties: {
        count: { type: 'number', description: 'Number of hits' },
        offset: { type: 'number', description: 'Offset' },
      },
    },
  },
  {
    name: 'vk_secure_check_token',
    description: 'Check access token',
    inputSchema: {
      type: 'object',
      properties: {
        token: { type: 'string', description: 'Access token to check' },
      },
    },
  },
  {
    name: 'vk_leadforms_get',
    description: 'Get lead forms',
    inputSchema: {
      type: 'object',
      properties: {
        group_id: { type: 'number', description: 'Community ID' },
        count: { type: 'number', description: 'Number of forms' },
      },
    },
  },
  {
    name: 'vk_leadforms_get_by_id',
    description: 'Get lead form by ID',
    inputSchema: {
      type: 'object',
      properties: {
        form_id: { type: 'number', description: 'Form ID' },
        group_id: { type: 'number', description: 'Community ID' },
      },
    },
  },
  {
    name: 'vk_orders_get',
    description: 'Get orders',
    inputSchema: {
      type: 'object',
      properties: {
        count: { type: 'number', description: 'Number of orders' },
        offset: { type: 'number', description: 'Offset' },
      },
    },
  },
  {
    name: 'vk_orders_get_by_id',
    description: 'Get orders by IDs',
    inputSchema: {
      type: 'object',
      properties: {
        order_ids: { type: 'string', description: 'Comma-separated order IDs' },
      },
    },
  },
];

// ============================================
// TOOL HANDLERS
// ============================================

async function handleToolCall(name, args) {
  try {
    let result;

    switch (name) {
      case 'vk_users_get':
        result = await vk.usersGet({
          user_ids: args.user_ids,
          fields: args.fields || 'photo_200,online,status',
        });
        break;

      case 'vk_wall_get':
        result = await vk.wallGet({
          owner_id: args.owner_id,
          domain: args.domain,
          count: args.count || 20,
          offset: args.offset,
          filter: args.filter,
        });
        break;

      case 'vk_wall_post':
        result = await vk.wallPost({
          owner_id: args.owner_id,
          message: args.message,
          from_group: args.from_group ? 1 : 0,
          attachments: args.attachments,
          publish_date: args.publish_date,
          guid: args.guid,
        });
        break;

      case 'vk_wall_create_comment':
        result = await vk.wallCreateComment({
          owner_id: args.owner_id,
          post_id: args.post_id,
          message: args.message,
        });
        break;

      case 'vk_wall_get_by_id':
        result = await vk.wallGetById({
          posts: args.posts,
          fields: args.fields,
        });
        break;

      case 'vk_wall_edit':
        result = await vk.wallEdit({
          owner_id: args.owner_id,
          post_id: args.post_id,
          message: args.message,
          attachments: args.attachments,
        });
        break;

      case 'vk_wall_delete':
        result = await vk.wallDelete({
          owner_id: args.owner_id,
          post_id: args.post_id,
        });
        break;

      case 'vk_photos_upload_wall': {
        const uploadServer = await vk.photosGetWallUploadServer({
          group_id: args.group_id,
        });
        const uploadResult = await vk.uploadPhoto(uploadServer.upload_url, args.image);
        const saved = await vk.photosSaveWallPhoto({
          group_id: args.group_id,
          server: uploadResult.server,
          photo: uploadResult.photo,
          hash: uploadResult.hash,
          caption: args.caption,
        });
        const photo = saved[0];
        result = {
          ...photo,
          attachment: `photo${photo.owner_id}_${photo.id}`,
        };
        break;
      }

      case 'vk_groups_get':
        result = await vk.groupsGet({
          user_id: args.user_id,
          filter: args.filter,
          fields: args.fields || 'description,members_count',
          count: args.count || 100,
        });
        break;

      case 'vk_groups_get_by_id':
        result = await vk.groupsGetById({
          group_ids: args.group_ids,
          fields: args.fields || 'description,members_count',
        });
        break;

      case 'vk_friends_get':
        result = await vk.friendsGet({
          user_id: args.user_id,
          order: args.order,
          fields: args.fields || 'photo_200,online',
          count: args.count || 100,
        });
        break;

      case 'vk_newsfeed_get':
        result = await vk.newsfeedGet({
          filters: args.filters || 'post',
          count: args.count || 20,
          start_from: args.start_from,
        });
        break;

      case 'vk_stats_get':
        result = await vk.statsGet({
          group_id: args.group_id,
          interval: args.interval || 'day',
          intervals_count: args.intervals_count || 7,
        });
        break;

      case 'vk_photos_get':
        result = await vk.photosGet({
          owner_id: args.owner_id,
          album_id: args.album_id || 'wall',
          count: args.count || 50,
        });
        break;

      case 'vk_photos_get_all':
        result = await vk.photosGetAll({
          owner_id: args.owner_id,
          album_id: args.album_id,
          count: args.count,
          offset: args.offset,
        });
        break;

      case 'vk_photos_get_albums':
        result = await vk.photosGetAlbums({
          owner_id: args.owner_id,
          count: args.count,
          offset: args.offset,
        });
        break;

      case 'vk_photos_get_album':
        result = await vk.photosGetAlbum({
          owner_id: args.owner_id,
          album_id: args.album_id,
          count: args.count,
          offset: args.offset,
        });
        break;

      case 'vk_photos_get_by_id':
        result = await vk.photosGetById({
          photos: args.photos,
        });
        break;

      case 'vk_photos_get_comments':
        result = await vk.photosGetComments({
          owner_id: args.owner_id,
          photo_id: args.photo_id,
          count: args.count,
        });
        break;

      case 'vk_photos_get_tags':
        result = await vk.photosGetTags({
          owner_id: args.owner_id,
          photo_id: args.photo_id,
        });
        break;

      case 'vk_photos_get_new_tags':
        result = await vk.photosGetNewTags({
          count: args.count,
          offset: args.offset,
        });
        break;

      case 'vk_photos_search':
        result = await vk.photosSearch({
          q: args.q,
          lat: args.lat,
          long: args.long,
          start_time: args.start_time,
          end_time: args.end_time,
          count: args.count,
          offset: args.offset,
        });
        break;

      case 'vk_photos_get_wall_upload_server':
        result = await vk.photosGetWallUploadServer({
          group_id: args.group_id,
        });
        break;

      case 'vk_photos_get_messages_upload_server':
        result = await vk.photosGetMessagesUploadServer({
          group_id: args.group_id,
        });
        break;

      case 'vk_photos_get_owner_photo_upload_server':
        result = await vk.photosGetOwnerPhotoUploadServer({
          owner_id: args.owner_id,
        });
        break;

      case 'vk_photos_get_chat_upload_server':
        result = await vk.photosGetChatUploadServer({
          chat_id: args.chat_id,
        });
        break;

      case 'vk_video_get':
        result = await vk.videoGet({
          owner_id: args.owner_id,
          videos: args.videos,
          album_id: args.album_id,
          count: args.count,
          offset: args.offset,
        });
        break;

      case 'vk_video_get_albums':
        result = await vk.videoGetAlbums({
          owner_id: args.owner_id,
          count: args.count,
          offset: args.offset,
        });
        break;

      case 'vk_video_get_album':
        result = await vk.videoGetAlbum({
          owner_id: args.owner_id,
          album_id: args.album_id,
          count: args.count,
          offset: args.offset,
        });
        break;

      case 'vk_video_get_comments':
        result = await vk.videoGetComments({
          video_id: args.video_id,
          owner_id: args.owner_id,
          count: args.count,
        });
        break;

      case 'vk_video_get_tags':
        result = await vk.videoGetTags({
          video_id: args.video_id,
          owner_id: args.owner_id,
        });
        break;

      case 'vk_video_get_new_tags':
        result = await vk.videoGetNewTags({
          count: args.count,
          offset: args.offset,
        });
        break;

      case 'vk_video_get_by_id':
        result = await vk.videoGetById({
          videos: args.videos,
        });
        break;

      case 'vk_video_search':
        result = await vk.videoSearch({
          q: args.q,
          filters: args.filters,
          count: args.count,
          offset: args.offset,
        });
        break;

      case 'vk_video_get_album_by_id':
        result = await vk.videoGetAlbumById({
          album_id: args.album_id,
          owner_id: args.owner_id,
        });
        break;

      case 'vk_video_get_catalog':
        result = await vk.videoGetCatalog({
          section: args.section,
          count: args.count,
          from: args.from,
        });
        break;

      case 'vk_video_get_catalog_section':
        result = await vk.videoGetCatalogSection({
          section_id: args.section_id,
          count: args.count,
        });
        break;

      case 'vk_audio_get':
        result = await vk.audioGet({
          owner_id: args.owner_id,
          album_id: args.album_id,
          count: args.count,
          offset: args.offset,
        });
        break;

      case 'vk_audio_get_by_id':
        result = await vk.audioGetById({
          audios: args.audios,
        });
        break;

      case 'vk_audio_get_lyrics':
        result = await vk.audioGetLyrics({
          lyrics_id: args.lyrics_id,
        });
        break;

      case 'vk_audio_search':
        result = await vk.audioSearch({
          q: args.q,
          count: args.count,
          offset: args.offset,
        });
        break;

      case 'vk_audio_get_popular':
        result = await vk.audioGetPopular({
          only_eng: args.only_eng,
          count: args.count,
          offset: args.offset,
        });
        break;

      case 'vk_audio_get_radio':
        result = await vk.audioGetRadio({
          count: args.count,
          offset: args.offset,
        });
        break;

      case 'vk_audio_get_count':
        result = await vk.audioGetCount({
          owner_id: args.owner_id,
        });
        break;

      case 'vk_docs_get':
        result = await vk.docsGet({
          count: args.count,
          offset: args.offset,
          type: args.type,
        });
        break;

      case 'vk_docs_get_by_id':
        result = await vk.docsGetById({
          docs: args.docs,
        });
        break;

      case 'vk_docs_search':
        result = await vk.docsSearch({
          q: args.q,
          count: args.count,
        });
        break;

      case 'vk_docs_get_types':
        result = await vk.docsGetTypes({
          owner_id: args.owner_id,
        });
        break;

      case 'vk_docs_get_wall_upload_server':
        result = await vk.docsGetWallUploadServer({
          group_id: args.group_id,
        });
        break;

      case 'vk_docs_get_messages_upload_server':
        result = await vk.docsGetMessagesUploadServer({
          type: args.type,
        });
        break;

      case 'vk_users_get_followers':
        result = await vk.usersGetFollowers({
          user_id: args.user_id,
          count: args.count,
          offset: args.offset,
          fields: args.fields,
        });
        break;

      case 'vk_users_get_subscriptions':
        result = await vk.usersGetSubscriptions({
          user_id: args.user_id,
        });
        break;

      case 'vk_users_search':
        result = await vk.usersSearch({
          q: args.q,
          fields: args.fields,
          count: args.count,
          offset: args.offset,
        });
        break;

      case 'vk_users_is_app_user':
        result = await vk.usersIsAppUser({
          user_id: args.user_id,
        });
        break;

      case 'vk_users_get_nearby':
        result = await vk.usersGetNearby({
          latitude: args.latitude,
          longitude: args.longitude,
          count: args.count,
          radius: args.radius,
        });
        break;

      case 'vk_account_get_info':
        result = await vk.accountGetInfo({});
        break;

      case 'vk_account_get_push_settings':
        result = await vk.accountGetPushSettings({
          device_id: args.device_id,
        });
        break;

      case 'vk_account_get_counters':
        result = await vk.accountGetCounters({
          filter: args.filter,
        });
        break;

      case 'vk_account_get_app_permissions':
        result = await vk.accountGetAppPermissions({
          user_id: args.user_id,
        });
        break;

      case 'vk_account_get_balance':
        result = await vk.accountGetBalance({});
        break;

      case 'vk_groups_get_members':
        result = await vk.groupsGetMembers({
          group_id: args.group_id,
          count: args.count,
          offset: args.offset,
          fields: args.fields,
          filter: args.filter,
        });
        break;

      case 'vk_groups_get_requests':
        result = await vk.groupsGetRequests({
          group_id: args.group_id,
          count: args.count,
          offset: args.offset,
          fields: args.fields,
        });
        break;

      case 'vk_groups_get_settings':
        result = await vk.groupsGetSettings({
          group_id: args.group_id,
        });
        break;

      case 'vk_groups_get_long_poll_server':
        result = await vk.groupsGetLongPollServer({
          group_id: args.group_id,
        });
        break;

      case 'vk_groups_get_long_poll_settings':
        result = await vk.groupsGetLongPollSettings({
          group_id: args.group_id,
        });
        break;

      case 'vk_groups_get_addresses':
        result = await vk.groupsGetAddresses({
          group_id: args.group_id,
          address_ids: args.address_ids,
          latitude: args.latitude,
          longitude: args.longitude,
          count: args.count,
          offset: args.offset,
        });
        break;

      case 'vk_groups_get_token_permissions':
        result = await vk.groupsGetTokenPermissions({
          group_id: args.group_id,
        });
        break;

      case 'vk_friends_get_online':
        result = await vk.friendsGetOnline({
          user_id: args.user_id,
          count: args.count,
          offset: args.offset,
        });
        break;

      case 'vk_friends_get_mutual':
        result = await vk.friendsGetMutual({
          source_uid: args.source_uid,
          target_uid: args.target_uid,
          count: args.count,
          offset: args.offset,
        });
        break;

      case 'vk_friends_get_requests':
        result = await vk.friendsGetRequests({
          offset: args.offset,
          count: args.count,
          fields: args.fields,
          sort: args.sort,
        });
        break;

      case 'vk_friends_are_friends':
        result = await vk.friendsAreFriends({
          user_ids: args.user_ids,
        });
        break;

      case 'vk_friends_get_recent':
        result = await vk.friendsGetRecent({
          count: args.count,
        });
        break;

      case 'vk_friends_search':
        result = await vk.friendsSearch({
          user_id: args.user_id,
          q: args.q,
          count: args.count,
          offset: args.offset,
        });
        break;

      case 'vk_friends_get_suggestions':
        result = await vk.friendsGetSuggestions({
          count: args.count,
          offset: args.offset,
          fields: args.fields,
        });
        break;

      case 'vk_friends_get_app_users':
        result = await vk.friendsGetAppUsers({});
        break;

      case 'vk_friends_get_all':
        result = await vk.friendsGetAll({
          user_id: args.user_id,
          fields: args.fields,
          name_case: args.name_case,
        });
        break;

      case 'vk_newsfeed_get_comments':
        result = await vk.newsfeedGetComments({
          count: args.count,
          offset: args.offset,
          filters: args.filters,
        });
        break;

      case 'vk_newsfeed_get_reposts':
        result = await vk.newsfeedGetReposts({
          owner_id: args.owner_id,
          post_id: args.post_id,
          count: args.count,
          offset: args.offset,
        });
        break;

      case 'vk_newsfeed_get_suggested_sources':
        result = await vk.newsfeedGetSuggestedSources({
          count: args.count,
          offset: args.offset,
        });
        break;

      case 'vk_newsfeed_search':
        result = await vk.newsfeedSearch({
          q: args.q,
          count: args.count,
          offset: args.offset,
        });
        break;

      case 'vk_newsfeed_get_banned':
        result = await vk.newsfeedGetBanned({});
        break;

      case 'vk_likes_get_list':
        result = await vk.likesGetList({
          type: args.type,
          owner_id: args.owner_id,
          item_id: args.item_id,
          count: args.count,
          offset: args.offset,
          filters: args.filters,
        });
        break;

      case 'vk_likes_is_liked':
        result = await vk.likesIsLiked({
          type: args.type,
          owner_id: args.owner_id,
          item_id: args.item_id,
        });
        break;

      case 'vk_utils_get_short_link':
        result = await vk.utilsGetShortLink({
          url: args.url,
        });
        break;

      case 'vk_utils_get_server_time':
        result = await vk.utilsGetServerTime({});
        break;

      case 'vk_utils_resolve_screen_name':
        result = await vk.utilsResolveScreenName({
          screen_name: args.screen_name,
        });
        break;

      case 'vk_utils_get_link_stats':
        result = await vk.utilsGetLinkStats({
          key: args.key,
          interval: args.interval,
          intervals_count: args.intervals_count,
        });
        break;

      case 'vk_utils_check_link':
        result = await vk.utilsCheckLink({
          url: args.url,
        });
        break;

      case 'vk_database_get_countries':
        result = await vk.databaseGetCountries({
          need_all: args.need_all,
          code: args.code,
          count: args.count,
          offset: args.offset,
        });
        break;

      case 'vk_database_get_regions':
        result = await vk.databaseGetRegions({
          country_id: args.country_id,
          q: args.q,
          count: args.count,
        });
        break;

      case 'vk_database_get_cities':
        result = await vk.databaseGetCities({
          country_id: args.country_id,
          region_id: args.region_id,
          q: args.q,
          need_all: args.need_all,
          count: args.count,
          offset: args.offset,
        });
        break;

      case 'vk_database_get_schools':
        result = await vk.databaseGetSchools({
          city_id: args.city_id,
          q: args.q,
          count: args.count,
        });
        break;

      case 'vk_database_get_faculties':
        result = await vk.databaseGetFaculties({
          university_id: args.university_id,
          count: args.count,
          offset: args.offset,
        });
        break;

      case 'vk_database_get_chairs':
        result = await vk.databaseGetChairs({
          faculty_id: args.faculty_id,
          count: args.count,
          offset: args.offset,
        });
        break;

      case 'vk_wall_get_comment':
        result = await vk.wallGetComment({
          comment_id: args.comment_id,
          owner_id: args.owner_id,
        });
        break;

      case 'vk_wall_get_reposts':
        result = await vk.wallGetReposts({
          owner_id: args.owner_id,
          post_id: args.post_id,
          count: args.count,
          offset: args.offset,
        });
        break;

      case 'vk_messages_get':
        result = await vk.messagesGet({
          offset: args.offset,
          count: args.count,
          time_offset: args.time_offset,
        });
        break;

      case 'vk_messages_get_conversations':
        result = await vk.messagesGetConversations({
          offset: args.offset,
          count: args.count,
          filter: args.filter,
          extended: args.extended ? 1 : 0,
        });
        break;

      case 'vk_messages_get_by_id':
        result = await vk.messagesGetById({
          message_ids: args.message_ids,
        });
        break;

      case 'vk_messages_search':
        result = await vk.messagesSearch({
          q: args.q,
          count: args.count,
          offset: args.offset,
        });
        break;

      case 'vk_messages_get_dialogs':
        result = await vk.messagesGetDialogs({
          offset: args.offset,
          count: args.count,
          unread: args.unread ? 1 : 0,
        });
        break;

      case 'vk_messages_last_activity':
        result = await vk.messagesLastActivity({
          user_id: args.user_id,
        });
        break;

      case 'vk_messages_get_history':
        result = await vk.messagesGetHistory({
          user_id: args.user_id,
          offset: args.offset,
          count: args.count,
          start_message_id: args.start_message_id,
        });
        break;

      case 'vk_market_get_albums':
        result = await vk.marketGetAlbums({
          owner_id: args.owner_id,
          count: args.count,
          offset: args.offset,
        });
        break;

      case 'vk_market_get_album':
        result = await vk.marketGetAlbum({
          owner_id: args.owner_id,
          album_id: args.album_id,
        });
        break;

      case 'vk_market_get_items':
        result = await vk.marketGetItems({
          owner_id: args.owner_id,
          album_id: args.album_id,
          count: args.count,
          offset: args.offset,
        });
        break;

      case 'vk_market_get_items_by_id':
        result = await vk.marketGetItemsById({
          item_ids: args.item_ids,
        });
        break;

      case 'vk_market_search':
        result = await vk.marketSearch({
          q: args.q,
          count: args.count,
          offset: args.offset,
        });
        break;

      case 'vk_market_get_order':
        result = await vk.marketGetOrder({
          order_id: args.order_id,
          user_id: args.user_id,
        });
        break;

      case 'vk_market_get_orders':
        result = await vk.marketGetOrders({
          count: args.count,
          offset: args.offset,
        });
        break;

      case 'vk_market_get_order_items':
        result = await vk.marketGetOrderItems({
          order_id: args.order_id,
        });
        break;

      case 'vk_notes_get_by_id':
        result = await vk.notesGetById({
          note_id: args.note_id,
          owner_id: args.owner_id,
        });
        break;

      case 'vk_pages_get_history':
        result = await vk.pagesGetHistory({
          page_id: args.page_id,
          group_id: args.group_id,
          user_id: args.user_id,
        });
        break;

      case 'vk_pages_get_titles':
        result = await vk.pagesGetTitles({
          group_id: args.group_id,
        });
        break;

      case 'vk_pages_get_versions':
        result = await vk.pagesGetVersions({
          page_id: args.page_id,
          group_id: args.group_id,
        });
        break;

      case 'vk_status_get':
        result = await vk.statusGet({
          user_id: args.user_id,
          group_id: args.group_id,
        });
        break;

      case 'vk_storage_get':
        result = await vk.storageGet({
          key: args.key,
          user_id: args.user_id,
        });
        break;

      case 'vk_storage_get_keys':
        result = await vk.storageGetKeys({
          user_id: args.user_id,
          count: args.count,
          offset: args.offset,
        });
        break;

      case 'vk_gifts_get':
        result = await vk.giftsGet({
          user_id: args.user_id,
          count: args.count,
          offset: args.offset,
        });
        break;

      case 'vk_notifications_get_subscriptions':
        result = await vk.notificationsGetSubscriptions({});
        break;

      case 'vk_board_get':
        result = await vk.boardGet({
          group_id: args.group_id,
          topic_ids: args.topic_ids,
          count: args.count,
          offset: args.offset,
        });
        break;

      case 'vk_board_get_comments':
        result = await vk.boardGetComments({
          group_id: args.group_id,
          topic_id: args.topic_id,
          count: args.count,
          offset: args.offset,
        });
        break;

      case 'vk_fave_get_posts':
        result = await vk.faveGetPosts({
          count: args.count,
          offset: args.offset,
        });
        break;

      case 'vk_fave_get_photos':
        result = await vk.faveGetPhotos({
          count: args.count,
          offset: args.offset,
        });
        break;

      case 'vk_fave_get_videos':
        result = await vk.faveGetVideos({
          count: args.count,
          offset: args.offset,
        });
        break;

      case 'vk_fave_get_links':
        result = await vk.faveGetLinks({
          count: args.count,
          offset: args.offset,
        });
        break;

      case 'vk_apps_get':
        result = await vk.appsGet({
          app_id: args.app_id,
          app_ids: args.app_ids,
          platform: args.platform,
        });
        break;

      case 'vk_apps_get_catalog':
        result = await vk.appsGetCatalog({
          sort: args.sort,
          count: args.count,
          offset: args.offset,
          platform: args.platform,
          filter: args.filter,
        });
        break;

      case 'vk_apps_is_installed':
        result = await vk.appsIsInstalled({
          user_id: args.user_id,
        });
        break;

      case 'vk_widgets_get_comments':
        result = await vk.widgetsGetComments({
          widget_api_id: args.widget_api_id,
          url: args.url,
          count: args.count,
        });
        break;

      case 'vk_widgets_get_posts':
        result = await vk.widgetsGetPosts({
          widget_api_id: args.widget_api_id,
          url: args.url,
          count: args.count,
        });
        break;

      case 'vk_widgets_get_widget':
        result = await vk.widgetsGetWidget({
          widget_api_id: args.widget_api_id,
          url: args.url,
        });
        break;

      case 'vk_stats_get_post_reach':
        result = await vk.statsGetPostReach({
          owner_id: args.owner_id,
          post_id: args.post_id,
        });
        break;

      case 'vk_stats_get_visitors':
        result = await vk.statsGetVisitors({
          group_id: args.group_id,
          count: args.count,
          offset: args.offset,
        });
        break;

      case 'vk_polls_get':
        result = await vk.pollsGet({
          poll_id: args.poll_id,
          owner_id: args.owner_id,
        });
        break;

      case 'vk_secure_get_app_balance':
        result = await vk.secureGetAppBalance({});
        break;

      case 'vk_secure_get_mobile_apps_list':
        result = await vk.secureGetMobileAppsList({});
        break;

      case 'vk_secure_get_user_history':
        result = await vk.secureGetUserHistory({
          user_id: args.user_id,
          count: args.count,
          offset: args.offset,
        });
        break;

      case 'vk_secure_get_users_hits':
        result = await vk.secureGetUsersHits({
          count: args.count,
          offset: args.offset,
        });
        break;

      case 'vk_secure_check_token':
        result = await vk.secureCheckToken({
          token: args.token,
        });
        break;

      case 'vk_leadforms_get':
        result = await vk.leadformsGet({
          group_id: args.group_id,
          count: args.count,
        });
        break;

      case 'vk_leadforms_get_by_id':
        result = await vk.leadformsGetById({
          form_id: args.form_id,
          group_id: args.group_id,
        });
        break;

      case 'vk_orders_get':
        result = await vk.ordersGet({
          count: args.count,
          offset: args.offset,
        });
        break;

      case 'vk_orders_get_by_id':
        result = await vk.ordersGetById({
          order_ids: args.order_ids,
        });
        break;

      default:
        throw new Error(`Unknown tool: ${name}`);
    }

    return JSON.stringify(result, null, 2);
  } catch (error) {
    return JSON.stringify({ error: error.message });
  }
}

// ============================================
// SERVER SETUP
// ============================================

const server = new Server(
  { name: 'vk-mcp-server', version: '0.1.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const result = await handleToolCall(name, args || {});
  return { content: [{ type: 'text', text: result }] };
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('VK MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});

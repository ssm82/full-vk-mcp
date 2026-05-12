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
  photosCopy(params) { return this.call('photos.copy', params); }
  photosGetUploadServer(params) { return this.call('photos.getUploadServer', params); }
  photosMakeCover(params) { return this.call('photos.makeCover', params); }
  photosGetUserPhotos(params) { return this.call('photos.getUserPhotos', params); }

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
  videoAdd(params) { return this.call('video.add', params); }
  videoDelete(params) { return this.call('video.delete', params); }
  videoEdit(params) { return this.call('video.edit', params); }
  videoCreateComment(params) { return this.call('video.createComment', params); }
  videoDeleteComment(params) { return this.call('video.deleteComment', params); }
  videoEditComment(params) { return this.call('video.editComment', params); }
  videoAddAlbum(params) { return this.call('video.addAlbum', params); }
  videoDeleteAlbum(params) { return this.call('video.deleteAlbum', params); }
  videoEditAlbum(params) { return this.call('video.editAlbum', params); }
  videoSave(params) { return this.call('video.save', params); }

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
  accountGetProfileInfo(params) { return this.call('account.getProfileInfo', params); }
  accountSaveProfileInfo(params) { return this.call('account.saveProfileInfo', params); }
  accountSetOnline(params) { return this.call('account.setOnline', params); }
  accountSetOffline(params) { return this.call('account.setOffline', params); }
  accountBan(params) { return this.call('account.ban', params); }
  accountUnban(params) { return this.call('account.unban', params); }
  accountGetBanned(params) { return this.call('account.getBanned', params); }

  // Groups
  groupsGetMembers(params) { return this.call('groups.getMembers', params); }
  groupsGetRequests(params) { return this.call('groups.getRequests', params); }
  groupsGetSettings(params) { return this.call('groups.getSettings', params); }
  groupsGetLongPollServer(params) { return this.call('groups.getLongPollServer', params); }
  groupsGetLongPollSettings(params) { return this.call('groups.getLongPollSettings', params); }
  groupsGetAddresses(params) { return this.call('groups.getAddresses', params); }
  groupsGetTokenPermissions(params) { return this.call('groups.getTokenPermissions', params); }
  groupsIsMember(params) { return this.call('groups.isMember', params); }
  groupsCreate(params) { return this.call('groups.create', params); }
  groupsEdit(params) { return this.call('groups.edit', params); }
  groupsInvite(params) { return this.call('groups.invite', params); }
  groupsBan(params) { return this.call('groups.ban', params); }
  groupsGetBanned(params) { return this.call('groups.getBanned', params); }
  groupsApproveRequest(params) { return this.call('groups.approveRequest', params); }
  groupsGetInvites(params) { return this.call('groups.getInvites', params); }

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
  friendsAdd(params) { return this.call('friends.add', params); }
  friendsDelete(params) { return this.call('friends.delete', params); }
  friendsEdit(params) { return this.call('friends.edit', params); }
  friendsGetLists(params) { return this.call('friends.getLists', params); }

  // Newsfeed
  newsfeedGetComments(params) { return this.call('newsfeed.getComments', params); }
  newsfeedGetReposts(params) { return this.call('newsfeed.getReposts', params); }
  newsfeedGetSuggestedSources(params) { return this.call('newsfeed.getSuggestedSources', params); }
  newsfeedSearch(params) { return this.call('newsfeed.search', params); }
  newsfeedGetBanned(params) { return this.call('newsfeed.getBanned', params); }

  // Likes
  likesGetList(params) { return this.call('likes.getList', params); }
  likesIsLiked(params) { return this.call('likes.isLiked', params); }
  likesAdd(params) { return this.call('likes.add', params); }
  likesDelete(params) { return this.call('likes.delete', params); }

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
  wallGetComments(params) { return this.call('wall.getComments', params); }
  wallSearch(params) { return this.call('wall.search', params); }
  wallRepost(params) { return this.call('wall.repost', params); }
  wallPin(params) { return this.call('wall.pin', params); }
  wallUnpin(params) { return this.call('wall.unpin', params); }
  wallRestore(params) { return this.call('wall.restore', params); }
  wallDeleteComment(params) { return this.call('wall.deleteComment', params); }
  wallEditComment(params) { return this.call('wall.editComment', params); }
  wallCloseComments(params) { return this.call('wall.closeComments', params); }
  wallOpenComments(params) { return this.call('wall.openComments', params); }

  // Messages
  messagesGet(params) { return this.call('messages.get', params); }
  messagesGetConversations(params) { return this.call('messages.getConversations', params); }
  messagesGetById(params) { return this.call('messages.getById', params); }
  messagesSearch(params) { return this.call('messages.search', params); }
  messagesGetDialogs(params) { return this.call('messages.getDialogs', params); }
  messagesLastActivity(params) { return this.call('messages.lastActivity', params); }
  messagesGetHistory(params) { return this.call('messages.getHistory', params); }
  messagesSend(params) { return this.call('messages.send', params); }
  messagesDelete(params) { return this.call('messages.delete', params); }
  messagesEdit(params) { return this.call('messages.edit', params); }
  messagesMarkAsRead(params) { return this.call('messages.markAsRead', params); }
  messagesPin(params) { return this.call('messages.pin', params); }
  messagesUnpin(params) { return this.call('messages.unpin', params); }
  messagesCreateChat(params) { return this.call('messages.createChat', params); }
  messagesEditChat(params) { return this.call('messages.editChat', params); }
  messagesRemoveChatUser(params) { return this.call('messages.removeChatUser', params); }
  messagesAddChatUser(params) { return this.call('messages.addChatUser', params); }
  messagesGetConversationMembers(params) { return this.call('messages.getConversationMembers', params); }
  messagesGetConversationsById(params) { return this.call('messages.getConversationsById', params); }
  messagesGetChat(params) { return this.call('messages.getChat', params); }
  messagesGetLongPollServer(params) { return this.call('messages.getLongPollServer', params); }
  messagesSearchConversations(params) { return this.call('messages.searchConversations', params); }
  messagesSetActivity(params) { return this.call('messages.setActivity', params); }
  messagesDeleteConversation(params) { return this.call('messages.deleteConversation', params); }
  messagesRestore(params) { return this.call('messages.restore', params); }

  // Market
  marketGetAlbums(params) { return this.call('market.getAlbums', params); }
  marketGetAlbum(params) { return this.call('market.getAlbum', params); }
  marketGetItems(params) { return this.call('market.getItems', params); }
  marketGetItemsById(params) { return this.call('market.getItemsById', params); }
  marketSearch(params) { return this.call('market.search', params); }
  marketGetOrder(params) { return this.call('market.getOrder', params); }
  marketGetOrders(params) { return this.call('market.getOrders', params); }
  marketGetOrderItems(params) { return this.call('market.getOrderItems', params); }
  marketAdd(params) { return this.call('market.add', params); }
  marketEdit(params) { return this.call('market.edit', params); }
  marketDelete(params) { return this.call('market.delete', params); }
  marketAddAlbum(params) { return this.call('market.addAlbum', params); }
  marketEditAlbum(params) { return this.call('market.editAlbum', params); }
  marketDeleteAlbum(params) { return this.call('market.deleteAlbum', params); }
  marketCreateComment(params) { return this.call('market.createComment', params); }
  marketDeleteComment(params) { return this.call('market.deleteComment', params); }
  marketEditComment(params) { return this.call('market.editComment', params); }
  marketGetComments(params) { return this.call('market.getComments', params); }

  // Notes
  notesGetById(params) { return this.call('notes.getById', params); }

  // Pages
  pagesGetHistory(params) { return this.call('pages.getHistory', params); }
  pagesGetTitles(params) { return this.call('pages.getTitles', params); }
  pagesGetVersions(params) { return this.call('pages.getVersions', params); }

  // PrettyCards
  prettyCardsGet(params) { return this.call('prettyCards.get', params); }
  prettyCardsGetById(params) { return this.call('prettyCards.getById', params); }
  prettyCardsCreate(params) { return this.call('prettyCards.create', params); }
  prettyCardsEdit(params) { return this.call('prettyCards.edit', params); }
  prettyCardsDelete(params) { return this.call('prettyCards.delete', params); }
  prettyCardsGetUploadURL(params) { return this.call('prettyCards.getUploadURL', params); }

  // Status
  statusGet(params) { return this.call('status.get', params); }
  statusSet(params) { return this.call('status.set', params); }

  // Storage
  storageGet(params) { return this.call('storage.get', params); }
  storageGetKeys(params) { return this.call('storage.getKeys', params); }
  storageSet(params) { return this.call('storage.set', params); }

  // Gifts
  giftsGet(params) { return this.call('gifts.get', params); }

  // Notifications
  notificationsGetSubscriptions(params) { return this.call('notifications.getSubscriptions', params); }

  // Board
  boardGet(params) { return this.call('board.get', params); }
  boardGetComments(params) { return this.call('board.getComments', params); }
  boardAddTopic(params) { return this.call('board.addTopic', params); }
  boardDeleteTopic(params) { return this.call('board.deleteTopic', params); }
  boardEditTopic(params) { return this.call('board.editTopic', params); }
  boardCreateComment(params) { return this.call('board.createComment', params); }

  // Fave
  faveGetPosts(params) { return this.call('fave.getPosts', params); }
  faveGetPhotos(params) { return this.call('fave.getPhotos', params); }
  faveGetVideos(params) { return this.call('fave.getVideos', params); }
  faveGetLinks(params) { return this.call('fave.getLinks', params); }
  faveAddPost(params) { return this.call('fave.addPost', params); }
  faveRemovePost(params) { return this.call('fave.removePost', params); }
  faveAddLink(params) { return this.call('fave.addLink', params); }
  faveRemoveLink(params) { return this.call('fave.removeLink', params); }

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
  pollsCreate(params) { return this.call('polls.create', params); }
  pollsAddVote(params) { return this.call('polls.addVote', params); }
  pollsDeleteVote(params) { return this.call('polls.deleteVote', params); }
  pollsGetVoters(params) { return this.call('polls.getVoters', params); }

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

  // Stories
  storiesGet(params) { return this.call('stories.get', params); }
  storiesGetById(params) { return this.call('stories.getById', params); }
  storiesGetReplies(params) { return this.call('stories.getReplies', params); }
  storiesGetStats(params) { return this.call('stories.getStats', params); }
  storiesGetViewers(params) { return this.call('stories.getViewers', params); }
  storiesSearch(params) { return this.call('stories.search', params); }
  storiesDelete(params) { return this.call('stories.delete', params); }
  storiesBanOwner(params) { return this.call('stories.banOwner', params); }
  storiesUnbanOwner(params) { return this.call('stories.unbanOwner', params); }
  storiesGetBanned(params) { return this.call('stories.getBanned', params); }
  storiesGetPhotoUploadServer(params) { return this.call('stories.getPhotoUploadServer', params); }
  storiesGetVideoUploadServer(params) { return this.call('stories.getVideoUploadServer', params); }
  storiesSave(params) { return this.call('stories.save', params); }
  storiesHideReply(params) { return this.call('stories.hideReply', params); }
  storiesHideAllReplies(params) { return this.call('stories.hideAllReplies', params); }
  storiesSendInteraction(params) { return this.call('stories.sendInteraction', params); }

  // Search
  searchGetHints(params) { return this.call('search.getHints', params); }

  // Execute
  executeCode(params) { return this.call('execute', params); }

  // Notifications
  notificationsGet(params) { return this.call('notifications.get', params); }
  notificationsMarkAsViewed(params) { return this.call('notifications.markAsViewed', params); }
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
  {
        "name": "vk_stories_get",
        "description": "Get stories of a user or community",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "owner_id": {
                          "type": "number",
                          "description": "Story owner ID"
                    },
                    "extended": {
                          "type": "boolean",
                          "description": "Return additional fields"
                    }
              }
        }
  },
  {
        "name": "vk_stories_get_by_id",
        "description": "Get stories by their IDs",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "stories": {
                          "type": "string",
                          "description": "Comma-separated story IDs in format {owner_id}_{story_id}"
                    },
                    "extended": {
                          "type": "boolean",
                          "description": "Return additional fields"
                    }
              },
              "required": [
                    "stories"
              ]
        }
  },
  {
        "name": "vk_stories_get_replies",
        "description": "Get replies to a story",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "owner_id": {
                          "type": "number",
                          "description": "Story owner ID"
                    },
                    "story_id": {
                          "type": "number",
                          "description": "Story ID"
                    },
                    "count": {
                          "type": "number",
                          "description": "Number of replies"
                    },
                    "offset": {
                          "type": "number",
                          "description": "Offset"
                    }
              },
              "required": [
                    "owner_id",
                    "story_id"
              ]
        }
  },
  {
        "name": "vk_stories_get_stats",
        "description": "Get story statistics",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "owner_id": {
                          "type": "number",
                          "description": "Story owner ID"
                    },
                    "story_id": {
                          "type": "number",
                          "description": "Story ID"
                    }
              },
              "required": [
                    "owner_id",
                    "story_id"
              ]
        }
  },
  {
        "name": "vk_stories_get_viewers",
        "description": "Get list of story viewers",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "owner_id": {
                          "type": "number",
                          "description": "Story owner ID"
                    },
                    "story_id": {
                          "type": "number",
                          "description": "Story ID"
                    },
                    "count": {
                          "type": "number",
                          "description": "Number of viewers"
                    },
                    "offset": {
                          "type": "number",
                          "description": "Offset"
                    }
              },
              "required": [
                    "owner_id",
                    "story_id"
              ]
        }
  },
  {
        "name": "vk_stories_search",
        "description": "Search for stories by location",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "q": {
                          "type": "string",
                          "description": "Search query"
                    },
                    "place_id": {
                          "type": "number",
                          "description": "Place ID"
                    },
                    "latitude": {
                          "type": "number",
                          "description": "Latitude"
                    },
                    "longitude": {
                          "type": "number",
                          "description": "Longitude"
                    },
                    "radius": {
                          "type": "number",
                          "description": "Search radius in meters"
                    },
                    "count": {
                          "type": "number",
                          "description": "Number of stories"
                    },
                    "offset": {
                          "type": "number",
                          "description": "Offset"
                    }
              }
        }
  },
  {
        "name": "vk_stories_delete",
        "description": "Delete a story",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "owner_id": {
                          "type": "number",
                          "description": "Story owner ID"
                    },
                    "story_id": {
                          "type": "number",
                          "description": "Story ID"
                    }
              },
              "required": [
                    "owner_id",
                    "story_id"
              ]
        }
  },
  {
        "name": "vk_stories_ban_owner",
        "description": "Ban story owner from stories feed",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "owner_id": {
                          "type": "number",
                          "description": "Owner ID to ban"
                    }
              },
              "required": [
                    "owner_id"
              ]
        }
  },
  {
        "name": "vk_stories_unban_owner",
        "description": "Unban story owner",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "owner_id": {
                          "type": "number",
                          "description": "Owner ID to unban"
                    }
              },
              "required": [
                    "owner_id"
              ]
        }
  },
  {
        "name": "vk_stories_get_banned",
        "description": "Get banned story owners",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "count": {
                          "type": "number",
                          "description": "Number of banned owners"
                    },
                    "offset": {
                          "type": "number",
                          "description": "Offset"
                    },
                    "extended": {
                          "type": "boolean",
                          "description": "Return additional fields"
                    }
              }
        }
  },
  {
        "name": "vk_stories_get_photo_upload_server",
        "description": "Get photo upload server for stories",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "add_to_news": {
                          "type": "boolean",
                          "description": "Add story to news feed"
                    },
                    "user_ids": {
                          "type": "string",
                          "description": "Comma-separated user IDs to send story to"
                    },
                    "reply_to_story": {
                          "type": "string",
                          "description": "Story ID to reply to"
                    },
                    "link_text": {
                          "type": "string",
                          "description": "Link button text"
                    },
                    "link_url": {
                          "type": "string",
                          "description": "Link URL"
                    },
                    "group_id": {
                          "type": "number",
                          "description": "Community ID"
                    }
              }
        }
  },
  {
        "name": "vk_stories_get_video_upload_server",
        "description": "Get video upload server for stories",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "add_to_news": {
                          "type": "boolean",
                          "description": "Add story to news feed"
                    },
                    "user_ids": {
                          "type": "string",
                          "description": "Comma-separated user IDs to send story to"
                    },
                    "reply_to_story": {
                          "type": "string",
                          "description": "Story ID to reply to"
                    },
                    "link_text": {
                          "type": "string",
                          "description": "Link button text"
                    },
                    "link_url": {
                          "type": "string",
                          "description": "Link URL"
                    },
                    "group_id": {
                          "type": "number",
                          "description": "Community ID"
                    }
              }
        }
  },
  {
        "name": "vk_stories_save",
        "description": "Save uploaded story after upload",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "upload_results": {
                          "type": "string",
                          "description": "Upload result string from server"
                    }
              },
              "required": [
                    "upload_results"
              ]
        }
  },
  {
        "name": "vk_stories_hide_reply",
        "description": "Hide reply to a story",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "owner_id": {
                          "type": "number",
                          "description": "Story owner ID"
                    },
                    "story_id": {
                          "type": "number",
                          "description": "Story ID"
                    }
              },
              "required": [
                    "owner_id",
                    "story_id"
              ]
        }
  },
  {
        "name": "vk_stories_hide_all_replies",
        "description": "Hide all replies to a story",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "owner_id": {
                          "type": "number",
                          "description": "Story owner ID"
                    },
                    "story_id": {
                          "type": "number",
                          "description": "Story ID"
                    }
              },
              "required": [
                    "owner_id",
                    "story_id"
              ]
        }
  },
  {
        "name": "vk_stories_send_interaction",
        "description": "Send interaction to a story",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "user_id": {
                          "type": "number",
                          "description": "User ID"
                    },
                    "access_key": {
                          "type": "string",
                          "description": "Access key"
                    }
              },
              "required": [
                    "user_id",
                    "access_key"
              ]
        }
  },
  {
        "name": "vk_search_get_hints",
        "description": "Search for users, groups, and other items",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "q": {
                          "type": "string",
                          "description": "Search query"
                    },
                    "limit": {
                          "type": "number",
                          "description": "Number of results"
                    },
                    "filters": {
                          "type": "string",
                          "description": "Comma-separated filters: users, groups, applications, music, hints"
                    },
                    "search_global": {
                          "type": "boolean",
                          "description": "Search globally"
                    }
              },
              "required": [
                    "q"
              ]
        }
  },
  {
        "name": "vk_execute",
        "description": "Execute VKScript code",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "code": {
                          "type": "string",
                          "description": "VKScript code to execute"
                    }
              },
              "required": [
                    "code"
              ]
        }
  },
  {
        "name": "vk_notifications_get",
        "description": "Get user notifications",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "count": {
                          "type": "number",
                          "description": "Number of notifications"
                    },
                    "start_from": {
                          "type": "string",
                          "description": "Pagination cursor"
                    },
                    "filters": {
                          "type": "string",
                          "description": "Filters: wall, mentions, comments, likes, reposts, followers, friends"
                    }
              }
        }
  },
  {
        "name": "vk_notifications_mark_as_viewed",
        "description": "Mark all notifications as viewed",
        "inputSchema": {
              "type": "object",
              "properties": {}
        }
  },
  {
        "name": "vk_messages_send",
        "description": "Send a message",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "user_id": {
                          "type": "number",
                          "description": "User ID"
                    },
                    "peer_id": {
                          "type": "number",
                          "description": "Destination ID (user, chat, or community)"
                    },
                    "domain": {
                          "type": "string",
                          "description": "User short address"
                    },
                    "chat_id": {
                          "type": "number",
                          "description": "Chat ID"
                    },
                    "message": {
                          "type": "string",
                          "description": "Message text"
                    },
                    "random_id": {
                          "type": "number",
                          "description": "Unique random ID to prevent duplicates"
                    },
                    "lat": {
                          "type": "number",
                          "description": "Latitude"
                    },
                    "long": {
                          "type": "number",
                          "description": "Longitude"
                    },
                    "attachment": {
                          "type": "string",
                          "description": "Comma-separated attachments"
                    },
                    "reply_to": {
                          "type": "number",
                          "description": "Message ID to reply to"
                    },
                    "forward_messages": {
                          "type": "string",
                          "description": "Comma-separated message IDs to forward"
                    },
                    "sticker_id": {
                          "type": "number",
                          "description": "Sticker ID"
                    }
              }
        }
  },
  {
        "name": "vk_messages_delete",
        "description": "Delete messages",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "message_ids": {
                          "type": "string",
                          "description": "Comma-separated message IDs"
                    },
                    "spam": {
                          "type": "boolean",
                          "description": "Mark as spam"
                    },
                    "group_id": {
                          "type": "number",
                          "description": "Community ID"
                    },
                    "delete_for_all": {
                          "type": "boolean",
                          "description": "Delete for all recipients"
                    }
              }
        }
  },
  {
        "name": "vk_messages_edit",
        "description": "Edit a message",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "peer_id": {
                          "type": "number",
                          "description": "Destination ID"
                    },
                    "message_id": {
                          "type": "number",
                          "description": "Message ID"
                    },
                    "message": {
                          "type": "string",
                          "description": "New message text"
                    },
                    "lat": {
                          "type": "number",
                          "description": "Latitude"
                    },
                    "long": {
                          "type": "number",
                          "description": "Longitude"
                    },
                    "attachment": {
                          "type": "string",
                          "description": "Comma-separated attachments"
                    },
                    "keep_forward_messages": {
                          "type": "boolean",
                          "description": "Keep forwarded messages"
                    },
                    "keep_snippets": {
                          "type": "boolean",
                          "description": "Keep snippets"
                    },
                    "group_id": {
                          "type": "number",
                          "description": "Community ID"
                    },
                    "dont_parse_links": {
                          "type": "boolean",
                          "description": "Do not parse links"
                    }
              },
              "required": [
                    "peer_id",
                    "message_id"
              ]
        }
  },
  {
        "name": "vk_messages_mark_as_read",
        "description": "Mark messages as read",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "message_ids": {
                          "type": "string",
                          "description": "Comma-separated message IDs"
                    },
                    "peer_id": {
                          "type": "number",
                          "description": "Destination ID"
                    }
              }
        }
  },
  {
        "name": "vk_messages_pin",
        "description": "Pin a message",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "peer_id": {
                          "type": "number",
                          "description": "Destination ID"
                    },
                    "message_id": {
                          "type": "number",
                          "description": "Message ID"
                    }
              },
              "required": [
                    "peer_id",
                    "message_id"
              ]
        }
  },
  {
        "name": "vk_messages_unpin",
        "description": "Unpin a message",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "peer_id": {
                          "type": "number",
                          "description": "Destination ID"
                    },
                    "message_id": {
                          "type": "number",
                          "description": "Message ID"
                    }
              },
              "required": [
                    "peer_id",
                    "message_id"
              ]
        }
  },
  {
        "name": "vk_messages_create_chat",
        "description": "Create a new chat",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "user_ids": {
                          "type": "string",
                          "description": "Comma-separated user IDs"
                    },
                    "title": {
                          "type": "string",
                          "description": "Chat title"
                    }
              }
        }
  },
  {
        "name": "vk_messages_edit_chat",
        "description": "Edit chat title",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "chat_id": {
                          "type": "number",
                          "description": "Chat ID"
                    },
                    "title": {
                          "type": "string",
                          "description": "New chat title"
                    }
              },
              "required": [
                    "chat_id",
                    "title"
              ]
        }
  },
  {
        "name": "vk_messages_remove_chat_user",
        "description": "Remove a user from a chat",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "chat_id": {
                          "type": "number",
                          "description": "Chat ID"
                    },
                    "user_id": {
                          "type": "number",
                          "description": "User ID"
                    },
                    "member_id": {
                          "type": "number",
                          "description": "Member ID (alternative to user_id)"
                    }
              },
              "required": [
                    "chat_id"
              ]
        }
  },
  {
        "name": "vk_messages_add_chat_user",
        "description": "Add a user to a chat",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "chat_id": {
                          "type": "number",
                          "description": "Chat ID"
                    },
                    "user_id": {
                          "type": "number",
                          "description": "User ID"
                    }
              },
              "required": [
                    "chat_id",
                    "user_id"
              ]
        }
  },
  {
        "name": "vk_messages_get_conversation_members",
        "description": "Get chat conversation members",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "peer_id": {
                          "type": "number",
                          "description": "Destination ID"
                    },
                    "fields": {
                          "type": "string",
                          "description": "Profile fields"
                    }
              },
              "required": [
                    "peer_id"
              ]
        }
  },
  {
        "name": "vk_messages_get_conversations_by_id",
        "description": "Get conversations by ID",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "peer_ids": {
                          "type": "string",
                          "description": "Comma-separated peer IDs"
                    },
                    "extended": {
                          "type": "boolean",
                          "description": "Return additional fields"
                    },
                    "fields": {
                          "type": "string",
                          "description": "Profile fields"
                    }
              },
              "required": [
                    "peer_ids"
              ]
        }
  },
  {
        "name": "vk_messages_get_chat",
        "description": "Get chat information",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "chat_id": {
                          "type": "number",
                          "description": "Chat ID"
                    },
                    "chat_ids": {
                          "type": "string",
                          "description": "Comma-separated chat IDs"
                    },
                    "fields": {
                          "type": "string",
                          "description": "Profile fields"
                    }
              }
        }
  },
  {
        "name": "vk_messages_get_long_poll_server",
        "description": "Get Long Poll server for messages",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "need_pts": {
                          "type": "boolean",
                          "description": "Return pts"
                    },
                    "group_id": {
                          "type": "number",
                          "description": "Community ID"
                    },
                    "lp_version": {
                          "type": "number",
                          "description": "Long Poll version"
                    }
              }
        }
  },
  {
        "name": "vk_messages_search_conversations",
        "description": "Search conversations",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "q": {
                          "type": "string",
                          "description": "Search query"
                    },
                    "count": {
                          "type": "number",
                          "description": "Number of results"
                    },
                    "extended": {
                          "type": "boolean",
                          "description": "Return additional fields"
                    },
                    "fields": {
                          "type": "string",
                          "description": "Profile fields"
                    }
              }
        }
  },
  {
        "name": "vk_messages_set_activity",
        "description": "Set typing activity status",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "user_id": {
                          "type": "number",
                          "description": "User ID"
                    },
                    "type": {
                          "type": "string",
                          "description": "Activity type: typing, audiomessage",
                          "enum": [
                                "typing",
                                "audiomessage"
                          ]
                    },
                    "peer_id": {
                          "type": "number",
                          "description": "Destination ID"
                    }
              },
              "required": [
                    "peer_id"
              ]
        }
  },
  {
        "name": "vk_messages_delete_conversation",
        "description": "Delete a conversation",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "user_id": {
                          "type": "number",
                          "description": "User ID"
                    },
                    "peer_id": {
                          "type": "number",
                          "description": "Destination ID"
                    },
                    "group_id": {
                          "type": "number",
                          "description": "Community ID"
                    }
              },
              "required": [
                    "peer_id"
              ]
        }
  },
  {
        "name": "vk_messages_restore",
        "description": "Restore a deleted message",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "message_id": {
                          "type": "number",
                          "description": "Message ID"
                    },
                    "group_id": {
                          "type": "number",
                          "description": "Community ID"
                    }
              },
              "required": [
                    "message_id"
              ]
        }
  },
  {
        "name": "vk_likes_add",
        "description": "Add a like",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "type": {
                          "type": "string",
                          "description": "Item type: post, comment, photo, audio, video, note, market, market_comment, topic_comment, sitepage",
                          "enum": [
                                "post",
                                "comment",
                                "photo",
                                "audio",
                                "video",
                                "note",
                                "market",
                                "market_comment",
                                "topic_comment",
                                "sitepage"
                          ]
                    },
                    "owner_id": {
                          "type": "number",
                          "description": "Item owner ID"
                    },
                    "item_id": {
                          "type": "number",
                          "description": "Item ID"
                    },
                    "access_key": {
                          "type": "string",
                          "description": "Access key"
                    }
              },
              "required": [
                    "type",
                    "item_id"
              ]
        }
  },
  {
        "name": "vk_likes_delete",
        "description": "Remove a like",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "type": {
                          "type": "string",
                          "description": "Item type: post, comment, photo, audio, video, note, market, market_comment, topic_comment, sitepage",
                          "enum": [
                                "post",
                                "comment",
                                "photo",
                                "audio",
                                "video",
                                "note",
                                "market",
                                "market_comment",
                                "topic_comment",
                                "sitepage"
                          ]
                    },
                    "owner_id": {
                          "type": "number",
                          "description": "Item owner ID"
                    },
                    "item_id": {
                          "type": "number",
                          "description": "Item ID"
                    }
              },
              "required": [
                    "type",
                    "item_id"
              ]
        }
  },
  {
        "name": "vk_wall_get_comments",
        "description": "Get comments on a wall post",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "owner_id": {
                          "type": "number",
                          "description": "Post owner ID"
                    },
                    "post_id": {
                          "type": "number",
                          "description": "Post ID"
                    },
                    "need_likes": {
                          "type": "boolean",
                          "description": "Include likes info"
                    },
                    "offset": {
                          "type": "number",
                          "description": "Offset"
                    },
                    "count": {
                          "type": "number",
                          "description": "Number of comments"
                    },
                    "sort": {
                          "type": "string",
                          "description": "Sort order: asc, desc",
                          "enum": [
                                "asc",
                                "desc"
                          ]
                    },
                    "preview_length": {
                          "type": "number",
                          "description": "Preview length"
                    },
                    "extended": {
                          "type": "boolean",
                          "description": "Return additional fields"
                    }
              },
              "required": [
                    "post_id"
              ]
        }
  },
  {
        "name": "vk_wall_search",
        "description": "Search posts on a wall",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "owner_id": {
                          "type": "number",
                          "description": "Wall owner ID"
                    },
                    "domain": {
                          "type": "string",
                          "description": "Domain"
                    },
                    "query": {
                          "type": "string",
                          "description": "Search query"
                    },
                    "owners_only": {
                          "type": "boolean",
                          "description": "Search only owner posts"
                    },
                    "count": {
                          "type": "number",
                          "description": "Number of posts"
                    },
                    "offset": {
                          "type": "number",
                          "description": "Offset"
                    },
                    "extended": {
                          "type": "boolean",
                          "description": "Return additional fields"
                    }
              }
        }
  },
  {
        "name": "vk_wall_repost",
        "description": "Repost a wall post",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "object": {
                          "type": "string",
                          "description": "Object to repost: wall{owner_id}_{post_id}, wall{owner_id}_{post_id}_{reply_id}, topic{owner_id}_{topic_id}, video{owner_id}_{video_id}"
                    },
                    "message": {
                          "type": "string",
                          "description": "Comment text"
                    },
                    "group_id": {
                          "type": "number",
                          "description": "Community ID to repost to"
                    },
                    "mark_as_ads": {
                          "type": "boolean",
                          "description": "Mark as ads"
                    },
                    "mute_notifications": {
                          "type": "boolean",
                          "description": "Mute notifications"
                    }
              },
              "required": [
                    "object"
              ]
        }
  },
  {
        "name": "vk_wall_pin",
        "description": "Pin a wall post",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "owner_id": {
                          "type": "number",
                          "description": "Wall owner ID"
                    },
                    "post_id": {
                          "type": "number",
                          "description": "Post ID"
                    }
              },
              "required": [
                    "owner_id",
                    "post_id"
              ]
        }
  },
  {
        "name": "vk_wall_unpin",
        "description": "Unpin a wall post",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "owner_id": {
                          "type": "number",
                          "description": "Wall owner ID"
                    },
                    "post_id": {
                          "type": "number",
                          "description": "Post ID"
                    }
              },
              "required": [
                    "owner_id",
                    "post_id"
              ]
        }
  },
  {
        "name": "vk_wall_restore",
        "description": "Restore a deleted wall post",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "owner_id": {
                          "type": "number",
                          "description": "Wall owner ID"
                    },
                    "post_id": {
                          "type": "number",
                          "description": "Post ID"
                    }
              },
              "required": [
                    "post_id"
              ]
        }
  },
  {
        "name": "vk_wall_delete_comment",
        "description": "Delete a comment on a wall post",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "owner_id": {
                          "type": "number",
                          "description": "Wall owner ID"
                    },
                    "comment_id": {
                          "type": "number",
                          "description": "Comment ID"
                    }
              },
              "required": [
                    "comment_id"
              ]
        }
  },
  {
        "name": "vk_wall_edit_comment",
        "description": "Edit a comment on a wall post",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "owner_id": {
                          "type": "number",
                          "description": "Wall owner ID"
                    },
                    "comment_id": {
                          "type": "number",
                          "description": "Comment ID"
                    },
                    "message": {
                          "type": "string",
                          "description": "New comment text"
                    },
                    "attachments": {
                          "type": "string",
                          "description": "Comma-separated attachments"
                    }
              },
              "required": [
                    "comment_id"
              ]
        }
  },
  {
        "name": "vk_wall_close_comments",
        "description": "Close comments on a wall post",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "owner_id": {
                          "type": "number",
                          "description": "Wall owner ID"
                    },
                    "post_id": {
                          "type": "number",
                          "description": "Post ID"
                    }
              },
              "required": [
                    "owner_id",
                    "post_id"
              ]
        }
  },
  {
        "name": "vk_wall_open_comments",
        "description": "Open comments on a wall post",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "owner_id": {
                          "type": "number",
                          "description": "Wall owner ID"
                    },
                    "post_id": {
                          "type": "number",
                          "description": "Post ID"
                    }
              },
              "required": [
                    "owner_id",
                    "post_id"
              ]
        }
  },
  {
        "name": "vk_photos_copy",
        "description": "Copy a photo to Saved Photos",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "owner_id": {
                          "type": "number",
                          "description": "Photo owner ID"
                    },
                    "photo_id": {
                          "type": "number",
                          "description": "Photo ID"
                    },
                    "access_key": {
                          "type": "string",
                          "description": "Access key"
                    }
              },
              "required": [
                    "owner_id",
                    "photo_id"
              ]
        }
  },
  {
        "name": "vk_photos_create_album",
        "description": "Create a photo album",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "title": {
                          "type": "string",
                          "description": "Album title"
                    },
                    "group_id": {
                          "type": "number",
                          "description": "Community ID"
                    },
                    "description": {
                          "type": "string",
                          "description": "Album description"
                    },
                    "privacy_view": {
                          "type": "string",
                          "description": "Privacy settings for viewing"
                    },
                    "privacy_comment": {
                          "type": "string",
                          "description": "Privacy settings for commenting"
                    },
                    "upload_by_admins_only": {
                          "type": "boolean",
                          "description": "Only admins can upload"
                    },
                    "comments_disabled": {
                          "type": "boolean",
                          "description": "Disable comments"
                    }
              },
              "required": [
                    "title"
              ]
        }
  },
  {
        "name": "vk_photos_delete_album",
        "description": "Delete a photo album",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "album_id": {
                          "type": "number",
                          "description": "Album ID"
                    },
                    "group_id": {
                          "type": "number",
                          "description": "Community ID"
                    }
              },
              "required": [
                    "album_id"
              ]
        }
  },
  {
        "name": "vk_photos_edit_album",
        "description": "Edit a photo album",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "album_id": {
                          "type": "number",
                          "description": "Album ID"
                    },
                    "title": {
                          "type": "string",
                          "description": "New album title"
                    },
                    "description": {
                          "type": "string",
                          "description": "New album description"
                    },
                    "owner_id": {
                          "type": "number",
                          "description": "Owner ID"
                    },
                    "privacy_view": {
                          "type": "string",
                          "description": "Privacy settings for viewing"
                    },
                    "privacy_comment": {
                          "type": "string",
                          "description": "Privacy settings for commenting"
                    },
                    "upload_by_admins_only": {
                          "type": "boolean",
                          "description": "Only admins can upload"
                    },
                    "comments_disabled": {
                          "type": "boolean",
                          "description": "Disable comments"
                    }
              },
              "required": [
                    "album_id"
              ]
        }
  },
  {
        "name": "vk_photos_get_upload_server",
        "description": "Get photo upload server",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "album_id": {
                          "type": "number",
                          "description": "Album ID"
                    },
                    "group_id": {
                          "type": "number",
                          "description": "Community ID"
                    }
              },
              "required": [
                    "album_id"
              ]
        }
  },
  {
        "name": "vk_photos_save",
        "description": "Save uploaded photos",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "album_id": {
                          "type": "number",
                          "description": "Album ID"
                    },
                    "group_id": {
                          "type": "number",
                          "description": "Community ID"
                    },
                    "server": {
                          "type": "number",
                          "description": "Server parameter from upload result"
                    },
                    "photos_list": {
                          "type": "string",
                          "description": "Photos list from upload result"
                    },
                    "hash": {
                          "type": "string",
                          "description": "Hash from upload result"
                    },
                    "latitude": {
                          "type": "number",
                          "description": "Latitude"
                    },
                    "longitude": {
                          "type": "number",
                          "description": "Longitude"
                    },
                    "caption": {
                          "type": "string",
                          "description": "Photo caption"
                    }
              },
              "required": [
                    "album_id",
                    "server",
                    "photos_list",
                    "hash"
              ]
        }
  },
  {
        "name": "vk_photos_save_messages_photo",
        "description": "Save uploaded message photos",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "photo": {
                          "type": "string",
                          "description": "Photo parameter from upload result"
                    },
                    "server": {
                          "type": "number",
                          "description": "Server parameter from upload result"
                    },
                    "hash": {
                          "type": "string",
                          "description": "Hash from upload result"
                    }
              },
              "required": [
                    "photo",
                    "server",
                    "hash"
              ]
        }
  },
  {
        "name": "vk_photos_save_owner_photo",
        "description": "Save uploaded owner photo",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "server": {
                          "type": "string",
                          "description": "Server parameter from upload result"
                    },
                    "hash": {
                          "type": "string",
                          "description": "Hash from upload result"
                    },
                    "photo": {
                          "type": "string",
                          "description": "Photo parameter from upload result"
                    }
              },
              "required": [
                    "server",
                    "hash",
                    "photo"
              ]
        }
  },
  {
        "name": "vk_photos_make_cover",
        "description": "Make a photo an album cover",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "owner_id": {
                          "type": "number",
                          "description": "Photo owner ID"
                    },
                    "photo_id": {
                          "type": "number",
                          "description": "Photo ID"
                    },
                    "album_id": {
                          "type": "number",
                          "description": "Album ID"
                    }
              },
              "required": [
                    "owner_id",
                    "photo_id",
                    "album_id"
              ]
        }
  },
  {
        "name": "vk_photos_get_user_photos",
        "description": "Get photos where a user is tagged",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "user_id": {
                          "type": "number",
                          "description": "User ID"
                    },
                    "offset": {
                          "type": "number",
                          "description": "Offset"
                    },
                    "count": {
                          "type": "number",
                          "description": "Number of photos"
                    },
                    "extended": {
                          "type": "boolean",
                          "description": "Return additional fields"
                    },
                    "sort": {
                          "type": "string",
                          "description": "Sort order"
                    }
              }
        }
  },
  {
        "name": "vk_video_add",
        "description": "Add a video to user or community videos",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "target_id": {
                          "type": "number",
                          "description": "Target owner ID"
                    },
                    "video_id": {
                          "type": "number",
                          "description": "Video ID"
                    },
                    "owner_id": {
                          "type": "number",
                          "description": "Video owner ID"
                    }
              },
              "required": [
                    "video_id",
                    "owner_id"
              ]
        }
  },
  {
        "name": "vk_video_delete",
        "description": "Delete a video",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "video_id": {
                          "type": "number",
                          "description": "Video ID"
                    },
                    "owner_id": {
                          "type": "number",
                          "description": "Video owner ID"
                    },
                    "target_id": {
                          "type": "number",
                          "description": "Target ID"
                    }
              },
              "required": [
                    "video_id"
              ]
        }
  },
  {
        "name": "vk_video_edit",
        "description": "Edit a video",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "owner_id": {
                          "type": "number",
                          "description": "Video owner ID"
                    },
                    "video_id": {
                          "type": "number",
                          "description": "Video ID"
                    },
                    "name": {
                          "type": "string",
                          "description": "New video title"
                    },
                    "desc": {
                          "type": "string",
                          "description": "New video description"
                    },
                    "privacy_view": {
                          "type": "string",
                          "description": "Privacy settings for viewing"
                    },
                    "privacy_comment": {
                          "type": "string",
                          "description": "Privacy settings for commenting"
                    },
                    "no_comments": {
                          "type": "boolean",
                          "description": "Disable comments"
                    },
                    "repeat": {
                          "type": "boolean",
                          "description": "Loop playback"
                    }
              },
              "required": [
                    "video_id"
              ]
        }
  },
  {
        "name": "vk_video_create_comment",
        "description": "Add a comment to a video",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "owner_id": {
                          "type": "number",
                          "description": "Video owner ID"
                    },
                    "video_id": {
                          "type": "number",
                          "description": "Video ID"
                    },
                    "message": {
                          "type": "string",
                          "description": "Comment text"
                    },
                    "attachments": {
                          "type": "string",
                          "description": "Comma-separated attachments"
                    },
                    "from_group": {
                          "type": "boolean",
                          "description": "Post on behalf of community"
                    },
                    "reply_to_comment": {
                          "type": "number",
                          "description": "Comment ID to reply to"
                    },
                    "sticker_id": {
                          "type": "number",
                          "description": "Sticker ID"
                    },
                    "guid": {
                          "type": "string",
                          "description": "Unique identifier"
                    }
              },
              "required": [
                    "video_id",
                    "message"
              ]
        }
  },
  {
        "name": "vk_video_delete_comment",
        "description": "Delete a comment on a video",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "owner_id": {
                          "type": "number",
                          "description": "Video owner ID"
                    },
                    "comment_id": {
                          "type": "number",
                          "description": "Comment ID"
                    }
              },
              "required": [
                    "owner_id",
                    "comment_id"
              ]
        }
  },
  {
        "name": "vk_video_edit_comment",
        "description": "Edit a comment on a video",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "owner_id": {
                          "type": "number",
                          "description": "Video owner ID"
                    },
                    "comment_id": {
                          "type": "number",
                          "description": "Comment ID"
                    },
                    "message": {
                          "type": "string",
                          "description": "New comment text"
                    },
                    "attachments": {
                          "type": "string",
                          "description": "Comma-separated attachments"
                    }
              },
              "required": [
                    "owner_id",
                    "comment_id"
              ]
        }
  },
  {
        "name": "vk_video_add_album",
        "description": "Create a video album",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "group_id": {
                          "type": "number",
                          "description": "Community ID"
                    },
                    "title": {
                          "type": "string",
                          "description": "Album title"
                    },
                    "privacy": {
                          "type": "string",
                          "description": "Privacy settings"
                    }
              },
              "required": [
                    "title"
              ]
        }
  },
  {
        "name": "vk_video_delete_album",
        "description": "Delete a video album",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "album_id": {
                          "type": "number",
                          "description": "Album ID"
                    },
                    "group_id": {
                          "type": "number",
                          "description": "Community ID"
                    }
              },
              "required": [
                    "album_id"
              ]
        }
  },
  {
        "name": "vk_video_edit_album",
        "description": "Edit a video album",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "album_id": {
                          "type": "number",
                          "description": "Album ID"
                    },
                    "title": {
                          "type": "string",
                          "description": "New album title"
                    },
                    "group_id": {
                          "type": "number",
                          "description": "Community ID"
                    },
                    "privacy": {
                          "type": "string",
                          "description": "Privacy settings"
                    }
              },
              "required": [
                    "album_id"
              ]
        }
  },
  {
        "name": "vk_video_save",
        "description": "Save a video after upload",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "name": {
                          "type": "string",
                          "description": "Video title"
                    },
                    "description": {
                          "type": "string",
                          "description": "Video description"
                    },
                    "is_private": {
                          "type": "boolean",
                          "description": "Private video"
                    },
                    "wallpost": {
                          "type": "boolean",
                          "description": "Post to wall"
                    },
                    "link": {
                          "type": "string",
                          "description": "External URL"
                    },
                    "group_id": {
                          "type": "number",
                          "description": "Community ID"
                    },
                    "album_id": {
                          "type": "number",
                          "description": "Album ID"
                    },
                    "privacy_view": {
                          "type": "string",
                          "description": "Privacy settings for viewing"
                    },
                    "privacy_comment": {
                          "type": "string",
                          "description": "Privacy settings for commenting"
                    },
                    "no_comments": {
                          "type": "boolean",
                          "description": "Disable comments"
                    },
                    "repeat": {
                          "type": "boolean",
                          "description": "Loop playback"
                    }
              }
        }
  },
  {
        "name": "vk_groups_is_member",
        "description": "Check if user is a group member",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "group_id": {
                          "type": "string",
                          "description": "Group ID or short name"
                    },
                    "user_id": {
                          "type": "number",
                          "description": "User ID"
                    },
                    "user_ids": {
                          "type": "string",
                          "description": "Comma-separated user IDs"
                    },
                    "extended": {
                          "type": "boolean",
                          "description": "Return detailed info"
                    }
              },
              "required": [
                    "group_id"
              ]
        }
  },
  {
        "name": "vk_groups_create",
        "description": "Create a new community",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "title": {
                          "type": "string",
                          "description": "Community title"
                    },
                    "type": {
                          "type": "string",
                          "description": "Community type: group, page, event",
                          "enum": [
                                "group",
                                "page",
                                "event"
                          ]
                    },
                    "description": {
                          "type": "string",
                          "description": "Community description"
                    }
              },
              "required": [
                    "title"
              ]
        }
  },
  {
        "name": "vk_groups_edit",
        "description": "Edit community settings",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "group_id": {
                          "type": "number",
                          "description": "Community ID"
                    },
                    "title": {
                          "type": "string",
                          "description": "New title"
                    },
                    "description": {
                          "type": "string",
                          "description": "New description"
                    },
                    "screen_name": {
                          "type": "string",
                          "description": "New short name"
                    },
                    "access": {
                          "type": "number",
                          "description": "Access level: 0-open, 1-closed, 2-private"
                    },
                    "website": {
                          "type": "string",
                          "description": "Website URL"
                    },
                    "subject": {
                          "type": "number",
                          "description": "Community subject"
                    }
              },
              "required": [
                    "group_id"
              ]
        }
  },
  {
        "name": "vk_groups_invite",
        "description": "Invite a user to a group",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "group_id": {
                          "type": "number",
                          "description": "Community ID"
                    },
                    "user_id": {
                          "type": "number",
                          "description": "User ID"
                    }
              },
              "required": [
                    "group_id",
                    "user_id"
              ]
        }
  },
  {
        "name": "vk_groups_ban",
        "description": "Ban a user in a group",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "group_id": {
                          "type": "number",
                          "description": "Community ID"
                    },
                    "owner_id": {
                          "type": "number",
                          "description": "User ID to ban"
                    },
                    "end_date": {
                          "type": "number",
                          "description": "Ban end date (Unix timestamp)"
                    },
                    "reason": {
                          "type": "number",
                          "description": "Ban reason: 0-other, 1-spam, 2-verbal abuse, 3-strong language, 4-flood"
                    },
                    "comment": {
                          "type": "string",
                          "description": "Ban comment"
                    },
                    "comment_visible": {
                          "type": "boolean",
                          "description": "Comment visible to user"
                    }
              },
              "required": [
                    "group_id",
                    "owner_id"
              ]
        }
  },
  {
        "name": "vk_groups_get_banned",
        "description": "Get banned users in a group",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "group_id": {
                          "type": "number",
                          "description": "Community ID"
                    },
                    "offset": {
                          "type": "number",
                          "description": "Offset"
                    },
                    "count": {
                          "type": "number",
                          "description": "Number of users"
                    },
                    "fields": {
                          "type": "string",
                          "description": "Profile fields"
                    },
                    "owner_id": {
                          "type": "number",
                          "description": "Filter by user ID"
                    }
              },
              "required": [
                    "group_id"
              ]
        }
  },
  {
        "name": "vk_groups_approve_request",
        "description": "Approve a join request",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "group_id": {
                          "type": "number",
                          "description": "Community ID"
                    },
                    "user_id": {
                          "type": "number",
                          "description": "User ID"
                    }
              },
              "required": [
                    "group_id",
                    "user_id"
              ]
        }
  },
  {
        "name": "vk_groups_get_invites",
        "description": "Get group invites for current user",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "offset": {
                          "type": "number",
                          "description": "Offset"
                    },
                    "count": {
                          "type": "number",
                          "description": "Number of invites"
                    },
                    "extended": {
                          "type": "boolean",
                          "description": "Return additional fields"
                    }
              }
        }
  },
  {
        "name": "vk_account_get_profile_info",
        "description": "Get current user profile info",
        "inputSchema": {
              "type": "object",
              "properties": {}
        }
  },
  {
        "name": "vk_account_save_profile_info",
        "description": "Save current user profile info",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "first_name": {
                          "type": "string",
                          "description": "First name"
                    },
                    "last_name": {
                          "type": "string",
                          "description": "Last name"
                    },
                    "maiden_name": {
                          "type": "string",
                          "description": "Maiden name"
                    },
                    "screen_name": {
                          "type": "string",
                          "description": "Short name"
                    },
                    "sex": {
                          "type": "number",
                          "description": "Gender: 1-female, 2-male"
                    },
                    "relation": {
                          "type": "number",
                          "description": "Relationship status"
                    },
                    "bdate": {
                          "type": "string",
                          "description": "Birth date (DD.MM.YYYY)"
                    },
                    "bdate_visibility": {
                          "type": "number",
                          "description": "Birth date visibility: 0-hidden, 1-show only day and month, 2-show full"
                    },
                    "home_town": {
                          "type": "string",
                          "description": "Home town"
                    },
                    "status": {
                          "type": "string",
                          "description": "Status text"
                    }
              }
        }
  },
  {
        "name": "vk_account_set_online",
        "description": "Set current user online",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "voip": {
                          "type": "boolean",
                          "description": "Online from VoIP"
                    }
              }
        }
  },
  {
        "name": "vk_account_set_offline",
        "description": "Set current user offline",
        "inputSchema": {
              "type": "object",
              "properties": {}
        }
  },
  {
        "name": "vk_account_ban",
        "description": "Ban a user",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "owner_id": {
                          "type": "number",
                          "description": "User ID to ban"
                    }
              },
              "required": [
                    "owner_id"
              ]
        }
  },
  {
        "name": "vk_account_unban",
        "description": "Unban a user",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "owner_id": {
                          "type": "number",
                          "description": "User ID to unban"
                    }
              },
              "required": [
                    "owner_id"
              ]
        }
  },
  {
        "name": "vk_account_get_banned",
        "description": "Get banned users",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "offset": {
                          "type": "number",
                          "description": "Offset"
                    },
                    "count": {
                          "type": "number",
                          "description": "Number of users"
                    },
                    "fields": {
                          "type": "string",
                          "description": "Profile fields"
                    }
              }
        }
  },
  {
        "name": "vk_polls_create",
        "description": "Create a poll",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "question": {
                          "type": "string",
                          "description": "Poll question"
                    },
                    "is_anonymous": {
                          "type": "boolean",
                          "description": "Anonymous poll"
                    },
                    "owner_id": {
                          "type": "number",
                          "description": "Owner ID (negative for community)"
                    },
                    "add_answers": {
                          "type": "string",
                          "description": "JSON array of answer options"
                    },
                    "end_date": {
                          "type": "number",
                          "description": "Poll end date (Unix timestamp)"
                    },
                    "photo_id": {
                          "type": "number",
                          "description": "Photo ID for poll background"
                    },
                    "background_id": {
                          "type": "string",
                          "description": "Background ID"
                    },
                    "disable_unvote": {
                          "type": "boolean",
                          "description": "Disable vote removal"
                    }
              },
              "required": [
                    "question"
              ]
        }
  },
  {
        "name": "vk_polls_add_vote",
        "description": "Vote in a poll",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "owner_id": {
                          "type": "number",
                          "description": "Poll owner ID"
                    },
                    "poll_id": {
                          "type": "number",
                          "description": "Poll ID"
                    },
                    "answer_ids": {
                          "type": "string",
                          "description": "Comma-separated answer IDs"
                    },
                    "is_board": {
                          "type": "boolean",
                          "description": "Poll is in a topic"
                    }
              },
              "required": [
                    "poll_id",
                    "answer_ids"
              ]
        }
  },
  {
        "name": "vk_polls_delete_vote",
        "description": "Remove a vote from a poll",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "owner_id": {
                          "type": "number",
                          "description": "Poll owner ID"
                    },
                    "poll_id": {
                          "type": "number",
                          "description": "Poll ID"
                    },
                    "answer_id": {
                          "type": "number",
                          "description": "Answer ID"
                    },
                    "is_board": {
                          "type": "boolean",
                          "description": "Poll is in a topic"
                    }
              },
              "required": [
                    "poll_id",
                    "answer_id"
              ]
        }
  },
  {
        "name": "vk_polls_get_voters",
        "description": "Get poll voters",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "owner_id": {
                          "type": "number",
                          "description": "Poll owner ID"
                    },
                    "poll_id": {
                          "type": "number",
                          "description": "Poll ID"
                    },
                    "answer_ids": {
                          "type": "string",
                          "description": "Comma-separated answer IDs"
                    },
                    "is_board": {
                          "type": "boolean",
                          "description": "Poll is in a topic"
                    },
                    "friends_only": {
                          "type": "boolean",
                          "description": "Return only friends"
                    },
                    "offset": {
                          "type": "number",
                          "description": "Offset"
                    },
                    "count": {
                          "type": "number",
                          "description": "Number of voters"
                    },
                    "fields": {
                          "type": "string",
                          "description": "Profile fields"
                    }
              },
              "required": [
                    "poll_id",
                    "answer_ids"
              ]
        }
  },
  {
        "name": "vk_friends_add",
        "description": "Add a friend or approve a friend request",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "user_id": {
                          "type": "number",
                          "description": "User ID"
                    },
                    "text": {
                          "type": "string",
                          "description": "Friend request text"
                    },
                    "follow": {
                          "type": "boolean",
                          "description": "Send follow request"
                    }
              },
              "required": [
                    "user_id"
              ]
        }
  },
  {
        "name": "vk_friends_delete",
        "description": "Delete a friend",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "user_id": {
                          "type": "number",
                          "description": "User ID"
                    }
              },
              "required": [
                    "user_id"
              ]
        }
  },
  {
        "name": "vk_friends_edit",
        "description": "Edit friend lists",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "user_id": {
                          "type": "number",
                          "description": "User ID"
                    },
                    "list_ids": {
                          "type": "string",
                          "description": "Comma-separated list IDs"
                    }
              },
              "required": [
                    "user_id"
              ]
        }
  },
  {
        "name": "vk_friends_get_lists",
        "description": "Get friend lists",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "user_id": {
                          "type": "number",
                          "description": "User ID"
                    },
                    "return_system": {
                          "type": "boolean",
                          "description": "Return system lists"
                    }
              }
        }
  },
  {
        "name": "vk_market_add",
        "description": "Add a product to market",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "owner_id": {
                          "type": "number",
                          "description": "Owner ID (negative for community)"
                    },
                    "name": {
                          "type": "string",
                          "description": "Product name"
                    },
                    "description": {
                          "type": "string",
                          "description": "Product description"
                    },
                    "category_id": {
                          "type": "number",
                          "description": "Category ID"
                    },
                    "price": {
                          "type": "number",
                          "description": "Product price"
                    },
                    "main_photo_id": {
                          "type": "number",
                          "description": "Main photo ID"
                    },
                    "photo_ids": {
                          "type": "string",
                          "description": "Comma-separated additional photo IDs"
                    },
                    "deleted": {
                          "type": "boolean",
                          "description": "Mark as deleted"
                    },
                    "url": {
                          "type": "string",
                          "description": "Product URL"
                    }
              },
              "required": [
                    "owner_id",
                    "name",
                    "description",
                    "category_id",
                    "price",
                    "main_photo_id"
              ]
        }
  },
  {
        "name": "vk_market_edit",
        "description": "Edit a market product",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "owner_id": {
                          "type": "number",
                          "description": "Owner ID (negative for community)"
                    },
                    "item_id": {
                          "type": "number",
                          "description": "Product ID"
                    },
                    "name": {
                          "type": "string",
                          "description": "Product name"
                    },
                    "description": {
                          "type": "string",
                          "description": "Product description"
                    },
                    "category_id": {
                          "type": "number",
                          "description": "Category ID"
                    },
                    "price": {
                          "type": "number",
                          "description": "Product price"
                    },
                    "main_photo_id": {
                          "type": "number",
                          "description": "Main photo ID"
                    },
                    "photo_ids": {
                          "type": "string",
                          "description": "Comma-separated additional photo IDs"
                    },
                    "deleted": {
                          "type": "boolean",
                          "description": "Mark as deleted"
                    },
                    "url": {
                          "type": "string",
                          "description": "Product URL"
                    }
              },
              "required": [
                    "owner_id",
                    "item_id"
              ]
        }
  },
  {
        "name": "vk_market_delete",
        "description": "Delete a market product",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "owner_id": {
                          "type": "number",
                          "description": "Owner ID (negative for community)"
                    },
                    "item_id": {
                          "type": "number",
                          "description": "Product ID"
                    }
              },
              "required": [
                    "owner_id",
                    "item_id"
              ]
        }
  },
  {
        "name": "vk_market_add_album",
        "description": "Create a market collection",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "owner_id": {
                          "type": "number",
                          "description": "Owner ID (negative for community)"
                    },
                    "title": {
                          "type": "string",
                          "description": "Collection title"
                    },
                    "photo_id": {
                          "type": "number",
                          "description": "Cover photo ID"
                    },
                    "main_album": {
                          "type": "boolean",
                          "description": "Set as main album"
                    }
              },
              "required": [
                    "owner_id",
                    "title"
              ]
        }
  },
  {
        "name": "vk_market_edit_album",
        "description": "Edit a market collection",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "owner_id": {
                          "type": "number",
                          "description": "Owner ID (negative for community)"
                    },
                    "album_id": {
                          "type": "number",
                          "description": "Collection ID"
                    },
                    "title": {
                          "type": "string",
                          "description": "New title"
                    },
                    "photo_id": {
                          "type": "number",
                          "description": "Cover photo ID"
                    },
                    "main_album": {
                          "type": "boolean",
                          "description": "Set as main album"
                    }
              },
              "required": [
                    "owner_id",
                    "album_id"
              ]
        }
  },
  {
        "name": "vk_market_delete_album",
        "description": "Delete a market collection",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "owner_id": {
                          "type": "number",
                          "description": "Owner ID (negative for community)"
                    },
                    "album_id": {
                          "type": "number",
                          "description": "Collection ID"
                    }
              },
              "required": [
                    "owner_id",
                    "album_id"
              ]
        }
  },
  {
        "name": "vk_market_create_comment",
        "description": "Add a comment to a market product",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "owner_id": {
                          "type": "number",
                          "description": "Owner ID (negative for community)"
                    },
                    "item_id": {
                          "type": "number",
                          "description": "Product ID"
                    },
                    "message": {
                          "type": "string",
                          "description": "Comment text"
                    },
                    "attachments": {
                          "type": "string",
                          "description": "Comma-separated attachments"
                    },
                    "from_group": {
                          "type": "boolean",
                          "description": "Post on behalf of community"
                    },
                    "reply_to_comment": {
                          "type": "number",
                          "description": "Comment ID to reply to"
                    },
                    "sticker_id": {
                          "type": "number",
                          "description": "Sticker ID"
                    },
                    "guid": {
                          "type": "string",
                          "description": "Unique identifier"
                    }
              },
              "required": [
                    "owner_id",
                    "item_id",
                    "message"
              ]
        }
  },
  {
        "name": "vk_market_delete_comment",
        "description": "Delete a comment on a market product",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "owner_id": {
                          "type": "number",
                          "description": "Owner ID (negative for community)"
                    },
                    "comment_id": {
                          "type": "number",
                          "description": "Comment ID"
                    }
              },
              "required": [
                    "owner_id",
                    "comment_id"
              ]
        }
  },
  {
        "name": "vk_market_edit_comment",
        "description": "Edit a comment on a market product",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "owner_id": {
                          "type": "number",
                          "description": "Owner ID (negative for community)"
                    },
                    "comment_id": {
                          "type": "number",
                          "description": "Comment ID"
                    },
                    "message": {
                          "type": "string",
                          "description": "New comment text"
                    },
                    "attachments": {
                          "type": "string",
                          "description": "Comma-separated attachments"
                    }
              },
              "required": [
                    "owner_id",
                    "comment_id"
              ]
        }
  },
  {
        "name": "vk_market_get_comments",
        "description": "Get comments on a market product",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "owner_id": {
                          "type": "number",
                          "description": "Owner ID (negative for community)"
                    },
                    "item_id": {
                          "type": "number",
                          "description": "Product ID"
                    },
                    "need_likes": {
                          "type": "boolean",
                          "description": "Include likes info"
                    },
                    "offset": {
                          "type": "number",
                          "description": "Offset"
                    },
                    "count": {
                          "type": "number",
                          "description": "Number of comments"
                    },
                    "extended": {
                          "type": "boolean",
                          "description": "Return additional fields"
                    },
                    "sort": {
                          "type": "string",
                          "description": "Sort order: asc, desc, smart",
                          "enum": [
                                "asc",
                                "desc",
                                "smart"
                          ]
                    }
              },
              "required": [
                    "owner_id",
                    "item_id"
              ]
        }
  },
  {
        "name": "vk_pretty_cards_get",
        "description": "Get pretty cards for a community",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "owner_id": {
                          "type": "number",
                          "description": "Community ID"
                    },
                    "offset": {
                          "type": "number",
                          "description": "Offset"
                    },
                    "count": {
                          "type": "number",
                          "description": "Number of cards"
                    }
              },
              "required": [
                    "owner_id"
              ]
        }
  },
  {
        "name": "vk_pretty_cards_get_by_id",
        "description": "Get pretty cards by ID",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "owner_id": {
                          "type": "number",
                          "description": "Community ID"
                    },
                    "card_ids": {
                          "type": "string",
                          "description": "Comma-separated card IDs"
                    }
              },
              "required": [
                    "owner_id",
                    "card_ids"
              ]
        }
  },
  {
        "name": "vk_pretty_cards_create",
        "description": "Create a pretty card",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "owner_id": {
                          "type": "number",
                          "description": "Community ID"
                    },
                    "photo": {
                          "type": "string",
                          "description": "Uploaded photo string"
                    },
                    "title": {
                          "type": "string",
                          "description": "Card title"
                    },
                    "link": {
                          "type": "string",
                          "description": "Button link URL"
                    },
                    "price": {
                          "type": "string",
                          "description": "Price text"
                    },
                    "price_old": {
                          "type": "string",
                          "description": "Old price text"
                    },
                    "button": {
                          "type": "string",
                          "description": "Button text"
                    }
              },
              "required": [
                    "owner_id",
                    "photo",
                    "title",
                    "link"
              ]
        }
  },
  {
        "name": "vk_pretty_cards_edit",
        "description": "Edit a pretty card",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "owner_id": {
                          "type": "number",
                          "description": "Community ID"
                    },
                    "card_id": {
                          "type": "number",
                          "description": "Card ID"
                    },
                    "photo": {
                          "type": "string",
                          "description": "Uploaded photo string"
                    },
                    "title": {
                          "type": "string",
                          "description": "Card title"
                    },
                    "link": {
                          "type": "string",
                          "description": "Button link URL"
                    },
                    "price": {
                          "type": "string",
                          "description": "Price text"
                    },
                    "price_old": {
                          "type": "string",
                          "description": "Old price text"
                    },
                    "button": {
                          "type": "string",
                          "description": "Button text"
                    }
              },
              "required": [
                    "owner_id",
                    "card_id"
              ]
        }
  },
  {
        "name": "vk_pretty_cards_delete",
        "description": "Delete a pretty card",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "owner_id": {
                          "type": "number",
                          "description": "Community ID"
                    },
                    "card_id": {
                          "type": "number",
                          "description": "Card ID"
                    }
              },
              "required": [
                    "owner_id",
                    "card_id"
              ]
        }
  },
  {
        "name": "vk_pretty_cards_get_upload_url",
        "description": "Get upload URL for pretty card photo",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "owner_id": {
                          "type": "number",
                          "description": "Community ID"
                    }
              },
              "required": [
                    "owner_id"
              ]
        }
  },
  {
        "name": "vk_status_set",
        "description": "Set user status",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "text": {
                          "type": "string",
                          "description": "Status text"
                    },
                    "group_id": {
                          "type": "number",
                          "description": "Community ID"
                    }
              }
        }
  },
  {
        "name": "vk_storage_set",
        "description": "Set a value in storage",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "key": {
                          "type": "string",
                          "description": "Storage key"
                    },
                    "value": {
                          "type": "string",
                          "description": "Value to store"
                    },
                    "user_id": {
                          "type": "number",
                          "description": "User ID"
                    }
              },
              "required": [
                    "key",
                    "value"
              ]
        }
  },
  {
        "name": "vk_fave_add_post",
        "description": "Add a post to bookmarks",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "id": {
                          "type": "number",
                          "description": "Post ID"
                    },
                    "owner_id": {
                          "type": "number",
                          "description": "Post owner ID"
                    },
                    "access_key": {
                          "type": "string",
                          "description": "Access key"
                    }
              },
              "required": [
                    "id",
                    "owner_id"
              ]
        }
  },
  {
        "name": "vk_fave_remove_post",
        "description": "Remove a post from bookmarks",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "id": {
                          "type": "number",
                          "description": "Post ID"
                    },
                    "owner_id": {
                          "type": "number",
                          "description": "Post owner ID"
                    }
              },
              "required": [
                    "id",
                    "owner_id"
              ]
        }
  },
  {
        "name": "vk_fave_add_link",
        "description": "Add a link to bookmarks",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "link": {
                          "type": "string",
                          "description": "Link URL"
                    },
                    "text": {
                          "type": "string",
                          "description": "Link text"
                    }
              },
              "required": [
                    "link"
              ]
        }
  },
  {
        "name": "vk_fave_remove_link",
        "description": "Remove a link from bookmarks",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "link_id": {
                          "type": "number",
                          "description": "Link ID"
                    }
              },
              "required": [
                    "link_id"
              ]
        }
  },
  {
        "name": "vk_board_add_topic",
        "description": "Create a new topic on a board",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "group_id": {
                          "type": "number",
                          "description": "Community ID"
                    },
                    "title": {
                          "type": "string",
                          "description": "Topic title"
                    },
                    "text": {
                          "type": "string",
                          "description": "Topic text"
                    },
                    "from_group": {
                          "type": "boolean",
                          "description": "Post on behalf of community"
                    },
                    "attachments": {
                          "type": "string",
                          "description": "Comma-separated attachments"
                    }
              },
              "required": [
                    "group_id",
                    "title"
              ]
        }
  },
  {
        "name": "vk_board_delete_topic",
        "description": "Delete a topic from a board",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "group_id": {
                          "type": "number",
                          "description": "Community ID"
                    },
                    "topic_id": {
                          "type": "number",
                          "description": "Topic ID"
                    }
              },
              "required": [
                    "group_id",
                    "topic_id"
              ]
        }
  },
  {
        "name": "vk_board_edit_topic",
        "description": "Edit a board topic",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "group_id": {
                          "type": "number",
                          "description": "Community ID"
                    },
                    "topic_id": {
                          "type": "number",
                          "description": "Topic ID"
                    },
                    "title": {
                          "type": "string",
                          "description": "New topic title"
                    }
              },
              "required": [
                    "group_id",
                    "topic_id",
                    "title"
              ]
        }
  },
  {
        "name": "vk_board_create_comment",
        "description": "Add a comment to a board topic",
        "inputSchema": {
              "type": "object",
              "properties": {
                    "group_id": {
                          "type": "number",
                          "description": "Community ID"
                    },
                    "topic_id": {
                          "type": "number",
                          "description": "Topic ID"
                    },
                    "message": {
                          "type": "string",
                          "description": "Comment text"
                    },
                    "attachments": {
                          "type": "string",
                          "description": "Comma-separated attachments"
                    },
                    "from_group": {
                          "type": "boolean",
                          "description": "Post on behalf of community"
                    },
                    "sticker_id": {
                          "type": "number",
                          "description": "Sticker ID"
                    },
                    "guid": {
                          "type": "string",
                          "description": "Unique identifier"
                    }
              },
              "required": [
                    "group_id",
                    "topic_id",
                    "message"
              ]
        }
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

case 'vk_stories_get':
        result = await vk.storiesGet({
          owner_id: args.owner_id,
          extended: args.extended ? 1 : 0,
        });
        break;

      case 'vk_stories_get_by_id':
        result = await vk.storiesGetById({
          stories: args.stories,
          extended: args.extended ? 1 : 0,
        });
        break;

      case 'vk_stories_get_replies':
        result = await vk.storiesGetReplies({
          owner_id: args.owner_id,
          story_id: args.story_id,
          count: args.count,
          offset: args.offset,
        });
        break;

      case 'vk_stories_get_stats':
        result = await vk.storiesGetStats({
          owner_id: args.owner_id,
          story_id: args.story_id,
        });
        break;

      case 'vk_stories_get_viewers':
        result = await vk.storiesGetViewers({
          owner_id: args.owner_id,
          story_id: args.story_id,
          count: args.count,
          offset: args.offset,
        });
        break;

      case 'vk_stories_search':
        result = await vk.storiesSearch({
          q: args.q,
          place_id: args.place_id,
          latitude: args.latitude,
          longitude: args.longitude,
          radius: args.radius,
          count: args.count || 20,
          offset: args.offset,
        });
        break;

      case 'vk_stories_delete':
        result = await vk.storiesDelete({
          owner_id: args.owner_id,
          story_id: args.story_id,
        });
        break;

      case 'vk_stories_ban_owner':
        result = await vk.storiesBanOwner({
          owner_id: args.owner_id,
        });
        break;

      case 'vk_stories_unban_owner':
        result = await vk.storiesUnbanOwner({
          owner_id: args.owner_id,
        });
        break;

      case 'vk_stories_get_banned':
        result = await vk.storiesGetBanned({
          count: args.count,
          offset: args.offset,
          extended: args.extended ? 1 : 0,
        });
        break;

      case 'vk_stories_get_photo_upload_server':
        result = await vk.storiesGetPhotoUploadServer({
          add_to_news: args.add_to_news ? 1 : 0,
          user_ids: args.user_ids,
          reply_to_story: args.reply_to_story,
          link_text: args.link_text,
          link_url: args.link_url,
          group_id: args.group_id,
        });
        break;

      case 'vk_stories_get_video_upload_server':
        result = await vk.storiesGetVideoUploadServer({
          add_to_news: args.add_to_news ? 1 : 0,
          user_ids: args.user_ids,
          reply_to_story: args.reply_to_story,
          link_text: args.link_text,
          link_url: args.link_url,
          group_id: args.group_id,
        });
        break;

      case 'vk_stories_save':
        result = await vk.storiesSave({
          upload_results: args.upload_results,
        });
        break;

      case 'vk_stories_hide_reply':
        result = await vk.storiesHideReply({
          owner_id: args.owner_id,
          story_id: args.story_id,
        });
        break;

      case 'vk_stories_hide_all_replies':
        result = await vk.storiesHideAllReplies({
          owner_id: args.owner_id,
          story_id: args.story_id,
        });
        break;

      case 'vk_stories_send_interaction':
        result = await vk.storiesSendInteraction({
          user_id: args.user_id,
          access_key: args.access_key,
        });
        break;

      case 'vk_search_get_hints':
        result = await vk.searchGetHints({
          q: args.q,
          limit: args.limit || 9,
          filters: args.filters,
          search_global: args.search_global ? 1 : 0,
        });
        break;

      case 'vk_execute':
        result = await vk.executeCode({
          code: args.code,
        });
        break;

      case 'vk_notifications_get':
        result = await vk.notificationsGet({
          count: args.count || 30,
          start_from: args.start_from,
          filters: args.filters,
        });
        break;

      case 'vk_notifications_mark_as_viewed':
        result = await vk.notificationsMarkAsViewed({});
        break;

      case 'vk_messages_send':
        result = await vk.messagesSend({
          user_id: args.user_id,
          peer_id: args.peer_id,
          domain: args.domain,
          chat_id: args.chat_id,
          message: args.message,
          random_id: args.random_id || Math.floor(Math.random() * 1e9),
          lat: args.lat,
          long: args.long,
          attachment: args.attachment,
          reply_to: args.reply_to,
          forward_messages: args.forward_messages,
          sticker_id: args.sticker_id,
        });
        break;

      case 'vk_messages_delete':
        result = await vk.messagesDelete({
          message_ids: args.message_ids,
          spam: args.spam ? 1 : 0,
          group_id: args.group_id,
          delete_for_all: args.delete_for_all ? 1 : 0,
        });
        break;

      case 'vk_messages_edit':
        result = await vk.messagesEdit({
          peer_id: args.peer_id,
          message_id: args.message_id,
          message: args.message,
          lat: args.lat,
          long: args.long,
          attachment: args.attachment,
          keep_forward_messages: args.keep_forward_messages ? 1 : 0,
          keep_snippets: args.keep_snippets ? 1 : 0,
          group_id: args.group_id,
          dont_parse_links: args.dont_parse_links ? 1 : 0,
        });
        break;

      case 'vk_messages_mark_as_read':
        result = await vk.messagesMarkAsRead({
          message_ids: args.message_ids,
          peer_id: args.peer_id,
        });
        break;

      case 'vk_messages_pin':
        result = await vk.messagesPin({
          peer_id: args.peer_id,
          message_id: args.message_id,
        });
        break;

      case 'vk_messages_unpin':
        result = await vk.messagesUnpin({
          peer_id: args.peer_id,
          message_id: args.message_id,
        });
        break;

      case 'vk_messages_create_chat':
        result = await vk.messagesCreateChat({
          user_ids: args.user_ids,
          title: args.title,
        });
        break;

      case 'vk_messages_edit_chat':
        result = await vk.messagesEditChat({
          chat_id: args.chat_id,
          title: args.title,
        });
        break;

      case 'vk_messages_remove_chat_user':
        result = await vk.messagesRemoveChatUser({
          chat_id: args.chat_id,
          user_id: args.user_id,
          member_id: args.member_id,
        });
        break;

      case 'vk_messages_add_chat_user':
        result = await vk.messagesAddChatUser({
          chat_id: args.chat_id,
          user_id: args.user_id,
        });
        break;

      case 'vk_messages_get_conversation_members':
        result = await vk.messagesGetConversationMembers({
          peer_id: args.peer_id,
          fields: args.fields,
        });
        break;

      case 'vk_messages_get_conversations_by_id':
        result = await vk.messagesGetConversationsById({
          peer_ids: args.peer_ids,
          extended: args.extended ? 1 : 0,
          fields: args.fields,
        });
        break;

      case 'vk_messages_get_chat':
        result = await vk.messagesGetChat({
          chat_id: args.chat_id,
          chat_ids: args.chat_ids,
          fields: args.fields,
        });
        break;

      case 'vk_messages_get_long_poll_server':
        result = await vk.messagesGetLongPollServer({
          need_pts: args.need_pts ? 1 : 0,
          group_id: args.group_id,
          lp_version: args.lp_version,
        });
        break;

      case 'vk_messages_search_conversations':
        result = await vk.messagesSearchConversations({
          q: args.q,
          count: args.count || 20,
          extended: args.extended ? 1 : 0,
          fields: args.fields,
        });
        break;

      case 'vk_messages_set_activity':
        result = await vk.messagesSetActivity({
          user_id: args.user_id,
          type: args.type || 'typing',
          peer_id: args.peer_id,
        });
        break;

      case 'vk_messages_delete_conversation':
        result = await vk.messagesDeleteConversation({
          user_id: args.user_id,
          peer_id: args.peer_id,
          group_id: args.group_id,
        });
        break;

      case 'vk_messages_restore':
        result = await vk.messagesRestore({
          message_id: args.message_id,
          group_id: args.group_id,
        });
        break;

      case 'vk_likes_add':
        result = await vk.likesAdd({
          type: args.type,
          owner_id: args.owner_id,
          item_id: args.item_id,
          access_key: args.access_key,
        });
        break;

      case 'vk_likes_delete':
        result = await vk.likesDelete({
          type: args.type,
          owner_id: args.owner_id,
          item_id: args.item_id,
        });
        break;

      case 'vk_wall_get_comments':
        result = await vk.wallGetComments({
          owner_id: args.owner_id,
          post_id: args.post_id,
          need_likes: args.need_likes ? 1 : 0,
          offset: args.offset,
          count: args.count || 20,
          sort: args.sort,
          preview_length: args.preview_length,
          extended: args.extended ? 1 : 0,
        });
        break;

      case 'vk_wall_search':
        result = await vk.wallSearch({
          owner_id: args.owner_id,
          domain: args.domain,
          query: args.query,
          owners_only: args.owners_only ? 1 : 0,
          count: args.count || 20,
          offset: args.offset,
          extended: args.extended ? 1 : 0,
        });
        break;

      case 'vk_wall_repost':
        result = await vk.wallRepost({
          object: args.object,
          message: args.message,
          group_id: args.group_id,
          mark_as_ads: args.mark_as_ads ? 1 : 0,
          mute_notifications: args.mute_notifications ? 1 : 0,
        });
        break;

      case 'vk_wall_pin':
        result = await vk.wallPin({
          owner_id: args.owner_id,
          post_id: args.post_id,
        });
        break;

      case 'vk_wall_unpin':
        result = await vk.wallUnpin({
          owner_id: args.owner_id,
          post_id: args.post_id,
        });
        break;

      case 'vk_wall_restore':
        result = await vk.wallRestore({
          owner_id: args.owner_id,
          post_id: args.post_id,
        });
        break;

      case 'vk_wall_delete_comment':
        result = await vk.wallDeleteComment({
          owner_id: args.owner_id,
          comment_id: args.comment_id,
        });
        break;

      case 'vk_wall_edit_comment':
        result = await vk.wallEditComment({
          owner_id: args.owner_id,
          comment_id: args.comment_id,
          message: args.message,
          attachments: args.attachments,
        });
        break;

      case 'vk_wall_close_comments':
        result = await vk.wallCloseComments({
          owner_id: args.owner_id,
          post_id: args.post_id,
        });
        break;

      case 'vk_wall_open_comments':
        result = await vk.wallOpenComments({
          owner_id: args.owner_id,
          post_id: args.post_id,
        });
        break;

      case 'vk_photos_copy':
        result = await vk.photosCopy({
          owner_id: args.owner_id,
          photo_id: args.photo_id,
          access_key: args.access_key,
        });
        break;

      case 'vk_photos_create_album':
        result = await vk.photosCreateAlbum({
          title: args.title,
          group_id: args.group_id,
          description: args.description,
          privacy_view: args.privacy_view,
          privacy_comment: args.privacy_comment,
          upload_by_admins_only: args.upload_by_admins_only ? 1 : 0,
          comments_disabled: args.comments_disabled ? 1 : 0,
        });
        break;

      case 'vk_photos_delete_album':
        result = await vk.photosDeleteAlbum({
          album_id: args.album_id,
          group_id: args.group_id,
        });
        break;

      case 'vk_photos_edit_album':
        result = await vk.photosEditAlbum({
          album_id: args.album_id,
          title: args.title,
          description: args.description,
          owner_id: args.owner_id,
          privacy_view: args.privacy_view,
          privacy_comment: args.privacy_comment,
          upload_by_admins_only: args.upload_by_admins_only ? 1 : 0,
          comments_disabled: args.comments_disabled ? 1 : 0,
        });
        break;

      case 'vk_photos_get_upload_server':
        result = await vk.photosGetUploadServer({
          album_id: args.album_id,
          group_id: args.group_id,
        });
        break;

      case 'vk_photos_save':
        result = await vk.photosSave({
          album_id: args.album_id,
          group_id: args.group_id,
          server: args.server,
          photos_list: args.photos_list,
          hash: args.hash,
          latitude: args.latitude,
          longitude: args.longitude,
          caption: args.caption,
        });
        break;

      case 'vk_photos_save_messages_photo':
        result = await vk.photosSaveMessagesPhoto({
          photo: args.photo,
          server: args.server,
          hash: args.hash,
        });
        break;

      case 'vk_photos_save_owner_photo':
        result = await vk.photosSaveOwnerPhoto({
          server: args.server,
          hash: args.hash,
          photo: args.photo,
        });
        break;

      case 'vk_photos_make_cover':
        result = await vk.photosMakeCover({
          owner_id: args.owner_id,
          photo_id: args.photo_id,
          album_id: args.album_id,
        });
        break;

      case 'vk_photos_get_user_photos':
        result = await vk.photosGetUserPhotos({
          user_id: args.user_id,
          offset: args.offset,
          count: args.count || 20,
          extended: args.extended ? 1 : 0,
          sort: args.sort,
        });
        break;

      case 'vk_video_add':
        result = await vk.videoAdd({
          target_id: args.target_id,
          video_id: args.video_id,
          owner_id: args.owner_id,
        });
        break;

      case 'vk_video_delete':
        result = await vk.videoDelete({
          video_id: args.video_id,
          owner_id: args.owner_id,
          target_id: args.target_id,
        });
        break;

      case 'vk_video_edit':
        result = await vk.videoEdit({
          owner_id: args.owner_id,
          video_id: args.video_id,
          name: args.name,
          desc: args.desc,
          privacy_view: args.privacy_view,
          privacy_comment: args.privacy_comment,
          no_comments: args.no_comments ? 1 : 0,
          repeat: args.repeat ? 1 : 0,
        });
        break;

      case 'vk_video_create_comment':
        result = await vk.videoCreateComment({
          owner_id: args.owner_id,
          video_id: args.video_id,
          message: args.message,
          attachments: args.attachments,
          from_group: args.from_group ? 1 : 0,
          reply_to_comment: args.reply_to_comment,
          sticker_id: args.sticker_id,
          guid: args.guid,
        });
        break;

      case 'vk_video_delete_comment':
        result = await vk.videoDeleteComment({
          owner_id: args.owner_id,
          comment_id: args.comment_id,
        });
        break;

      case 'vk_video_edit_comment':
        result = await vk.videoEditComment({
          owner_id: args.owner_id,
          comment_id: args.comment_id,
          message: args.message,
          attachments: args.attachments,
        });
        break;

      case 'vk_video_add_album':
        result = await vk.videoAddAlbum({
          group_id: args.group_id,
          title: args.title,
          privacy: args.privacy,
        });
        break;

      case 'vk_video_delete_album':
        result = await vk.videoDeleteAlbum({
          album_id: args.album_id,
          group_id: args.group_id,
        });
        break;

      case 'vk_video_edit_album':
        result = await vk.videoEditAlbum({
          album_id: args.album_id,
          title: args.title,
          group_id: args.group_id,
          privacy: args.privacy,
        });
        break;

      case 'vk_video_save':
        result = await vk.videoSave({
          name: args.name,
          description: args.description,
          is_private: args.is_private ? 1 : 0,
          wallpost: args.wallpost ? 1 : 0,
          link: args.link,
          group_id: args.group_id,
          album_id: args.album_id,
          privacy_view: args.privacy_view,
          privacy_comment: args.privacy_comment,
          no_comments: args.no_comments ? 1 : 0,
          repeat: args.repeat ? 1 : 0,
        });
        break;

      case 'vk_groups_is_member':
        result = await vk.groupsIsMember({
          group_id: args.group_id,
          user_id: args.user_id,
          user_ids: args.user_ids,
          extended: args.extended ? 1 : 0,
        });
        break;

      case 'vk_groups_create':
        result = await vk.groupsCreate({
          title: args.title,
          type: args.type,
          description: args.description,
        });
        break;

      case 'vk_groups_edit':
        result = await vk.groupsEdit({
          group_id: args.group_id,
          title: args.title,
          description: args.description,
          screen_name: args.screen_name,
          access: args.access,
          website: args.website,
          subject: args.subject,
        });
        break;

      case 'vk_groups_invite':
        result = await vk.groupsInvite({
          group_id: args.group_id,
          user_id: args.user_id,
        });
        break;

      case 'vk_groups_ban':
        result = await vk.groupsBan({
          group_id: args.group_id,
          owner_id: args.owner_id,
          end_date: args.end_date,
          reason: args.reason,
          comment: args.comment,
          comment_visible: args.comment_visible ? 1 : 0,
        });
        break;

      case 'vk_groups_get_banned':
        result = await vk.groupsGetBanned({
          group_id: args.group_id,
          offset: args.offset,
          count: args.count || 20,
          fields: args.fields,
          owner_id: args.owner_id,
        });
        break;

      case 'vk_groups_approve_request':
        result = await vk.groupsApproveRequest({
          group_id: args.group_id,
          user_id: args.user_id,
        });
        break;

      case 'vk_groups_get_invites':
        result = await vk.groupsGetInvites({
          offset: args.offset,
          count: args.count || 20,
          extended: args.extended ? 1 : 0,
        });
        break;

      case 'vk_account_get_profile_info':
        result = await vk.accountGetProfileInfo({});
        break;

      case 'vk_account_save_profile_info':
        result = await vk.accountSaveProfileInfo({
          first_name: args.first_name,
          last_name: args.last_name,
          maiden_name: args.maiden_name,
          screen_name: args.screen_name,
          sex: args.sex,
          relation: args.relation,
          bdate: args.bdate,
          bdate_visibility: args.bdate_visibility,
          home_town: args.home_town,
          status: args.status,
        });
        break;

      case 'vk_account_set_online':
        result = await vk.accountSetOnline({
          voip: args.voip ? 1 : 0,
        });
        break;

      case 'vk_account_set_offline':
        result = await vk.accountSetOffline({});
        break;

      case 'vk_account_ban':
        result = await vk.accountBan({
          owner_id: args.owner_id,
        });
        break;

      case 'vk_account_unban':
        result = await vk.accountUnban({
          owner_id: args.owner_id,
        });
        break;

      case 'vk_account_get_banned':
        result = await vk.accountGetBanned({
          offset: args.offset,
          count: args.count || 20,
          fields: args.fields,
        });
        break;

      case 'vk_polls_create':
        result = await vk.pollsCreate({
          question: args.question,
          is_anonymous: args.is_anonymous ? 1 : 0,
          owner_id: args.owner_id,
          add_answers: args.add_answers,
          end_date: args.end_date,
          photo_id: args.photo_id,
          background_id: args.background_id,
          disable_unvote: args.disable_unvote ? 1 : 0,
        });
        break;

      case 'vk_polls_add_vote':
        result = await vk.pollsAddVote({
          owner_id: args.owner_id,
          poll_id: args.poll_id,
          answer_ids: args.answer_ids,
          is_board: args.is_board ? 1 : 0,
        });
        break;

      case 'vk_polls_delete_vote':
        result = await vk.pollsDeleteVote({
          owner_id: args.owner_id,
          poll_id: args.poll_id,
          answer_id: args.answer_id,
          is_board: args.is_board ? 1 : 0,
        });
        break;

      case 'vk_polls_get_voters':
        result = await vk.pollsGetVoters({
          owner_id: args.owner_id,
          poll_id: args.poll_id,
          answer_ids: args.answer_ids,
          is_board: args.is_board ? 1 : 0,
          friends_only: args.friends_only ? 1 : 0,
          offset: args.offset,
          count: args.count || 100,
          fields: args.fields,
        });
        break;

      case 'vk_friends_add':
        result = await vk.friendsAdd({
          user_id: args.user_id,
          text: args.text,
          follow: args.follow ? 1 : 0,
        });
        break;

      case 'vk_friends_delete':
        result = await vk.friendsDelete({
          user_id: args.user_id,
        });
        break;

      case 'vk_friends_edit':
        result = await vk.friendsEdit({
          user_id: args.user_id,
          list_ids: args.list_ids,
        });
        break;

      case 'vk_friends_get_lists':
        result = await vk.friendsGetLists({
          user_id: args.user_id,
          return_system: args.return_system ? 1 : 0,
        });
        break;

      case 'vk_market_add':
        result = await vk.marketAdd({
          owner_id: args.owner_id,
          name: args.name,
          description: args.description,
          category_id: args.category_id,
          price: args.price,
          main_photo_id: args.main_photo_id,
          photo_ids: args.photo_ids,
          deleted: args.deleted ? 1 : 0,
          url: args.url,
        });
        break;

      case 'vk_market_edit':
        result = await vk.marketEdit({
          owner_id: args.owner_id,
          item_id: args.item_id,
          name: args.name,
          description: args.description,
          category_id: args.category_id,
          price: args.price,
          main_photo_id: args.main_photo_id,
          photo_ids: args.photo_ids,
          deleted: args.deleted ? 1 : 0,
          url: args.url,
        });
        break;

      case 'vk_market_delete':
        result = await vk.marketDelete({
          owner_id: args.owner_id,
          item_id: args.item_id,
        });
        break;

      case 'vk_market_add_album':
        result = await vk.marketAddAlbum({
          owner_id: args.owner_id,
          title: args.title,
          photo_id: args.photo_id,
          main_album: args.main_album ? 1 : 0,
        });
        break;

      case 'vk_market_edit_album':
        result = await vk.marketEditAlbum({
          owner_id: args.owner_id,
          album_id: args.album_id,
          title: args.title,
          photo_id: args.photo_id,
          main_album: args.main_album ? 1 : 0,
        });
        break;

      case 'vk_market_delete_album':
        result = await vk.marketDeleteAlbum({
          owner_id: args.owner_id,
          album_id: args.album_id,
        });
        break;

      case 'vk_market_create_comment':
        result = await vk.marketCreateComment({
          owner_id: args.owner_id,
          item_id: args.item_id,
          message: args.message,
          attachments: args.attachments,
          from_group: args.from_group ? 1 : 0,
          reply_to_comment: args.reply_to_comment,
          sticker_id: args.sticker_id,
          guid: args.guid,
        });
        break;

      case 'vk_market_delete_comment':
        result = await vk.marketDeleteComment({
          owner_id: args.owner_id,
          comment_id: args.comment_id,
        });
        break;

      case 'vk_market_edit_comment':
        result = await vk.marketEditComment({
          owner_id: args.owner_id,
          comment_id: args.comment_id,
          message: args.message,
          attachments: args.attachments,
        });
        break;

      case 'vk_market_get_comments':
        result = await vk.marketGetComments({
          owner_id: args.owner_id,
          item_id: args.item_id,
          need_likes: args.need_likes ? 1 : 0,
          offset: args.offset,
          count: args.count || 20,
          extended: args.extended ? 1 : 0,
          sort: args.sort,
        });
        break;

      case 'vk_pretty_cards_get':
        result = await vk.prettyCardsGet({
          owner_id: args.owner_id,
          offset: args.offset,
          count: args.count || 10,
        });
        break;

      case 'vk_pretty_cards_get_by_id':
        result = await vk.prettyCardsGetById({
          owner_id: args.owner_id,
          card_ids: args.card_ids,
        });
        break;

      case 'vk_pretty_cards_create':
        result = await vk.prettyCardsCreate({
          owner_id: args.owner_id,
          photo: args.photo,
          title: args.title,
          link: args.link,
          price: args.price,
          price_old: args.price_old,
          button: args.button,
        });
        break;

      case 'vk_pretty_cards_edit':
        result = await vk.prettyCardsEdit({
          owner_id: args.owner_id,
          card_id: args.card_id,
          photo: args.photo,
          title: args.title,
          link: args.link,
          price: args.price,
          price_old: args.price_old,
          button: args.button,
        });
        break;

      case 'vk_pretty_cards_delete':
        result = await vk.prettyCardsDelete({
          owner_id: args.owner_id,
          card_id: args.card_id,
        });
        break;

      case 'vk_pretty_cards_get_upload_url':
        result = await vk.prettyCardsGetUploadURL({
          owner_id: args.owner_id,
        });
        break;

      case 'vk_status_set':
        result = await vk.statusSet({
          text: args.text,
          group_id: args.group_id,
        });
        break;

      case 'vk_storage_set':
        result = await vk.storageSet({
          key: args.key,
          value: args.value,
          user_id: args.user_id,
        });
        break;

      case 'vk_fave_add_post':
        result = await vk.faveAddPost({
          id: args.id,
          owner_id: args.owner_id,
          access_key: args.access_key,
        });
        break;

      case 'vk_fave_remove_post':
        result = await vk.faveRemovePost({
          id: args.id,
          owner_id: args.owner_id,
        });
        break;

      case 'vk_fave_add_link':
        result = await vk.faveAddLink({
          link: args.link,
          text: args.text,
        });
        break;

      case 'vk_fave_remove_link':
        result = await vk.faveRemoveLink({
          link_id: args.link_id,
        });
        break;

      case 'vk_board_add_topic':
        result = await vk.boardAddTopic({
          group_id: args.group_id,
          title: args.title,
          text: args.text,
          from_group: args.from_group ? 1 : 0,
          attachments: args.attachments,
        });
        break;

      case 'vk_board_delete_topic':
        result = await vk.boardDeleteTopic({
          group_id: args.group_id,
          topic_id: args.topic_id,
        });
        break;

      case 'vk_board_edit_topic':
        result = await vk.boardEditTopic({
          group_id: args.group_id,
          topic_id: args.topic_id,
          title: args.title,
        });
        break;

      case 'vk_board_create_comment':
        result = await vk.boardCreateComment({
          group_id: args.group_id,
          topic_id: args.topic_id,
          message: args.message,
          attachments: args.attachments,
          from_group: args.from_group ? 1 : 0,
          sticker_id: args.sticker_id,
          guid: args.guid,
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
  { name: 'vk-mcp-server', version: '0.2.0' },
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

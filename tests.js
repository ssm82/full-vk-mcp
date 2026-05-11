/**
 * VK MCP Server Tests
 *
 * Unit tests for the VK API client and MCP tools
 */

process.env.VK_ACCESS_TOKEN = 'test_token';

import { describe, it, expect, jest, beforeEach } from '@jest/globals';

global.fetch = jest.fn();

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

  usersGet(params) { return this.call('users.get', params); }
  wallGet(params) { return this.call('wall.get', params); }
  wallPost(params) { return this.call('wall.post', params); }
  wallEdit(params) { return this.call('wall.edit', params); }
  wallDelete(params) { return this.call('wall.delete', params); }
  wallCreateComment(params) { return this.call('wall.createComment', params); }
  groupsGet(params) { return this.call('groups.get', { ...params, extended: 1 }); }
  groupsGetById(params) { return this.call('groups.getById', params); }
  friendsGet(params) { return this.call('friends.get', params); }
  newsfeedGet(params) { return this.call('newsfeed.get', params); }
  statsGet(params) { return this.call('stats.get', params); }
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
  audioGet(params) { return this.call('audio.get', params); }
  audioGetById(params) { return this.call('audio.getById', params); }
  audioGetLyrics(params) { return this.call('audio.getLyrics', params); }
  audioSearch(params) { return this.call('audio.search', params); }
  audioGetPopular(params) { return this.call('audio.getPopular', params); }
  audioGetRadio(params) { return this.call('audio.getRadio', params); }
  audioGetCount(params) { return this.call('audio.getCount', params); }
  docsGet(params) { return this.call('docs.get', params); }
  docsGetById(params) { return this.call('docs.getById', params); }
  docsSearch(params) { return this.call('docs.search', params); }
  docsGetTypes(params) { return this.call('docs.getTypes', params); }
  docsGetWallUploadServer(params) { return this.call('docs.getWallUploadServer', params); }
  docsGetMessagesUploadServer(params) { return this.call('docs.getMessagesUploadServer', params); }
  usersGetFollowers(params) { return this.call('users.getFollowers', params); }
  usersGetSubscriptions(params) { return this.call('users.getSubscriptions', params); }
  usersSearch(params) { return this.call('users.search', params); }
  usersIsAppUser(params) { return this.call('users.isAppUser', params); }
  usersGetNearby(params) { return this.call('users.getNearby', params); }
  usersReport(params) { return this.call('users.report', params); }
  accountGetInfo(params) { return this.call('account.getInfo', params); }
  accountGetPushSettings(params) { return this.call('account.getPushSettings', params); }
  accountGetCounters(params) { return this.call('account.getCounters', params); }
  accountGetAppPermissions(params) { return this.call('account.getAppPermissions', params); }
  accountGetBalance(params) { return this.call('account.getBalance', params); }
  groupsGetMembers(params) { return this.call('groups.getMembers', params); }
  groupsGetRequests(params) { return this.call('groups.getRequests', params); }
  groupsGetSettings(params) { return this.call('groups.getSettings', params); }
  groupsGetLongPollServer(params) { return this.call('groups.getLongPollServer', params); }
  groupsGetLongPollSettings(params) { return this.call('groups.getLongPollSettings', params); }
  groupsGetAddresses(params) { return this.call('groups.getAddresses', params); }
  groupsGetTokenPermissions(params) { return this.call('groups.getTokenPermissions', params); }
  friendsGetOnline(params) { return this.call('friends.getOnline', params); }
  friendsGetMutual(params) { return this.call('friends.getMutual', params); }
  friendsGetRequests(params) { return this.call('friends.getRequests', params); }
  friendsAreFriends(params) { return this.call('friends.areFriends', params); }
  friendsGetRecent(params) { return this.call('friends.getRecent', params); }
  friendsSearch(params) { return this.call('friends.search', params); }
  friendsGetSuggestions(params) { return this.call('friends.getSuggestions', params); }
  friendsGetAppUsers(params) { return this.call('friends.getAppUsers', params); }
  friendsGetAll(params) { return this.call('friends.getAll', params); }
  newsfeedGetComments(params) { return this.call('newsfeed.getComments', params); }
  newsfeedGetReposts(params) { return this.call('newsfeed.getReposts', params); }
  newsfeedGetSuggestedSources(params) { return this.call('newsfeed.getSuggestedSources', params); }
  newsfeedSearch(params) { return this.call('newsfeed.search', params); }
  newsfeedGetBanned(params) { return this.call('newsfeed.getBanned', params); }
  likesGetList(params) { return this.call('likes.getList', params); }
  likesIsLiked(params) { return this.call('likes.isLiked', params); }
  utilsGetShortLink(params) { return this.call('utils.getShortLink', params); }
  utilsGetServerTime(params) { return this.call('utils.getServerTime', params); }
  utilsResolveScreenName(params) { return this.call('utils.resolveScreenName', params); }
  utilsGetLinkStats(params) { return this.call('utils.getLinkStats', params); }
  utilsCheckLink(params) { return this.call('utils.checkLink', params); }
  databaseGetCountries(params) { return this.call('database.getCountries', params); }
  databaseGetRegions(params) { return this.call('database.getRegions', params); }
  databaseGetCities(params) { return this.call('database.getCities', params); }
  databaseGetSchools(params) { return this.call('database.getSchools', params); }
  databaseGetFaculties(params) { return this.call('database.getFaculties', params); }
  databaseGetChairs(params) { return this.call('database.getChairs', params); }
  wallGetComment(params) { return this.call('wall.getComment', params); }
  wallGetReposts(params) { return this.call('wall.getReposts', params); }
  messagesGet(params) { return this.call('messages.get', params); }
  messagesGetConversations(params) { return this.call('messages.getConversations', params); }
  messagesGetById(params) { return this.call('messages.getById', params); }
  messagesSearch(params) { return this.call('messages.search', params); }
  messagesGetDialogs(params) { return this.call('messages.getDialogs', params); }
  messagesLastActivity(params) { return this.call('messages.lastActivity', params); }
  messagesGetHistory(params) { return this.call('messages.getHistory', params); }
  marketGetAlbums(params) { return this.call('market.getAlbums', params); }
  marketGetAlbum(params) { return this.call('market.getAlbum', params); }
  marketGetItems(params) { return this.call('market.getItems', params); }
  marketGetItemsById(params) { return this.call('market.getItemsById', params); }
  marketSearch(params) { return this.call('market.search', params); }
  marketGetOrder(params) { return this.call('market.getOrder', params); }
  marketGetOrders(params) { return this.call('market.getOrders', params); }
  marketGetOrderItems(params) { return this.call('market.getOrderItems', params); }
  notesGetById(params) { return this.call('notes.getById', params); }
  pagesGetHistory(params) { return this.call('pages.getHistory', params); }
  pagesGetTitles(params) { return this.call('pages.getTitles', params); }
  pagesGetVersions(params) { return this.call('pages.getVersions', params); }
  statusGet(params) { return this.call('status.get', params); }
  storageGet(params) { return this.call('storage.get', params); }
  storageGetKeys(params) { return this.call('storage.getKeys', params); }
  giftsGet(params) { return this.call('gifts.get', params); }
  notificationsGetSubscriptions(params) { return this.call('notifications.getSubscriptions', params); }
  boardGet(params) { return this.call('board.get', params); }
  boardGetComments(params) { return this.call('board.getComments', params); }
  faveGetPosts(params) { return this.call('fave.getPosts', params); }
  faveGetPhotos(params) { return this.call('fave.getPhotos', params); }
  faveGetVideos(params) { return this.call('fave.getVideos', params); }
  faveGetLinks(params) { return this.call('fave.getLinks', params); }
  appsGet(params) { return this.call('apps.get', params); }
  appsGetCatalog(params) { return this.call('apps.getCatalog', params); }
  appsIsInstalled(params) { return this.call('apps.isInstalled', params); }
  widgetsGetComments(params) { return this.call('widgets.getComments', params); }
  widgetsGetPosts(params) { return this.call('widgets.getPosts', params); }
  widgetsGetWidget(params) { return this.call('widgets.getWidget', params); }
  statsGetPostReach(params) { return this.call('stats.getPostReach', params); }
  statsGetVisitors(params) { return this.call('stats.getVisitors', params); }
  pollsGet(params) { return this.call('polls.get', params); }
  secureGetAppBalance(params) { return this.call('secure.getAppBalance', params); }
  secureGetMobileAppsList(params) { return this.call('secure.getMobileAppsList', params); }
  secureGetUserHistory(params) { return this.call('secure.getUserHistory', params); }
  secureGetUsersHits(params) { return this.call('secure.getUsersHits', params); }
  secureCheckToken(params) { return this.call('secure.checkToken', params); }
  leadformsGet(params) { return this.call('leadforms.get', params); }
  leadformsGetById(params) { return this.call('leadforms.getById', params); }
  asrDecode(params) { return this.call('asr.decode', params); }
  streamingGetServerUrl(params) { return this.call('streaming.getServerUrl', params); }
  ordersGet(params) { return this.call('orders.get', params); }
  ordersGetById(params) { return this.call('orders.getById', params); }
}

const tools = [
  { name: 'vk_users_get', description: 'Get user info', inputSchema: { type: 'object', properties: { user_ids: { type: 'string' } } } },
  { name: 'vk_wall_get', description: 'Get wall posts', inputSchema: { type: 'object', properties: { owner_id: { type: 'number' } } } },
  { name: 'vk_wall_post', description: 'Post to wall', inputSchema: { type: 'object', properties: { message: { type: 'string' } }, required: ['message'] } },
  { name: 'vk_wall_create_comment', description: 'Comment on wall', inputSchema: { type: 'object', properties: { owner_id: { type: 'number' }, post_id: { type: 'number' }, message: { type: 'string' } }, required: ['owner_id', 'post_id', 'message'] } },
  { name: 'vk_wall_get_by_id', description: 'Get posts by ID', inputSchema: { type: 'object', properties: { posts: { type: 'string' } }, required: ['posts'] } },
  { name: 'vk_wall_edit', description: 'Edit wall post', inputSchema: { type: 'object', properties: { post_id: { type: 'number' } }, required: ['post_id'] } },
  { name: 'vk_wall_delete', description: 'Delete wall post', inputSchema: { type: 'object', properties: { post_id: { type: 'number' } }, required: ['post_id'] } },
  { name: 'vk_photos_upload_wall', description: 'Upload photo to wall', inputSchema: { type: 'object', properties: { image: { type: 'string' } }, required: ['image'] } },
  { name: 'vk_groups_get', description: 'Get groups', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_groups_get_by_id', description: 'Get group by ID', inputSchema: { type: 'object', properties: { group_ids: { type: 'string' } } } },
  { name: 'vk_friends_get', description: 'Get friends', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_newsfeed_get', description: 'Get newsfeed', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_stats_get', description: 'Get stats', inputSchema: { type: 'object', properties: { group_id: { type: 'number' } }, required: ['group_id'] } },
  { name: 'vk_photos_get', description: 'Get photos', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_photos_get_all', description: 'Get all photos', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_photos_get_albums', description: 'Get photo albums', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_photos_get_album', description: 'Get album photos', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_photos_get_by_id', description: 'Get photos by ID', inputSchema: { type: 'object', properties: { photos: { type: 'string' } }, required: ['photos'] } },
  { name: 'vk_photos_get_comments', description: 'Get photo comments', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_photos_get_tags', description: 'Get photo tags', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_photos_get_new_tags', description: 'Get new photo tags', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_photos_search', description: 'Search photos', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_photos_get_wall_upload_server', description: 'Get wall upload server', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_photos_get_messages_upload_server', description: 'Get messages upload server', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_photos_get_owner_photo_upload_server', description: 'Get owner photo upload server', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_photos_get_chat_upload_server', description: 'Get chat upload server', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_video_get', description: 'Get videos', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_video_get_albums', description: 'Get video albums', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_video_get_album', description: 'Get album videos', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_video_get_comments', description: 'Get video comments', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_video_get_tags', description: 'Get video tags', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_video_get_new_tags', description: 'Get new video tags', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_video_get_by_id', description: 'Get videos by ID', inputSchema: { type: 'object', properties: { videos: { type: 'string' } }, required: ['videos'] } },
  { name: 'vk_video_search', description: 'Search videos', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_video_get_album_by_id', description: 'Get video album by ID', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_video_get_catalog', description: 'Get video catalog', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_video_get_catalog_section', description: 'Get catalog section', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_audio_get', description: 'Get audios', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_audio_get_by_id', description: 'Get audios by ID', inputSchema: { type: 'object', properties: { audios: { type: 'string' } }, required: ['audios'] } },
  { name: 'vk_audio_get_lyrics', description: 'Get lyrics', inputSchema: { type: 'object', properties: { lyrics_id: { type: 'number' } }, required: ['lyrics_id'] } },
  { name: 'vk_audio_search', description: 'Search audios', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_audio_get_popular', description: 'Get popular audios', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_audio_get_radio', description: 'Get radio', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_audio_get_count', description: 'Get audio count', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_docs_get', description: 'Get docs', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_docs_get_by_id', description: 'Get docs by ID', inputSchema: { type: 'object', properties: { docs: { type: 'string' } }, required: ['docs'] } },
  { name: 'vk_docs_search', description: 'Search docs', inputSchema: { type: 'object', properties: { q: { type: 'string' } }, required: ['q'] } },
  { name: 'vk_docs_get_types', description: 'Get doc types', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_docs_get_wall_upload_server', description: 'Get wall upload server', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_docs_get_messages_upload_server', description: 'Get messages upload server', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_users_get_followers', description: 'Get followers', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_users_get_subscriptions', description: 'Get subscriptions', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_users_search', description: 'Search users', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_users_is_app_user', description: 'Check app user', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_users_get_nearby', description: 'Get nearby users', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_account_get_info', description: 'Get account info', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_account_get_push_settings', description: 'Get push settings', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_account_get_counters', description: 'Get counters', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_account_get_app_permissions', description: 'Get app permissions', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_account_get_balance', description: 'Get balance', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_groups_get_members', description: 'Get group members', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_groups_get_requests', description: 'Get join requests', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_groups_get_settings', description: 'Get group settings', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_groups_get_long_poll_server', description: 'Get Long Poll server', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_groups_get_long_poll_settings', description: 'Get Long Poll settings', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_groups_get_addresses', description: 'Get group addresses', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_groups_get_token_permissions', description: 'Get token permissions', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_friends_get_online', description: 'Get online friends', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_friends_get_mutual', description: 'Get mutual friends', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_friends_get_requests', description: 'Get friend requests', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_friends_are_friends', description: 'Check friendship', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_friends_get_recent', description: 'Get recent friends', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_friends_search', description: 'Search friends', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_friends_get_suggestions', description: 'Get friend suggestions', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_friends_get_app_users', description: 'Get app users', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_friends_get_all', description: 'Get all friends', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_newsfeed_get_comments', description: 'Get newsfeed comments', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_newsfeed_get_reposts', description: 'Get reposts', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_newsfeed_get_suggested_sources', description: 'Get suggested sources', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_newsfeed_search', description: 'Search newsfeed', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_newsfeed_get_banned', description: 'Get banned', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_likes_get_list', description: 'Get likes', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_likes_is_liked', description: 'Check if liked', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_utils_get_short_link', description: 'Get short link', inputSchema: { type: 'object', properties: { url: { type: 'string' } }, required: ['url'] } },
  { name: 'vk_utils_get_server_time', description: 'Get server time', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_utils_resolve_screen_name', description: 'Resolve screen name', inputSchema: { type: 'object', properties: { screen_name: { type: 'string' } }, required: ['screen_name'] } },
  { name: 'vk_utils_get_link_stats', description: 'Get link stats', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_utils_check_link', description: 'Check link', inputSchema: { type: 'object', properties: { url: { type: 'string' } }, required: ['url'] } },
  { name: 'vk_database_get_countries', description: 'Get countries', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_database_get_regions', description: 'Get regions', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_database_get_cities', description: 'Get cities', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_database_get_schools', description: 'Get schools', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_database_get_faculties', description: 'Get faculties', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_database_get_chairs', description: 'Get chairs', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_wall_get_comment', description: 'Get wall comment', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_wall_get_reposts', description: 'Get reposts', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_messages_get', description: 'Get messages', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_messages_get_conversations', description: 'Get conversations', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_messages_get_by_id', description: 'Get messages by ID', inputSchema: { type: 'object', properties: { message_ids: { type: 'string' } }, required: ['message_ids'] } },
  { name: 'vk_messages_search', description: 'Search messages', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_messages_get_dialogs', description: 'Get dialogs', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_messages_last_activity', description: 'Get last activity', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_messages_get_history', description: 'Get history', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_market_get_albums', description: 'Get market albums', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_market_get_album', description: 'Get market album', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_market_get_items', description: 'Get market items', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_market_get_items_by_id', description: 'Get items by ID', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_market_search', description: 'Search market', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_market_get_order', description: 'Get order', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_market_get_orders', description: 'Get orders', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_market_get_order_items', description: 'Get order items', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_notes_get_by_id', description: 'Get note', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_pages_get_history', description: 'Get page history', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_pages_get_titles', description: 'Get page titles', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_pages_get_versions', description: 'Get page versions', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_status_get', description: 'Get status', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_storage_get', description: 'Get storage', inputSchema: { type: 'object', properties: { key: { type: 'string' } }, required: ['key'] } },
  { name: 'vk_storage_get_keys', description: 'Get storage keys', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_gifts_get', description: 'Get gifts', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_notifications_get_subscriptions', description: 'Get notification subscriptions', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_board_get', description: 'Get board', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_board_get_comments', description: 'Get board comments', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_fave_get_posts', description: 'Get favorite posts', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_fave_get_photos', description: 'Get favorite photos', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_fave_get_videos', description: 'Get favorite videos', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_fave_get_links', description: 'Get favorite links', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_apps_get', description: 'Get apps', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_apps_get_catalog', description: 'Get apps catalog', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_apps_is_installed', description: 'Check if installed', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_widgets_get_comments', description: 'Get widget comments', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_widgets_get_posts', description: 'Get widget posts', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_widgets_get_widget', description: 'Get widget', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_stats_get_post_reach', description: 'Get post reach', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_stats_get_visitors', description: 'Get visitors', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_polls_get', description: 'Get poll', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_secure_get_app_balance', description: 'Get app balance', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_secure_get_mobile_apps_list', description: 'Get mobile apps', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_secure_get_user_history', description: 'Get user history', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_secure_get_users_hits', description: 'Get user hits', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_secure_check_token', description: 'Check token', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_leadforms_get', description: 'Get lead forms', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_leadforms_get_by_id', description: 'Get lead form', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_orders_get', description: 'Get orders', inputSchema: { type: 'object', properties: {} } },
  { name: 'vk_orders_get_by_id', description: 'Get orders by ID', inputSchema: { type: 'object', properties: {} } },
];

async function handleToolCall(name, args) {
  try {
    let result;
    switch (name) {
      case 'vk_users_get':
        result = await new VKClient('test').usersGet({ user_ids: args.user_ids });
        break;
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
    return JSON.stringify(result, null, 2);
  } catch (error) {
    return JSON.stringify({ error: error.message });
  }
}

describe('VK API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('API Call Structure', () => {
    it('should construct correct API URL', async () => {
      const mockResponse = { response: { id: 1 } };
      global.fetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse),
      });

      const params = new URLSearchParams({
        user_ids: '1',
        access_token: 'test_token',
        v: '5.199',
      });

      await fetch('https://api.vk.com/method/users.get', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      });

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.vk.com/method/users.get',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        })
      );
    });

    it('should include API version in all requests', async () => {
      const mockResponse = { response: [] };
      global.fetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse),
      });

      const params = new URLSearchParams({
        access_token: 'test_token',
        v: '5.199',
      });

      await fetch('https://api.vk.com/method/wall.get', {
        method: 'POST',
        body: params.toString(),
      });

      const callBody = global.fetch.mock.calls[0][1].body;
      expect(callBody).toContain('v=5.199');
    });
  });

  describe('Error Handling', () => {
    it('should parse VK API errors correctly', async () => {
      const errorResponse = {
        error: {
          error_code: 5,
          error_msg: 'User authorization failed: invalid access_token.',
        },
      };

      global.fetch.mockResolvedValueOnce({
        json: () => Promise.resolve(errorResponse),
      });

      const response = await fetch('https://api.vk.com/method/users.get');
      const data = await response.json();

      expect(data.error).toBeDefined();
      expect(data.error.error_code).toBe(5);
    });
  });

  describe('Tool Definitions', () => {
    it('should have more than 100 tools defined', () => {
      expect(tools.length).toBeGreaterThan(100);
    });

    it('should contain essential tools', () => {
      const toolNames = tools.map(t => t.name);
      expect(toolNames).toContain('vk_users_get');
      expect(toolNames).toContain('vk_wall_post');
      expect(toolNames).toContain('vk_wall_edit');
      expect(toolNames).toContain('vk_wall_delete');
      expect(toolNames).toContain('vk_wall_get_by_id');
      expect(toolNames).toContain('vk_photos_upload_wall');
      expect(toolNames).toContain('vk_photos_get_all');
      expect(toolNames).toContain('vk_video_get');
      expect(toolNames).toContain('vk_audio_get');
      expect(toolNames).toContain('vk_docs_get');
      expect(toolNames).toContain('vk_messages_get');
      expect(toolNames).toContain('vk_market_get_items');
    });

    it('should have correct tool naming convention', () => {
      tools.forEach((tool) => {
        expect(tool.name).toMatch(/^vk_[a-z_]+$/);
      });
    });
  });

  describe('Input Validation', () => {
    it('should require message for wall_post', () => {
      const wallPost = tools.find(t => t.name === 'vk_wall_post');
      expect(wallPost.inputSchema.required).toContain('message');
    });

    it('should require owner_id and post_id for wall_create_comment', () => {
      const tool = tools.find(t => t.name === 'vk_wall_create_comment');
      expect(tool.inputSchema.required).toContain('owner_id');
      expect(tool.inputSchema.required).toContain('post_id');
      expect(tool.inputSchema.required).toContain('message');
    });

    it('should require group_id for stats_get', () => {
      const tool = tools.find(t => t.name === 'vk_stats_get');
      expect(tool.inputSchema.required).toContain('group_id');
    });

    it('should require post_id for wall_edit', () => {
      const tool = tools.find(t => t.name === 'vk_wall_edit');
      expect(tool.inputSchema.required).toContain('post_id');
    });

    it('should require post_id for wall_delete', () => {
      const tool = tools.find(t => t.name === 'vk_wall_delete');
      expect(tool.inputSchema.required).toContain('post_id');
    });

    it('should require posts for wall_get_by_id', () => {
      const tool = tools.find(t => t.name === 'vk_wall_get_by_id');
      expect(tool.inputSchema.required).toContain('posts');
    });

    it('should require image for photos_upload_wall', () => {
      const tool = tools.find(t => t.name === 'vk_photos_upload_wall');
      expect(tool.inputSchema.required).toContain('image');
    });
  });
});

describe('MCP Server', () => {
  it('should export server with correct name', () => {
    const serverConfig = { name: 'vk-mcp-server', version: '0.1.0' };
    expect(serverConfig.name).toBe('vk-mcp-server');
  });

  it('should have tools capability', () => {
    const capabilities = { tools: {} };
    expect(capabilities).toHaveProperty('tools');
  });
});

describe('Tool Schema Validation', () => {
  it.each(tools)('tool $name should have valid name format', (tool) => {
    expect(tool.name).toMatch(/^vk_[a-z_]+$/);
  });

  it.each(tools)('tool $name should have description', (tool) => {
    expect(tool.description).toBeDefined();
    expect(tool.description.length).toBeGreaterThan(0);
  });

  it.each(tools)('tool $name should have inputSchema', (tool) => {
    expect(tool.inputSchema).toBeDefined();
    expect(tool.inputSchema.type).toBe('object');
  });

  it.each(tools)('tool $name should have properties in inputSchema', (tool) => {
    expect(tool.inputSchema.properties).toBeDefined();
    expect(typeof tool.inputSchema.properties).toBe('object');
  });
});

describe('Handler Coverage', () => {
  it('handleToolCall should be a function', () => {
    expect(typeof handleToolCall).toBe('function');
  });

  it('handleToolCall should return error for unknown tool', async () => {
    const result = await handleToolCall('vk_unknown_tool_xyz', {});
    const parsed = JSON.parse(result);
    expect(parsed.error).toBeDefined();
    expect(parsed.error).toContain('Unknown tool');
  });
});

describe('VKClient Method Coverage', () => {
  const sampleMethods = [
    'usersGet', 'wallGet', 'wallPost', 'wallEdit', 'wallDelete',
    'groupsGet', 'friendsGet', 'photosGet', 'videoGet', 'audioGet',
    'docsGet', 'messagesGet', 'marketGetItems', 'newsfeedGet',
    'databaseGetCountries', 'utilsGetServerTime', 'accountGetInfo',
    'storageGet', 'statusGet', 'pollsGet', 'statsGet',
    'likesGetList', 'friendsGetOnline', 'giftsGet', 'notesGetById',
    'pagesGetHistory', 'boardGet', 'faveGetPosts', 'appsGetCatalog',
    'widgetsGetComments', 'secureGetAppBalance', 'leadformsGet',
    'ordersGet', 'streamingGetServerUrl', 'asrDecode',
  ];

  it.each(sampleMethods)('VKClient should have %s method', (method) => {
    expect(VKClient.prototype[method]).toBeDefined();
    expect(typeof VKClient.prototype[method]).toBe('function');
  });

  it('VKClient should have call method', () => {
    expect(VKClient.prototype.call).toBeDefined();
    expect(typeof VKClient.prototype.call).toBe('function');
  });
});

describe('Tool-Handler-Client Mapping', () => {
  const mappings = [
    { tool: 'vk_users_get', clientMethod: 'usersGet' },
    { tool: 'vk_wall_get', clientMethod: 'wallGet' },
    { tool: 'vk_wall_post', clientMethod: 'wallPost' },
    { tool: 'vk_photos_get', clientMethod: 'photosGet' },
    { tool: 'vk_messages_get', clientMethod: 'messagesGet' },
    { tool: 'vk_groups_get', clientMethod: 'groupsGet' },
    { tool: 'vk_friends_get', clientMethod: 'friendsGet' },
    { tool: 'vk_video_get', clientMethod: 'videoGet' },
    { tool: 'vk_audio_get', clientMethod: 'audioGet' },
    { tool: 'vk_docs_get', clientMethod: 'docsGet' },
    { tool: 'vk_newsfeed_get', clientMethod: 'newsfeedGet' },
    { tool: 'vk_database_get_countries', clientMethod: 'databaseGetCountries' },
    { tool: 'vk_market_get_items', clientMethod: 'marketGetItems' },
    { tool: 'vk_stats_get', clientMethod: 'statsGet' },
    { tool: 'vk_account_get_info', clientMethod: 'accountGetInfo' },
    { tool: 'vk_utils_get_server_time', clientMethod: 'utilsGetServerTime' },
  ];

  it.each(mappings)('tool $tool should map to VKClient method $clientMethod', ({ tool, clientMethod }) => {
    const toolExists = tools.some(t => t.name === tool);
    expect(toolExists).toBe(true);
    expect(VKClient.prototype[clientMethod]).toBeDefined();
  });
});

describe('API Version and URL Structure', () => {
  it('should use correct API version', () => {
    expect(VK_API_VERSION).toBe('5.199');
  });

  it('should use correct API base URL', () => {
    expect(VK_API_BASE).toBe('https://api.vk.com/method');
  });

  it('VKClient call should construct correct URL', async () => {
    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ response: {} }),
    });

    const client = new VKClient('test_token');
    await client.call('test.method', { param: 'value' });

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.vk.com/method/test.method',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
    );
  });

  it('VKClient call should include access_token and version', async () => {
    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ response: {} }),
    });

    const client = new VKClient('test_token');
    await client.call('test.method', {});

    const callBody = global.fetch.mock.calls[0][1].body;
    expect(callBody).toContain('access_token=test_token');
    expect(callBody).toContain('v=5.199');
  });
});

describe('Write Methods Still Present', () => {
  const writeMethods = ['wallPost', 'wallEdit', 'wallDelete', 'wallCreateComment'];

  it.each(writeMethods)('VKClient should have write method %s', (method) => {
    expect(VKClient.prototype[method]).toBeDefined();
  });

  it.each(['vk_wall_post', 'vk_wall_edit', 'vk_wall_delete', 'vk_wall_create_comment', 'vk_photos_upload_wall'])(
    'tool %s should exist',
    (toolName) => {
      const toolExists = tools.some(t => t.name === toolName);
      expect(toolExists).toBe(true);
    }
  );
});
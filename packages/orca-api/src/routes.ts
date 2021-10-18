import { Request, Response, Router } from 'express';
import passport from 'passport';
import multer from 'multer';
import {
  ChannelController,
  UserController,
  PostController,
  LikeController,
  CommentController,
  NotificationController,
  FollowController,
  MessageController,
  SearchController,
  AuthController,
  SettingsController,
} from './controllers';
import { checkIfAdmin, checkIfSuperAdmin, checkIfUser } from './utils/protectedRoute';
import { withUser } from './utils/withUser';

const router = Router();

const storage = multer.memoryStorage();
const multerUpload = multer({ storage });

router.get('/', (req: Request, res: Response) => res.send('echo'));

/**
 * Authentication
 */
router.get('/auth-user', AuthController.authUser);
router.post('/signup', AuthController.signUp);
router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);
router.post('/email-verify', AuthController.emailVerify);
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback', AuthController.githubCallback);
router.get('/google', passport.authenticate('google', { scope: 'profile email' }));
router.get('/google/callback', AuthController.googleCallback);
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback', AuthController.facebookCallback);

/**
 * Users
 */
router.get('/users/get-users', withUser, UserController.getUsers);
router.get('/users/online-users', withUser, UserController.onlineUsers);
router.get('/users/new-members', withUser, UserController.newMembers);
router.post('/users/upload-photo', [checkIfUser, multerUpload.single('image')], UserController.uploadPhoto);
router.get('/users/:id', UserController.user);
router.delete('/users/ban-user', checkIfSuperAdmin, UserController.banUser);

/**
 * Settings
 */
router.get('/settings', SettingsController.settings);
router.put('/settings/update-community', checkIfAdmin, SettingsController.updateCommunity);
router.post('/settings/upload-logo', [checkIfAdmin, multerUpload.single('image')], SettingsController.uploadLogo);
router.put('/settings/update-user', checkIfUser, SettingsController.updateProfile);
router.get('/settings/users', checkIfSuperAdmin, SettingsController.users);
router.get('/settings/users-total', checkIfSuperAdmin, SettingsController.usersTotal);
router.put('/settings/update-password', checkIfUser, SettingsController.updatePassword);
router.post('/settings/create-user', checkIfSuperAdmin, SettingsController.createUser);

/**
 * Channels
 */
router.get('/channels', ChannelController.channels);
router.get('/channels/:name', ChannelController.channelByName);
router.post('/channels/create', checkIfAdmin, ChannelController.create);
router.put('/channels/update', checkIfAdmin, ChannelController.update);
router.delete('/channels/delete', checkIfAdmin, ChannelController.delete);
router.post('/channels/reorder', checkIfAdmin, ChannelController.reorder);

/**
 * Posts
 */
router.get('/posts/channel/:channelId', PostController.postsByChannelId);
router.get('/posts/author/:authorId', PostController.postsByAuthorId);
router.get('/posts/follow', withUser, PostController.postsByFollowing);
router.get('/posts/:id', PostController.postById);
router.post('/posts/create', checkIfUser, multerUpload.single('image'), PostController.create);
router.put('/posts/update', checkIfUser, multerUpload.single('image'), PostController.update);
router.delete('/posts/delete', checkIfUser, PostController.delete);
router.post('/posts/pin', checkIfSuperAdmin, PostController.pin);

/**
 * Likes
 */
router.post('/likes/create', checkIfUser, LikeController.create);
router.delete('/likes/delete', checkIfUser, LikeController.delete);

/**
 * Comments
 */
router.post('/comments/create', checkIfUser, CommentController.create);
router.delete('/comments/delete', checkIfUser, CommentController.delete);

/**
 * Notifications
 */
router.get('/notifications', checkIfUser, NotificationController.notificationsByUserId);
router.get('/notifications/author-and-user/:userId', checkIfUser, NotificationController.notificationByAuthorAndUserId);
router.post('/notifications/create', checkIfUser, NotificationController.create);
router.delete('/notifications/delete', checkIfUser, NotificationController.delete);
router.put('/notifications/seen', checkIfUser, NotificationController.updateNotificationSeen);
router.put('/notifications/messages-seen', checkIfUser, NotificationController.updateMessagesNotificationSeen);

/**
 * Follow
 */
router.post('/follow/create', checkIfUser, FollowController.create);
router.delete('/follow/delete', checkIfUser, FollowController.delete);

/**
 * Messages
 */
router.get('/messages', checkIfUser, MessageController.messages);
router.post('/messages/create', checkIfUser, MessageController.create);
router.get('/messages/conversations', checkIfUser, MessageController.conversations);
router.put('/messages/update-seen', checkIfUser, MessageController.updateMessageSeen);

/**
 * Search
 */
router.get('/search/all/:searchQuery', withUser, SearchController.search);
router.get('/search/users/:searchQuery', withUser, SearchController.searchUsers);

export default router;

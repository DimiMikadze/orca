import { Request, Response } from 'express';
import { AuthUser, ErrorCodes, ErrorMessages, UserRole } from '../constants';
import {
  createPost,
  deletePost,
  getFollowedPosts,
  getPostById,
  getPostsByAuthorId,
  getPostsByChannelId,
  pinPost,
  postById,
  updatePost,
} from '../db';
import { deleteFromCloudinary, uploadToCloudinary } from '../utils/cloudinary';
import { IPost } from '../models/post';

const PostController = {
  postsByFollowing: async (req: Request, res: Response<IPost[]>): Promise<Response<IPost[]>> => {
    const authUser = req.user as AuthUser;
    const { offset, limit } = req.query;
    const posts = await getFollowedPosts(authUser?._id, +offset, +limit);
    return res.send(posts);
  },
  postsByChannelId: async (req: Request, res: Response<IPost[]>): Promise<Response<IPost[]>> => {
    const { channelId } = req.params;
    const { offset, limit } = req.query;
    const posts = await getPostsByChannelId(channelId, +offset, +limit);
    return res.send(posts);
  },
  postsByAuthorId: async (req: Request, res: Response<IPost[]>): Promise<Response<IPost[]>> => {
    const { authorId } = req.params;
    const { offset, limit } = req.query;
    const posts = await getPostsByAuthorId(authorId, +offset, +limit);
    return res.send(posts);
  },
  postById: async (req: Request, res: Response<IPost>): Promise<Response<IPost>> => {
    const { id } = req.params;
    const post = await getPostById(id);
    return res.send(post);
  },
  create: async (req: Request, res: Response<IPost | string>): Promise<Response<IPost>> => {
    const authUser = req.user as AuthUser;
    const { title, channelId } = req.body;
    const image = req.file;

    if (!title && !image) {
      return res.status(400).send('Post title or image is required.');
    }
    if (image && !image.mimetype.match(/image-*/)) {
      return res.status(ErrorCodes.Bad_Request).send('Please upload an image.');
    }

    let imageUrl: string;
    let imagePublicId: string;
    if (image) {
      const uploadImage = await uploadToCloudinary(image, 'post');
      if (!uploadImage.secure_url) {
        return res.status(ErrorCodes.Internal).send(ErrorMessages.Generic);
      }
      imageUrl = uploadImage.secure_url;
      imagePublicId = uploadImage.public_id;
    }
    const newPost: IPost = await createPost(title, imageUrl, imagePublicId, channelId, authUser._id);
    return res.send(newPost);
  },
  update: async (req: Request, res: Response<IPost | string>): Promise<Response<IPost>> => {
    const authUser = req.user as AuthUser;
    const { postId, title, imageToDeletePublicId, channelId } = req.body;
    const image = req.file;

    // Super Admins can update another user's post.
    if (authUser.role !== UserRole.SuperAdmin) {
      // Check if the post author is updating the post.
      const post: IPost = await postById(postId);
      if (post.author.toString() !== authUser._id.toString()) {
        return res.status(ErrorCodes.Bad_Request).send('Unauthorized');
      }
    }

    // If the imageToDeletePublicId is defined, we need to remove an existing image.
    if (imageToDeletePublicId) {
      const deleteImage = await deleteFromCloudinary(imageToDeletePublicId);
      if (deleteImage.result !== 'ok') {
        return res.status(ErrorCodes.Internal).send(ErrorMessages.Generic);
      }
    }

    // If an image is defined, we need to upload a new image.
    let imageUrl: string;
    let imagePublicId: string;
    if (image) {
      const uploadImage = await uploadToCloudinary(image, 'post');
      if (!uploadImage.secure_url) {
        return res.status(ErrorCodes.Internal).send(ErrorMessages.Generic);
      }
      imageUrl = uploadImage.secure_url;
      imagePublicId = uploadImage.public_id;
    }

    const updatedPost: IPost = await updatePost({
      postId,
      title,
      imageUrl,
      imagePublicId,
      imageToDeletePublicId,
      channelId,
    });
    return res.send(updatedPost);
  },
  delete: async (req: Request, res: Response<IPost | string>): Promise<Response<IPost>> => {
    const { id, imagePublicId } = req.body;
    const authUser = req.user as AuthUser;

    // Super Admins can delete another user's post.
    if (authUser.role !== UserRole.SuperAdmin) {
      // Check if the post author is removing the post.
      const post: IPost = await postById(id);
      if (post.author.toString() !== authUser._id.toString()) {
        return res.status(ErrorCodes.Bad_Request).send(ErrorMessages.Generic);
      }
    }

    if (imagePublicId) {
      const deleteImage = await deleteFromCloudinary(imagePublicId);
      if (deleteImage.result !== 'ok') {
        return res.status(ErrorCodes.Internal).send(ErrorMessages.Generic);
      }
    }

    const deletedPost: IPost = await deletePost(id);
    return res.send(deletedPost);
  },
  pin: async (req: Request, res: Response<IPost>): Promise<Response<IPost>> => {
    const { id, pinned } = req.body;
    const updatedPost: IPost = await pinPost(id, pinned);
    return res.send(updatedPost);
  },
};

export default PostController;

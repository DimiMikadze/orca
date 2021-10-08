import { ChangeEvent, FC, FormEvent, useState, Fragment } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation, useQueryClient } from 'react-query';
import { CloseIcon } from '../ui/icons';
import PostImageUpload from './PostImageUpload';
import { MaxImageSize, Channel } from '../../constants';
import { TextAreaAutoSize, Spacing, Button, Modal, Select, Avatar } from '../ui';
import {
  Options,
  OptionsText,
  SelectContainer,
  ImagePreviewContainer,
  CloseIconContainer,
  ImagePreview,
} from './style';
import { RootState } from '../../store';
import { AlertTypes, openAlert } from '../../store/alert';
import { updateCache } from './cache';

const config = {
  headers: {
    'content-type': 'multipart/form-data',
  },
};

const createPost = async ({ title, image, channelId }) => {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('image', image);
  formData.append('channelId', channelId);

  const newPost = await axios.post('/posts/create', formData, config);
  return newPost.data;
};

const updatePost = async ({ postId, title, image, imageToDeletePublicId, channelId }) => {
  const formData = new FormData();
  formData.append('postId', postId);
  formData.append('title', title);
  formData.append('image', image);
  formData.append('channelId', channelId);
  formData.append('imageToDeletePublicId', imageToDeletePublicId);

  const updatedPost = await axios.put('/posts/update', formData, config);
  return updatedPost.data;
};

interface PostCreateProps {
  isPostCreateOpen: boolean;
  postId?: string;
  postTitle?: string;
  postImage?: string;
  postImagePublicId?: string;
  channelId?: string;
  queryKey: any;
  closePostCreate: () => void;
}

const PostCreate: FC<PostCreateProps> = ({
  isPostCreateOpen,
  closePostCreate,
  channelId,
  postId,
  postTitle,
  postImage,
  queryKey,
  postImagePublicId,
}) => {
  const authUser = useSelector((state: RootState) => state.auth.user);
  const queryClient = useQueryClient();
  const channels: Channel[] = queryClient.getQueryData(['channels']);
  const dispatch = useDispatch();
  const initialState = {
    title: postTitle || '',
    channelId: channelId ? channelId : channels && channels[0]?._id,
    image: null,
  };
  const [formValues, setFormValues] = useState<{ title: string; channelId: string; image: File }>(initialState);
  const [existingPostImage, setExistingPostImage] = useState(postImage);
  const { mutateAsync: createPostMutation, isLoading: isPostCreateLoading } = useMutation(createPost);
  const { mutateAsync: updatePostMutation, isLoading: isPostUpdateLoading } = useMutation(updatePost);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // If we don't have a post id, it means we need to create one.
      if (!postId) {
        const post = await createPostMutation({ ...formValues });
        updateCache({
          queryKey,
          operation: 'create',
          queryClient,
          post,
          notAddingToCurrentChannel: channelId !== formValues.channelId,
        });
        notify('added');
        close();
      } else {
        let imageToDeleteId = '';
        // If a user has uploaded a new photo, we need to delete the previous one.
        if (formValues.image) {
          imageToDeleteId = postImagePublicId || '';
          // If existingPostImage and postImagePublicId are not defined, the user has deleted a photo.
        } else if (!existingPostImage) {
          imageToDeleteId = postImagePublicId || '';
        }
        const updatedPost = await updatePostMutation({
          postId,
          imageToDeletePublicId: imageToDeleteId,
          title: formValues.title,
          image: formValues.image || '', // We need to upload an image only if a user has added a new one.
          channelId: formValues.channelId,
        });
        updateCache({
          queryKey,
          operation: 'update',
          queryClient,
          post: updatedPost,
          notAddingToCurrentChannel: channelId !== formValues.channelId,
        });
        notify('updated');
        close();
      }
    } catch (error) {
      console.error('An error occurred while creating a post: ', error);
    }
  };

  const notify = (operation: 'added' | 'updated') => {
    const channel = channels.find((c) => c._id === formValues.channelId);
    const addedMessage = `The Post has been successfully added to the ${channel.name} channel.`;
    const updatedMessage = 'The Post has been successfully updated.';
    dispatch(
      openAlert({
        type: AlertTypes.Success,
        message: operation === 'added' ? addedMessage : updatedMessage,
      })
    );
  };

  const close = () => {
    setFormValues(initialState);
    closePostCreate();
  };

  const handleChange = (e: FormEvent<HTMLInputElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormValues({ ...formValues, [name]: value });
  };

  const isFormValid = () => {
    const { title, image } = formValues;
    return title || image;
  };

  const handlePostImageUpload = (e: ChangeEvent) => {
    const file = (e.target as HTMLInputElement).files[0];

    if (!file) return;

    if (!file.type.match(/image-*/)) return;

    if (file.size >= MaxImageSize.Post) {
      alert(`File size should be less than ${MaxImageSize.Post / 1000000}MB`);
      return;
    }

    setFormValues({ ...formValues, image: file });
    (e.target as HTMLInputElement).value = null;
  };

  const closeImagePreview = () => {
    setFormValues({ ...formValues, image: null });
    setExistingPostImage('');
  };

  const renderImagePreview = () => {
    if (formValues.image || existingPostImage) {
      return (
        <Spacing bottom="sm">
          <ImagePreviewContainer>
            <CloseIconContainer>
              <Button type="button" ghost onClick={closeImagePreview}>
                <CloseIcon color="white" />
              </Button>
            </CloseIconContainer>
            <ImagePreview src={formValues.image ? URL.createObjectURL(formValues.image) : existingPostImage} />
          </ImagePreviewContainer>
        </Spacing>
      );
    }
  };

  return (
    <Modal title={postId ? 'Edit Post' : 'Create Post'} isOpen={isPostCreateOpen} close={close}>
      <form onSubmit={handleSubmit}>
        <SelectContainer>
          <Avatar size={1.25} image={authUser.image} />
          <Spacing left="sm">
            <Select onChange={handleChange} name="channelId" defaultValue={channelId && channelId}>
              {channels?.map((channel: Channel) => (
                <Fragment key={channel._id}>
                  <option value={channel._id}>{channel.name}</option>
                </Fragment>
              ))}
            </Select>
          </Spacing>
        </SelectContainer>

        <Spacing top="xs" bottom="xxs">
          <TextAreaAutoSize
            name="title"
            autoFocus
            onChange={handleChange}
            value={formValues.title}
            placeholder={`What do you want to talk about, ${authUser.fullName}?`}
          />
        </Spacing>

        {renderImagePreview()}

        <Options>
          <OptionsText>Add to your post</OptionsText>
          <PostImageUpload label="Photo" handleChange={handlePostImageUpload} />
        </Options>

        <Button
          fullWidth
          type="submit"
          color="primary"
          disabled={!isFormValid() || isPostCreateLoading || isPostUpdateLoading}
        >
          Post
        </Button>
      </form>
    </Modal>
  );
};

export default PostCreate;

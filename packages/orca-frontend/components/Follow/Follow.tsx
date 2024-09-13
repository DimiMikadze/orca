import axios from 'axios';
import debounce from 'lodash/debounce';
import { FC } from 'react';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { AuthUser } from '../../constants';
import { NotificationType } from '../../constants/Notification';
import { RootState } from '../../store';
import { addUserFollowing, AuthActionTypes, removeUserFollowing } from '../../store/auth';
import { useNotifications } from '../../utils';
import { Root } from './style';
import { Dispatch } from 'redux';

const createFollow = async ({ userId }) => {
  const follow = await axios.post('/follow/create', { userId });
  return follow.data;
};

const deleteFollow = async (id: string) => {
  const follow = await axios.delete('/follow/delete', { data: { id } });
  return follow.data;
};

interface FollowProps {
  user: AuthUser;
  queryKey: any;
}

const Follow: FC<FollowProps> = ({ user, queryKey }) => {
  const authUser = useSelector((state: RootState) => state.auth.user);
  const isFollowing: any = authUser.following.find((f: any) => f.user === user._id);
  const dispatch = useDispatch<Dispatch<AuthActionTypes>>();

  const { createNotification, deleteNotification } = useNotifications();
  const { mutateAsync: createFollowMutation } = useMutation(createFollow);
  const { mutateAsync: deleteFollowMutation } = useMutation(deleteFollow);

  const followMutation = async () => {
    const follow = isFollowing
      ? await deleteFollowMutation(isFollowing._id)
      : await createFollowMutation({ userId: user._id });
    if (isFollowing) {
      dispatch(removeUserFollowing(follow._id));
    } else {
      dispatch(addUserFollowing(follow));
    }

    if (isFollowing) {
      const notification: any = user.notifications.find((n: any) => n?.follow?._id === isFollowing?._id);
      if (notification) {
        deleteNotification({ id: notification._id, postId: null, user, queryKey });
      }
    } else {
      createNotification({
        user: user,
        postId: null,
        notificationType: NotificationType.FOLLOW,
        notificationTypeId: follow._id,
        queryKey,
      });
    }
  };

  return (
    <Root onClick={debounce(followMutation, 200)} isFollowing={isFollowing}>
      {isFollowing ? 'Following' : 'Follow'}
    </Root>
  );
};

export default Follow;

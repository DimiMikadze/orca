'use client';

import axios from 'axios';
import { FC, useEffect } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../../components/Layout/Layout';
import Notification from '../../components/Notification';
import Seo from '../../components/Seo';
import { Button } from '../../components/ui/Button';
import Container from '../../components/ui/Container/Container';
import Empty from '../../components/ui/Empty';
import Skeleton from '../../components/ui/Skeleton';
import Spacing from '../../components/ui/Spacing';
import CommunityIcon from '../../components/ui/icons/CommunityIcon';
import { RootState } from '../../store';
import { AuthActionTypes, PopupType, openAuthPopup } from '../../store/auth';
import { Dispatch } from 'redux';

export const updateNotificationSeen = async (): Promise<any> => {
  const { data } = await axios.put('/notifications/seen');
  return data;
};

const fetchUserNotifications = async (): Promise<any> => {
  const { data } = await axios.get('/notifications');
  return data;
};

const NotificationsPage: FC = () => {
  const authUser = useSelector((state: RootState) => state.auth.user);
  const { data: notifications, isFetching } = useQuery('fetchUserNotifications', fetchUserNotifications, {
    enabled: authUser !== null,
  });
  const { mutateAsync } = useMutation(updateNotificationSeen);
  const dispatch = useDispatch<Dispatch<AuthActionTypes>>();

  const openAuthModal = () => {
    dispatch(openAuthPopup(PopupType.Sign_Up));
  };

  useEffect(() => {
    if (authUser?._id) {
      mutateAsync();
    }
  }, [mutateAsync, authUser]);

  const isEmpty = (!isFetching && !notifications) || notifications?.length === 0;

  if (isFetching) {
    return (
      <Layout hideRightSidebar containerMaxWidth="md">
        <Container shadow="sm" bgColor="white" maxWidth="lg">
          <Skeleton height={40} count={14} bottom="xs" />
        </Container>
      </Layout>
    );
  }

  if (!authUser) {
    return (
      <Layout containerMaxWidth="md">
        <Container centered padding="lg" bgColor="white" shadow="sm">
          <CommunityIcon width="40" />

          <Spacing top="sm">
            {!authUser && (
              <Button inline onClick={openAuthModal} color="primary">
                Sign up
              </Button>
            )}

            <Spacing top="md">
              {/* <Text>To get notifications when someone interacts with your post, follows, or messages you.</Text> */}
              <div>To get notifications when someone interacts with your post, follows, or messages you.</div>
            </Spacing>
          </Spacing>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout hideRightSidebar containerMaxWidth="md">
      <Container shadow="sm" bgColor="white" maxWidth="lg">
        <Seo title="Notifications" />

        {isEmpty && authUser !== null && <Empty>You don&apos;t have notifications yet.</Empty>}

        {notifications?.map((notification) => <Notification key={notification._id} notification={notification} />)}
      </Container>
    </Layout>
  );
};

export default NotificationsPage;

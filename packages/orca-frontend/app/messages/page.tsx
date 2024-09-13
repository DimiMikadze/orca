'use client';

import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../../components/Layout';
import { Messages } from '../../components/Messages';
import Seo from '../../components/Seo';
import { Button, Container, Spacing, Text } from '../../components/ui';
import { CommunityIcon } from '../../components/ui/icons';
import { RootState } from '../../store';
import { AuthActionTypes, openAuthPopup, PopupType } from '../../store/auth';
import { Dispatch } from 'redux';

const MessagesPage: FC = () => {
  const authUser = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<Dispatch<AuthActionTypes>>();

  const openAuthModal = () => {
    dispatch(openAuthPopup(PopupType.Sign_Up));
  };

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
              <Text>To chat with community members.</Text>
            </Spacing>
          </Spacing>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout hideRightSidebar containerMaxWidth="md" marginTop="none">
      <Seo title="Messages" />
      <Messages />
    </Layout>
  );
};

export default MessagesPage;

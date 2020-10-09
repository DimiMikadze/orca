import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { useQuery } from '@apollo/client';

import { Loading } from 'components/Loading';
import { CloseIcon } from 'components/icons';
import CreateComment from 'components/CreateComment';
import { Spacing } from 'components/Layout';
import NotFound from 'components/NotFound';
import Head from 'components/Head';
import PostPopupInfo from './PostPopupInfo';
import PostPopupComments from './PostPopupComments';
import PostPopupOptions from './PostPopupOptions';

import { GET_POST } from 'graphql/post';

const Root = styled.div`
  margin: 0 auto;
  margin: ${(p) => !p.usedInModal && p.theme.spacing.lg} 0;
  box-shadow: ${(p) => p.theme.shadows.sm};
  border-radius: ${(p) => p.theme.radius.sm};
  z-index: ${(p) => (p.usedInModal ? p.theme.zIndex.xl : 'inherit')};
  overflow: hidden;
  width: 100%;

  @media (min-width: ${(p) => p.theme.screen.md}) {
    width: auto;
  }
`;

const Container = styled.div`
  max-height: ${(p) => (p.usedInModal ? '600px' : 'auto')};
  overflow-y: ${(p) => (p.usedInModal ? 'auto' : 'inherit')};
  max-width: 1300px;
  background-color: ${(p) => p.theme.colors.white};
  display: flex;
  flex-direction: column;

  @media (min-width: ${(p) => p.theme.screen.md}) {
    flex-direction: ${(p) => (p.usedInModal ? 'row' : 'column')};
    max-height: ${(p) => (p.usedInModal ? '600px' : 'auto')};
    overflow-y: inherit;
  }
`;

const Left = styled.div`
  display: flex;
  flex-direction: row;
  align-items: ${(p) => (p.usedInModal ? 'center' : 'flex-start')};
  justify-content: center;
  background-color: ${(p) => p.theme.colors.black};
  width: 100%;

  @media (min-width: ${(p) => p.theme.screen.md}) {
    max-width: 1000px;
    min-width: 500px;
    height: ${(p) => (p.usedInModal ? '600px' : 'auto')};
  }
`;

const Image = styled.img`
  display: block;
  max-width: 100%;
  width: ${(p) => !p.usedInModal && '100%'};
  max-height: ${(p) => (p.usedInModal ? '600px' : '100%')};
`;

const Right = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  width: 100%;
  background-color: ${(p) => p.theme.colors.white};

  @media (min-width: ${(p) => p.theme.screen.md}) {
    width: ${(p) => (p.usedInModal ? '360px' : '100%')};
    min-width: 360px;
  }
`;

const CloseModal = styled.div`
  display: block;
  position: fixed;
  right: 20px;
  top: 15px;
  cursor: pointer;
`;

const Title = styled.div`
  font-size: ${(p) => p.theme.font.size.xs};
  border-bottom: 1px solid ${(p) => p.theme.colors.border.light};
  padding: ${(p) => p.theme.spacing.xs};
`;

/**
 * Displays post with comments and options
 * Meant to be used in Modal or Page component
 */
const PostPopup = ({ id, closeModal, usedInModal }) => {
  const { data, loading, error } = useQuery(GET_POST, {
    variables: { id },
  });

  if (loading) return <Loading top="lg" />;
  if (error) return <NotFound />;

  const post = data.getPost;

  return (
    <Root usedInModal={usedInModal}>
      <Head title={post.title ? post.title : `${post.author.username}'s post`} />

      {closeModal && (
        <CloseModal onClick={closeModal}>
          <CloseIcon width="16" color="white" />
        </CloseModal>
      )}

      <Container usedInModal={usedInModal}>
        <Left usedInModal={usedInModal}>
          <Image src={post.image} usedInModal={usedInModal} />
        </Left>

        <Right usedInModal={usedInModal}>
          <Spacing>
            <PostPopupInfo author={post.author} />

            {post.title && <Title>{post.title}</Title>}

            <PostPopupComments
              usedInModal={usedInModal}
              comments={post.comments}
              postId={post.id}
              postAuthor={post.author}
            />
          </Spacing>

          <Spacing>
            <PostPopupOptions postId={post.id} postAuthor={post.author} postLikes={post.likes} />

            <CreateComment post={post} />
          </Spacing>
        </Right>
      </Container>
    </Root>
  );
};

PostPopup.propTypes = {
  id: PropTypes.string.isRequired,
  closeModal: PropTypes.func,
  usedInModal: PropTypes.bool.isRequired,
};

PostPopup.defaultProps = {
  usedInModal: true,
};

export default withRouter(PostPopup);

import React, { FC, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import PostCardPopover from './PostCardPopover';
import {
  Root,
  Image,
  TitleContainer,
  Title,
  SeeMore,
  Top,
  Author,
  Name,
  CreatedAt,
  LikeAndCommentsCount,
  LikeAndCommentButtons,
  StyledButton,
  Share,
  Comments,
} from './style';
import { Spacing, Avatar, Button, Link, Text } from '../../ui';
import { Comment, CommentCreate } from '../../Comment';
import { CommentIcon, PinnedIcon, ShareIcon } from '../../ui/icons';
import { RootState } from '../../../store';
import { Post, UserRole } from '../../../constants';
import { timeAgo } from '../../../utils';
import useClickOutside from '../../../utils/useClickOutside';
import PostCardShare from './PostCardShare';
import PostCreate from '../../PostCreate';
import Like from '../../Like';

interface PostCardProps {
  post: Post;
  queryKey: any;
  displayChannelName?: boolean;
  isCommentsOpen?: boolean;
  refetch?: any;
}

const PostCard: FC<PostCardProps> = ({ post, queryKey, displayChannelName, isCommentsOpen, refetch }) => {
  const authUser = useSelector((state: RootState) => state.auth.user);
  const [isTitleExpanded, setIsTitleExpanded] = useState(false);
  const [isCommentSectionOpen, setIsCommentSectionOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isPostCreateOpen, setIsPostCreateOpen] = useState(false);
  const sharePopoverRef = useRef(null);
  const shareButtonRef = useRef(null);
  useClickOutside([sharePopoverRef, shareButtonRef], isShareOpen, () => {
    toggleShare();
  });

  const titleRef = useRef(null);
  const TITLE_INITIAL_HEIGHT = 222;

  const likesLength = post.likes.length;
  const commentsLength = post.comments.length;
  const likes = likesLength > 0 ? likesLength + ' likes' : null;
  const comments = commentsLength > 0 ? commentsLength + ' comments' : null;
  const hasLiked = post.likes.find((post: any) => post.user === authUser?._id);

  useEffect(() => {
    if (titleRef.current && titleRef.current.clientHeight > TITLE_INITIAL_HEIGHT) {
      setIsTitleExpanded(true);
    }
  }, []);

  const expandTitle = () => setIsTitleExpanded(false);

  const toggleShare = () => setIsShareOpen(!isShareOpen);

  const toggleCommentSection = () => setIsCommentSectionOpen(!isCommentSectionOpen);

  const showComments = isCommentSectionOpen || isCommentsOpen;

  return (
    <Root>
      {authUser && isPostCreateOpen && (
        <PostCreate
          isPostCreateOpen={isPostCreateOpen}
          closePostCreate={() => setIsPostCreateOpen(false)}
          postId={post._id}
          postTitle={post.title}
          postImage={post.image}
          postImagePublicId={post.imagePublicId}
          channelId={post.channel?._id}
          queryKey={queryKey}
        />
      )}

      <Top>
        <Author>
          <Link disableBorderOnHover href={`/profile/${post.author._id}`}>
            <Avatar image={post.author?.image} size={1.25} />
          </Link>

          <Spacing left="xs">
            <Link href={`/profile/${post.author._id}`} color="text">
              <Name>{post.author.fullName} </Name>
            </Link>
            <CreatedAt>
              {post.pinned && (
                <>
                  <Text size="tiny" color="textSecondary">
                    <PinnedIcon /> Pinned &middot;
                  </Text>{' '}
                </>
              )}
              {timeAgo(post.createdAt)}
              {displayChannelName && (
                <>
                  {' '}
                  &middot;{' '}
                  <Link color="textSecondary" size="tiny" href={`/channel/${post.channel?.name}`}>
                    {post.channel?.name}
                  </Link>{' '}
                </>
              )}
            </CreatedAt>
          </Spacing>
        </Author>

        {(post.author._id === authUser?._id || authUser?.role === UserRole.SuperAdmin) && (
          <PostCardPopover
            queryKey={queryKey}
            postId={post._id}
            channelId={post.channel?._id}
            openPostCreate={() => setIsPostCreateOpen(true)}
            imagePublicId={post.imagePublicId}
            pinned={post.pinned}
            refetch={refetch}
          />
        )}
      </Top>
      {post.title && (
        <>
          <TitleContainer isTitleExpanded={isTitleExpanded} initialHeight={TITLE_INITIAL_HEIGHT}>
            <Link color="text" href={`/post/${post._id}`} disableBorderOnHover>
              <Title ref={titleRef}>{post.title}</Title>
            </Link>
          </TitleContainer>

          <SeeMore isTitleExpanded={isTitleExpanded}>
            <Button ghost size="xs" onClick={expandTitle}>
              See more
            </Button>
          </SeeMore>
        </>
      )}
      {post.image && (
        <Link href={`/post/${post._id}`} disableBorderOnHover fullWidth block>
          <Image alt="post" src={post.image} />
        </Link>
      )}
      <LikeAndCommentsCount hadData={likes || comments}>
        {likes}
        <div />

        <Button ghost size="xs" onClick={isCommentsOpen ? null : toggleCommentSection}>
          {comments}
        </Button>
      </LikeAndCommentsCount>
      <LikeAndCommentButtons isCommentSectionOpen={isCommentSectionOpen}>
        <Like queryKey={queryKey} post={post} hasLiked={hasLiked} fullWidth withText />

        <StyledButton
          fullWidth
          radius="none"
          text
          size="xs"
          weight="bold"
          onClick={isCommentsOpen ? null : toggleCommentSection}
        >
          <CommentIcon />
          <Spacing left="xxs" /> Comment
        </StyledButton>

        <Share ref={shareButtonRef}>
          {isShareOpen && (
            <PostCardShare
              ref={sharePopoverRef}
              setIsShareOpen={setIsShareOpen}
              url={`${window.location.host}/post/${post._id}`}
              title={post.title}
            />
          )}
          <StyledButton fullWidth radius="none" text size="xs" weight="bold" onClick={toggleShare}>
            <ShareIcon />
            <Spacing left="xxs" /> Share
          </StyledButton>
        </Share>
      </LikeAndCommentButtons>
      {showComments && (
        <Comments>
          <Spacing top="xs">
            {authUser && <CommentCreate queryKey={queryKey} autoFocus={isCommentSectionOpen} post={post} />}
          </Spacing>

          {post.comments.map((comment: any) => (
            <Comment key={comment._id} queryKey={queryKey} post={post} author={comment.author} comment={comment} />
          ))}
        </Comments>
      )}
    </Root>
  );
};

export default PostCard;

import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import {
  Root,
  HeadingContainer,
  Heading,
  SearchContainer,
  UserContainer,
  User,
  Info,
  FullNameUnSeen,
  FullName,
  UnSeen,
  LastMessage,
} from './style';
import { ButtonLink, Avatar, Spacing, Skeleton } from '../../ui';
import Search from '../../Search';
import { RootState } from '../../../store';

interface MessagesUsers {
  isFetching: boolean;
  onSearchItemClick: (user: any) => void;
  conversations: any[];
  userId?: string;
}

const MessagesUsers: FC<MessagesUsers> = ({ onSearchItemClick, conversations, userId, isFetching }) => {
  const authUser = useSelector((state: RootState) => state.auth.user);

  const renderSkeleton = () => {
    return <Skeleton count={3} height={50} top="xs" />;
  };

  const renderConversations = () => {
    return conversations.map((conversation: any) => {
      const person = conversation.receiver._id === authUser._id ? conversation.sender : conversation.receiver;

      return (
        <ButtonLink href={`/messages/${person._id}`} fullWidth key={conversation._id}>
          <User active={person._id === userId}>
            <Avatar isOnline={conversation.isOnline} image={person.image} size={1.5} />

            <Info>
              <FullNameUnSeen>
                <FullName>{person.fullName}</FullName>

                {!conversation.seen && conversation.sender._id !== authUser._id && <UnSeen />}
              </FullNameUnSeen>

              <LastMessage>
                {conversation.sender._id === authUser._id && conversation.message && 'You:'} {conversation.message}
              </LastMessage>
            </Info>
          </User>
        </ButtonLink>
      );
    });
  };

  return (
    <Root>
      <HeadingContainer>
        <Heading>Messages</Heading>
      </HeadingContainer>

      <SearchContainer>
        <Search radius="none" onlyUsers onItemClick={onSearchItemClick} placeholder="Search members" hideBorder />
      </SearchContainer>

      <UserContainer>
        {isFetching ? renderSkeleton() : renderConversations()}
        <Spacing top="xxs" />
      </UserContainer>
    </Root>
  );
};

export default MessagesUsers;

import axios from 'axios';
import React, { FC } from 'react';
import { useQuery } from 'react-query';
import { Avatar, H3, Spacing, Link, Text, Skeleton } from '../ui';
import { Root, PersonContainer, Person, Heading } from './style';

const fetchOnlineUsers = async () => {
  const { data } = await axios.get('/users/online-users');
  return data;
};

const fetchNewMembers = async () => {
  const { data } = await axios.get('/users/new-members');
  return data;
};

const REFETCH_INTERVAL = 10000;

const RightSideBar: FC = () => {
  const {
    data: onlineMembers,
    isFetching: isFetchingOnlineMembers,
    isRefetching: isReFetchingOnlineMembers,
  } = useQuery('onlineUsers', fetchOnlineUsers, {
    refetchInterval: REFETCH_INTERVAL,
  });
  const { data: newMembers, isFetching: isFetchingNewMembers } = useQuery('newMembers', fetchNewMembers);

  const noOnlineMembers = !onlineMembers || onlineMembers?.length === 0;
  const noNewMembers = !newMembers || newMembers?.length === 0;

  const renderList = (list: any, displayIsOnline: boolean) => {
    return list.map((user: any) => (
      <PersonContainer key={user._id}>
        <Link href={`/profile/${user._id}`} disableBorderOnHover>
          <Person>
            <Avatar
              size={1.1}
              image={user.image}
              fullName={user.fullName}
              isOnline={displayIsOnline ? user.isOnline : false}
            />
            <Spacing right="xs" />
          </Person>
        </Link>
      </PersonContainer>
    ));
  };

  return (
    <Root>
      <Heading>
        <H3>New Members</H3>
      </Heading>

      {!isFetchingNewMembers && noNewMembers && (
        <Spacing top="sm">
          <Text color="textSecondary">No new members.</Text>
        </Spacing>
      )}

      {newMembers && <Spacing top="xs" />}

      {isFetchingNewMembers ? <Skeleton count={3} height={36} top="xs" /> : newMembers && renderList(newMembers, false)}

      <Spacing top="md">
        <Heading>
          <H3>Online Members</H3>
        </Heading>
      </Spacing>

      {!isFetchingOnlineMembers && noOnlineMembers && (
        <Spacing top="sm">
          <Text color="textSecondary">No members are online.</Text>
        </Spacing>
      )}

      {onlineMembers && <Spacing top="xs" />}

      {isFetchingOnlineMembers && !isReFetchingOnlineMembers ? (
        <Skeleton count={3} height={36} top="xs" />
      ) : (
        onlineMembers && renderList(onlineMembers, true)
      )}
    </Root>
  );
};

export default RightSideBar;

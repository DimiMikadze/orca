import axios from 'axios';
import React, { FC } from 'react';
import { useQuery } from 'react-query';
import { Avatar, H3, Spacing, Link, Text } from '../ui';
import { Root, PersonContainer, Person, Heading } from './style';

const fetchOnlineUsers = async () => {
  const { data } = await axios.get('/users/online-users');
  return data;
};

const REFETCH_INTERVAL = 10000;

const RightBar: FC = () => {
  const { data } = useQuery('onlineUsers', fetchOnlineUsers, { refetchInterval: REFETCH_INTERVAL });

  const isEmpty = !data || data?.length === 0;

  return (
    <Root>
      <Heading>
        <H3>Online Members</H3>
      </Heading>

      {isEmpty && (
        <Spacing top="sm">
          <Text color="textSecondary">Oops, no members are online.</Text>
        </Spacing>
      )}

      {data && <Spacing top="xs" />}

      {data &&
        data.map((user: any) => (
          <PersonContainer key={user._id}>
            <Link href={`/profile/${user._id}`} disableBorderOnHover>
              <Person>
                <Avatar size={1.1} image={user.image} isOnline={user.isOnline} fullName={user.fullName} />
                <Spacing right="xs" />
              </Person>
            </Link>
          </PersonContainer>
        ))}
    </Root>
  );
};

export default RightBar;

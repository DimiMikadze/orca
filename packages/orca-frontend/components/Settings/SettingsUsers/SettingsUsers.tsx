import { FC } from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
import { DataLimit, UserRole } from '../../../constants';
import { useInfiniteScroll, timeAgo } from '../../../utils';
import { Root, Table, Tr, Th, Td, Top, Title, Count } from './style';
import { LoadingDots, Container, Empty, Spacing, H2, Divider } from '../../../components/ui';
import { CloseIcon, SuccessIcon, BanIcon } from '../../ui/icons';
import SettingsPopover from './SettingsPopover';
import SettingsCreateUser from '../SettingsCreateUser/SettingsCreateUser';

const fetchUsers = async ({ pageParam = 0 }) => {
  const { data } = await axios.get(`/settings/users?offset=${pageParam}&limit=${DataLimit.AdminUsers}`);
  return data;
};

const fetchUsersTotal = async () => {
  const { data } = await axios.get('/settings/users-total');
  return data;
};

const SettingsUsers: FC = () => {
  const { data: usersTotal } = useQuery('usersTotal', fetchUsersTotal);
  const {
    data: users,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteScroll({
    key: 'adminUsers',
    apiCall: fetchUsers,
    dataLimit: DataLimit.AdminUsers,
  });

  const isEmpty = !users?.pages[0] || users.pages[0].length === 0;

  if (isFetching && !isFetchingNextPage) {
    return (
      <Root>
        <H2>Community Users</H2>
        <Divider spacing="sm" />

        <LoadingDots />
      </Root>
    );
  }

  if (isEmpty) {
    return (
      <Root>
        <H2>Community Users</H2>
        <Divider spacing="sm" />

        <Container centered padding="lg">
          <Empty>
            <div>Oops! There are no users yet.</div>
          </Empty>
        </Container>
      </Root>
    );
  }

  const renderUserStatus = (emailVerified: boolean, banned: boolean) => {
    if (banned) {
      return banned && <BanIcon width="13" color="error" />;
    }

    return emailVerified ? <SuccessIcon width="13" /> : <CloseIcon width="13" color="error" />;
  };

  return (
    <Root>
      <H2>Community Users</H2>
      <Divider spacing="sm" />

      {usersTotal && (
        <Top>
          <div>
            <Spacing inline right="lg">
              <Title>Total</Title> <Count>{usersTotal.total}</Count>
            </Spacing>
            <Spacing inline right="lg">
              <Title>Verified</Title> <Count>{usersTotal.verified}</Count>
            </Spacing>
            <Spacing inline>
              <Title>Not Verified</Title> <Count>{usersTotal.total - usersTotal.verified}</Count>
            </Spacing>
          </div>
          <div>
            <SettingsCreateUser />
          </div>
        </Top>
      )}

      <Table>
        <thead>
          <Tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Status</Th>
            <Th>Created</Th>
          </Tr>
        </thead>

        {users?.pages?.map((users: any, i: any) => {
          return (
            <tbody key={i}>
              {users?.map((user: any) => (
                <Tr key={user._id}>
                  <Td>{user.fullName}</Td>
                  <Td>{user.email}</Td>
                  <Td>
                    <Spacing left="sm">{renderUserStatus(user.emailVerified, user.banned)}</Spacing>
                  </Td>
                  <Td>{timeAgo(user.createdAt)}</Td>
                  <Td>
                    {user.role !== UserRole.SuperAdmin && <SettingsPopover userId={user._id} banned={user.banned} />}
                  </Td>
                </Tr>
              ))}
            </tbody>
          );
        })}
      </Table>
      {isFetchingNextPage && <LoadingDots />}
    </Root>
  );
};

export default SettingsUsers;

import { FC, FormEvent, useState } from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
import { DataLimit, UserRole } from '../../../constants';
import { useInfiniteScroll, timeAgo } from '../../../utils';
import {
  TableContainer,
  Table,
  Tr,
  Th,
  Td,
  Top,
  Count,
  Title,
  SearchInput,
  SearchContainer,
  SearchClearButton,
  Form,
} from './style';
import { LoadingDots, Container, Empty, Spacing, H2, Divider } from '../../../components/ui';
import { CloseIcon, SuccessIcon, GoogleIcon, GithubIcon, FacebookIcon } from '../../ui/icons';
import SettingsPopover from './SettingsPopover';
import SettingsCreateUser from '../SettingsCreateUser/SettingsCreateUser';

const fetchUsers = async ({ queryKey, pageParam = 0 }) => {
  const [, searchQuery] = queryKey;
  const { data } = await axios.get(
    `/settings/users?offset=${pageParam}&limit=${DataLimit.AdminUsers}&searchQuery=${searchQuery}`
  );
  return data;
};

const fetchUsersTotal = async () => {
  const { data } = await axios.get('/settings/users-total');
  return data;
};

const SettingsUsers: FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { data: usersTotal, isFetching: isFetchingTotal } = useQuery('usersTotal', fetchUsersTotal);
  const {
    data: users,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteScroll({
    key: ['adminUsers', searchQuery],
    apiCall: fetchUsers,
    dataLimit: DataLimit.AdminUsers,
  });

  const onSearchFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchQuery(searchValue);
  };

  const isEmpty = !usersTotal || usersTotal?.total < 1;
  const isSearchResultEmpty = !users?.pages[0] || users.pages[0].length === 0;

  if (isFetchingTotal) {
    return (
      <div>
        <H2>Community Users</H2>
        <Divider spacing="sm" />

        <LoadingDots />
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div>
        <H2>Community Users</H2>
        <Divider spacing="sm" />

        <Container centered padding="lg">
          <Empty>
            <div>Oops! There are no users yet.</div>
          </Empty>
        </Container>
      </div>
    );
  }

  return (
    <div>
      <H2>Community Users</H2>
      <Divider spacing="sm" />

      {usersTotal && (
        <Top>
          <div>
            <Spacing inline right="lg">
              <Title>Total users</Title> <Count>{usersTotal.total}</Count>
            </Spacing>
            <Spacing inline right="lg">
              <Title>Verified</Title> <Count>{usersTotal.verified}</Count>
            </Spacing>
            <Spacing inline>
              <Title>Not Verified</Title> <Count>{usersTotal.total - usersTotal.verified}</Count>
            </Spacing>
          </div>
          <SearchContainer>
            <Form onSubmit={onSearchFormSubmit}>
              <SearchInput
                onChange={(e) => setSearchValue(e.target.value)}
                type="text"
                value={searchValue}
                placeholder="Search by email, name or username"
              />
              {searchQuery && (
                <SearchClearButton ghost onClick={() => setSearchQuery('')}>
                  <CloseIcon width="14" />
                </SearchClearButton>
              )}
            </Form>
            <SettingsCreateUser searchQuery={searchQuery} />
          </SearchContainer>
        </Top>
      )}

      {isFetching && !isFetchingNextPage ? (
        <LoadingDots />
      ) : (
        <>
          {isSearchResultEmpty && searchQuery && `We couldn't find an account for "${searchQuery}"`}
          {!isSearchResultEmpty && (
            <TableContainer>
              <Table>
                <thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Email</Th>
                    <Th>Role</Th>
                    <Th>Email Verified</Th>
                    <Th>Provider</Th>
                    <Th>Created</Th>
                  </Tr>
                </thead>

                {users?.pages?.map((users: any, i: any) => {
                  return (
                    <tbody key={i}>
                      {users?.map((user: any) => (
                        <Tr bgColor={user.banned ? 'error' : ''} key={user._id} title="Banned">
                          <Td>{user.fullName}</Td>
                          <Td>{user.email}</Td>
                          <Td>{user.role}</Td>
                          <Td>
                            <Spacing left="sm">
                              {user.emailVerified ? <SuccessIcon width="14" /> : <CloseIcon width="12" />}
                            </Spacing>
                          </Td>
                          <Td>
                            {user.facebookId && <FacebookIcon color="facebook" width="14" />}{' '}
                            {user.googleId && <GoogleIcon width="14" />} {user.githubId && <GithubIcon width="15" />}
                          </Td>
                          <Td>{timeAgo(user.createdAt)}</Td>
                          <Td>
                            {user.role !== UserRole.SuperAdmin && (
                              <SettingsPopover searchQuery={searchQuery} userId={user._id} banned={user.banned} />
                            )}
                          </Td>
                        </Tr>
                      ))}
                    </tbody>
                  );
                })}
              </Table>
            </TableContainer>
          )}
        </>
      )}
      {isFetchingNextPage && <LoadingDots />}
    </div>
  );
};

export default SettingsUsers;

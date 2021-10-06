import React, { FC, Fragment } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';
import { Wrapper } from '../../components/Members/style';
import MembersCard from '../../components/Members/MembersCard';
import { useInfiniteScroll } from '../../utils';
import { DataLimit } from '../../constants';
import { LoadingDots, Container, Empty, Skeleton } from '../../components/ui';
import Seo from '../../components/Seo';

const fetchUsers = async ({ pageParam = 0 }) => {
  const { data } = await axios.get(
    `/users/get-users?offset=${pageParam}&limit=${DataLimit.Members}&emailVerified=true`
  );
  return data;
};

const MembersPage: FC = () => {
  const { data, isFetching, isFetchingNextPage } = useInfiniteScroll({
    key: 'members',
    apiCall: fetchUsers,
    dataLimit: DataLimit.Members,
  });

  const isEmpty = !data?.pages[0] || data.pages[0].length === 0;

  if (isFetching && !isFetchingNextPage) {
    return (
      <Layout hideRightSidebar containerMaxWidth="md">
        <Wrapper>
          <Skeleton count={12} height={270} />
        </Wrapper>
      </Layout>
    );
  }

  if (isEmpty) {
    return (
      <Layout hideRightSidebar containerMaxWidth="md">
        <Container centered padding="lg">
          <Empty>
            <div>No community members yet.</div>
          </Empty>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout hideRightSidebar containerMaxWidth="md">
      <Seo title="Members" />
      <Wrapper>
        {data?.pages?.map((users, i) => {
          return (
            <Fragment key={i}>
              {users?.map((user: any) => (
                <MembersCard key={user._id} queryKey={['members']} user={user} />
              ))}

              {isFetchingNextPage && <LoadingDots />}
            </Fragment>
          );
        })}
      </Wrapper>
    </Layout>
  );
};

export default MembersPage;

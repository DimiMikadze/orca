import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { generatePath } from 'react-router-dom';

import { A } from 'components/Text';
import Follow from 'components/Follow';
import { Spacing } from 'components/Layout';
import Avatar from 'components/Avatar';

import * as Routes from 'routes';

import { useStore } from 'store';

const Root = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${(p) => p.theme.colors.border.main};
  padding: ${(p) => p.theme.spacing.xs};
  margin-bottom: ${(p) => p.theme.spacing.xxs};
`;

const Author = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: ${(p) => p.theme.spacing.sm};
`;

const UserName = styled.div`
  max-width: 100%;
  font-size: ${(p) => p.theme.font.size.xs};
  font-weight: ${(p) => p.theme.font.weight.bold};
`;

/**
 * Author info for PostPopup component
 */
const PostPopupInfo = ({ author }) => {
  const [{ auth }] = useStore();

  return (
    <Root>
      <Author>
        <A to={generatePath(Routes.USER_PROFILE, { username: author.username })}>
          <Avatar image={author.image} />
        </A>

        <Spacing left="xs" inline>
          <A
            to={generatePath(Routes.USER_PROFILE, {
              username: author.username,
            })}
          >
            <UserName>{author.fullName}</UserName>
          </A>
        </Spacing>
      </Author>

      {auth.user.id !== author.id && <Follow user={author} />}
    </Root>
  );
};

PostPopupInfo.propTypes = {
  author: PropTypes.object.isRequired,
};

export default PostPopupInfo;

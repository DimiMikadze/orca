import React from 'react';
import styled, { css } from 'styled-components';
import { generatePath } from 'react-router-dom';
import PropTypes from 'prop-types';

import SignOut from 'components/App/SignOut';
import { A } from 'components/Text';

import * as Routes from 'routes';

import { useStore } from 'store';

const Root = styled.div`
  text-align: center;
  position: absolute;
  background-color: white;
  line-height: ${p => p.theme.spacing.md};
  right: 0;
  top: 60px;
  z-index: ${p => p.theme.zIndex.xl};
  box-shadow: ${p => p.theme.shadows.sm};
`;

const CSS = css`
  transition: background-color 0.1s;
  display: block;
  padding: ${p => p.theme.spacing.sm} ${p => p.theme.spacing.xl};

  &:hover {
    background-color: ${p => p.theme.colors.grey[100]};
    color: ${p => p.theme.colors.text.secondary};
  }
`;

const Link = styled(A)`
  ${CSS};
`;

const Item = styled.div`
  ${CSS};
`;

/**
 * Component that renders Header User's dropdown
 */
const HeaderUserDropDown = ({ userRef }) => {
  const [{ auth }] = useStore();

  return (
    <Root ref={userRef}>
      <Link
        to={generatePath(Routes.USER_PROFILE, {
          username: auth.user.username,
        })}
      >
        My Profile
      </Link>

      <Item>
        <SignOut />
      </Item>
    </Root>
  );
};

HeaderUserDropDown.propTypes = {
  userRef: PropTypes.object,
};

export default HeaderUserDropDown;

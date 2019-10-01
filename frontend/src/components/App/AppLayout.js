import React, { useEffect, useState, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { Switch, Route } from 'react-router-dom';
import styled from 'styled-components';

import Header from 'components/App/Header';
import NotFound from 'components/NotFound';
import SideBar from './SideBar';
import UserSuggestions from './UserSuggestions';

import Home from 'pages/Home';
import Profile from 'pages/Profile';
import Explore from 'pages/Explore';
import People from 'pages/People';
import Notifications from 'pages/Notifications';
import Post from 'pages/Post/Post';

import { useWindowSize } from 'hooks/useWindowSize';
import { useClickOutside } from 'hooks/useClickOutside';

import * as Routes from 'routes';

import theme from 'theme';

const Root = styled.div`
  display: flex;
  flex-direction: row;
  margin: 0 auto;
  width: 100%;
  position: relative;

  @media (min-width: ${p => p.theme.screen.md}) {
    width: ${p => p.theme.screen.md};
  }

  @media (min-width: ${p => p.theme.screen.lg}) {
    width: ${p => p.theme.screen.lg};
  }
`;

const Container = styled.div`
  position: relative;
  margin: 0 auto;
  width: 100%;
  z-index: ${p => p.zIndex && p.theme.zIndex[p.zIndex]};
  width: 100%;
  min-height: 500px;

  @media (min-width: ${p => p.theme.screen.md}) {
    width: ${p => p.theme.screen.xs};
  }

  @media (min-width: ${p => p.theme.screen.lg}) {
    width: ${p => p.theme.screen.sm};
  }
`;

/**
 * Main layout of the app, when user is authenticated
 */
const AppLayout = ({ location }) => {
  const windowSize = useWindowSize();
  const isDesktop = windowSize.width >= parseInt(theme.screen.md, 10);
  const [isSideBarOpen, setIsSidebarOpen] = useState(isDesktop);

  const sideBarRef = useRef('');

  useClickOutside(sideBarRef, () => {
    if (!isDesktop && isSideBarOpen) {
      setIsSidebarOpen(false);
    }
  });

  useEffect(
    () => {
      setIsSidebarOpen(isDesktop);
    },
    [isDesktop]
  );

  useEffect(
    () => {
      return () => {
        if (!isDesktop) {
          setIsSidebarOpen(false);
        }
      };
    },
    [location.pathname, isDesktop]
  );

  return (
    <>
      <Header toggleSideBar={() => setIsSidebarOpen(!isSideBarOpen)} />

      <Root>
        <SideBar isOpen={isSideBarOpen} sideBarRef={sideBarRef} />

        <Container>
          <Switch>
            <Route exact path={Routes.HOME} component={Home} />

            <Route exact path={Routes.EXPLORE} component={Explore} />

            <Route exact path={Routes.PEOPLE} component={People} />

            <Route
              exact
              path={Routes.NOTIFICATIONS}
              component={Notifications}
            />

            <Route exact path={Routes.USER_PROFILE} component={Profile} />

            <Route exact path={Routes.POST} component={Post} />

            <Route component={NotFound} />
          </Switch>
        </Container>

        <UserSuggestions />
      </Root>
    </>
  );
};

export default withRouter(AppLayout);

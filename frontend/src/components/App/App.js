import React from 'react';
import { Query } from 'react-apollo';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { GlobalStyle } from './GlobalStyles';

import { GET_AUTH_USER } from 'graphql/user';

import { useStore } from 'store';
import { SET_AUTH_USER } from 'store/auth';

import Message from 'components/Message';
import { Loading } from 'components/Loading';
import AuthLayout from 'pages/Auth/AuthLayout';
import AppLayout from './AppLayout';
import ScrollToTop from './ScrollToTop';

/**
 * Root component of the app
 */
const App = () => {
  const [{ auth, message }, dispatch] = useStore();

  return (
    <Query
      query={GET_AUTH_USER}
      onCompleted={data =>
        dispatch({ type: SET_AUTH_USER, payload: data.getAuthUser })
      }
    >
      {({ loading, refetch }) => {
        if (loading) return <Loading top="xl" />;

        return (
          <Router>
            <GlobalStyle />

            <ScrollToTop>
              <Switch>
                {!auth.user && (
                  <Route
                    exact
                    render={() => <AuthLayout refetch={refetch} />}
                  />
                )}

                {auth.user && <Route exact component={AppLayout} />}
              </Switch>
            </ScrollToTop>

            {message.content.text && (
              <Message
                type={message.content.type}
                autoClose={message.content.autoClose}
              >
                {message.content.text}
              </Message>
            )}
          </Router>
        );
      }}
    </Query>
  );
};

export default App;

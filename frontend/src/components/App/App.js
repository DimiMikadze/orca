import React, { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { GlobalStyle } from './GlobalStyles';

import { GET_AUTH_USER } from 'graphql/user';
import { GET_NEW_CONVERSATIONS_SUBSCRIPTION } from 'graphql/messages';

import Message from 'components/Message';
import { Loading } from 'components/Loading';
import AuthLayout from 'pages/Auth/AuthLayout';
import AppLayout from './AppLayout';
import ScrollToTop from './ScrollToTop';

import { useStore } from 'store';

/**
 * Root component of the app
 */
const App = () => {
  const [{ message }, dispatch] = useStore();

  const { loading, subscribeToMore, data, refetch } = useQuery(GET_AUTH_USER);

  useEffect(() => {
    const unsubscribe = subscribeToMore({
      document: GET_NEW_CONVERSATIONS_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;

        const oldConversations = prev.getAuthUser.newConversations;
        const { newConversation } = subscriptionData.data;

        // Don't show message notification in Header if user already is on messages page
        if (window.location.href.split('/')[3] === 'messages') {
          return prev;
        }

        // If authUser already has unseen message from that user,
        // remove old message, so we can show the new one
        const index = oldConversations.findIndex(
          u => u.id === newConversation.id
        );
        if (index > -1) {
          oldConversations.splice(index, 1);
        }

        // Merge conversations
        const mergeConversations = [newConversation, ...oldConversations];

        // Attach new conversation to authUser
        const authUser = prev.getAuthUser;
        authUser.newConversations = mergeConversations;

        return { getAuthUser: authUser };
      },
    });

    return () => {
      unsubscribe();
    };
  }, [subscribeToMore, dispatch]);

  if (loading) return <Loading top="xl" />;

  return (
    <Router>
      <GlobalStyle />

      <ScrollToTop>
        <Switch>
          {data.getAuthUser ? (
            <Route
              exact
              render={() => <AppLayout authUser={data.getAuthUser} />}
            />
          ) : (
            <Route exact render={() => <AuthLayout refetch={refetch} />} />
          )}
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
};

export default App;

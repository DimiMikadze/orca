import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useMutation } from '@apollo/client';

import { Spacing } from 'components/Layout';
import { H1, A, Error } from 'components/Text';
import { InputText, Button } from 'components/Form';
import Head from 'components/Head';

import { REQUEST_PASSWORD_RESET } from 'graphql/user';

import * as Routes from 'routes';

const Root = styled.div`
  padding: 0 ${(p) => p.theme.spacing.sm};
`;

const Container = styled.div`
  width: 450px;
  margin: 0 auto;
  background-color: ${(p) => p.theme.colors.white};
  padding: ${(p) => p.theme.spacing.md};
  border-radius: ${(p) => p.theme.radius.sm};
  width: 100%;
  margin-top: 80px;

  @media (min-width: ${(p) => p.theme.screen.sm}) {
    width: 450px;
  }

  @media (min-width: ${(p) => p.theme.screen.md}) {
    margin-top: auto;
  }
`;

const Text = styled.p`
  font-size: ${(p) => p.theme.font.size.xs};
  line-height: 22px;
`;

/**
 * Forgot password page
 */
const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [requestResetPassword, { loading }] = useMutation(REQUEST_PASSWORD_RESET);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(String(email).toLowerCase())) {
      setError('Enter a valid email address.');
      return;
    }

    setError('');
    setEmail('');
    try {
      const response = await requestResetPassword({
        variables: { input: { email } },
      });
      setMessage(response.data.requestPasswordReset.message);
    } catch (error) {
      setError(error.graphQLErrors[0].message);
    }
  };

  if (message) {
    return (
      <Root>
        <Container>
          <Spacing bottom="sm">
            <H1>{message}</H1>
          </Spacing>
        </Container>
      </Root>
    );
  }

  return (
    <Root>
      <Head title="Forgot Password" />

      <Container>
        <Spacing bottom="sm">
          <H1>Reset Password</H1>
          <Text>
            Enter the email address associated with your account, and we’ll email you a link to reset your password.
          </Text>
        </Spacing>

        <form onSubmit={(e) => handleSubmit(e, requestResetPassword)}>
          <InputText type="text" name="email" values={email} onChange={handleEmailChange} placeholder="Email" />

          {error && (
            <Spacing bottom="sm" top="sm">
              <Error>{error}</Error>
            </Spacing>
          )}

          <Spacing top="xs" />

          <Button disabled={loading}>Send reset link</Button>

          <Spacing top="sm">
            <A to={Routes.HOME}>&larr; Back to Sign Up</A>
          </Spacing>
        </form>
      </Container>
    </Root>
  );
};

ForgotPassword.propTypes = {
  history: PropTypes.object.isRequired,
};

export default ForgotPassword;

import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { Spacing } from 'components/Layout';
import { H1, Error } from 'components/Text';
import { Loading } from 'components/Loading';
import { InputText, Button } from 'components/Form';
import Head from 'components/Head';

import { VERIFY_RESET_PASSWORD_TOKEN, RESET_PASSWORD } from 'graphql/user';

import * as Routes from 'routes';

const Root = styled.div`
  padding: 0 ${(p) => p.theme.spacing.sm};
`;

const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  background-color: ${(p) => p.theme.colors.white};
  padding: ${(p) => p.theme.spacing.md};
  border-radius: ${(p) => p.theme.radius.sm};
  margin-top: 80px;

  @media (min-width: ${(p) => p.theme.screen.sm}) {
    width: 450px;
  }

  @media (min-width: ${(p) => p.theme.screen.md}) {
    margin-top: auto;
  }
`;

/**
 * Reset password page
 */
const ResetPassword = ({ history, location, refetch }) => {
  const [values, setValues] = useState({ password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [mutationError, setMutationError] = useState('');
  const url = new URLSearchParams(location.search);
  const email = url.get('email');
  const token = url.get('token');
  const { queryLoading, error: queryError } = useQuery(VERIFY_RESET_PASSWORD_TOKEN, {
    variables: { email, token },
  });
  const { password, confirmPassword } = values;
  const [resetPassword, { loading: mutationLoading }] = useMutation(RESET_PASSWORD);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      setError('Enter password and Confirm password.');
      return;
    } else if (password.length < 6) {
      setError('Password min 6 characters');
      return;
    } else if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setError('');
    setMutationError('');
    try {
      const response = await resetPassword({
        variables: { input: { email, password, token } },
      });
      localStorage.setItem('token', response.data.resetPassword.token);
      await refetch();
      history.push(Routes.HOME);
    } catch (error) {
      setMutationError(error.graphQLErrors[0].message);
    }
  };

  return (
    <Root>
      <Head title="Reset Password" />

      <Container>
        <>
          {queryLoading && <Loading top="lg" />}
          {mutationError || queryError ? (
            <Spacing bottom="md">
              <Error>{mutationError ? mutationError : queryError.graphQLErrors[0].message}</Error>
            </Spacing>
          ) : (
            ''
          )}

          <Spacing bottom="md">
            <H1>Password Reset</H1>
          </Spacing>

          <form onSubmit={(e) => handleSubmit(e, resetPassword)}>
            <InputText
              type="password"
              name="password"
              values={password}
              onChange={handleChange}
              placeholder="Password"
            />

            <Spacing top="xs" bottom="sm">
              <InputText
                type="password"
                name="confirmPassword"
                values={confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
              />
            </Spacing>

            {error && (
              <Spacing bottom="sm" top="sm">
                <Error>{error}</Error>
              </Spacing>
            )}

            <Button disabled={mutationLoading}>Reset Password</Button>
          </form>
        </>
      </Container>
    </Root>
  );
};

ResetPassword.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  refetch: PropTypes.func.isRequired,
};

export default withRouter(ResetPassword);

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import styled from 'styled-components';

import { A } from 'components/Text';
import { Spacing } from 'components/Layout';
import { Error } from 'components/Text';
import { InputText, Button } from 'components/Form';

import { SIGN_IN } from 'graphql/user';

import * as Routes from 'routes';

const Root = styled.div`
  display: flex;
  flex-direction: row;
  align-items: space-between;
  font-size: ${p => p.theme.font.size.xxs};
  margin-top: ${p => p.theme.spacing.sm};
`;

const InputContainer = styled(Spacing)`
  width: 100%;
`;

const ErrorMessage = styled.div`
  position: absolute;
  top: 1px;
`;

const ForgotPassword = styled.div`
  font-size: ${p => p.theme.font.size.xxs};
  margin-top: ${p => p.theme.spacing.xxs};
  color: ${p => p.theme.colors.white};
`;

/**
 * Sign In page
 */
const SignIn = ({ history, location, refetch }) => {
  const [values, setValues] = useState({ emailOrUsername: '', password: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
  }, [location.pathname]);

  const handleChange = e => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = (e, signin) => {
    e.preventDefault();

    if (!emailOrUsername || !password) {
      setError('All fields are required');
      return;
    }

    setError('');
    signin().then(async ({ data }) => {
      localStorage.setItem('token', data.signin.token);
      await refetch();
      history.push(Routes.HOME);
    });
  };

  const renderErrors = apiError => {
    let errorMessage;

    if (error) {
      errorMessage = error;
    } else if (apiError) {
      errorMessage = apiError.graphQLErrors[0].message;
    }

    if (errorMessage) {
      return (
        <ErrorMessage>
          <Error size="xxs" color="white">
            {errorMessage}
          </Error>
        </ErrorMessage>
      );
    }

    return null;
  };

  const { emailOrUsername, password } = values;

  return (
    <Mutation
      mutation={SIGN_IN}
      variables={{ input: { emailOrUsername, password } }}
    >
      {(signin, { loading, error: apiError }) => (
        <form onSubmit={e => handleSubmit(e, signin)}>
          <Root>
            <InputContainer>
              {renderErrors(apiError)}

              <InputText
                autoFocus
                type="text"
                name="emailOrUsername"
                values={emailOrUsername}
                onChange={handleChange}
                placeholder="Email or Username"
                borderColor="white"
              />
            </InputContainer>

            <InputContainer left="xs" right="xs">
              <InputText
                type="password"
                name="password"
                values={password}
                onChange={handleChange}
                placeholder="Password"
                borderColor="white"
              />
              <A to={Routes.FORGOT_PASSWORD}>
                <ForgotPassword>Forgot password?</ForgotPassword>
              </A>
            </InputContainer>

            <Button disabled={loading}>Log in</Button>
          </Root>
        </form>
      )}
    </Mutation>
  );
};

SignIn.propTypes = {
  history: PropTypes.object.isRequired,
  refetch: PropTypes.func.isRequired,
};

export default withRouter(SignIn);

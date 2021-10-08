import { FC, FormEvent, useState } from 'react';
import axios from 'axios';
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import { Button, Divider, H2, InputText, Spacing, Text } from '../../ui';
import { AlertTypes, openAlert } from '../../../store/alert';

const updatePassword = async (password: string) => {
  const updatedSettings = await axios.put('/settings/update-password', { password });
  return updatedSettings.data;
};

const SettingsAuthentication: FC = () => {
  const dispatch = useDispatch();
  const [apiError, setApiError] = useState('');
  const [values, setValues] = useState({
    password: '',
    confirmPassword: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const { mutateAsync, isLoading } = useMutation(updatePassword);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!values.password || values.password.length < 6) {
      setErrorMessage('Password length should be at least 6 characters.');
      return;
    }

    if (values.password !== values.confirmPassword) {
      setErrorMessage("Password and confirm password doesn't match.");
      return;
    }

    setErrorMessage('');
    setApiError('');
    try {
      await mutateAsync(values.password);
      dispatch(
        openAlert({
          type: AlertTypes.Success,
          message: 'Password updated successfully.',
        })
      );
      setValues({ password: '', confirmPassword: '' });
    } catch (error) {
      console.log('An error occurred while updating a password: ', error);
      setApiError(error.response.data);
    }
  };

  const onChange = (e: FormEvent<HTMLInputElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    setValues({ ...values, [name]: value });
  };

  return (
    <div>
      <H2>Authentication Settings</H2>
      <Divider spacing="sm" />

      <form onSubmit={onSubmit}>
        <Spacing top="md" />
        <InputText
          type="password"
          name="password"
          label="New Password"
          description="Please make sure your password includes at least 6 characters."
          value={values.password}
          onChange={onChange}
        />

        <Spacing top="md" />

        <InputText
          type="password"
          name="confirmPassword"
          label="Confirm new password"
          description="Re-enter your new password for verification."
          value={values.confirmPassword}
          onChange={onChange}
        />

        <Spacing top="md" bottom="md">
          {apiError && <Text color="error">{apiError}</Text>}
          {errorMessage && <Text color="error">{errorMessage}</Text>}
        </Spacing>

        <Button color="primary" type="submit" disabled={isLoading}>
          Save changes
        </Button>
      </form>
    </div>
  );
};

export default SettingsAuthentication;

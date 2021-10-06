import { FC, FormEvent, useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useMutation } from 'react-query';
import { RootState } from '../../../store';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Divider, H2, InputText, Spacing, Text } from '../../ui';
import { AlertTypes, openAlert } from '../../../store/alert';
import { setAuthUser } from '../../../store/auth';

interface AccountSettings {
  fullName: string;
  username: string;
}

const updateAccountSettings = async (settings: AccountSettings) => {
  const updatedSettings = await axios.put('/settings/update-user', settings);
  return updatedSettings.data;
};

const SettingsAccount: FC = () => {
  const dispatch = useDispatch();
  const authUser = useSelector((state: RootState) => state.auth.user);
  const [apiError, setApiError] = useState('');
  const [formTouched, setFormTouched] = useState(false);

  const [values, setValues] = useState({
    fullName: authUser.fullName,
    username: authUser.username || '',
  });
  const [errors, setErrors] = useState({
    fullName: null,
    username: null,
  });
  const { mutateAsync, isLoading } = useMutation(updateAccountSettings);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setApiError('');
    try {
      await mutateAsync({ fullName: values.fullName, username: values.username });
      dispatch(
        setAuthUser({
          ...authUser,
          fullName: values.fullName,
          username: values.username,
        })
      );
      dispatch(
        openAlert({
          type: AlertTypes.Success,
          message: 'Profile updated successfully.',
        })
      );
    } catch (error) {
      console.log('An error occurred while updating your profile: ', error);
      setApiError(error.response.data);
    }
  };

  const onChange = (e: FormEvent<HTMLInputElement>) => {
    if (!formTouched) {
      setFormTouched(true);
    }
    const { name, value } = e.target as HTMLInputElement;
    setValues({ ...values, [name]: value });
  };

  const validateFullName = useCallback(() => {
    if (values.fullName === '') {
      setErrors((prevErrors) => ({ ...prevErrors, fullName: 'Full name is a required field.' }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, fullName: null }));
    }
  }, [values.fullName]);

  const validateUsername = useCallback(() => {
    if (values.username === '') {
      setErrors((prevErrors) => ({ ...prevErrors, username: 'Username is a required field.' }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, username: null }));
    }
  }, [values.username]);

  useEffect(() => {
    validateFullName();
    validateUsername();
  }, [validateFullName, validateUsername]);

  return (
    <div>
      <H2>Account Settings</H2>
      <Divider spacing="sm" />

      <form onSubmit={onSubmit}>
        <Spacing top="md" />
        <InputText
          name="fullName"
          label="Full name"
          description="Example: John doe"
          value={values.fullName}
          error={errors.fullName}
          onChange={onChange}
        />

        <Spacing top="md" />

        <InputText
          name="username"
          label="Username"
          description="Example: john"
          value={values.username}
          error={formTouched && errors.username}
          onChange={onChange}
        />

        <Spacing top="md" bottom="md">
          {apiError && <Text color="error">{apiError}</Text>}
        </Spacing>

        <Button color="primary" type="submit" disabled={errors.fullName || errors.username || isLoading}>
          Save changes
        </Button>
      </form>
    </div>
  );
};

export default SettingsAccount;

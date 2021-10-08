import { FC, useState, FormEvent, useEffect } from 'react';
import { Modal, Button, Text, Spacing, InputText, Select } from '../../ui';
import { openAlert, AlertTypes } from '../../../store/alert';
import { useQueryClient } from 'react-query';
import { UserRole } from '../../../constants';
import { useDispatch } from 'react-redux';
import axios from 'axios';

interface User {
  fullName: string;
  email: string;
  password: string;
  role: string;
}

const createUser = async (user: User) => {
  const response = await axios.post('/settings/create-user', user);
  return response;
};

const INITIAL_STATE = {
  fullName: '',
  email: '',
  password: '',
  role: UserRole.Regular,
};

interface SettingsCreateUserProps {
  searchQuery: string;
}

const SettingsCreateUser: FC<SettingsCreateUserProps> = ({ searchQuery }) => {
  const [values, setValues] = useState(INITIAL_STATE);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const onChange = (e: FormEvent<HTMLInputElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    setValues({ ...values, [name]: value });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const createdUser = await createUser(values);

      queryClient.setQueryData(['adminUsers', searchQuery], (existingUsers: any) => {
        return {
          pages: [[createdUser.data, ...existingUsers.pages[0]]],
        };
      });
      setIsPopupOpen(false);
      dispatch(
        openAlert({
          message: `The user has been successfully created`,
          type: AlertTypes.Success,
        })
      );
    } catch (error) {
      setErrorMessage(error.response.data);
      dispatch(
        openAlert({
          message: 'An error occurred while creating a user.',
          type: AlertTypes.Error,
        })
      );
    }
  };

  useEffect(() => {
    if (isPopupOpen) {
      setErrorMessage('');
    }

    return () => {
      setErrorMessage('');
      setValues(INITIAL_STATE);
    };
  }, [isPopupOpen]);

  return (
    <>
      <Button color="primary" onClick={() => setIsPopupOpen(true)}>
        Add user
      </Button>

      <Modal isOpen={isPopupOpen} close={() => setIsPopupOpen(false)} title="Create a user">
        <form onSubmit={onSubmit}>
          <InputText name="fullName" placeholder="Full Name" value={values.fullName} onChange={onChange} />
          <Spacing bottom="xs" />

          <InputText name="email" placeholder="Email" value={values.email} onChange={onChange} />
          <Spacing bottom="xs" />
          <InputText
            name="password"
            type="password"
            placeholder="Password"
            value={values.password}
            onChange={onChange}
          />
          <Spacing bottom="xs" />
          <Select onChange={onChange} name="role" defaultValue={UserRole.Regular}>
            <option value={UserRole.Regular}>Regular user</option>
            <option value={UserRole.Admin}>Admin user</option>
          </Select>
          {errorMessage && (
            <Spacing top="sm">
              <Text color="error">{errorMessage}</Text>
            </Spacing>
          )}
          <Spacing bottom="sm" />
          <Button color="primary">Create user</Button>
        </form>
      </Modal>
    </>
  );
};

export default SettingsCreateUser;

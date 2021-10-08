import { FC, useState } from 'react';
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';
import { openAlert, AlertTypes } from '../../../store/alert';
import { StyledButton } from './style';
import { Confirm } from '../../../components/ui';
import { BanIcon, UnbanIcon } from '../../ui/icons';

interface SettingsPopoverProps {
  userId: string;
  banned: boolean;
  searchQuery: string;
}

const banUser = async ({ id, banned }) => {
  const newUser = await axios.delete('/users/ban-user', { data: { id, banned } });
  return newUser.data;
};

const SettingsPopover: FC<SettingsPopoverProps> = ({ userId, banned, searchQuery }) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation(banUser);

  const userBan = async () => {
    try {
      const bannedUser = await mutateAsync({ id: userId, banned: !banned });

      queryClient.setQueryData(['adminUsers', searchQuery], (existingUsers: any) => {
        return {
          pages: [
            existingUsers.pages[0].map((user: any) => {
              return user._id === bannedUser._id ? { ...user, banned: bannedUser.banned } : user;
            }),
          ],
        };
      });

      setIsConfirmOpen(false);
      dispatch(
        openAlert({
          message: `The user has been successfully ${bannedUser.banned ? 'banned' : 'unbanned'}`,
          type: AlertTypes.Success,
        })
      );
    } catch (error) {
      dispatch(
        openAlert({
          message: 'An error occurred while banning a user.',
          type: AlertTypes.Error,
        })
      );
    }
  };

  return (
    <>
      <Confirm
        confirmText={banned ? 'Unban' : 'Ban'}
        onConfirm={userBan}
        close={() => setIsConfirmOpen(false)}
        isOpen={isConfirmOpen}
        title={banned ? 'Do you really want to unban the user?' : 'Do you really want to ban the user?'}
      />
      <StyledButton ghost onClick={() => setIsConfirmOpen(true)}>
        {banned ? <UnbanIcon color="success" /> : <BanIcon color="error" />}
      </StyledButton>
    </>
  );
};

export default SettingsPopover;

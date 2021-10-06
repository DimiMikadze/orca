import { FC, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { openAlert, AlertTypes } from '../../store/alert';
import ChannelForm, { ChannelFormMode } from './ChannelForm';
import { Channel } from '../../constants';

interface ChannelCreateProps {
  closeModal: () => void;
}

const createChannel = async (channel: Channel) => {
  try {
    const newChannel = await axios.post('/channels/create', channel);
    return newChannel;
  } catch (error) {
    throw error.response.data;
  }
};

const ChannelCreate: FC<ChannelCreateProps> = ({ closeModal }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading, error } = useMutation(createChannel);

  const onSubmit = async (e: FormEvent<HTMLFormElement>, formValues: Channel) => {
    e.preventDefault();
    try {
      const { data: channel } = await mutateAsync(formValues);
      queryClient.setQueryData('channels', (existingChannels: Channel[]) => [...existingChannels, channel]);
      closeModal();
      router.push(`/channel/${channel?.name}`);
      dispatch(
        openAlert({
          message: 'Channel has been successfully created.',
          type: AlertTypes.Success,
        })
      );
    } catch (error) {
      console.error('An error occurred while creating a channel: ', error);
    }
  };

  return (
    <ChannelForm
      closeModal={closeModal}
      apiErrorMessage={error as string}
      onSubmit={onSubmit}
      loading={isLoading}
      mode={ChannelFormMode.Create}
    />
  );
};

export default ChannelCreate;

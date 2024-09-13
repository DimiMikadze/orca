import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FC, FormEvent } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { Channel } from '../../constants';
import { AlertActionTypes, AlertTypes, openAlert } from '../../store/alert';
import ChannelForm, { ChannelFormMode, IChannelForm } from './ChannelForm';

interface ChannelEditProps {
  channel: Channel;
  closeModal: () => void;
}

const updateChannel = async (channel: any) => {
  try {
    const newChannel = await axios.put('/channels/update', channel);
    return newChannel.data;
  } catch (error) {
    throw error.response.data;
  }
};

const ChannelEdit: FC<ChannelEditProps> = ({ channel, closeModal }) => {
  const router = useRouter();
  const dispatch = useDispatch<Dispatch<AlertActionTypes>>();
  const queryClient = useQueryClient();

  const { mutateAsync, isLoading, error } = useMutation(updateChannel);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>, formValues: IChannelForm) => {
    try {
      const updatedChannel = await mutateAsync({ _id: channel._id, ...formValues });
      queryClient.setQueryData('channels', (existingChannels: Channel[]) => {
        return existingChannels.map((channel) =>
          channel._id === updatedChannel._id ? { ...updatedChannel } : channel
        );
      });
      closeModal();
      router.push(`/channel/${updatedChannel.name}`);
      dispatch(
        openAlert({
          message: 'Channel has been successfully updated.',
          type: AlertTypes.Success,
        })
      );
    } catch (error) {
      console.error('An error occurred while updating the channel: ', error);
    }
  };

  return (
    <ChannelForm
      apiErrorMessage={error as string}
      closeModal={closeModal}
      channel={channel}
      onSubmit={handleSubmit}
      loading={isLoading}
      mode={ChannelFormMode.Edit}
    />
  );
};

export default ChannelEdit;

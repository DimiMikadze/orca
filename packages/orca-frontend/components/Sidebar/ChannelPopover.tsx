import React, { FC, useState, useRef } from 'react';
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';
import { openAlert, AlertTypes } from '../../store/alert';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { Popover, PopoverContent, ThreeDots } from './style';
import { Button, Modal, Confirm, Spacing } from '../ui';
const ChannelEdit = dynamic(() => import('../Channel/ChannelEdit'));
import { ThreeDotsIcon } from '../ui/icons';
import { useClickOutside } from '../../utils';
import { Channel } from '../../constants';

interface ChannelPopoverProps {
  channel: Channel;
}

const deleteChannel = async (id: string) => {
  const newChannel = await axios.delete('/channels/delete', { data: { id } });
  return newChannel.data;
};

const ChannelPopover: FC<ChannelPopoverProps> = ({ channel }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const queryClient = useQueryClient();
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  useClickOutside(ref, isOpen, () => {
    setIsOpen(false);
  });

  const { mutateAsync } = useMutation(deleteChannel);

  const removeChannel = async (id: string) => {
    try {
      const deletedChannel = await mutateAsync(id);

      queryClient.setQueryData('channels', (existingChannels: Channel[]) => {
        return existingChannels.filter((channel) => channel._id !== deletedChannel._id);
      });

      setIsEditModalOpen(false);
      setIsDeleteModalOpen(false);

      if (router.query.name === channel.name) {
        router.push('/');
      }

      dispatch(
        openAlert({
          message: 'The channel has been deleted successfully.',
          type: AlertTypes.Success,
        })
      );
    } catch (error) {
      dispatch(
        openAlert({
          message: 'An error occurred while deleting a channel.',
          type: AlertTypes.Error,
        })
      );
    }
  };

  const openEditModal = () => {
    setIsEditModalOpen(true);
    setIsOpen(false);
  };
  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
    setIsOpen(false);
  };

  const closeModal = () => {
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
  };

  return (
    <Popover ref={ref}>
      <Modal title="Edit Channel" isOpen={isEditModalOpen} close={closeModal}>
        <ChannelEdit channel={channel} closeModal={closeModal} />
      </Modal>

      <Confirm isOpen={isDeleteModalOpen} close={closeModal} onConfirm={() => removeChannel(channel._id)} />

      <ThreeDots isOpen={isOpen}>
        <Button ghost onClick={() => setIsOpen(!isOpen)}>
          <Spacing top="xxs" bottom="xxs" left="xxs" right="xxs">
            <ThreeDotsIcon />
          </Spacing>
        </Button>
      </ThreeDots>

      {isOpen && (
        <PopoverContent>
          <Button onClick={openEditModal} text fullWidth radius="none" size="xs">
            Edit
          </Button>

          <Button text fullWidth radius="none" size="xs" onClick={openDeleteModal}>
            Delete
          </Button>
        </PopoverContent>
      )}
    </Popover>
  );
};

export default ChannelPopover;

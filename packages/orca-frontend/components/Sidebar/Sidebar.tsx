import { forwardRef, ForwardRefRenderFunction, useEffect, useState } from 'react';
import { List, arrayMove } from 'react-movable';
import { useSelector } from 'react-redux';
import { useMutation, useQuery } from 'react-query';
import { UserRole } from '../../constants';
import { Button, ButtonLink, Divider, Modal, Spacing, Avatar } from '../ui';
import {
  PlusIcon,
  HouseColorfulIcon,
  PeopleColorfulIcon,
  NotificationColorfulIcon,
  MessageColorfulIcon,
  DragIcon,
} from '../ui/icons';
import { Root, UL, LI, ChannelName, DragButton } from './style';
import ChannelPopover from './ChannelPopover';
import { useRouter } from 'next/router';
import { RootState } from '../../store';
import axios from 'axios';
import ChannelCreate from '../Channel/ChannelCreate';

interface SidebarProps {
  isOpen: boolean;
}

const fetchChannels = async () => {
  const { data } = await axios.get('/channels');
  return data;
};

const reorderChannels = async ({ sortedChannels }) => {
  const response = await axios.post('/channels/reorder', { sortedChannels });
  return response;
};

const Sidebar: ForwardRefRenderFunction<HTMLDivElement, SidebarProps> = ({ isOpen }, ref) => {
  const authUser = useSelector((state: RootState) => state.auth.user);
  const [modal, setModal] = useState(false);
  const closeModal = () => setModal(false);
  const router = useRouter();

  const { data: channels } = useQuery('channels', fetchChannels);
  const [channelItems, setChannelItems] = useState([]);
  const { mutateAsync: reorderChannelsMutation } = useMutation(reorderChannels);
  const isAdmin = (authUser && authUser.role === UserRole.Admin) || (authUser && authUser.role === UserRole.SuperAdmin);

  useEffect(() => {
    if (channels) {
      setChannelItems(channels);
    }
  }, [channels]);

  useEffect(() => {
    if (channelItems.length > 0 && isAdmin) {
      reorderChannelsMutation({ sortedChannels: channelItems });
    }
  }, [channelItems, reorderChannelsMutation, isAdmin]);

  return (
    <Root ref={ref} isOpen={isOpen}>
      <Modal title="Create Channel" isOpen={modal} close={closeModal}>
        <ChannelCreate closeModal={closeModal} channels={channelItems} />
      </Modal>

      <UL>
        {authUser && (
          <LI>
            <ButtonLink
              fullWidth
              radius="none"
              href={`/profile/${authUser._id}`}
              color="text"
              active={router.query?.id === authUser._id}
              size="sm"
            >
              <Avatar image={authUser.image} isActive={router.query?.id === authUser._id} />
              <Spacing right="xs" />
              {authUser.fullName}
            </ButtonLink>
          </LI>
        )}
        <LI>
          <ButtonLink fullWidth radius="none" href="/" color="text" active={router.pathname === '/'} size="sm">
            <HouseColorfulIcon color={router.pathname === '/' ? 'primary' : 'text'} />
            {'\u00A0'}
            {'\u00A0'} Home
          </ButtonLink>
        </LI>
        <LI>
          <ButtonLink
            fullWidth
            radius="none"
            href="/members"
            color="text"
            active={router.pathname === '/members'}
            size="sm"
          >
            <PeopleColorfulIcon color={router.pathname === '/members' ? 'primary' : 'text'} />
            {'\u00A0'}
            {'\u00A0'} Members
          </ButtonLink>
        </LI>

        <LI>
          <ButtonLink
            fullWidth
            radius="none"
            href="/notifications"
            color="text"
            active={router.pathname === '/notifications'}
            size="sm"
          >
            <NotificationColorfulIcon width="20" color={router.pathname === '/notifications' ? 'primary' : 'text'} />
            {'\u00A0'}
            {'\u00A0'} Notifications
          </ButtonLink>
        </LI>
        <LI>
          <ButtonLink
            fullWidth
            radius="none"
            href="/messages"
            color="text"
            active={router.pathname === '/messages'}
            size="sm"
          >
            <MessageColorfulIcon width="20" color={router.pathname === '/messages' ? 'primary' : 'text'} />
            {'\u00A0'}
            {'\u00A0'} Messages
          </ButtonLink>
        </LI>

        <LI noHover>
          <Spacing top="sm" left="xs" />
          <Divider />
        </LI>
      </UL>

      {channelItems?.length > 0 && (
        <List
          lockVertically
          values={channelItems}
          onChange={({ oldIndex, newIndex }) => {
            setChannelItems(arrayMove(channelItems, oldIndex, newIndex));
          }}
          renderList={({ children, props }) => <UL {...props}>{children}</UL>}
          renderItem={({ value, props }) => {
            return (
              <LI {...props}>
                <ButtonLink
                  fullWidth
                  radius="none"
                  href={`/channel/${value.name}`}
                  color="text"
                  active={value.name === router.query.name}
                  size="sm"
                >
                  <ChannelName>{value.name}</ChannelName>
                </ButtonLink>

                {isAdmin && (
                  <Spacing right="xxs">
                    <DragButton ghost data-movable-handle tabIndex={-1}>
                      <DragIcon />
                    </DragButton>
                  </Spacing>
                )}

                {isAdmin && <ChannelPopover channel={value} />}
              </LI>
            );
          }}
        />
      )}

      {isAdmin && (
        <Button size="xs" onClick={() => setModal(true)} textColor="text">
          <PlusIcon />
          {'\u00A0'}
          {'\u00A0'}
          Create Channel
        </Button>
      )}
    </Root>
  );
};

export default forwardRef(Sidebar);

import { FC, useEffect, useRef, useState } from 'react';
import Router from 'next/router';
import { Root, StyledContainer } from './style';
import Header from '../Header';
import SideBar from '../Sidebar';
import { Cookies, getCookie, useClickOutside } from '../../utils';
import { Spacing, Screen } from '../../theme';
import RightSideBar from '../RightSideBar';
import Seo from '../Seo';
import Announcement from '../Announcement';

interface LayoutProps {
  children: React.ReactNode;
  hideLeftSidebar?: boolean;
  hideRightSidebar?: boolean;
  containerMaxWidth?: Screen;
  marginTop?: Spacing;
}

const Layout: FC<LayoutProps> = ({ children, hideLeftSidebar, hideRightSidebar, containerMaxWidth, marginTop }) => {
  const isAnnouncementDisabled = getCookie(Cookies.Announcement_Disabled);
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(isAnnouncementDisabled !== 'true');
  const sideBarRef = useRef(null);
  const hamburgerRef = useRef(null);
  const [isSideBarOpen, setIsSidebarOpen] = useState(false);
  useClickOutside([sideBarRef, hamburgerRef], isSideBarOpen, () => {
    setIsSidebarOpen(false);
  });

  const toggleSidebar = () => setIsSidebarOpen(!isSideBarOpen);

  useEffect(() => {
    Router.events.on('routeChangeComplete', () => {
      if (isSideBarOpen) {
        setIsSidebarOpen(false);
      }
    });
  }, [isSideBarOpen]);

  return (
    <>
      <Seo />
      {isAnnouncementOpen && <Announcement setIsAnnouncementOpen={setIsAnnouncementOpen} />}
      <Header ref={hamburgerRef} toggleSidebar={toggleSidebar} />
      <Root>
        {!hideLeftSidebar && <SideBar ref={sideBarRef} isOpen={isSideBarOpen} />}
        <StyledContainer
          bgColor="body"
          marginTop={marginTop}
          padding="none"
          maxWidth={containerMaxWidth}
          hideRightSidebar={hideRightSidebar}
        >
          {children}
        </StyledContainer>
        {!hideRightSidebar && <RightSideBar />}
      </Root>
    </>
  );
};

Layout.defaultProps = {
  hideLeftSidebar: false,
  hideRightSidebar: false,
  containerMaxWidth: 'sm',
  marginTop: 'md',
};

export default Layout;

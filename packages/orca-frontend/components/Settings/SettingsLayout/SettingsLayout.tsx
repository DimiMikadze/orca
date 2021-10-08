import { FC, useEffect, useRef, useState } from 'react';
import Router from 'next/router';
import { Root, Container } from './style';
import Header from '../../Header';
import SettingsSidebar from '../SettingsSidebar';
import { useClickOutside } from '../../../utils';
import Seo from '../../Seo';

interface SettingsAppLayoutProps {
  children: React.ReactNode;
}

const SettingsLayout: FC<SettingsAppLayoutProps> = ({ children }) => {
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
      <Seo title="Settings" />
      <Header ref={hamburgerRef} toggleSidebar={toggleSidebar} />
      <Root>
        <SettingsSidebar ref={sideBarRef} isOpen={isSideBarOpen} />
        <Container>{children}</Container>
      </Root>
    </>
  );
};

export default SettingsLayout;

import { FC, useRef, useState } from 'react';
import { Root, StyledContainer } from './style';
import Header from '../Header';
import SideBar from '../Sidebar';
import { useClickOutside } from '../../utils';
import { Spacing, Screen } from '../../theme';
import Rightbar from '../Rightbar';
import Seo from '../Seo';

interface LayoutProps {
  children: React.ReactNode;
  hideLeftSidebar?: boolean;
  hideRightSidebar?: boolean;
  containerMaxWidth?: Screen;
  marginTop?: Spacing;
}

const Layout: FC<LayoutProps> = ({ children, hideLeftSidebar, hideRightSidebar, containerMaxWidth, marginTop }) => {
  const sideBarRef = useRef(null);
  const hamburgerRef = useRef(null);
  const [isSideBarOpen, setIsSidebarOpen] = useState(false);
  useClickOutside([sideBarRef, hamburgerRef], isSideBarOpen, () => {
    setIsSidebarOpen(false);
  });

  const toggleSidebar = () => setIsSidebarOpen(!isSideBarOpen);

  return (
    <>
      <Seo />

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
        {!hideRightSidebar && <Rightbar />}
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

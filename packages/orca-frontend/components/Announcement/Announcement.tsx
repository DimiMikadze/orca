import React, { FC } from 'react';
import { Cookies, setCookie } from '../../utils';

import { Root, StyledButton, Iframe, Link } from './style';

interface AnnouncementProps {
  setIsAnnouncementOpen: (isOpen: boolean) => void;
}

const Announcement: FC<AnnouncementProps> = ({ setIsAnnouncementOpen }) => {
  const onCloseClick = () => {
    setCookie(Cookies.Announcement_Disabled, 'true');
    setIsAnnouncementOpen(false);
  };

  return (
    <Root>
      <div>
        ☆ If you like Orca, give it a star on{' '}
        <Link href="https://github.com/dimimikadze/orca" target="__blank" rel="noreferrer noopener">
          GitHub
        </Link>{' '}
        ☆
      </div>

      <div>
        <Iframe
          src="https://ghbtns.com/github-btn.html?user=dimimikadze&repo=orca&type=star&count=true"
          frameBorder="0"
          scrolling="0"
          width="104"
          height="20"
          title="GitHub"
        ></Iframe>
      </div>

      <StyledButton ghost color="white" onClick={onCloseClick}>
        ✕
      </StyledButton>
    </Root>
  );
};

export default Announcement;

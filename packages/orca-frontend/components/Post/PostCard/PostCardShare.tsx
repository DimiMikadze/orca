import { forwardRef, ForwardRefRenderFunction, RefObject } from 'react';
import { useDispatch } from 'react-redux';
import { FacebookShareButton, LinkedinShareButton, TwitterShareButton } from 'react-share';
import { Dispatch } from 'redux';
import { AlertActionTypes, AlertTypes, openAlert } from '../../../store/alert';
import { Spacing } from '../../ui';
import { FacebookIcon, LinkedInIcon, LinkIcon, TwitterIcon } from '../../ui/icons';
import { ShareButton, ShareItem, SharePopover } from './style';

interface PostCardShareProps {
  url: string;
  title: string;
  setIsShareOpen: (isOpen: boolean) => void;
  ref: RefObject<HTMLDivElement>;
}

const PostCardShare: ForwardRefRenderFunction<HTMLDivElement, PostCardShareProps> = (
  { url, title, setIsShareOpen },
  ref
) => {
  const dispatch = useDispatch<Dispatch<AlertActionTypes>>();

  const saveToClipboard = (): void => {
    navigator.clipboard.writeText(window.location.href);
    setIsShareOpen(false);
    dispatch(
      openAlert({
        message: 'Post link has been copied',
        type: AlertTypes.Success,
      })
    );
  };

  return (
    <SharePopover ref={ref}>
      <FacebookShareButton url={url} /*  quote={title} */ title={title}>
        <ShareItem>
          <FacebookIcon color="facebook" />
          <Spacing left="xs" />
          Facebook
        </ShareItem>
      </FacebookShareButton>

      <TwitterShareButton url={url} title={title}>
        <ShareItem>
          <TwitterIcon color="twitter" />
          <Spacing left="xs" />
          Twitter
        </ShareItem>
      </TwitterShareButton>

      <LinkedinShareButton url={url} title={title}>
        <ShareItem>
          <LinkedInIcon color="linkedIn" />
          <Spacing left="xs" />
          LinkedIn
        </ShareItem>
      </LinkedinShareButton>

      <ShareButton radius="none" text size="xxs" onClick={saveToClipboard}>
        <LinkIcon />
        <Spacing left="xs" />
        Copy link
      </ShareButton>
    </SharePopover>
  );
};

export default forwardRef(PostCardShare);

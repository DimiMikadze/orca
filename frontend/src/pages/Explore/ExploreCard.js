import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Spacing } from 'components/Layout';
import { LikeIcon, PostCommentIcon } from 'components/icons';

const Overlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  bottom: 0;
  opacity: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  transition: opacity 0.3s, visibility 0.3s;
  background-color: rgba(0, 0, 0, 0.3);
  color: ${p => p.theme.colors.white};
`;

const Root = styled.div`
  width: 100%;
  position: relative;
  cursor: pointer;
  box-shadow: ${p => p.theme.shadows.sm};
  border-radius: ${p => p.theme.radius.sm};
  overflow: hidden;

  &:hover ${Overlay} {
    opacity: 1;
  }
`;

const Photo = styled.div`
  width: 100%;
  height: 200px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  background-color: ${p => p.theme.colors.grey[300]};
`;

const ExploreCard = ({ openPostPopup, image, countLikes, countComments }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(
    () => {
      const img = new Image();
      img.src = image;

      img.onload = () => {
        setImageLoaded(true);
      };

      return () => {
        img.onload = null;
      };
    },
    [image]
  );

  return (
    <Root>
      <Photo style={imageLoaded ? { backgroundImage: `url(${image})` } : {}} />

      <Overlay onClick={openPostPopup}>
        <LikeIcon color="white" />

        <Spacing left="xs" right="lg">
          {countLikes}
        </Spacing>

        <PostCommentIcon color="white" />

        <Spacing left="xs">{countComments}</Spacing>
      </Overlay>
    </Root>
  );
};

ExploreCard.propTypes = {
  openPostPopup: PropTypes.func.isRequired,
  image: PropTypes.string.isRequired,
  countLikes: PropTypes.number.isRequired,
  countComments: PropTypes.number.isRequired,
};

export default ExploreCard;

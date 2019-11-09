import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Container = styled.div`
  width: ${p => p.width && `${p.width}px`};
  height: ${p => p.height && `${p.height}px`};
  display: ${p => p.inline && `inline-block`};
  margin-top: ${p => p.theme.spacing[p.top]};
  margin-left: ${p => p.theme.spacing[p.left]};
  margin-right: ${p => p.theme.spacing[p.right]};
  margin-bottom: ${p => p.theme.spacing[p.bottom]};
  background-color: ${p => p.theme.colors.grey[200]};
  border-radius: ${p =>
    p.radius ? p.theme.radius[p.radius] : p.theme.radius.sm};
`;

/**
 * Renders an UI block to inform a user, that content will be shown here after loading
 */
const Skeleton = ({
  count,
  width,
  height,
  inline,
  top,
  right,
  bottom,
  left,
  radius,
}) => {
  const loopSkeleton = () => {
    let skeleton = [];
    for (let i = 0; i < count; i++) {
      skeleton.push(
        <Container
          key={i}
          top={top}
          left={left}
          right={right}
          width={width}
          height={height}
          inline={inline}
          bottom={bottom}
          radius={radius}
        />
      );
    }
    return skeleton;
  };

  return loopSkeleton();
};

Skeleton.propTypes = {
  inline: PropTypes.bool,
  count: PropTypes.number,
  width: PropTypes.number,
  left: PropTypes.string,
  top: PropTypes.string,
  right: PropTypes.string,
  bottom: PropTypes.string,
  height: PropTypes.number,
};

Skeleton.defaultProps = {
  count: 1,
};

export default Skeleton;

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Spacing } from 'components/Layout';
import { UploadImageIcon } from 'components/icons';

const Input = styled.input`
  display: none;
`;

const Label = styled.label`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 9px 14px;
  cursor: pointer;
  transition: background-color 0.1s;
  font-weight: ${(p) => p.theme.font.weight.bold};
  border-radius: ${(p) => p.theme.radius.lg};
  background-color: ${(p) => p.theme.colors.grey[100]};
  font-size: ${(p) => p.theme.font.size.xxs};

  &:hover {
    background-color: ${(p) => p.theme.colors.grey[300]};
  }
`;

/**
 * Component for uploading post image
 */
const PostImageUpload = ({ handleChange, label }) => (
  <>
    <Input name="image" onChange={handleChange} type="file" id="post-image" accept="image/x-png,image/jpeg" />

    <Label htmlFor="post-image">
      <UploadImageIcon />

      {label && <Spacing left="xs">{label}</Spacing>}
    </Label>
  </>
);

PostImageUpload.propTypes = {
  handleChange: PropTypes.func.isRequired,
  label: PropTypes.string,
};

export default PostImageUpload;

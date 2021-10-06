import React, { ChangeEvent, FC } from 'react';
import styled from 'styled-components';

import { Spacing } from '../ui';
import { UploadIcon } from '../ui/icons';

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

interface PostImageUploadProps {
  handleChange: (e: ChangeEvent) => void;
  label?: string;
}

const PostImageUpload: FC<PostImageUploadProps> = ({ handleChange, label }) => (
  <>
    <Input name="image" onChange={handleChange} type="file" id="post-image" accept="image/x-png,image/jpeg" />

    <Label htmlFor="post-image">
      <UploadIcon />

      {label && <Spacing left="xs">{label}</Spacing>}
    </Label>
  </>
);

export default PostImageUpload;

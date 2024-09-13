import axios from 'axios';
import { ChangeEvent, FC, useEffect } from 'react';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { MaxImageSize } from '../../constants';
import { RootState } from '../../store';
import { addUserCover, addUserImage, AuthActionTypes } from '../../store/auth';
import { ProfileLoading } from '../Profile/Profile';
import { UploadIcon } from '../ui/icons';
import { Input, Label, Text } from './style';
import { Dispatch } from 'redux';

interface UploadImageProps {
  isCover?: boolean;
  setIsLoading: (param: ProfileLoading) => void;
}

const createUploadImage = async ({ image, isCover, imagePublicId, coverImagePublicId }) => {
  const formData = new FormData();
  formData.append('image', image);
  formData.append('isCover', isCover);
  formData.append('imagePublicId', imagePublicId);
  formData.append('coverImagePublicId', coverImagePublicId);

  const newImage = await axios.post('/users/upload-photo', formData);
  return newImage;
};

const UploadImage: FC<UploadImageProps> = ({ isCover = false, setIsLoading }) => {
  const authUser = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<Dispatch<AuthActionTypes>>();

  const { mutateAsync, isLoading: isFetching } = useMutation(createUploadImage);

  useEffect(() => {
    if (!isFetching) {
      return;
    }

    setIsLoading(isCover ? ProfileLoading.CoverPicture : ProfileLoading.ProfilePicture);
  }, [isFetching, setIsLoading, isCover]);

  const handleChange = async (e: ChangeEvent) => {
    const file = (e.target as HTMLInputElement).files[0];

    if (!file) return;
    if (!file.type.match(/image-*/)) return;
    if (file.size >= MaxImageSize.Post) {
      alert(`File size should be less than ${MaxImageSize.Post / 1000000}MB`);
      return;
    }
    try {
      const updateImage = await mutateAsync({
        image: file,
        isCover: isCover,
        imagePublicId: authUser.imagePublicId ? authUser.imagePublicId : '',
        coverImagePublicId: authUser.coverImagePublicId ? authUser.coverImagePublicId : '',
      });
      setIsLoading(null);
      if (isCover) {
        dispatch(
          addUserCover({
            coverImage: updateImage.data.coverImage,
            coverImagePublicId: updateImage.data.coverImagePublicId,
          })
        );
      } else {
        dispatch(
          addUserImage({
            image: updateImage.data.image,
            imagePublicId: updateImage.data.imagePublicId,
          })
        );
      }
    } catch (error) {
      console.error('An error occurred while uploading an image: ', error);
    }

    (e.target as HTMLInputElement) = null;
  };

  return (
    <form>
      <Input
        name="image"
        type="file"
        onChange={handleChange}
        id={isCover ? 'cover-upload' : 'profile-upload'}
        accept="image/x-png,image/jpeg"
      />

      <Label isCover={isCover} htmlFor={isCover ? 'cover-upload' : 'profile-upload'}>
        <UploadIcon width="16" />

        {isCover && <Text>Edit Cover Photo</Text>}
      </Label>
    </form>
  );
};

export default UploadImage;

import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import { v4 as uuid } from 'uuid';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

interface UploadToCloudinaryPayload {
  secure_url: string;
  public_id: string;
}

export const uploadToCloudinary = async (
  stream: any,
  folder: string,
  imagePublicId?: string
): Promise<UploadToCloudinaryPayload> => {
  // If the imagePublicId param is defined, we should overwrite the image.
  const options = imagePublicId ? { public_id: imagePublicId, overwrite: true } : { public_id: `${folder}/${uuid()}` };

  return new Promise((resolve, reject) => {
    const streamLoad = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    });
    return streamifier.createReadStream(stream.buffer).pipe(streamLoad);
  });
};

interface DeleteFromCloudinaryPayload {
  result: string;
}

export const deleteFromCloudinary = async (publicId: string): Promise<DeleteFromCloudinaryPayload> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    });
  });
};

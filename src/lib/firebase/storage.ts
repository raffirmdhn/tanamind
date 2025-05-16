// src/lib/firebase/storage.ts
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import { storage } from "@/lib/firebase/client";

// Replace the two functions below
interface UpdateRestaurantImageParams {
  uId: string;
  plantId: string;
  image: File;
}
export async function postGrowthReportImage({ uId, plantId, image }: UpdateRestaurantImageParams) {
  try {
    if (!uId || !plantId) {
      throw new Error("No user ID or plant ID has been provided.");
    }

    if (!image || !image.name) {
      throw new Error("A valid image has not been provided.");
    }

    const filePath = `images/${uId}/${plantId}/${image.name}`;
    const newImageRef = ref(storage, filePath);
    const uploadTask = uploadBytesResumable(newImageRef, image);

    // const publicImageUrl = await uploadImage(restaurantId, image);
    // await updateRestaurantImageReference(restaurantId, publicImageUrl);

    return 'publicImageUrl';
  } catch (error) {
    console.error("Error in updateRestaurantImage:", error);
    throw error;
  }
}

interface UploadImageParams {
  uId: string;
  image: File;
  plantId: string;
}

async function uploadImage({ image, plantId, uId }: UploadImageParams): Promise<string> {
  const filePath = `images/${uId}/${plantId}/${image.name}`;
  const newImageRef = ref(storage, filePath);
  await uploadBytesResumable(newImageRef, image);

  return await getDownloadURL(newImageRef);
}
// Replace the two functions above

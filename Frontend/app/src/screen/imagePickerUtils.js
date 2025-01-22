// imagePickerUtils.js

import * as ImagePicker from 'expo-image-picker';

/**
 * Launches the image library and allows the user to pick an image or video.
 * @returns {Promise<string | null>} The URI of the selected image or video, or null if canceled.
 */
export const pickImage = async () => {
  // Launch image library
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images', 'videos'], // Specify media types
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  console.log(result);

  if (!result.canceled) {
    return result.assets[0].uri; // Return the URI of the selected image or video
  }
  return null; // Return null if the selection was canceled
};
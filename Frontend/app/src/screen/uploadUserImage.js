import CONFIG from "./config"; // Ensure API_BASE_URL is correctly set

const uploadUserImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`${CONFIG.API_BASE_URL}/uploads/user`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload user image.");
    }

    const fileName = await response.text();
    return fileName; // This is the uploaded file's name
  } catch (error) {
    console.error("Error uploading user image:", error);
    return null;
  }
};

export default uploadUserImage;

// Cloudinary upload utility
export async function uploadToCloudinary(file: File): Promise<string> {
  const cloudName = 'djscwzftc';
  const uploadPreset = 'the-plush-stories';

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', 'plush-stories');

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Failed to upload image to Cloudinary');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
}

// Optional: Delete from Cloudinary (requires signed requests, so we'll skip for now)
export async function deleteFromCloudinary(url: string): Promise<void> {
  // Cloudinary deletion requires backend API with signed requests
  // For now, we'll just log it - images will remain in Cloudinary
  console.log('Image deletion from Cloudinary requires backend setup:', url);
}

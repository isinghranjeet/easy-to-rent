/**
 * Converts a File object to a base64 encoded string.
 * @param file - The file to convert
 * @returns A promise that resolves to the base64 string
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Validates if a file is an image and within size limits.
 * @param file - The file to validate
 * @param maxSizeMB - Maximum size in MB (default 5)
 * @returns { valid: boolean; error?: string }
 */
export const validateImage = (file: File, maxSizeMB: number = 5): { valid: boolean; error?: string } => {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'File must be an image (JPEG, PNG, or WEBP)' };
  }
  
  if (file.size > maxSizeMB * 1024 * 1024) {
    return { valid: false, error: `File size must be less than ${maxSizeMB}MB` };
  }
  
  return { valid: true };
};

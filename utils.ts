/**
 * Converts a File object to a Base64 string.
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
 * Fetches an image from a URL and converts it to Base64.
 * Used for the trending templates.
 */
export const urlToBase64 = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return await fileToBase64(new File([blob], "template.jpg", { type: "image/jpeg" }));
  } catch (error) {
    console.error("Error converting URL to base64:", error);
    throw error;
  }
};

/**
 * Strips the data:image/...;base64, prefix for Gemini API
 */
export const stripBase64Prefix = (base64: string): string => {
  return base64.split(',')[1] || base64;
};

/**
 * Gets the MIME type from a base64 string
 */
export const getMimeTypeFromBase64 = (base64: string): string => {
  return base64.substring(base64.indexOf(':') + 1, base64.indexOf(';')) || 'image/jpeg';
};
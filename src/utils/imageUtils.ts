
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the metadata part (e.g., "data:image/png;base64,")
      const base64Content = result.split(',')[1];
      if (base64Content) {
        resolve(base64Content);
      } else {
        reject(new Error("Failed to extract base64 content from file."));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

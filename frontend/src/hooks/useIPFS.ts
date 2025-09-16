import { useState } from 'react';
import axios from 'axios';

const useIPFS = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const uploadFile = async (file: File): Promise<string | null> => {
    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_PINATA_JWT}`
        }
      });

      return response.data.IpfsHash;
    } catch (e) {
      setError(e as Error);
      console.error("Error uploading file to IPFS:", e);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadFile, isUploading, error };
};

export default useIPFS;
import { useState } from 'react';
import useIPFS from '../hooks/useIPFS';
import { useRegister } from '../hooks/useRegister';

const RegistrationForm = () => {
  const [name, setName] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const { uploadFile, isUploading, error: ipfsError } = useIPFS();
  const { registerUser, isRegistering, registrationError } = useRegister();

  const handleRegister = async () => {
    if (!name || !image) {
      alert('Please provide a username and an image.');
      return;
    }

    const imageCid = await uploadFile(image);
    if (imageCid) {
      registerUser(name, imageCid);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center">Register a Profile</h2>
      <div>
        <label htmlFor="username" className="text-sm font-medium text-gray-700">Username</label>
        <input
          id="username"
          type="text"
          placeholder="Choose a unique username"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          disabled={isUploading || isRegistering}
        />
      </div>
      <div>
        <label htmlFor="avatar" className="text-sm font-medium text-gray-700">Profile Picture</label>
        <input
          id="avatar"
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
          className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md"
          disabled={isUploading || isRegistering}
        />
      </div>
      <button 
        onClick={handleRegister} 
        className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
        disabled={isUploading || isRegistering || !name || !image}
      >
        {isUploading ? 'Uploading Image...' : isRegistering ? 'Registering...' : 'Register'}
      </button>
      
      {ipfsError && <p className="text-red-500 text-sm mt-2 text-center">IPFS Upload Failed: {ipfsError.message}</p>}
      {registrationError && <p className="text-red-500 text-sm mt-2 text-center">Registration Failed: {registrationError.message}</p>}
    </div>
  );
};

export default RegistrationForm;
import { useState, useEffect, useRef, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { updateProfile } from '../services/ProfileService';
import { Button } from '../components/Button';
import { LuImagePlus } from 'react-icons/lu';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../services/firebase';

const ProfilePage = () => {
  const { userInfo, setUserInfo } = useContext(AppContext);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(
    userInfo.file ? `${userInfo.file}` : '/user.webp'
  );

  const [userName, setUserName] = useState(userInfo.username || '');
  const [email, setEmail] = useState(userInfo.email || '');

  useEffect(() => {
    setUserName(userInfo.username);
    setEmail(userInfo.email);
    setImagePreview(userInfo.file || '/user.webp');
    console.log(userInfo.file);
  }, [userInfo]);

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);

      const previewUrl = URL.createObjectURL(selectedFile);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let downloadUrl = userInfo.file;
      if (file) {
        const storageRef = ref(storage, `users/${file.name}`);
        await uploadBytes(storageRef, file);
        downloadUrl = await getDownloadURL(storageRef);
      }
      const profileData = {
        username: userName,
        email: email,
        file: downloadUrl,
      };

      const updatedProfile = await updateProfile(profileData);
      alert('Profile updated successfully');

      setUserInfo(updatedProfile);
      if (updatedProfile.file) {
        setImagePreview(updatedProfile.file);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className='w-[60%] lg:mt-10 mt-14 mx-auto flex-col flex gap-4 items-center justify-center'>
      <h2 className='text-3xl font-bold'>Editar perfil</h2>
      <div className='relative w-60 h-60 cursor-pointer '>
        <img
          className='w-full h-full rounded-full object-cover cursor-pointer'
          src={imagePreview ? imagePreview : `${userInfo.file}`}
        />
        <div className='group' onClick={handleImageClick}>
          <div className='absolute inset-0 bg-gray-900 opacity-0 group-hover:opacity-60 rounded-full transition-opacity duration-300 '></div>
          <LuImagePlus className='absolute inset-0 m-auto text-white text-4xl opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
        </div>
      </div>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <div className='flex lg:flex-row flex-col gap-2'>
          <label>Nombre de usuario:</label>
          <input
            type='text'
            name='username'
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className='border px-2 rounded flex-1'
          />
        </div>
        <div className='flex lg:flex-row flex-col gap-2'>
          <label>Email:</label>
          <input
            type='email'
            name='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='border px-2 rounded flex-1'
          />
        </div>

        <input
          type='file'
          className='border p-2 rounded'
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        <Button
          type='submit'
          className='bg-blue-500 text-white p-2 rounded mt-4'
        >
          Guardar cambios
        </Button>
      </form>
    </div>
  );
};

export default ProfilePage;

import { useState } from 'react';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [file] = useState('https://blog-app-mir.vercel.app/public/user.webp');

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('file', file);

      /*  const responseFile = await fetch(`${window.location.origin}/${files}`);
      const blob = await responseFile.blob();
      formData.set('file', blob, 'user.webp');*/

      const response = await fetch(
        'https://blog-app-server-mir.vercel.app/api/register',
        {
          method: 'POST',
          body: formData,
          credentials: 'include',
        }
      );

      if (response.ok) {
        alert('Ha sido registrado con éxito!');
        navigate('/login');
      } else {
        alert('Registro fallido');
      }
    } catch (e) {
      alert('Registro fallido');
    }
  };
  return (
    <div className='w-[20%] mx-auto mt-20 '>
      <h2 className='text-2xl font-bold text-center mb-2'>Registro</h2>
      <form
        onSubmit={handleSubmit}
        className='flex flex-col justify-center gap-2'
      >
        <input
          placeholder='Nombre de usuario'
          className=' border-2 border-gray-200 p-2 rounded-md'
          value={username}
          onChange={(e) => setUserName(e.target.value)}
        />
        <input
          type='email'
          placeholder='Correo electrónico'
          className=' border-2 border-gray-200 p-2 rounded-md'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type='password'
          placeholder='Contraseña'
          className=' border-2 border-gray-200 p-2 rounded-md'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button>Crear cuenta</Button>
      </form>
    </div>
  );
};

export default RegisterPage;

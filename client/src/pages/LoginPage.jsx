import { useState, useContext } from 'react';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUserInfo } = useContext(AppContext);

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        'https://blog-app-server-three.vercel.app/api/login',
        {
          method: 'POST',
          body: JSON.stringify({ email, password }),
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        }
      );

      if (response.ok) {
        const userInfo = await response.json();
        setUserInfo(userInfo);
        sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
        navigate('/');
      } else {
        alert('Acceso fallido');
      }
    } catch (e) {
      alert('Acceso fallido');
    }
  };
  return (
    <div className='w-[20%] mx-auto mt-20 '>
      <h2 className='text-2xl font-bold text-center  mb-2'>Inicio de sesión</h2>
      <form
        onSubmit={handleSubmit}
        className='flex flex-col justify-center gap-2'
      >
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

        <Button>Acceder</Button>
      </form>
    </div>
  );
};

export default LoginPage;

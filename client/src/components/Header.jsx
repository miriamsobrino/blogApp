import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { useEffect, useContext, useState } from 'react';
import { MdLogin } from 'react-icons/md';
import { RiLogoutBoxLine } from 'react-icons/ri';
import { CgProfile } from 'react-icons/cg';
import { useNavigate } from 'react-router-dom';
import { IoSearch } from 'react-icons/io5';
import { AiFillPlusCircle } from 'react-icons/ai';
import { FiEdit } from 'react-icons/fi';

export const Header = () => {
  const { userInfo, setUserInfo, posts, setFilteredPosts } =
    useContext(AppContext);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [value, setValue] = useState('');
  const navigate = useNavigate();
  const email = userInfo?.email;
  const file = userInfo?.file;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showProfileMenu &&
        !event.target.closest('.profile-menu') &&
        !event.target.closest('.profile-pic')
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);

  const logout = () => {
    fetch('http://localhost:8080/api/logout', {
      credentials: 'include',
      method: 'POST',
    });
    setUserInfo(null);
    sessionStorage.removeItem('userInfo');
    setShowProfileMenu(false);
    navigate('/login');
  };

  const openProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const searchedPosts = posts.filter((post) =>
      post.title.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredPosts(searchedPosts);

    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  useEffect(() => {
    const searchedPosts = posts.filter((post) =>
      post.title.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredPosts(searchedPosts);
  }, [value, posts, setFilteredPosts]);
  return (
    <header className='w-[60%] mx-auto mt-2'>
      <nav className='flex justify-between py-4 px-8 items-center'>
        <Link to='/'>
          <h1 className='text-3xl font-bold'>BlogApp</h1>
        </Link>
        <form
          className='flex w-full items-center gap-2 mr-4'
          onSubmit={handleSubmit}
        >
          <input
            placeholder='Buscar...'
            className='border-2 border-slate-100 py-1  rounded-md w-full ml-20  px-2 '
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button>
            <IoSearch size={20} className=' ' />
          </button>
        </form>
        {!email && (
          <ul className='ml-4 flex gap-4 items-center'>
            <li>
              <Link to='/register'>Registrarse</Link>
            </li>
            <li>
              <Link
                className='bg-sky-500 py-1 px-2 flex items-center  gap-2 font-bold rounded-md text-white'
                to='/login'
              >
                <MdLogin size={20} />
                Acceder
              </Link>
            </li>
          </ul>
        )}
        {email && (
          <>
            <ul className='ml-4 flex gap-4 w-60 items-center'>
              <li>
                <Link
                  className='bg-sky-500 py-1 px-2 flex gap-2 items-center font-bold rounded-md text-white'
                  to='/create'
                >
                  Añadir
                  <AiFillPlusCircle size={20} />
                </Link>
              </li>
              <li className='relative'>
                <img
                  onClick={openProfileMenu}
                  className='h-12 w-12 object-cover rounded-full cursor-pointer profile-pic '
                  src={file}
                  alt='Perfil'
                />
                {showProfileMenu && (
                  <div className='absolute top-12 mt-2 text-right right-0 bg-slate-100 w-32 rounded shadow-lg profile-menu'>
                    <ul className=' cursor-pointer '>
                      <Link
                        to='/profile'
                        className='p-2 rounded border-b-2  hover:bg-slate-200 flex items-center justify-between gap-2'
                      >
                        Perfil <CgProfile size={20} />
                      </Link>
                      <Link
                        to='/posts'
                        className='p-2 rounded border-b-2  hover:bg-slate-200 flex items-center justify-between gap-2'
                      >
                        Mis posts <FiEdit size={20} />
                      </Link>
                      <li
                        onClick={logout}
                        className='p-2 rounded hover:bg-slate-200 flex items-center justify-between gap-3
                      '
                      >
                        Salir <RiLogoutBoxLine size={20} />
                      </li>
                    </ul>
                  </div>
                )}
              </li>
            </ul>
          </>
        )}
      </nav>
    </header>
  );
};

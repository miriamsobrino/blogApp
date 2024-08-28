import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { useEffect, useContext, useState, useRef } from 'react';
import { MdLogin } from 'react-icons/md';
import { RiLogoutBoxLine } from 'react-icons/ri';
import { CgProfile } from 'react-icons/cg';
import { useNavigate } from 'react-router-dom';
import { IoSearch } from 'react-icons/io5';
import { AiFillPlusCircle } from 'react-icons/ai';
import { FiEdit } from 'react-icons/fi';
import { RxHamburgerMenu } from 'react-icons/rx';

export const Header = () => {
  const { userInfo, setUserInfo, posts, setFilteredPosts } =
    useContext(AppContext);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [value, setValue] = useState('');
  const navigate = useNavigate();
  const email = userInfo?.email;
  const file = userInfo?.file;

  const mobileMenuRef = useRef(null);
  const hamburgerRef = useRef(null);

  const logout = () => {
    fetch('https://blog-app-server-three.vercel.app/api/logout', {
      credentials: 'include',
      method: 'POST',
    });
    setUserInfo(null);
    sessionStorage.removeItem('userInfo');
    setShowProfileMenu(false);
    setIsMobileMenuOpen(false);
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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showProfileMenu &&
        !event.target.closest('.profile-menu') &&
        !event.target.closest('.profile-pic')
      ) {
        setShowProfileMenu(false);
      }

      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu, isMobileMenuOpen]);

  return (
    <header className='lg:w-[60%] w-full mx-auto mt-2  '>
      <nav className='flex justify-between py-4 px-8 items-center'>
        <Link to='/'>
          <h1 className='text-3xl font-bold'>BlogApp</h1>
        </Link>
        <form
          className='flex lg:static absolute top-20 w-[340px] lg:w-full pr-4 lg:pr-0 items-center gap-2 lg:mr-4 lg:ml-0 '
          onSubmit={handleSubmit}
        >
          <input
            placeholder='Buscar...'
            className='border-2 border-slate-100 py-1 w-full rounded-md  lg:ml-20  px-2 '
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button>
            <IoSearch size={20} className=' ' />
          </button>
        </form>
        {!email && (
          <RxHamburgerMenu
            size={24}
            className='lg:hidden cursor-pointer'
            onClick={toggleMobileMenu}
          />
        )}

        <div
          ref={mobileMenuRef}
          className={`lg:flex gap-4 items-center ${
            isMobileMenuOpen
              ? 'block absolute top-16 right-0 text-center w-full bg-gray-50 lg:bg-transparent lg:py-0 py-6'
              : 'hidden'
          } lg:block`}
        >
          {!email && (
            <ul className='lg:ml-4 flex flex-col lg:flex-row lg:gap-4  items-center  lg:pr-0 pr-6 '>
              <li className='border-b-2 border-slate-100 lg:border-none w-full'>
                <Link to='/register'>Registrarse</Link>
              </li>
              <li>
                <Link
                  className='lg:bg-sky-500 lg:py-1 lg:px-2 flex items-center gap-2 lg:font-bold lg:rounded-md lg:text-white'
                  to='/login'
                >
                  <MdLogin size={20} className='hidden lg:block' />
                  Acceder
                </Link>
              </li>
            </ul>
          )}
        </div>
        {email && (
          <ul className='ml-4 lg:flex flex-col lg:flex-row gap-4 items-center'>
            <li>
              <Link
                className='bg-sky-500 py-1 px-2  gap-2 items-center font-bold rounded-md text-white hidden lg:flex'
                to='/create'
              >
                Añadir
                <AiFillPlusCircle size={20} />
              </Link>
            </li>
            <li className='relative w-[60px]'>
              <img
                onClick={openProfileMenu}
                className='lg:h-12 lg:w-12 w-10 ml-4 lg:ml-0  object-cover rounded-full cursor-pointer profile-pic'
                src={file}
                alt='Perfil'
              />
              {showProfileMenu && (
                <div className='absolute top-12 mt-2 z-50 text-right right-0 bg-slate-100 w-32 rounded shadow-lg profile-menu'>
                  <ul className='cursor-pointer'>
                    <Link
                      to='/profile'
                      className='p-2 rounded border-b-2 hover:bg-slate-200 flex items-center justify-between gap-2'
                    >
                      Perfil <CgProfile size={20} />
                    </Link>
                    <Link
                      to='/posts'
                      className='p-2 rounded border-b-2 hover:bg-slate-200 flex items-center justify-between gap-2'
                    >
                      Mis posts <FiEdit size={20} />
                    </Link>
                    <li
                      onClick={logout}
                      className='p-2 rounded hover:bg-slate-200 flex items-center justify-between gap-3'
                    >
                      Salir <RiLogoutBoxLine size={20} />
                    </li>
                  </ul>
                </div>
              )}
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
};

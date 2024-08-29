import { Aside } from '../components/Aside';
import { Post } from '../components/Post';
import { AppContext } from '../context/AppContext';
import { useContext } from 'react';

const HomePage = () => {
  return (
    <div className='w-full lg:w-[60%] mx-auto px-8 items-start flex flex-col lg:flex-row gap-8 lg:gap-14 mt-10'>
      <Aside />
      <div className='flex flex-col w-full mb-10 '>
        <h2 className='text-3xl font-bold '>Últimos posts</h2>
        <div className='border-b-2 border-gray-200 mt-2'></div>
        <Post />
      </div>
    </div>
  );
};

export default HomePage;

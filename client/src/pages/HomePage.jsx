import { Aside } from '../components/Aside';
import { Post } from '../components/Post';
import { AppContext } from '../context/AppContext';
import { useContext } from 'react';

const HomePage = () => {
  const { loading } = useContext(AppContext);
  return (
    <div className='w-[60%] mx-auto px-8 items-start flex gap-14 mt-10'>
      <Aside />
      <div className='flex flex-col w-full mb-10 '>
        <h2 className='text-3xl font-bold '>Últimos posts</h2>
        <div className='border-b-2 border-gray-200 mt-2'></div>
        {loading ? <span class='loader'></span> : <Post />}
      </div>
    </div>
  );
};

export default HomePage;

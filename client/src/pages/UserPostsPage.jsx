import React from 'react';
import { useEffect, useState } from 'react';
import { getUserPosts } from '../services/getUserPosts';
import { CardPost } from '../components/CardPost';

const UserPostsPage = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const data = await getUserPosts();
        setPosts(data);
      } catch (error) {
        console.error('Error al obtener los artículos');
      }
    };

    fetchUserPosts();
  }, []);

  const handleDeletePost = (postId) => {
    setPosts(posts.filter((post) => post._id !== postId));
  };
  return (
    <div className='w-[60%] mt-10 mx-auto flex-col flex gap-2 px-8'>
      <h2 className='text-3xl font-bold '>Mis posts</h2>
      <div className='border-b-2 border-gray-200 mb-2'></div>
      <div className='grid grid-cols-3 gap-4 content-center  '>
        {posts.map((post) => (
          <CardPost
            key={post._id}
            post={post}
            onDelete={() => handleDeletePost(post._id)}
          />
        ))}
      </div>
    </div>
  );
};

export default UserPostsPage;

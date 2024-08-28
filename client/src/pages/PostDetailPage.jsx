import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPostDetail } from '../services/PostsService';
const PostDetailPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState('');

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        const data = await getPostDetail(id);
        setPost(data);
      } catch (error) {
        console.error('Error al obtener los detalles del artículo:', error);
      }
    };

    fetchPostDetail();
  }, [id]);

  return (
    <article className='w-[60%] mx-auto px-8 items-center justify-center flex flex-col gap-8 text-pretty text-left m-10'>
      <img className='w-[60%] object-contain' src={post.file} />
      {post.user && (
        <div className='flex'>
          <small>Creado por @{post.user.username}</small>
          <img
            className='w-6 h-6 rounded-full object-cover mx-2'
            src={post.user.file}
          />
        </div>
      )}
      <h2 className='font-bold text-3xl text-left'>{post.title}</h2>
      <h3 className='text-xl text-pretty'>{post.summary}</h3>
      <div
        className='text-left'
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
};

export default PostDetailPage;

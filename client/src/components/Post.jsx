import { Link } from 'react-router-dom';
import { Badge } from './Badge';
import { AppContext } from '../context/AppContext';
import { useContext, useState, useEffect } from 'react';
import { Button } from './Button';

export const Post = () => {
  const {
    filteredPosts,
    loading: globalLoading,
    activeCategory,
  } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 4;
  const totalPosts = filteredPosts.length;
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(totalPosts / postsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };
  useEffect(() => {
    if (globalLoading) {
      setIsLoading(true);
    } else {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [globalLoading]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  return (
    <div className='flex flex-col gap-2'>
      {isLoading ? (
        <div className='flex justify-center items-center h-64'>
          <span className='loader'></span>
        </div>
      ) : currentPosts.length > 0 ? (
        currentPosts.map((post) => (
          <article
            key={post._id}
            className='my-4 flex gap-4 justify-start items-center '
          >
            <img
              src={post.file}
              className='object-cover min-w-80 max-w-80 min-h-[200px] max-h-[200px]'
            />

            <div className='flex flex-col justify-between gap-2'>
              <div className='flex gap-2'>
                <img
                  className='w-6 h-6 rounded-full object-cover'
                  src={post.user.file}
                />
                <small className='text-slate-700 mb-2'>
                  @{post.user.username}
                </small>
              </div>

              <div>
                <Badge>{post.category}</Badge>
                <p className='font-bold text-xl mt-4 line-clamp-1'>
                  {post.title}
                </p>

                <p className='line-clamp-2 mb-4 mt-2 font-light'>
                  {post.summary}
                </p>

                <Link to={`/post/${post._id}`}>
                  <Button>Leer más</Button>
                </Link>
              </div>
            </div>
          </article>
        ))
      ) : (
        !isLoading && (
          <p className='mt-4 w-full block'>
            No se han encontrado resultados para esta categoría.
          </p>
        )
      )}
      {totalPosts > postsPerPage && (
        <div
          className={`flex justify-center items-center gap-4 mt-6 text-sm ${
            isLoading ? 'hidden' : ''
          }`}
        >
          <Button onClick={previousPage} disabled={currentPage === 1}>
            Anterior
          </Button>
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <Button
            onClick={nextPage}
            disabled={currentPage === totalPages || currentPage <= 0}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
};

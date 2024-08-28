import { createContext, useState, useEffect } from 'react';
import { getPosts } from '../services/PostsService';
import { getCategories } from '../services/getCategories';
import { getProfile } from '../services/ProfileService';
import { getUsers } from '../services/getUsers';

export const AppContext = createContext({});

export function AppContextProvider({ children }) {
  const [userInfo, setUserInfo] = useState(() => {
    const storedUserInfo = sessionStorage.getItem('userInfo');
    return storedUserInfo ? JSON.parse(storedUserInfo) : null;
  });
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const data = await getPosts();
        setPosts(data);
        setFilteredPosts(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      setLoading(true);
      try {
        const data = await getCategories();
        setCategories(data);
        setActiveCategory(data[0].name);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getProfile();
        setUserInfo(data);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener la información del usuario:', error);
        setLoading(false);
      }
    };

    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await getUsers();
        setUsers(data);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener los usuarios', error);
        setLoading(false);
      }
    };
    fetchPosts();
    fetchCategories();
    fetchProfile();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (activeCategory === 'todas') {
      setFilteredPosts(posts);
    } else if (activeCategory) {
      const resultFilteredPosts = posts.filter(
        (post) => post.category === activeCategory
      );
      setFilteredPosts(resultFilteredPosts);
    }
  }, [activeCategory, posts]);

  const removePost = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
    setFilteredPosts((prevFilteredPosts) =>
      prevFilteredPosts.filter((post) => post._id !== postId)
    );
  };

  const updatePostInState = (updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === updatedPost._id ? updatedPost : post
      )
    );

    setFilteredPosts((prevFilteredPosts) =>
      prevFilteredPosts.map((post) =>
        post._id === updatedPost._id ? updatedPost : post
      )
    );
  };

  return (
    <AppContext.Provider
      value={{
        userInfo,
        posts,
        categories,
        filteredPosts,
        activeCategory,
        users,
        loading,
        removePost,
        updatePostInState,
        setUserInfo,
        setActiveCategory,
        setPosts,
        setFilteredPosts,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

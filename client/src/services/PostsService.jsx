import { ref, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

export const getPosts = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/posts', {
      method: 'GET',
      credentials: 'include',
    });
    const posts = response.json();
    return posts;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const getPostDetail = async (id) => {
  try {
    const response = await fetch(`http://localhost:8080/api/post/${id}`, {
      method: 'GET',
      credentials: 'include',
    });

    const postInfo = response.json();
    return postInfo;
  } catch (error) {
    console.error('Error', error);
    throw error;
  }
};

export const deletePostWithImage = async (id, imageUrl) => {
  try {
    const storageRef = ref(storage, imageUrl);
    await deleteObject(storageRef);
    const response = await fetch(
      `https://blog-app-server-three.vercel.app/api/post/${id}`,
      {
        method: 'DELETE',
        credentials: 'include',
      }
    );

    if (!response.ok) {
      throw new Error('Error al eliminar el artículo');
    }

    return response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updatePost = async (id, formData) => {
  try {
    const response = await fetch(
      `https://blog-app-server-three.vercel.app/api/post/${id}`,
      {
        method: 'PUT',
        credentials: 'include',
        body: formData,
      }
    );
    return response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};

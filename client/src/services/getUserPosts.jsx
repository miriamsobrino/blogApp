export const getUserPosts = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/user-posts', {
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

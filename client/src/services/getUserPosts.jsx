export const getUserPosts = async () => {
  try {
    const response = await fetch(
      'https://blog-app-server-mir.vercel.app/api/user-posts',
      {
        method: 'GET',
        credentials: 'include',
      }
    );
    if (!response.ok) {
      console.log(error);
    }
    const posts = await response.json();
    return posts;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

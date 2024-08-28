export const getUsers = async () => {
  try {
    const response = await fetch(
      'https://blog-app-server-mir.vercel.app/api/users',
      {
        method: 'GET',
        credentials: 'include',
      }
    );
    const users = response.json();
    return users;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

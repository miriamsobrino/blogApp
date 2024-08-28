export const getUsers = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/users', {
      method: 'GET',
      credentials: 'include',
    });
    const users = response.json();
    return users;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

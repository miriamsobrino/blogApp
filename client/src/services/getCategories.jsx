export const getCategories = async () => {
  try {
    const response = await fetch(
      'https://blog-app-server-mir.vercel.app/api/categories',
      {
        method: 'GET',
        credentials: 'include',
      }
    );
    const categories = response.json();
    return categories;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/categories', {
      method: 'GET',
      credentials: 'include',
    });
    const categories = response.json();
    return categories;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

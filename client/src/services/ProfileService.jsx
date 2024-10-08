export const getProfile = async () => {
  try {
    const response = await fetch(
      'https://blog-app-server-mir.vercel.app/api/profile',
      {
        method: 'GET',
        credentials: 'include',
      }
    );
    const profile = response.json();
    return profile;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const updateProfile = async (profileData) => {
  const response = await fetch(
    'https://blog-app-server-mir.vercel.app/api/profile',
    {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    }
  );
  return response.json();
};

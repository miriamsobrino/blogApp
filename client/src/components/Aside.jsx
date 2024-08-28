import { AppContext } from '../context/AppContext';
import { BadgeInteractive } from './BadgeInteractive';
import { useContext } from 'react';
export const Aside = () => {
  const { categories, activeCategory, setActiveCategory } =
    useContext(AppContext);

  const handleBadgeClick = (categoryName) => {
    setActiveCategory(categoryName);
  };

  return (
    <section className='w-[20%] mt-1'>
      <h2 className='text-2xl font-bold'>Categorías</h2>
      <div className='border-b-2 border-gray-200 mt-2'></div>
      <ul className='mt-4  flex-col flex gap-2'>
        {categories.map((category) => (
          <li key={category._id}>
            <BadgeInteractive
              focus={category.name === activeCategory}
              onClick={() => handleBadgeClick(category.name)}
            >
              {category.name}
            </BadgeInteractive>
          </li>
        ))}
      </ul>
    </section>
  );
};

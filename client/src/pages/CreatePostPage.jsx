import { useEffect, useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { getCategories } from '../services/getCategories';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../services/firebase';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const CreatePostPage = () => {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [files, setFiles] = useState('');
  const { setPosts, posts } = useContext(AppContext);
  const navigate = useNavigate();

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' },
      ],
      ['link'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      const fetchedCategories = await getCategories();
      setCategories(fetchedCategories);
      if (fetchedCategories.length > 0) {
        setCategory(fetchedCategories[1].name);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const storageRef = ref(storage, `posts/${files.name}`);
      await uploadBytes(storageRef, files);
      const downloadUrl = await getDownloadURL(storageRef);
      const postData = {
        title,
        summary,
        content,
        category,
        file: downloadUrl,
      };

      const response = await fetch(
        'https://blog-app-server-mir.vercel.app/api/posts',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData),
          credentials: 'include',
        }
      );

      if (response.ok) {
        alert('Post creado con éxito!');
        const newPost = await response.json();
        setPosts([newPost, ...posts]);
        navigate('/posts');
      } else {
        alert('Error al crear el post');
      }
    } catch (e) {
      alert('Error al crear el post');
    }
  };
  return (
    <div className='w-[50%] mx-auto mt-20 '>
      <h2 className='text-2xl font-bold text-center mb-2'>Post</h2>
      <form
        onSubmit={handleSubmit}
        className='flex flex-col justify-center gap-2'
      >
        <input
          type='file'
          className='flex w-full border-2 border-gray-200 rounded-md p-2  file:border-0  file:text-foreground  file:font-medium  focus-visible:outline-none disabled:opacity-50'
          onChange={(e) => setFiles(e.target.files[0])}
        />
        <input
          placeholder='Título'
          className=' border-2 border-gray-200 p-2 rounded-md'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          placeholder='Entradilla'
          className=' border-2 border-gray-200 p-2 rounded-md'
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />

        <ReactQuill
          theme='snow'
          className='h-60 mb-10'
          value={content}
          onChange={(newValue) => setContent(newValue)}
          modules={modules}
          formats={formats}
        />
        <div className='flex gap-2 justify-between items-center'>
          <label>Selecciona una categoría</label>
          <select
            value={category}
            className='border-2 border-gray-200 rounded-md w-9/12'
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories
              .filter((category) => category.name !== 'todas')
              .map((category) => (
                <option value={category.name} key={category.name}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>
        <Button>Crear post</Button>
      </form>
    </div>
  );
};

export default CreatePostPage;

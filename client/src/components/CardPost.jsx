import { Link } from 'react-router-dom';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { FaRegTrashAlt } from 'react-icons/fa';
import { MdEdit } from 'react-icons/md';
import { useState, useRef, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { deletePostWithImage, updatePost } from '../services/PostsService';
import { getCategories } from '../services/getCategories';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export const CardPost = ({ post, onDelete }) => {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    post.file ? `${post.file}` : ''
  );
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const { removePost, updatePostInState } = useContext(AppContext);
  const dialogRef = useRef(null);
  const dialogRefv2 = useRef(null);

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
    ,
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      const fetchedCategories = await getCategories();
      setCategories(fetchedCategories);
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    setTitle(post.title);
    setSummary(post.summary);
    setCategory(post.category);
    setContent(post.content);
  }, [post]);

  const openDeletePopUp = () => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
      setShowDeletePopUp(true);
    }
  };

  const openEditPopUp = () => {
    if (dialogRefv2.current) {
      dialogRefv2.current.showModal();
    }
  };

  const closeDeletePopUp = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
    } else if (dialogRefv2.current) {
      dialogRefv2.current.close();
    }
  };

  const closeEditPopUp = () => {
    if (dialogRefv2.current) {
      dialogRefv2.current.close();
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFiles(selectedFile);
      const previewUrl = URL.createObjectURL(selectedFile);
      setImagePreview(previewUrl);
    }
  };

  const handleOutsideClick = (event) => {
    if (dialogRef.current && event.target === dialogRef.current) {
      closeDeletePopUp();
    } else if (dialogRefv2.current && event.target === dialogRefv2.current) {
      closeEditPopUp();
    }
  };

  const handleDeletePost = async () => {
    try {
      await deletePostWithImage(post._id, post.file);
      removePost(post._id);
      onDelete(post._id);
      closeDeletePopUp();
    } catch (error) {
      console.error('Error al eliminar el post:', error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('summary', summary);
    formData.append('category', category);
    formData.append('content', content);
    if (files) {
      formData.append('file', files);
    }
    try {
      const updatedPost = await updatePost(post._id, formData);
      updatePostInState(updatedPost);
      closeEditPopUp();
    } catch (error) {
      console.error('Error al editar el post:', error.message);
    }
  };
  return (
    <div className='mb-8 flex flex-col w-80 max-h-96 min-h-96 justify-between'>
      <img
        src={imagePreview ? imagePreview : `${post.file}`}
        className='object-cover min-w-80 max-w-80 min-h-[200px] max-h-[200px] mb-4 '
        alt={post.title}
      />
      <div>
        <Badge>{post.category}</Badge>
      </div>
      <div className='flex flex-col gap-2 mt-2 mb-4'>
        <p className='font-bold text-xl line-clamp-2'>{title}</p>
        <p className='line-clamp-2 font-light'>{summary}</p>
      </div>
      <div className='flex justify-between w-full items-center'>
        <Link to={`/post/${post._id}`}>
          <Button>Leer más</Button>
        </Link>
        <div className='flex gap-4'>
          <MdEdit
            className='cursor-pointer hover:scale-110 hover:text-sky-500'
            size={18}
            onClick={openEditPopUp}
          />
          <FaRegTrashAlt
            className='cursor-pointer hover:scale-110 hover:text-red-600'
            size={18}
            onClick={openDeletePopUp}
          />
        </div>
      </div>
      <dialog
        ref={dialogRef}
        className='backdrop:bg-black/70  p-4 rounded w-full lg:w-[30%] mx-auto top-80 lg:static '
        onClick={handleOutsideClick}
      >
        <div className='bg-white p-6 rounded text-center'>
          <h4 className='text-lg font-bold'>Confirmar eliminación</h4>
          <p>¿Estás seguro de que deseas eliminar este post?</p>
          <div className='flex justify-center mt-4 gap-2'>
            <button
              onClick={handleDeletePost}
              className=' bg-red-500 text-white font-bold rounded-md px-4 py-1 hover:text-red-500 hover:bg-white border-2 border-red-500 transition-all duration-200 '
            >
              Eliminar
            </button>
            <button onClick={closeDeletePopUp}>Cancelar</button>
          </div>
        </div>
      </dialog>
      <dialog
        ref={dialogRefv2}
        className='backdrop:bg-black/70  p-4 rounded  lg:w-[50%]  w-full mx-auto top-40 lg:static'
        onClick={handleOutsideClick}
      >
        <form
          onSubmit={handleSubmit}
          className='flex flex-col justify-center gap-2 '
        >
          <input
            type='file'
            className='flex w-full border-2 border-gray-200 rounded-md p-2  file:border-0  file:text-foreground  file:font-medium  focus-visible:outline-none disabled:opacity-50'
            onChange={handleFileChange}
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
          <div className='flex gap-2 justify-between items-center pt-8 lg:pt-0'>
            <label>Categoría</label>
            <select
              value={category}
              className='border-2 border-gray-200 rounded-md w-full'
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
          <Button onClick={closeEditPopUp}>Guardar cambios</Button>
        </form>
      </dialog>
    </div>
  );
};

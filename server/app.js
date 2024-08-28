import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import connectDB from './config/db.js';
import Category from './models/category.js';
import multer from 'multer';
import fs from 'fs';
import User from './models/user.js';
import Post from './models/post.js';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import authenticate from './middleware/authenticate.js';

const app = express();
const uploadMiddleware = multer();
const salt = bcrypt.genSaltSync(10);
const secret = process.env.SECRET;
config();
connectDB();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

/*app.use('/uploads', express.static('uploads'));*/

app.get('/', (req, res) => {
  res.send('Hello!');
});

app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Category.find();
    console.log('Categories:', categories);
    res.json(categories);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/api/register', uploadMiddleware.none(), async (req, res) => {
  const { username, email, password, file } = req.body;

  try {
    const userInfo = await User.create({
      username,
      email,
      password: bcrypt.hashSync(password, salt),
      file: file || 'http://localhost:5173/public/user.webp',
    });
    res.json(userInfo);
  } catch {
    res.status(500).send('registration failed!');
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userInfo = await User.findOne({ email });

    if (userInfo) {
      const passOk = bcrypt.compareSync(password, userInfo.password);
      if (passOk) {
        const token = jwt.sign(
          { email: userInfo.email, id: userInfo._id },
          secret,
          {
            expiresIn: '1h',
          }
        );
        res
          .cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
          })
          .json({
            id: userInfo._id,
            username: userInfo.username,
            email: userInfo.email,
            file: userInfo.file,
          });
      } else {
        res.status(400).json('Credenciales incorrectas');
      }
    }
  } catch (error) {
    res.status(500).send('Error interno del servidor');
  }
});
app.get('/api/profile', authenticate, async (req, res) => {
  try {
    const user = req.user;

    res.json({ username: user.username, email: user.email, file: user.file });
  } catch (err) {
    console.error('Error al recuperar el perfil:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

app.put('/api/profile', authenticate, async (req, res) => {
  try {
    const user = req.user;
    const { username, email, file } = req.body;

    if (file) {
      user.file = file;
    }

    user.username = username || user.username;
    user.email = email || user.email;

    await user.save();
    res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
      file: user.file,
    });
  } catch (err) {
    console.error('Error al recuperar el perfil:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error al recuperar usuarios:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});
app.post('/api/logout', (req, res) => {
  res
    .clearCookie('token', {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
    })
    .json({ message: 'Logged out successfully' });
});

app.post('/api/posts', authenticate, async (req, res) => {
  const { title, summary, content, category, file } = req.body;
  const user = req.user;
  const postItem = await Post.create({
    title,
    summary,
    content,
    category,
    file: file,
    user: user,
  });

  res.json(postItem);
});

app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('user', 'username file');

    res.status(200).json(posts);
  } catch (error) {
    console.error('Error al obtener los posts:', error.message);
    res.status(500).send('Error interno del servidor');
  }
});

app.get('/api/post/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id).populate('user', 'username file');

    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error('Error al obtener el post por ID:', error.message);
    res.status(500).send('Error interno del servidor');
  }
});

app.delete('/api/post/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findByIdAndDelete(id);

    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    res.json({ message: 'Artículo eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el post:', error.message);
    res.status(500).send('Error interno del servidor');
  }
});

app.put('/api/post/:id', uploadMiddleware.single('file'), async (req, res) => {
  const { id } = req.params;
  const { title, summary, content, category } = req.body;

  try {
    const updateData = {
      title,
      summary,
      content,
      category,
    };

    if (req.file) {
      const originalName = req.file.originalname;
      const pathFile = req.file.path.replace(/\\/g, '/');
      const part = originalName.split('.');
      const ext = part[part.length - 1];
      const newPath = pathFile + '.' + ext;
      fs.renameSync(pathFile, newPath);
      updateData.file = newPath;
    }

    const updatedPost = await Post.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate('user', 'username file');

    if (!updatedPost) {
      return res.status(404).json({ message: 'Artículo no encontrado' });
    }

    res.json(updatedPost);
  } catch (error) {
    console.error('Error al editar el post:', error.message);
    res.status(500).send('Error interno del servidor');
  }
});

app.get('/api/user-posts', authenticate, async (req, res) => {
  try {
    const userId = req.user._id;
    const posts = await Post.find({ user: userId }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error('Error al obtener los posts del usuario:', error.message);
    res.status(500).send('Error interno del servidor');
  }
});
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

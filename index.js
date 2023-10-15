import express from 'express';
import fs from 'fs';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';

import {
  registerValidation,
  loginValidation,
  postCreateValidation,
  commentCreateValidation,
} from './validations.js';
import { checkAuth, handleValidationErrors } from './utils/index.js';

import { UserController, PostController, CommentController } from './controllers/index.js';

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log('DB OK'))
  .catch((error) => console.error('DB error', error));

const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(cors());
app.use(express.json());
app.use('/mern-blog/uploads', express.static('uploads'));

// authorization
app.post('/mern-blog/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post(
  '/mern-blog/auth/register',
  registerValidation,
  handleValidationErrors,
  UserController.register,
);
app.get('/mern-blog/auth/me', checkAuth, UserController.getMe);

// image upload
app.post('/mern-blog/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

// posts
app.get('/mern-blog/posts/tags', PostController.getLastTags);
app.get('/mern-blog/posts/tags/:tagName', PostController.getTagPosts);
app.get('/mern-blog/posts', PostController.getAll);
app.get('/mern-blog/posts/:id', PostController.getOne);
app.post(
  '/mern-blog/posts',
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.create,
);
app.delete('/mern-blog/posts/:id', checkAuth, PostController.remove);
app.patch(
  '/mern-blog/posts/:id',
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update,
);

// comments
app.post(
  '/mern-blog/comments',
  commentCreateValidation,
  handleValidationErrors,
  CommentController.create,
);
app.post('/mern-blog/comments/allposts', checkAuth, CommentController.getPostComments);
app.get('/mern-blog/comments', CommentController.getSomeComments);

app.listen(process.env.PORT || 4444, (err) => {
  if (err) return console.log(err);
  console.log('server OK');
});

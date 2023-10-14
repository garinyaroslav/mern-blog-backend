import CommentModel from '../models/Comment.js';

export const create = async (req, res) => {
  try {
    const doc = new CommentModel({
      postId: req.body.postId,
      user: {
        fullName: req.body.user.fullName,
        avatarUrl: req.body.user.avatarUrl,
      },
      text: req.body.text,
    });

    const comment = await doc.save();
    res.json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Не удалось создать комментарий',
    });
  }
};

export const getPostComments = async (req, res) => {
  try {
    const comments = await CommentModel.find({ postId: req.body.id }).exec();
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Ошибка при получении комментариев',
    });
  }
};

export const getSomeComments = async (req, res) => {
  try {
    const comments = await CommentModel.find().limit(5).exec();
    res.json(comments);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить комментарии',
    });
  }
};

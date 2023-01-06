const router = require('express').Router();
const Post = require('../models/Post');
const User = require('../models/User');

// create a post
router.post('/', async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(error);
  }
});

// update a post
router.put('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(201).json('Your post has been updated!');
    } else {
      res.status(403).json('You cannot update others post');
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete a post
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne({ $set: req.body });
      res.status(201).json('Your post has been deleted!');
    } else {
      res.status(403).json('You cannot delete others post');
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// like OR dislike a post
router.put('/:id/like', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(201).json('The post has been liked');
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(201).json('The post has been disliked');
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// get a post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(400).json('No such post!');
    }

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get timeline posts (newsfeed)
// if you want to fetch data through GET method, use parameters
router.get('/timeline/:userId', async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    if (!currentUser) {
      res.status(400).json('No such user!');
    }

    // this currentUser's post
    const userPosts = await Post.find({ userId: currentUser._id });
    // all following's post
    const follwoingPosts = await Promise.all(
      currentUser.followings.map((followingId) => {
        // map function need have an return value (or ellipsis)
        return Post.find({ userId: followingId });
      })
    );

    res.status(200).json(userPosts.concat(...follwoingPosts));
  } catch (err) {
    res.status(500).json(err);
  }
});

// get user all posts
router.get('/profile/:username', async (req, res) => {
  try {
    const currentUser = await User.findOne({ username: req.params.username });
    if (!currentUser) {
      res.status(400).json('No such user!');
    }

    // this user's all posts
    const posts = await Post.find({ userId: currentUser._id });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

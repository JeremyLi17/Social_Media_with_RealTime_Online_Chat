/*
if we want to use ES6 import or export, like:
import express from 'express';
export default router;

we have to include this inside the package.json
"type" : "module"
*/

const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

// update user
router.put('/:id', async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      // try to update password
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json(err);
      }
    }

    // update user
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });

      res.status(200).json('Account has been updated');
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    res.status(403).json('You can update only your account');
  }
});

// delete user
router.delete('/:id', async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    // update user
    try {
      // const user = await User.deleteOne({ _id: req.params.id });
      const user = await User.findByIdAndDelete(req.params.id);

      res.status(200).json('Account has been deleted');
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    res.status(403).json('You can update only your account');
  }
});

// get user
router.get('/', async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  if (!userId && !username) {
    res.status(400).json('Invalid request!');
  }

  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    if (!user) {
      res.status(404).json('User not found');
    }

    // deconstruct the return user
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get friends
router.get('/friends/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      user.followings.map((friendId) => {
        return User.findById(friendId);
      })
    );

    let firendList = [];
    friends.map((friend) => {
      // deconstruct user, only need id, name and profilePicture
      const { _id, username, profilePicture } = friend;
      firendList.push({ _id, username, profilePicture });
    });

    res.status(200).json(firendList);
  } catch (err) {
    res.status(500).json(err);
  }
});

// follow user
router.put('/:id/follow', async (req, res) => {
  // req.body.userId -> follow -> req.params.id
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({
          $push: { followers: req.body.userId },
        });
        await currentUser.updateOne({
          $push: { followings: req.params.id },
        });

        res.status(200).json('User has been followed');
      } else {
        res.status(400).json('You already follow this user');
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json('You cannot follow yourself');
  }
});

// unfollow user
router.put('/:id/unfollow', async (req, res) => {
  // req.body.userId -> unfollow -> req.params.id
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({
          $pull: { followers: req.body.userId },
        });
        await currentUser.updateOne({
          $pull: { followings: req.params.id },
        });

        res.status(200).json('User has been unfollowed');
      } else {
        res.status(400).json('You dont follow this user');
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json('You cannot unfollow yourself');
  }
});

module.exports = router;

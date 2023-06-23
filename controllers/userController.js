const { User, Thought } = require('../models');

module.exports = {
  async getUsers(req, res) {
    try {
      const users = await User.find().select('-__v');
      res.json(users);
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
  },

  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId }).select('-__v').populate('friends').populate('thoughts');
      if (!user) {
        res.status(404).json({ message: 'No user found with this id!' });
        return;
      }
      res.json(user);
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
  },

  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
  },

  async updateUser(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
      );
      if (!user) {
        res.status(404).json({ message: 'No user found with this id!' });
      }
      res.json(user);
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
  },

  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndDelete({ _id: req.params.userId });
      if (!user) {
        res.status(404).json({ message: 'No user found with this id!' });
      }
      
      const thoughts = await Thought.deleteMany({
        _id: { $in: user.thoughts },
      });
      if (!thoughts) {
        res.status(404).json({ message: 'No thoughts found for this user!' });
      }
      res.json({ message: 'User and thoughts erased!' });
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
  },

  async addFriend(req, res) {
    try {
      const mainUser = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { runValidators: true, new: true }
      );
      if (!mainUser) {
        res.status(404).json({ message: 'No user found with this id!' });
      }
      res.json(mainUser);
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
  },

  async deleteFriend(req, res) {
    try {
      const mainUser = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { runValidators: true, new: true }
      );

      if (!mainUser) {
        res.status(404).json({ message: 'No user found with this id!' });
      }
      res.json({ message: 'Friend deleted!' });
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
  },
};
const { User, Thought } = require('../models');

module.exports = {
  async getUsers(req, res) {
    try {
      const users = await User.find();
      const allUsers = users;
      res.json(allUsers);
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  },
  async getSingleUser(req, res) {
    try {
      const userData = await User.findOne({ _id: req.params.id })
        .select('-__v')
        .populate('thoughts')
        .populate('friends');

      if (!userData) {
        res.status(404).json({ message: 'No user found with this id!' });
        return;
      }
      res.json(userData);
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  },
  async updateUser(req, res) {
    try {
      const updateUserData = await User.findByIdAndUpdate(
        { _id: req.params.id },
        { $set: req.body },
        { runValidators: true, new: true }
      );
      if (!updateUserData) {
        res.status(404).json({ message: 'No user found with this id!' });
        return;
      }
      res.json(updateUserData);
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  },
  async deleteUser(req, res) {
    try {
      const deleteUserData = await User.findOneAndDelete({ _id: req.params.id, }).select("+thoughts");
      if (!deleteUserData) {
        res.status(404).json({ message: 'No user found with this id!' });
      }
      await Thought.deleteMany({ _id: { $in: deleteUserData.thoughts } });
      res.json({ message: 'User and thoughts erased!' });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  async addFriend(req, res) {
    try {
      const addFriendData = await User.findOneAndUpdate(
        { _id: req.params.id },
        { $addToSet: { friends: req.params.friendId } },
        { new: true }
      );
      if (!addFriendData) {
        res.status(404).json({ message: 'No user found with this id!' });
        return;
      }
      res.json(addFriendData);
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  },
  async deleteFriend(req, res) {
    try {
      const deleteFriendData = await User.findOneAndUpdate(
        { _id: req.params.id },
        { $pull: { friends: req.params.friendId } },
        { new: true }
      );
      if (!deleteFriendData) {
        res.status(404).json({ message: 'No user found with this id!' });
        return;
      }
      res.json(deleteFriendData);
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  },
};


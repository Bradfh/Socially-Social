const bcrypt = require('bcrypt');
const User = require('../models/User');

const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    //checking if user email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); //! bcrypt hash

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(201).json({ message: 'User created' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' }); //! Error message is vague
  }
};

const login = async (req, res) => {
 try {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ error: 'Invalid email' });
  }

  const passwordValid = await bcrypt.compare(password, user.password); //! bcrypt compare

  if (!passwordValid) {
    return res.status(401).json({ error: 'Invalid password' });
 } 

 res.status(200).json({ message: 'You made it!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error Logging in.  Try turning it off and on again' }); 
  }
};

const logout = (req, res) => {
   res.status(200).json({ message: 'Logout Successful' });
};

module.exports = { signup, login, logout };
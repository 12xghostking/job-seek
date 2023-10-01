const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'employer'], // Define the allowed roles
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Hash the password before saving to the database
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const saltRounds = 10;
  const hash = await bcrypt.hash(this.password, saltRounds);
  this.password = hash;

  next();
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;

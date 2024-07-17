const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [
      (value) => /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value), // hopefully correct xd
    ]
  },
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    min: 6,
  },
  refresh_token: String // refresh token 
},
{
  // properties not stored in db
  virtuals: {
    full_name: {
      get() {
        return `${this.first_name} ${this.last_name}`
      }
    }
  }
}
);

module.exports = model('User', userSchema);


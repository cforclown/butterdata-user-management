import { Schema } from 'mongoose';

export const UsersModel = new Schema({
  password: { type: String, required: false },
  fullname: { type: String, required: true },
  email: { type: String, required: false, default: null },
  avatar: {
    type: {
      data: { type: String, required: true },
      filename: { type: String, required: true }
    },
    required: false,
    default: null
  },
  archived: { type: Boolean, required: false, default: false }
}, { timestamps: true });

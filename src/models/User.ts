import { Document, Model, model, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
}

const userSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const User: Model<IUser> = model('User', userSchema);

export default User;

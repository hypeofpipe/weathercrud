import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import config from 'config';
import { validationResult } from 'express-validator';
import HttpStatusCodes from 'http-status-codes';
import jwt from 'jsonwebtoken';

import Payload from '../../types/Payload';
import User, { IUser } from '../../models/User';

export const registerUser = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    const user: IUser = await User.findOne({ email });

    if (user) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        errors: [
          {
            msg: 'User already exists',
          },
        ],
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const createdUser = new User({
      email,
      password: hashed,
    });

    await createdUser.save();

    const payload: Payload = {
      userId: user.id,
    };

    jwt.sign(
      payload,
      config.get('jwtSecret'),
      { expiresIn: config.get('jwtExpiration') },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      },
    );
  } catch (err) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server Error');
  }
};

import bcrypt from 'bcryptjs';
import config from 'config';
import { validationResult } from 'express-validator/check';
import HttpStatusCodes from 'http-status-codes';
import jwt from 'jsonwebtoken';
import Payload from '../../types/Payload';
import User, { IUser } from '../../models/User';
import { Response } from 'express';
import Request from '../../types/Request';

export const fetchUser = async (req: Request, res: Response) => {
  try {
    const user: IUser = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server Error');
  }
};

export const login = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    const user: IUser = await User.findOne({ email });

    if (!user) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        errors: [
          {
            msg: 'Invalid Credentials',
          },
        ],
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        errors: [
          {
            msg: 'Invalid Credentials',
          },
        ],
      });
    }

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

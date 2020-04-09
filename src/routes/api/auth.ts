import { Router, Response } from 'express';
import { check } from 'express-validator/check';

import auth from '../../middleware/auth';
import Request from '../../types/Request';
import { fetchUser, login } from '../../services/api/auth';

const router: Router = Router();

// @route   GET api/auth
// @desc    Get authenticated user given the token
// @access  Private
router.get('/', auth, async (req: Request, res: Response) => {
  return fetchUser(req, res);
});

// @route   POST api/auth
// @desc    Login user and get token
// @access  Public
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req: Request, res: Response) => {
    return login(req, res);
  },
);

export default router;

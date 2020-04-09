import { Router, Response } from 'express';
import { check } from 'express-validator/check';

import auth from '../../middleware/auth';
import Request from '../../types/Request';
import { createWeatherDataByCityName } from '../../services/api/weather';

const router: Router = Router();

// @route   POST api/weather
// @desc    Save weather data by city name
// @access  Public
router.post(
  '/',
  [
    auth,
    check('cityName', 'Please include a city name').isLength({
      min: 2,
      max: 64,
    }),
  ],
  async (req: Request, res: Response) => {
    return createWeatherDataByCityName(req, res);
  },
);

export default router;

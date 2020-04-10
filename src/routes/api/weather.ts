import { Request, Response, Router } from 'express';
import { check } from 'express-validator';

import auth from '../../middleware/auth';

import {
  createWeatherDataByCityName,
  fetchAll,
  updateOneById,
  removeById,
} from '../../services/api/weather';

import { doesRecordExist } from '../../middleware/doesRecordExist';
import { dontAllowEmptyObjects } from '../../middleware/dontAllowEmptyObjects';

import WeatherData from '../../models/WeatherData';

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

// @route   GET api/weather
// @desc    Fetch all weather data records
// @access  Public
router.get('/', [auth], async (req: Request, res: Response) => {
  return fetchAll(req, res);
});

// @route   PUT api/weather
// @desc    Update weather data by id
// @access  Public
router.put(
  '/',
  [
    auth,
    check('id', 'Please include an id').isMongoId(),
    doesRecordExist(WeatherData, 'id'),
    dontAllowEmptyObjects(),
    check('cityName').isString().isLength({ min: 2 }).optional(),
    check('weather.main').isString().isLength({ min: 2 }).optional(),
    check('weather.description').isString().isLength({ min: 2 }).optional(),
    check('main.temp').isNumeric().optional(),
    check('main.feels_like').isNumeric().optional(),
    check('main.pressure').isNumeric().optional(),
    check('main.humidity').isNumeric().optional(),
    check('wind.speed').isNumeric().optional(),
    check('wind.deg').isNumeric().optional(),
  ],
  async (req: Request, res: Response) => {
    return updateOneById(req, res);
  },
);

// @route   DELETE api/weather
// @desc    Deletes weather data by id
// @access  Public
router.delete(
  '/',
  [
    auth,
    check('id', 'Please include an id').isMongoId(),
    doesRecordExist(WeatherData, 'id'),
  ],
  async (req: Request, res: Response) => {
    return removeById(req, res);
  },
);

export default router;

import { Request, Response } from 'express';
import config from 'config';
import { validationResult } from 'express-validator';
import HttpStatusCodes from 'http-status-codes';
import axios from 'axios';

import WeatherData, {
  IWeatherData,
  IWeatherDataPure,
} from '../../models/WeatherData';
import { WeatherApiResponse } from 'WeatherAPIResponse';

const fetchWeatherDataByCityName = async (cityName: string) => {
  const apiToken = config.get('openWeatherAPIToken');
  const response = await axios.get<WeatherApiResponse>(
    'https://api.openweathermap.org/data/2.5/weather',
    {
      params: {
        q: cityName,
        appid: apiToken,
      },
    },
  );

  if (response.status !== HttpStatusCodes.OK) {
    throw new Error(
      `Open Weather Api Request Failed with status code: ${response.status} and body: ${response.data}`,
    );
  }

  return response.data;
};

const handleValidationErrors = (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ errors: errors.array() });
  }
};

const convertData = (apiResponse: WeatherApiResponse): IWeatherDataPure => ({
  cityName: apiResponse.name,
  visibility: apiResponse.visibility,
  weather: {
    main: apiResponse.weather[0].main,
    description: apiResponse.weather[0].description,
  },
  main: {
    temp: apiResponse.main.temp,
    feels_like: apiResponse.main.feels_like,
    pressure: apiResponse.main.pressure,
    humidity: apiResponse.main.humidity,
  },
  wind: apiResponse.wind,
});

const cleanEmpty = (obj: IWeatherDataPure): object =>
  Object.entries(obj)
    .map(([k, v]) => [k, v && typeof v === 'object' ? cleanEmpty(v) : v])
    .reduce((a, [k, v]) => (v == null ? a : { ...a, [k]: v }), {});

export const createWeatherDataByCityName = async (
  req: Request,
  res: Response,
) => {
  handleValidationErrors(req, res);

  const { cityName } = req.body;

  try {
    const weatherDataResponse = await fetchWeatherDataByCityName(cityName);
    const weatherData: IWeatherData = new WeatherData(
      convertData(weatherDataResponse),
    );
    const savedWeatherData = await weatherData.save();
    return res.json(savedWeatherData);
  } catch (err) {
    console.error('Error occured:', err.message);
    return res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .send('Server Error');
  }
};

export const fetchAll = async (req: Request, res: Response) => {
  handleValidationErrors(req, res);

  try {
    const allWeatherData = await WeatherData.find();
    return res.json(allWeatherData);
  } catch (err) {
    console.error('Error occured:', err.message);
    return res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .send('Server Error');
  }
};

export const updateOneById = async (req: Request, res: Response) => {
  handleValidationErrors(req, res);

  const { id: _id, cityName, visibility, weather, main, wind } = req.body;
  try {
    const updateData = cleanEmpty({
      cityName,
      visibility,
      weather,
      main,
      wind,
    }) as IWeatherDataPure;

    const weatherDataRecord = await WeatherData.findByIdAndUpdate(
      _id,
      updateData,
    );

    return res.json(weatherDataRecord);
  } catch (err) {
    console.error('Error occured:', err.message);
    return res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .send('Server Error');
  }
};

export const removeById = async (req: Request, res: Response) => {
  handleValidationErrors(req, res);

  const { id } = req.body;
  try {
    const deletedCount = await WeatherData.deleteOne({ _id: id });
    return res.json(deletedCount);
  } catch (err) {
    console.error('Error occured:', err.message);
    return res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .send('Server Error');
  }
};

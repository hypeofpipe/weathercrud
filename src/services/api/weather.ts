import config from 'config';
import { Response } from 'express';
import { validationResult } from 'express-validator/check';
import HttpStatusCodes from 'http-status-codes';
import axios from 'axios';

import Request from '../../types/Request';
import WeatherData, {
  IWeatherData,
  IWeatherDataPure,
} from '../../models/WeatherData';
import weatherApiResponse, { WeatherApiResponse } from 'WeatherAPIResponse';

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

export const createWeatherDataByCityName = async (
  req: Request,
  res: Response,
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ errors: errors.array() });
  }

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

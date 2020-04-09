import { Response } from 'express';

export interface WeatherApiResponse {
  id: number;
  name: string;
  base: string;
  dt: number;
  timezone: number;
  visibility: number;
  coord: {
    lon: number;
    lat: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  main: {
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
    temp_min?: number;
    temp_max?: number;
    sea_level?: number;
    grnd_level?: number;
  };
  wind?: {
    speed: number;
    deg: number;
  };
  clouds?: {
    all: number;
  };
  rain?: {
    '1h': number;
    '3h': number;
  };
}

type weatherApiResponse = Response & WeatherApiResponse;

export default weatherApiResponse;

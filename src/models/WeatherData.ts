import { Document, Model, model, Schema } from 'mongoose';

export interface IWeatherDataPure {
  cityName: string;
  createdAt?: Date;
  visibility: number;
  weather: {
    main: string;
    description: string;
  };
  main: {
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
  };
  wind?: {
    speed: number;
    deg: number;
  };
}

export type IWeatherData = IWeatherDataPure & Document;

const weatherDataSchema: Schema = new Schema({
  cityName: { type: String, required: true },
  visibility: { type: Number, required: true },
  weather: {
    main: { type: String, required: true },
    description: { type: String, required: true },
  },
  main: {
    temp: { type: Number, required: true },
    feels_like: { type: Number, required: true },
    pressure: { type: Number, required: true },
    humidity: { type: Number, required: true },
  },
  wind: {
    speed: { type: Number },
    deg: { type: Number },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const WeatherData: Model<IWeatherData> = model(
  'WeatherData',
  weatherDataSchema,
);

export default WeatherData;

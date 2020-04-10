import { body } from 'express-validator';

export const dontAllowEmptyObjects = () =>
  body().custom((values: any) => {
    if (!values) return true;

    for (const key of Object.keys(values)) {
      const value = values[key];
      if (typeof value === 'object' && Object.keys(value).length < 1) {
        throw new Error("Empty objects aren't allowed in this method");
      }
    }

    return true;
  });

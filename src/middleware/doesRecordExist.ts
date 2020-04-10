import { body } from 'express-validator';
import { Model } from 'mongoose';

export const doesRecordExist = <T extends Model<any>>(
  entity: T,
  idField: string,
) =>
  body(idField).custom((id: string | number) => {
    if (!id) return;

    return entity.findById(id).then((entityData) => {
      if (!entityData) {
        return Promise.reject(`${entity.name} with id ${id} doesn't exist`);
      }
    });
  });

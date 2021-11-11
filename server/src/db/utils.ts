import {Schema, model, Model, FilterQuery, UpdateQuery} from 'mongoose';

export const getAll = async <T>(mongoModel: Model<T>) => {
  return await mongoModel.find({}, {_id: 0, updatedAt: 1, createdAt: 1, __v:1, name: 1, credit: 1}).sort({credit: -1});
}

export const updateOne = async <T>(mongoModel: Model<T>, filterQuery: Partial<Record<keyof T, unknown>>, updateQuery: Partial<Record<keyof T, unknown>>) => {
  return await mongoModel.findOneAndUpdate(filterQuery as FilterQuery<T>, updateQuery as UpdateQuery<T>, {new: true, upsert: true});
}
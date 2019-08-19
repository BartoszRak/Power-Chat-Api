import { UnknownObject } from './types';

export const copyProperties = (source: UnknownObject, target: UnknownObject) => {
  Object.keys(source).forEach((key: string) => {
    target[key] = source[key];
  });
};

import * as CANNON from 'cannon-es';
import { RewardType } from '../../../client/src/types/Types';

export const generateRandomPosition = (lowerBound: CANNON.Vec3, upperBound: CANNON.Vec3) => {
  const lowerX = lowerBound.x;
  const lowerZ = lowerBound.z;
  const upperX = upperBound.x;
  const upperZ = upperBound.z;
  const x = (upperX - lowerX) * Math.random() + lowerX;
  const z = (upperZ - lowerZ) * Math.random() + lowerZ;
  const y = 0.5;
  return new CANNON.Vec3(x, y, z);
}

export const randomEnum = <T>(anEnum: T): T[keyof T] => {
  const enumValues = Object.keys(anEnum)
    .map(n => Number.parseInt(n))
    .filter(n => !Number.isNaN(n)) as unknown as T[keyof T][];
  const randomIndex = Math.floor(Math.random() * enumValues.length);
  return enumValues[randomIndex];
}

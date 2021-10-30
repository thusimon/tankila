import * as CANNON from 'cannon-es';

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

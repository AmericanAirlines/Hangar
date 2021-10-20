export const getMock = <Return, Parameters extends Array<any>>(
  originalImplementation: (...args: Parameters) => Return,
): jest.Mock<Return, Parameters> => {
  if (!jest.isMockFunction(originalImplementation)) {
    throw new Error(`${originalImplementation.name} is not a mock function`);
  }
  return originalImplementation as jest.Mock<Return, Parameters>;
};

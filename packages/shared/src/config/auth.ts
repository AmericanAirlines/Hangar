type AuthMethod = 'slack' | 'pingfed'; // To support new methods, add them here
type AuthData = {
  method: AuthMethod;
};

/**
 * Configuration for authentication throughout the app
 */
export const Auth: AuthData = {
  method: 'pingfed', // Change this value to drive auth throughout the app
};

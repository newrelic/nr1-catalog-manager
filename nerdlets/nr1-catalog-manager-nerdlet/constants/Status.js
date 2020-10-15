/**
 * Simple Status type definition for transitioning states within the app
 */
module.exports = {
  AUTH: {
    MUTATING: 'MUTATING',
    ERROR: 'ERROR'
  },
  CATALOG_MANAGER: {
    LOADING: 'LOADING',
    USER_TOKEN_SET: 'USER_TOKEN_SET',
    USER_TOKEN_EMPTY: 'USER_TOKEN_EMPTY'
  },
  WORKFLOWS: {
    LOADING: 'LOADING',
    FETCHING: 'FETCHING',
    DATA_FETCHED: 'DATA_FETCHED'
  }
};

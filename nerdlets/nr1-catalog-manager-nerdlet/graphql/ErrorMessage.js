import React from 'react';
import PropTypes from 'prop-types';

/**
 * Renders error content for GraphQL API calls
 * Ref: https://github.com/the-road-to-graphql/react-graphql-github-apollo/blob/master/src/Error/index.js
 */
const ErrorMessage = ({ error }) => (
  <div className="ErrorMessage">
    <p>{error.toString()}</p>
    <p>Try checking/replacing your github token</p>
  </div>
);

ErrorMessage.propTypes = {
  error: PropTypes.string
};

export default ErrorMessage;

import React from 'react';

/**
 * Renders error content for GraphQL API calls
 * Borrowed from: https://github.com/the-road-to-graphql/react-graphql-github-apollo/blob/master/src/Error/index.js
 */
const ErrorMessage = ({ error }) => (
  <div className="ErrorMessage">
    <small>{error.toString()}</small>
  </div>
);

export default ErrorMessage;

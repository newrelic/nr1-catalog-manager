import gql from 'graphql-tag';

/**
 * Common place to hold various GraphQL queries
 */

export const ACCESS_CHECK_QUERY = gql`
  query {
    viewer {
      login
    }
  }
`;

export const CATALOG_REPOS_QUERY = gql`
  {
    nr1Repos: search(
      query: "org:newrelic nr1 fork:false archived:false is:public"
      type: REPOSITORY
      first: 100
    ) {
      repositoryCount
      nodes {
        ... on Repository {
          id
          name
          viewerPermission
          url
          refs(
            refPrefix: "refs/tags/"
            first: 25
            orderBy: { field: TAG_COMMIT_DATE, direction: DESC }
          ) {
            nodes {
              name
              id
              target {
                ... on Commit {
                  oid
                  messageHeadline
                }
                commitUrl
              }
            }
          }
          defaultBranchRef {
            name
          }
          catalog: object(expression: "main:catalog/") {
            oid
          }
        }
      }
    }
    viewer {
      login
    }
    globals: repository(name: "nr1-catalog", owner: "newrelic") {
      globalUUIDs: object(expression: "master:globals.json") {
        ... on Blob {
          text
        }
      }
      versions: object(expression: "master:versions.json") {
        ... on Blob {
          text
        }
      }
    }
  }
`;

export const PULL_REQUESTS_QUERY = gql`
  {
    repository(name: "nr1-catalog", owner: "newrelic") {
      pullRequests(
        last: 100
        orderBy: { field: CREATED_AT, direction: ASC }
        states: OPEN
      ) {
        totalCount
        nodes {
          author {
            login
          }
          title
          updatedAt
          labels(last: 10) {
            nodes {
              name
            }
          }
          createdAt
          body
          bodyText
          state
          url
        }
      }
    }
  }
`;

export const CATALOG_VALIDATION_QUERY = gql`
  query catalogValidationQuery(
    $repoName: String!
    $configExp: String!
    $documentationExp: String!
    $screenshotsExp: String!
  ) {
    repository(name: $repoName, owner: "newrelic") {
      configJson: object(expression: $configExp) {
        ... on Blob {
          text
          isBinary
        }
      }
      documentationMd: object(expression: $documentationExp) {
        ... on Blob {
          text
          isBinary
        }
      }
      screenshots: object(expression: $screenshotsExp) {
        ... on Tree {
          entries {
            name
            extension
          }
        }
      }
    }
  }
`;

export const EXPRESSIONS = version => ({
  configExp: `${version}:catalog/config.json`,
  documentationExp: `${version}:catalog/documentation.md`,
  screenshotsExp: `${version}:catalog/screenshots`
});

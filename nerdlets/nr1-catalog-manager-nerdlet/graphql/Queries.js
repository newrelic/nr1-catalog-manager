import gql from 'graphql-tag';

/**
 * Common place to hold various GraphQL queries
 */

export const GET_REPOS_QUERY = gql`
  {
    viewer {
      login
      repositories(last: 100) {
        totalCount
        nodes {
          name
          createdAt
          commitComments(last: 1) {
            totalCount
          }
          url
          isPrivate
          defaultBranchRef {
            target {
              ... on Commit {
                id
                message
                messageBody
                history {
                  totalCount
                }
                commitUrl
              }
            }
          }
        }
      }
    }
  }
`;

export const ORIGINAL_GET_REPOS_QUERY = gql`
  {
    viewer {
      repositories(last: 100) {
        totalCount
        nodes {
          name
          createdAt
          commitComments(last: 1) {
            totalCount
          }
        }
      }
    }
  }
`;

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
          # collaborators(first: 10, affiliation: DIRECT) {
          #   edges {
          #     permission
          #     node {
          #       name
          #     }
          #   }
          # }
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
export const USER_REPOS_QUERY = gql`
  {
    search(
      query: "nr1-prototype-actions fork:false archived:false is:public"
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
          # collaborators(first: 10, affiliation: DIRECT) {
          #   edges {
          #     permission
          #     node {
          #       name
          #     }
          #   }
          # }
          refs(
            refPrefix: "refs/tags/"
            last: 10
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
        }
      }
    }
    viewer {
      login
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

// export const CATALOG_VALIDATION_QUERY = gql`
//   query catalogValidationQuery($repoName: String!) {
//     repository(name: $repoName, owner: "newrelic") {
//       catalogJson: object(expression: "main:catalog/") {
//         ... on Tree {
//           entries {
//             name
//             object {
//               ... on Blob {
//                 text
//                 isBinary
//               }
//             }
//             extension
//           }
//         }
//       }
//       screenshots: object(expression: "main:catalog/screenshots/") {
//         ... on Tree {
//           entries {
//             name
//             extension
//           }
//         }
//       }
//     }
//   }
// `;

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

export const VALIDATION_QUERY = gql`
  {
    search(
      query: "org:newrelic nr1-browser-analyzer fork:false archived:false is:public"
      type: REPOSITORY
      first: 100
    ) {
      repositoryCount
      nodes {
        ... on Repository {
          catalogJson: object(expression: "main:catalog/") {
            # oid
            ... on Tree {
              # id
              entries {
                name
                object {
                  ... on Blob {
                    # id
                    text
                    isBinary
                    # byteSize
                  }
                }
                extension
              }
            }
          }
          screenshots: object(expression: "main:catalog/screenshots/") {
            # oid
            ... on Tree {
              # id
              entries {
                name
                # object {
                # ... on Blob {
                # id
                # text
                # isBinary
                # byteSize
                # }
                # }
                extension
              }
            }
          }
        }
      }
    }
  }
`;

// {
//   search(query: "org:newrelic nr1 fork:false archived:false is:public", type: REPOSITORY, first: 100) {
//     repositoryCount
//     nodes {
//       ... on Repository {
//         id
//         name
//         viewerPermission
//         collaborators(first: 10, affiliation: DIRECT) {
//           edges {
//             permission
//             node {
//               name
//             }
//           }
//         }
//       }
//     }
//   }
// }

// {
//   user(login: "jbeveland27") {
//     repositories(first: 100) {
//       totalCount
//       nodes {
//         name
//         nameWithOwner
//         mergeCommitAllowed
//         viewerPermission
//       }
//     }
//   }
// }

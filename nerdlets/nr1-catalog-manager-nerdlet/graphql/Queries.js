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
    search(
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
            last: 25
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

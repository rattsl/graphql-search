//大規模開発に備えてファイルを分けておく
//ファイルを分けておいてコードの見通しをよくしておく

import gql from 'graphql-tag';

export const SEARCH_REPOSITORIES = gql`
  query serachRepos(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $query: String!
  ) {
    search(
      after: $after
      before: $before
      first: $first
      last: $last
      query: $query
      type: REPOSITORY
    ) {
      repositoryCount
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      edges {
        cursor
        node {
          ... on Repository {
            id
            name
            url
            stargazers {
              totalCount
            }
            viewerHasStarred
          }
        }
      }
    }
  }
`;

export const ADD_STAR = gql`
  mutation addStar($input: AddStarInput!) {
    addStar(input: $input) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`;

export const ME = gql`
  query me {
    user(login: "rattsl") {
      name
      avatarUrl
    }
  }
`;

//大規模開発に備えてファイルを分けておく
//ファイルを分けておいてコードの見通しをよくしておく

import gql from 'graphql-tag';

export const ME = gql`
  query me {
    user(login: "rattsl") {
      name
      avatarUrl
    }
  }
`;

import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';

const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;

const headersLink = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`
    }
  });
  return forward(operation);
});

const endpoint = 'https://api.github.com/graphql';
const httplink = new HttpLink({ uri: endpoint });

//httpLinkで生成したインスタンスとheadersLinkで生成したインスタンスを結合する
const link = ApolloLink.from([headersLink, httplink]);

export default new ApolloClient({
  link,
  cache: new InMemoryCache()
});

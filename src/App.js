import React, { Component } from 'react';
import client from './client';
import { ApolloProvider } from 'react-apollo';
import { Query } from 'react-apollo';
import { ME } from './graphql';
class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <div>hello</div>

        <Query query={ME}>
          {({ loading, error, data }) => {
            if (loading) return 'Now,loading...';
            if (error) return `error! ${error.message}`;

            return <div>{data.user.name}</div>;
          }}
        </Query>
      </ApolloProvider>
    );
  }
}

export default App;

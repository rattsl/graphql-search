import React, { Component } from 'react';
import client from './client';
import { ApolloProvider } from 'react-apollo';
import { Query } from 'react-apollo';
import { SEARCH_REPOSITORIES } from './graphql';

const DEFAULT_STATE = {
  after: null,
  before: null,
  first: 5,
  last: null,
  query: 'フロントエンドエンジニア'
};
class App extends Component {
  constructor(props) {
    super(props);
    this.state = DEFAULT_STATE;

    this.hundleChange = this.hundleChange.bind(this);
    this.hundleSubmit = this.hundleSubmit.bind(this);
  }

  hundleChange(event) {
    this.setState({
      ...DEFAULT_STATE,
      query: event.target.value
    });
  }

  hundleSubmit(event) {
    event.preventDefault();
  }
  render() {
    const { after, before, first, last, query } = this.state;
    console.log({ query });
    return (
      <ApolloProvider client={client}>
        <form onSubmit={this.hundleSubmit}>
          <input value={query} onChange={this.hundleChange} />
        </form>
        <Query
          query={SEARCH_REPOSITORIES}
          variables={{ after, before, first, last, query }}
        >
          {({ loading, error, data }) => {
            if (loading) return 'Now,loading...';
            if (error) return `error! ${error.message}`;

            const search = data.search;
            const repositoryCount = search.repositoryCount;
            const repositoryUnit =
              repositoryCount === 1 ? 'Repository' : 'Repositories';
            const title = `Github Repositories Search Result -${repositoryCount} ${repositoryUnit}`;
            return <h2>{title}</h2>;
          }}
        </Query>
      </ApolloProvider>
    );
  }
}

export default App;

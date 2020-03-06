import React, { Component } from 'react';
import client from './client';
import { ApolloProvider, Query, Mutation } from 'react-apollo';
import { SEARCH_REPOSITORIES, ADD_STAR, REMOVE_STAR } from './graphql';

const StarButton = props => {
  const { node, after, before, first, last, query } = props;
  const totalCount = node.stargazers.totalCount;
  const viewerHasStarred = node.viewerHasStarred;
  const totalCountUnit = totalCount === 1 ? '1 star' : `${totalCount} stars`;
  const staredUnit = viewerHasStarred === true ? 'stared' : '-';
  const title = `${totalCountUnit} | ${staredUnit}`;
  const StarStatus = ({ addOrRemoveStar }) => {
    return (
      <button
        onClick={() => {
          addOrRemoveStar({
            variables: { input: { starrableId: node.id } },
            update: (store, { data: { addStar, removeStar } }) => {
              const { starrable } = addStar || removeStar;
              console.log(starrable);
              const data = store.readQuery({
                query: SEARCH_REPOSITORIES,
                variables: { after, before, first, last, query }
              });
              const edges = data.search.edges;
              const newEdges = edges.map(edge => {
                if (edge.node.id === node.id) {
                  const totalCount = edge.node.stargazers.totalCount;
                  const diff = starrable.viewerHasStarred ? 1 : -1;
                  const newTotalCount = totalCount + diff;
                  edge.node.stargazers.totalCount = newTotalCount;
                }
                return edge;
              });
              data.search.edges = newEdges;
              store.writeQuery({ query: SEARCH_REPOSITORIES, data });
            }
          });
        }}
      >
        {title}
      </button>
    );
  };
  //関数starStatusではなく、コンポーネントStarStatusとしてreturn
  //mutationコンポーネントでラップ
  return (
    <Mutation mutation={viewerHasStarred ? REMOVE_STAR : ADD_STAR}>
      {addOrRemoveStar => <StarStatus addOrRemoveStar={addOrRemoveStar} />}
    </Mutation>
  );
};

const PER_PAGE = 5;
const DEFAULT_STATE = {
  after: null,
  before: null,
  first: PER_PAGE,
  last: null,
  query: ''
};
class App extends Component {
  constructor(props) {
    super(props);
    this.state = DEFAULT_STATE;

    this.myRef = React.createRef();
    this.hundleSubmit = this.hundleSubmit.bind(this);
  }

  hundleSubmit(event) {
    event.preventDefault();

    this.setState({
      query: this.myRef.current.value
    });
  }

  goBack(search) {
    this.setState({
      first: null,
      after: null,
      last: PER_PAGE,
      before: search.pageInfo.startCursor
    });
  }

  goNext(search) {
    this.setState({
      first: PER_PAGE,
      after: search.pageInfo.endCursor,
      last: null,
      before: null
    });
  }

  render() {
    const { after, before, first, last, query } = this.state;
    return (
      <ApolloProvider client={client}>
        <form onSubmit={this.hundleSubmit}>
          <input ref={this.myRef} />
          <input type="submit" value="Submit" />
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

            return (
              <React.Fragment>
                <h2>{title}</h2>
                <ul>
                  {search.edges.map(edge => {
                    const node = edge.node;
                    return (
                      <li key={node.id}>
                        <a href={node.url} target="_brank">
                          {node.name}
                        </a>
                        &nbsp;
                        <StarButton
                          node={node}
                          {...{ after, before, first, last, query }}
                        ></StarButton>
                      </li>
                    );
                  })}
                </ul>
                {search.pageInfo.hasPreviousPage === true ? (
                  <button onClick={this.goBack.bind(this, search)}>back</button>
                ) : null}
                {search.pageInfo.hasNextPage === true ? (
                  <button onClick={this.goNext.bind(this, search)}>next</button>
                ) : null}
              </React.Fragment>
            );
          }}
        </Query>
      </ApolloProvider>
    );
  }
}

export default App;

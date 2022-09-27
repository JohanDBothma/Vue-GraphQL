<template>
  <div class="max-w-7xl mx-auto mt-12">
    <div v-if="loading" class="w-full text-2xl items-center justify-center flex space-x-2 text-blue-400 uppercase"><svg
        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
        class="w-6 h-6 animate-spin">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
      <p>Loading Issues</p>
    </div>
    <div v-if="!loading && result" class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">

      <table class="min-w-full divide-y divide-gray-300">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
              Number</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Title</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Description<br />Body</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Client</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Priority</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Type</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Assigned To</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
          </tr>
        </thead>
        <tbody class="bg-white">
          <tr v-for="(edge, index) in result.repository.issues.edges" :key="edge.id"
            :class="index % 2 === 0 ? undefined : 'bg-gray-50'">
            <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{{ index+1 }}
            </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ edge.node.title }}</td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ edge.node.body }}</td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500" v-html="read_edge(edge.node.labels, 'C')">
            </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500" v-html="read_edge(edge.node.labels, 'P')">
            </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500" v-html="read_edge(edge.node.labels, 'T')">
            </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">

              {{edge.node.assignees.edges[0]?.node.login}}
            </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 capitalize">{{read_state(edge.node.state)}}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <button v-if="!loading && result.repository.issues.pageInfo.hasNextPage"
      class="bg-blue-400 my-4 rounded-full px-4 py-2 text-white uppercase" @click="loadMore">Load
      more</button>
    <a href="https://github.com/1-grid/GitIntegration/issues" target="_blank">1-grid github</a> <br />
    <a href="https://docs.github.com/en/graphql/guides/forming-calls-with-graphql" target="_blank">github calls</a>
    <div></div>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { useQuery } from '@vue/apollo-composable'

const QUERY = gql`
query($cursor: String) {
    repository(owner:"1-grid", name:"GitIntegration") {
    issues(first:5, after: $cursor) {
      pageInfo{
        hasNextPage
        endCursor
      }
      edges {
        node {
          title
          body
          state
          assignees(first:1) {
            edges {
              node {
                login
              }
            }
          }
          labels(first:3, orderBy:{field: NAME, direction: ASC}) {
            edges {
              node {
                name
              }
            }
          }
        }
      }
    }
  }
}
`
export default {
  name: "App",
  setup ()
  {
    const { result, loading, error, fetchMore } = useQuery( QUERY );

    function loadMore ()
    {
      fetchMore( {
        variables: {
          cursor: result.value.repository.issues.pageInfo.endCursor
        },
        updateQuery: ( previousResult, { fetchMoreResult } ) =>
        {
          const newEdges = fetchMoreResult.repository.issues.edges
          const pageInfo = fetchMoreResult.repository.issues.pageInfo

          return newEdges.length ? {
            ...previousResult,
            repository: {
              ...previousResult.repository,
              // Issues
              issues: {
                ...previousResult.repository.issues,
                // Override with new pageInfo
                pageInfo,
                // Concat edges
                edges: [
                  ...previousResult.repository.issues.edges,
                  ...newEdges,
                ],

              }
            }
          } : previousResult
        },
      } )
    }

    return {
      result,
      loading,
      fetchMore,
      loadMore,
      error
    };
  },

  methods: {
    /* 
      run this method 3 times for each label, C: client, P: priority, T: type
      since they can be in any order, looping through them and returning once found is the quickest
      check if the label does have any edges, if any, loop through them all and if it matches the char that is passed, slice the first 3 chars of and print
    */
    read_edge ( label, char = "C" )
    {
      if ( typeof label.edges !== "undefined" && label.edges.length > 0 )
      {
        for ( var x = 0; x <= label.edges.length; x++ )
        {
          if ( typeof label.edges[ x ] !== "undefined" && label.edges[ x ].node.name[ 0 ] === char )
          {
            return label.edges[ x ].node.name.slice( 3 )
          }
        }
      }
    },
    // make the status not shout in all caps
    read_state ( state )
    {
      return state[ 0 ].toUpperCase() + state.slice( 1 ).toLowerCase();

    }
  }
}
</script>
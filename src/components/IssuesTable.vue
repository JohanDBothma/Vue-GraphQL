<template>
  <h1 class="text-blue-600 text-xl mb-6">Current Reported Issues</h1>
  <table class="w-full divide-y divide-gray-300 shadow ring-1 ring-black ring-opacity-5 md:rounded-lg ">
    <thead class="bg-gray-50">
      <tr class="divide-x divide-gray-200">
        <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-medium  sm:pl-6">
          Number</th>
        <th scope="col" class="px-3 py-3.5 text-left text-sm font-medium ">Title</th>
        <th scope="col" class="px-3 py-3.5 text-left text-sm font-medium ">Description<br />Body
        </th>
        <th scope="col" class="px-3 py-3.5 text-left text-sm font-medium ">Client</th>
        <th scope="col" class="px-3 py-3.5 text-left text-sm font-medium ">Priority</th>
        <th scope="col" class="px-3 py-3.5 text-left text-sm font-medium ">Type</th>
        <th scope="col" class="w-32 px-3 py-3.5 text-left text-sm font-medium ">Assigned To</th>
        <th scope="col" class="px-3 py-3.5 text-left text-sm font-medium ">Status</th>
      </tr>
    </thead>
    <tbody class="bg-white ">
      <tr v-for="(edge, index) in issues.edges" :key="edge.id" class="divide-x divide-gray-200"
        :class="index % 2 === 0 ? undefined : 'bg-gray-50'">
        <td class="whitespace-pre-wrap w-12 py-4 pl-4 pr-3 text-sm  text-gray-500  sm:pl-6">{{ index+1 }}
        </td>
        <td class="whitespace-pre-wrap w-52 break-word px-3 py-4 text-sm text-gray-500">{{ edge.node.title }}</td>
        <td class="whitespace-pre-wrap w-96 break-word px-3 py-4 text-sm text-gray-500">{{ edge.node.body }}</td>
        <td class="whitespace-pre-wrap w-32 break-word px-3 py-4 text-sm text-gray-500"
          v-html="read_edge(edge.node.labels, 'C')">
        </td>
        <td class="whitespace-pre-wrap px-3 break-word py-4 text-sm text-gray-500"
          v-html="read_edge(edge.node.labels, 'P')">
        </td>
        <td class="whitespace-pre-wrap break-word px-3 py-4 text-sm text-gray-500"
          v-html="read_edge(edge.node.labels, 'T')">
        </td>
        <td class="whitespace-pre-wrap break-word px-3 py-4 text-sm text-gray-500">

          {{edge.node.assignees.edges[0]?.node.login}}
        </td>
        <td class="whitespace-pre-wrap break-word px-3 py-4 text-sm text-gray-500 capitalize">
          {{read_state(edge.node.state)}}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: {
    issues: Object
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
            return label.edges[ x ].node.name.slice( 3 );
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

/*function loadMore ()
    {
      fetchMore( {
        variables: {
          cursor: result.value.repository.issues.pageInfo.endCursor
        },
        updateQuery: ( previousResult, { fetchMoreResult } ) =>
        {
          const newEdges = fetchMoreResult.repository.issues.edges;
          const pageInfo = fetchMoreResult.repository.issues.pageInfo;
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
          } : previousResult;
        },
      } );
    }
    */
</script>
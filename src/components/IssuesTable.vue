<template>
  <h1 class="text-blue-600 text-xl mb-6">Current Reported Issues</h1>
  <table class="table-fixed divide-y divide-gray-300 shadow ring-1 ring-black ring-opacity-5 md:rounded-lg ">
    <thead class="bg-gray-50">
      <tr class="divide-x divide-gray-200">
        <th scope="col"
          class="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-medium text-gray-900 backdrop-blur backdrop-filter  ">
          Number</th>
        <th scope="col"
          class="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-medium text-gray-900 backdrop-blur backdrop-filter  ">
          Title</th>
        <th scope="col"
          class="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-medium text-gray-900 backdrop-blur backdrop-filter  ">
          Description<br />Body
        </th>
        <th scope="col"
          class="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-medium text-gray-900 backdrop-blur backdrop-filter  ">
          Client</th>
        <th scope="col"
          class="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-medium text-gray-900 backdrop-blur backdrop-filter  ">
          Priority</th>
        <th scope="col"
          class="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-medium text-gray-900 backdrop-blur backdrop-filter  ">
          Type</th>
        <th scope="col"
          class="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-medium text-gray-900 backdrop-blur backdrop-filter  ">
          Assigned To</th>
        <th scope="col"
          class="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-medium text-gray-900 backdrop-blur backdrop-filter  ">
          Status</th>
      </tr>
    </thead>
    <tbody class="bg-white ">
      <tr v-for="(edge, index) in issues.edges" :key="edge.id" class="divide-x divide-gray-200"
        :class="index % 2 === 0 ? undefined : 'bg-gray-50'">
        <td class="py-4 pl-4 pr-3 text-sm  text-gray-500  ">{{ index+1 }}
        </td>
        <td class="  px-3 py-4 text-sm text-gray-500">
          {{ edge.node.title }}
        </td>
        <td class="  px-3 py-4 text-sm text-gray-500">
          {{ edge.node.body }}
        </td>
        <td class="  px-3 py-4 text-sm text-gray-500" v-html="read_edge(edge.node.labels, 'C')">
        </td>
        <td class="  px-3 py-4 text-sm text-gray-500" v-html="read_edge(edge.node.labels, 'P')">
        </td>
        <td class="  px-3 py-4 text-sm text-gray-500" v-html="read_edge(edge.node.labels, 'T')">
        </td>
        <td class="  px-3 py-4 text-sm text-gray-500">

          {{edge.node.assignees.edges[0]?.node.login}}
        </td>
        <td class="  px-3 py-4 text-sm text-gray-500 capitalize">
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
</script> 
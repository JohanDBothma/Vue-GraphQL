<template>
  clear form on submit
  <NotificationOverlay v-if="notification_show" :title="notification_title" :message="notification_message"
    :type="notification_type" />
  <div class="max-w-7xl mx-auto mt-12">
    <h1 class="text-center text-blue-500 text-3xl">Johan Bothma's 1-grid Issue Tracker</h1>
    <div class="xl:flex justify-evenly space-x-4 mt-12 mb-12">

      <div class="ml-2">
        <h1 class="text-blue-600 text-xl mb-6">Have an issue that isn't here?</h1>
        <div class="ml-2 mb-12 xl:m-0 w-72 bg-gray-50 rounded-lg py-6 px-8  xl:top-12 xl:sticky">
          <p class="text-gray-800 text-xl">Submit the form and let us know!</p>

          <form method="POST" @submit.prevent="createIssue">
            <FormInput label="Give your issue a title" id="title" v-model="title" />
            <FormTextarea label="Describe your issue" v-model="description" />

            <FormSelect label="Choose a Client" v-model="client" id="client">
              <option :value="null" disabled>Choose a client</option>
              <option v-for="loop_client in clients" :key="loop_client.value" :value="loop_client.value">
                {{loop_client.label}}
              </option>
            </FormSelect>
            <FormSelect label="Choose a Priority" v-model="priority" id="priority">
              <option :value="null" disabled>Choose a priority</option>
              <option v-for="loop_priority in priorities" :key="loop_priority.value" :value="loop_priority.value">
                {{loop_priority.label}}
              </option>
            </FormSelect>
            <FormSelect label="Choose an Issue Type" v-model="type" id="type">
              <option :value="null" disabled>Choose a type</option>
              <option v-for="repo_type in types" :key="repo_type.value" :value="repo_type.value">
                {{repo_type.label}}
              </option>
            </FormSelect>

            <CustomButton @click="createIssue" :class="{'opacity-25':createIssueLoading}"
              :disabled="createIssueLoading">
              <SpinningLoader class="text-white" v-if="createIssueLoading">
                Loading
              </SpinningLoader>
              <span v-else>Submit Issue</span>
            </CustomButton>
          </form>
        </div>
      </div>
      <div class="max-w-1/2">
        <SpinningLoader class="text-2xl text-gray-900" v-if="loading && !result">
          loading issues
        </SpinningLoader>
        <IssuesTable v-else :issues="result.repository.issues" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { GET_ISSUES, POST_ISSUE } from './graphql'
import { useQuery, useMutation } from '@vue/apollo-composable'
import IssuesTable from './components/IssuesTable.vue'
import FormSelect from './components/Form/FormSelect.vue'
import FormInput from './components/Form/FormInput.vue'
import FormTextarea from './components/Form/FormTextarea.vue'
import CustomButton from './components/CustomButton.vue'
import SpinningLoader from './components/SpinningLoader.vue'
import NotificationOverlay from './components/NotificationOverlay.vue'

export default {
  name: "App",
  data ()
  {
    return {
      clients: [],
      types: [],
      priorities: []
    }
  },
  setup ()
  {
    const { result, loading, error, fetchMore } = useQuery( GET_ISSUES );

    const repository_id = ref( '' )
    const title = ref( '' )
    const description = ref( '' )
    const client = ref( null )
    const type = ref( null )
    const priority = ref( null )
    const notification_title = ref( '' )
    const notification_message = ref( '' )
    const notification_show = ref( false )
    const notification_type = ref( "Success" )

    const { mutate: createIssue, onDone, onError, loading: createIssueLoading } = useMutation( POST_ISSUE, () => (
      {
        variables: {
          repositoryId: repository_id.value,
          title: title.value,
          body: description.value,
          labelIds: [
            client.value,
            priority.value,
            type.value
          ]
        },

        update: ( cache, { data: { createIssue } } ) =>
        {
          let data = cache.readQuery( { query: GET_ISSUES } )

          data = {
            ...data,
            repository: {
              ...data.repository,
              // Issues
              issues: {
                ...data.repository.issues,
                // Concat edges
                edges: [
                  ...data.repository.issues.edges,
                  { node: createIssue.issue }
                ],
              }
            }
          }
          cache.writeQuery( { query: GET_ISSUES, data } )
        },
      } ) )
    onDone( () =>
    {
      // reset form values to blank
      title.value = ''
      description.value = ''
      client.value = ''
      priority.value = ''
      type.value = '';

      // show popup
      notification_title.value = "Succesfully Added!"
      notification_message.value = "Your issue is important to us, thus it is on the bottom of the list"
      notification_show.value = true

      // scroll to bottom of page
      window.scrollTo( 0, document.body.scrollHeight || document.documentElement.scrollHeight );

      // remove notification after 3 seconds
      setTimeout( () => notification_show.value = false, 3000 );

    } ),

      onError( error =>
      {
        // read the error message
        // console.log( JSON.stringify( error, null, 4 ) )

        console.log( error )
        notification_title.value = "Something went wrong"

        if ( error.graphQLErrors[ 0 ].message )
        {
          var message = error.graphQLErrors[ 0 ].message

          switch ( message )
          {
            case "Could not resolve to a node with the global id of ''": message = "Please ensure that you select a client, priority and type of issue"; break;
            case "Could not resolve to a node with the global id of 'null'": message = "Please ensure that you select a valid client, priority and type of issue"; break;
            case "Title can't be blank": message = "Please ensure that you provide a title to your issue"; break;
            default: break;
          }

          notification_title.value = "We require more information"
          notification_message.value = message
        } else
        {
          notification_message.value = error
        }

        // show popup
        notification_type.value = "Error"
        notification_show.value = true

        // remove notification after 3 seconds
        setTimeout( () => notification_show.value = false, 3000 );

      } )

    return {
      repository_id,
      notification_title,
      notification_message,
      notification_show,
      notification_type,
      createIssue,
      createIssueLoading,
      result,
      loading,
      fetchMore,
      error,
      title,
      description,
      client,
      priority,
      type,
    };
  },
  beforeUpdate ()
  {
    this.getLabels()
    this.getRepositoryId()
  },
  methods: {
    getRepositoryId ()
    {
      this.repository_id = this.result.repository.id
    },
    getLabels ()
    {
      var labels = this.result.repository.labels?.edges
      var clients_array = []
      var priority_array = []
      var types_array = []
      for ( var x = 0; x <= labels.length; x++ )
      {
        var element = {}
        if ( typeof labels[ x ] !== "undefined" )
        {
          element.label = labels[ x ].node.name.slice( 3 )
          element.value = labels[ x ].node.id

          if ( labels[ x ].node.name[ 0 ] === "C" )
          {
            clients_array.push( element )
          } else if ( labels[ x ].node.name[ 0 ] === "P" )
          {
            priority_array.push( element )
          }
          else if ( labels[ x ].node.name[ 0 ] === "T" )
          {
            types_array.push( element )

          }
        }

        this.clients = clients_array
        this.types = types_array

        // sort priority aray, thank you to this kind person: https://stackoverflow.com/questions/55123569/react-sorting-by-specific-word
        this.priorities = priority_array.sort( ( a, b ) =>
        {
          const orders = { 'Low': 0, 'Medium': 1, 'High': 2 };
          return orders[ a.label ] - orders[ b.label ];
        } );
      }
    }
  },
  components: { IssuesTable, FormSelect, FormInput, FormTextarea, CustomButton, NotificationOverlay, SpinningLoader }
}

</script>
<style>
html {
  scroll-behavior: smooth;
}
</style>
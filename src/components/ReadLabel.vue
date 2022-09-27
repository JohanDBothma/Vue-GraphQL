<template>
  <td>c</td>
  <td>p</td>
  <td>t</td>
</template>

<script>
export default {
  name: 'ReadLabel',
  props: {
    label: Object
  },

  mounted: function ()
  {
    let label = this;

    console.log( label.edges )
  }
}
</script>
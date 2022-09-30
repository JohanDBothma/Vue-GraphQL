<template>
  <div class="my-6">
    <label :for="id" class="block text-sm font-medium text-gray-700">{{label}}</label>
    <select :id="id" ref="input" v-model="selected" v-bind="{ ...$attrs, class: null }"
      class="mt-1 block w-full bg-gray-200 rounded-md border-gray-200 py-2 pl-3 pr-10 text-base text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm">
      <slot />
    </select>
  </div>
</template>

<script>
export default {

  inheritAttrs: false,
  props: {
    label: String,
    id: String,
    modelValue: {
      type: String,
      default: null
    }
  },
  emits: [ 'update:modelValue' ],
  data ()
  {
    return {
      selected: this.modelValue
    }
  },
  watch: {
    selected ( selected )
    {
      this.$emit( 'update:modelValue', selected )
    },
  }
}

</script>
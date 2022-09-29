<template>
  <div class="my-6">
    <label :for="id" class="block text-sm font-medium text-gray-700">{{label}}</label>
    <textarea :id="id" ref="input" v-bind="{ ...$attrs, class: null }"
      @input="$emit('update:modelValue', $event.target.value)"
      class="mt-1 block w-full bg-gray-200 rounded-md border-gray-200 py-2 pl-3 pr-10 text-base text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
      :value="modelValue" />
  </div>
</template>

<script>
export default {
  props: {
    label: String,
    id: String,
    modelValue: String
  },
  emits: [ 'update:modelValue' ],
}

</script>
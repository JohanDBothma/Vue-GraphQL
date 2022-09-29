<script>

export default {
    inheritAttrs: false,
    props: {
        type: {
            type: String,
            default: "button",
        }
    },

    methods: {
        callback: function ( e )
        {
            this.$emit( 'click', e );
        }
    }
}
</script>

<template>
    <button :type="type" @click="callback($event)"
        class="inline-flex items-center justify-center min-w-42 px-4 py-2 bg-blue-400 text-white rounded-full uppercase disabled:opacity-25 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 duration-300 hover:bg-blue-600">
        <slot />
    </button>
</template>

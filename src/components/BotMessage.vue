<template>
    <div class="min-w-64 inline-block">
        <div class="ml-16 bg-indigo-100 px-2 py-2 rounded-r rounded-tl relative">
            <img
                class="inline-block h-12 w-12 rounded-full absolute -bottom-8 -left-14"
                src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-1.2.1&ixqx=BF07yJNwUF&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="Bot Avatar"
            >
            <span
                class="text-gray-800"
                v-html="message.message"
            />
        </div>
    </div>
</template>

<script>
export default {
    props: {
        message: {
            type: Object,
            required: true
        }
    }
};
</script>

<style lang="scss" scoped></style>

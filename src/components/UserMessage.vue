<template>
    <div class="min-w-64 h-12 flex justify-end">
        <div
            class="mr-16 bg-indigo-300 px-2 py-2 rounded-tr rounded-l relative"
        >
            <span
                class="border inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100 absolute -bottom-8 -right-14"
            >
                <svg
                    class="h-full w-full text-gray-300"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                </svg>
            </span>

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
            required: true,
        },
    },
};
</script>

<style lang="scss" scoped></style>

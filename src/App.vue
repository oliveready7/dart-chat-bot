<template>
    <div id="app">
        <chat-entry />
    </div>
</template>

<script>
import ChatEntry from "./components/ChatEntry";

export default {
    name: "App",
    components: {
        ChatEntry,
    },
    data() {
        return {
            fetchingTrainData: true,
        };
    },
    async mounted() {
        Promise.all([]).then(() => this.fetchingTrainData = false)
    },
    methods: {
        fetchAllDartStations() {
            
        }
    }
};
</script>

<style></style>

<template>
    <div
        class="mx-auto max-w-2xl h-screen flex flex-row justify-between relative"
    >
        <div
            class="z-50 bg-indigo-700 h-16 flex items-center justify-center px-4 w-full text-center font-bold text-indigo-50 absolute top-0"
        >
            Chatting to DART Bot
        </div>

        <div
            ref="messages"
            class="h-full w-full overflow-y-auto bg-gray-100 pb-16 pt-20 "
        >
            <!-- Messages container -->
            <div
                v-for="(message, i) in messages"
                :key="i"
                class="w-full flex"
                :class="[
                    message.type == 'bot' ? 'justify-start' : 'justify-end',
                ]"
            >
                <div class="w-4/5 md:w-3/4 mb-8">
                    <bot-message
                        v-if="message.type == 'bot'"
                        :key="i"
                        :message="message"
                    />
                    <user-message
                        v-if="message.type == 'user'"
                        :key="i"
                        :message="message"
                    />
                </div>
            </div>
        </div>

        <div
            class="absolute h-14 md:h-12 bottom-0 w-full bg-gray-200 px-2 py-2 items-center justify-center flex"
        >
            <form
                class="w-full"
                @submit.prevent="sendMessage"
            >
                <div class="grid grid-cols-4 w-full gap-2">
                    <div class="col-span-3 flex justify-center">
                        <label
                            for="message"
                            class="sr-only"
                        >Email</label>
                        <input
                            id="message"
                            v-model="userMessage"
                            type="text"
                            name="message"
                            class="w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block sm:text-sm border-gray-300 rounded-md"
                            placeholder="Message me about DART..."
                        >
                    </div>
                    <div class="col-span-1 flex justify-center">
                        <button
                            type="submit"
                            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import BotMessage from "./BotMessage.vue";
import UserMessage from "./UserMessage.vue";
import xml2js from "xml2js";
import Vue from 'vue';

export default {
    components: { BotMessage, UserMessage },
    data() {
        return {
            messages: [],
            userMessage: "",
            dartStations: [],
            stationData: []
        };
    },
    computed: {
        dartStationData() {
            //filter out any station which isn't of type DART
            return this.stationData.filter(station => station.Traintype[0] == 'DART')
        }
    },
    mounted() {
        this.fetchDartStations();
        //create a welcome message
        this.messages.push({
            type: "bot",
            message:
                "Hey there 👋 <br> <br> You can ask me questions about DART train times. <br> <br>Here what I can do: <ul class='list-disc pl-4'><li> Message a station's full name for the next 2 train times</li> <li> Message 'List Stations' for a full list of DART stations</li><ul>",
        });
    },
    methods: {
        async respond(message) {
            //convert to lowercase, so if a user messes about with cases it doesn't matter. 
            // e.g. Malahide and malahide will both work
            const messageToMatch = message.toLowerCase();

            if (messageToMatch.includes("list stations")) {
                await this.repsondToListStations()
                this.scrollToBottom()
                return
            }

            //check if message include a station in the list of stations

            await this.fetchDartStations();

            const stationMatch = this.dartStations.find((station) => {
                //get station name and convert to lowercase to see if it matches
                return messageToMatch.includes(station.StationDesc[0].toLowerCase())
            });

            if(stationMatch) {
                //lookup the next two times for station
                await this.respondToStationName(stationMatch)
                this.scrollToBottom()
                return
            }

            //if we get here then the bot doesn't know how to respond
            this.messages.push({
                type: "bot",
                message: "Sorry, I don't know how to answer that"
            });

            //scroll to the bottom of the window
            this.scrollToBottom()

        },
        async repsondToListStations() {
            await this.fetchDartStations();

            const stationNames = this.dartStations.map(
                (station) => station.StationDesc
            );

            //constuct HTML markup for message
            var response = "<ul>";

            stationNames.forEach((name) => {
                response += `<li>${name}</li>`;
            });

            //clost list tag
            response += "</ul>";

            //once we have built the reponse, add it to the chat window
            this.messages.push({
                type: "bot",
                message: response,
            });

        },
        async respondToStationName(station) {
            await this.fetchStationData(station.StationDesc[0])

            //constuct HTML markup for message
            var response = "<div class='font-bold text-lg'>Next Two Dart Arrivals</div>";

            this.dartStationData.slice(0, 2).forEach((station, i) => {
                response += `<strong>Destination: </strong> ${station.Destination[0]}`;
                response += `<br><strong>Destination Time: </strong> ${station.Destinationtime[0]}`;
                response += `<br><strong>Direction: </strong> ${station.Direction[0]}`;
                response += `<br><strong>Due In: </strong> ${station.Duein[0]} mins`;
                response += `<br><strong>Late: </strong> ${station.Late[0]} mins`;
                response += `<br><strong>Expected Arrival: </strong> ${station.Exparrival[0]}`;
                response += `<br><strong>Expected Departure: </strong> ${station.Expdepart[0]}`;
                response += `<br><strong>Scheduled Arrival: </strong> ${station.Scharrival[0]}`;
                response += `<br><strong>Scheduled Departure: </strong> ${station.Schdepart[0]}`;
                response += `<br><strong>Last Location: </strong> ${station.Lastlocation[0]}`;
                
                response += `<br><strong>Origin: </strong> ${station.Origin[0]}`;
                response += `<br><strong>Train Code: </strong> ${station.Traincode[0]}`;

                //if first station add a divider
                if(i == 0) {
                    response += `<div class="w-full h-px my-2 bg-indigo-300"></div>`;
                }
                 
            });

            //once we have built the reponse, add it to the chat window
            this.messages.push({
                type: "bot",
                message: response,
            });

            return
        },
        sendMessage() {
            //add message to the list of messages
            this.messages.push({
                message: this.userMessage,
                type: "user",
            });

            this.respond(this.userMessage);

            //reset message
            this.userMessage = "";
        },
        fetchStationData(stationName) {
            return fetch(
                `https://dart.proxy.oliveready.com/realtime/realtime.asmx/getStationDataByNameXML?StationDesc=${stationName}`
            )
                .then((response) => response.text())
                .then((data) => {
                    //use library to convert to JSON, as it's much easier to deal with
                    return xml2js.parseStringPromise(data).then((result) => {
                        //set the nested data
                        this.stationData = result.ArrayOfObjStationData.objStationData;
                    });
                });
        },
        fetchDartStations() {
            return fetch(
                "https://dart.proxy.oliveready.com/realtime/realtime.asmx/getAllStationsXML_WithStationType?StationType=D"
            )
                .then((response) => response.text())
                .then((data) => {
                    //use library to convert to JSON, as it's much easier to deal with
                    return xml2js.parseStringPromise(data).then((result) => {
                        //set the nested data
                        this.dartStations = result.ArrayOfObjStation.objStation;
                    });
                });
        },
        scrollToBottom() {
            //waits until Vues next tick, then scrolls the message container to the bottom
            Vue.nextTick(() => {
                this.$refs['messages'].scrollTop = this.$refs['messages'].scrollHeight - this.$refs['messages'].clientHeight
            })
        }
    },
};
</script>

<style lang="scss" scoped></style>

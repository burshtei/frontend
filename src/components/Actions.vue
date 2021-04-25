<template>
  <v-card>
    <v-data-table
      dense
      :headers="headers"
      :items="actions"
      class="elevation-1"
      mobile-breakpoint="0"
    >
      <template v-slot:item.date="{ item }">
        {{ moment(item.date).format("DD/MM/YYYY") }}
      </template>
      <template v-slot:item.amount="{ item }">
        <v-chip :color="getColor(item.amount)">
          {{ signedNumber(item.amount) }}
        </v-chip>
      </template>
      <template v-slot:item.target="{ item }">
        {{ targetDisplay(item.target) }}
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize"> Reset</v-btn>
      </template>
    </v-data-table>
  </v-card>
</template>
<script>
import axios from "axios";
import * as moment from "moment";

export default {
  data: () => ({
    backendUrl: process.env.VUE_APP_BACKEND_API,
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: "תאריך", value: "date" },
      { text: "משתמש", value: "user" },
      { text: "ברקוד", value: "book.barCode" },
      { text: "שם", value: "book.name" },
      { text: "כמות", value: "amount" },
      { text: "מטרה", value: "target" },
    ],
    actions: [],
  }),

  mounted() {
    axios
      .get(this.backendUrl + "/actions")
      .then((response) => (this.actions = response.data))
      .catch((reason) => console.log(reason));
  },
  methods: {
    initialize() {
      this.actions = [];
    },
    moment: function (date) {
      return moment(date);
    },
    signedNumber: function (amount) {
      if (amount < 0) {
        return Math.abs(amount).toString() + "-";
      }
      return amount.toString();
    },

    targetDisplay: function (target) {
      return this.$t(target);
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    getColor(amount) {
      if (amount > 0) return "green";
      else return "red";
    },
  },
};
</script>

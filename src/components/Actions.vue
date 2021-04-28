<template>
  <v-card>
    <v-container>
      <v-card>
        <v-btn right small
          ><download-excel :data="actions" :fields="json_fields">
            <v-icon>mdi-download</v-icon>
            ייצוא
          </download-excel></v-btn
        >
      </v-card>
    </v-container>
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
import Vue from "vue";
import axios from "axios";
import JsonExcel from "vue-json-excel";

Vue.component("downloadExcel", JsonExcel);

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
    all_actions: [],
    actions: [],
    json_fields: {
      תאריך: {
        field: "date",
        callback: (value) => {
          return moment(value).format("DD/MM/YYYY");
        },
      },
      ברקוד: "book.barCode",
      שם: "book.name",
      כמות: "amount",
      מטרה: {
        field: "target",
        callback: (value) => {
          if (value === "chish") return "חיש";
          if (value === "kehat") return "קהת";
        },
      },
    },
  }),
  mounted() {
    axios
      .get(this.backendUrl + "/actions")
      .then((response) => {
        this.all_actions = response.data;
        this.actions = this.all_actions;
      })
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

<template>
  <v-container>
    <v-toolbar flat>
      <v-card>
        <v-btn right small
          ><download-excel :data="actions" :fields="json_fields">
            <v-icon>mdi-download</v-icon>
            {{ $t("export_to_excel") }}
          </download-excel></v-btn
        >
      </v-card>
    </v-toolbar>
    <v-toolbar flat>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-dialog v-model="dialogDelete" max-width="600px">
        <v-card>
          <v-card-title class="headline"
            >{{ $t("confirm_action_delete") }}
          </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close()">Cancel </v-btn>
            <v-btn color="blue darken-1" text @click="deleteItemConfirm"
              >OK
            </v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar>
    <v-data-table
      dense
      :headers="headers"
      :items="actions"
      class="elevation-1"
      mobile-breakpoint="0"
      :search="search"
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
      <template v-slot:item.target="{ item }">
        {{ targetDisplay(item.target) }}
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small @click="deleteItem(item)"> mdi-delete</v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize"> Reset</v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>
<script>
import Vue from "vue";
import axios from "axios";
import JsonExcel from "vue-json-excel";

Vue.component("downloadExcel", JsonExcel);

import * as moment from "moment";

export default {
  data: () => ({
    search: "",
    backendUrl: process.env.VUE_APP_BACKEND_API,
    dialog: false,
    dialogDelete: true,
    snackbar: true,
    headers: [
      { text: "תאריך", value: "date" },
      { text: "משתמש", value: "user" },
      { text: "ברקוד", value: "book.barCode" },
      { text: "שם", value: "book.name" },
      { text: "כמות", value: "amount" },
      { text: "מטרה", value: "target" },
      { text: "הערה", value: "comment" },
      { text: "פעולות", value: "actions", sortable: false },
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
          if (value === "bentzi") return "בנצי";
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

    deleteItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.items.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    closeDelete() {
      console.log(
        "closeDelete: " + this.backendUrl + "/actions/" + this.editedItem.id
      );
      this.$nextTick(() => {
        axios
          .delete(this.backendUrl + "/actions/" + this.editedItem.id)
          .then(() => {
            this.editedItem = Object.assign({}, this.defaultItem);
            this.editedIndex = -1;
            this.dialogDelete = false;
            this.displaySnackbar(
              this.$t("deleted_item_successfully"),
              "success"
            );
          })
          .catch((reason) => {
            console.log(reason);
            this.displaySnackbar(this.$t("deleted_item_failed"), "error");
          });
      });
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

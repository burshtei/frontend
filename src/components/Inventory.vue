<template>
  <v-card>
    <v-snackbar
      v-model="snackbar.show"
      :timeout="4000"
      top
      :color="snackbar.color"
    >
      <span>{{ snackbar.msg }}</span>
    </v-snackbar>
    <v-data-table
      dense
      :headers="headers"
      :items="items"
      sort-by="barCode"
      class="elevation-1"
      :search="search"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>{{ $t("items") }}</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="800px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark v-bind="attrs" v-on="on">
                {{ $t("new_item") }}
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container fluid>
                  <v-row>
                    <v-col cols="3">
                      <v-text-field
                        v-model="editedItem.barCode"
                        label="בר קוד"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="5">
                      <v-text-field
                        v-model="editedItem.name"
                        label="שם"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="3">
                      <v-text-field
                        v-model="editedItem.section"
                        label="עמודה"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="2">
                      <v-text-field
                        v-model="editedItem.amount"
                        label="כמות"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="3">
                      <v-text-field
                        v-model="editedItem.packageSize"
                        label="פריטים בחבילה"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close"> Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="save"> Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="600px">
            <v-card>
              <v-card-title class="headline"
                >{{ $t("confirm_item_delete") }}
              </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close()"
                  >Cancel
                </v-btn>
                <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                  >OK
                </v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil</v-icon>
        <v-icon small @click="deleteItem(item)"> mdi-delete</v-icon>
      </template>
      <template v-slot:item.amount="{ item }">
        {{ displayByPackage(item) }}
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize"> Reset</v-btn>
      </template>
    </v-data-table>
  </v-card>
</template>
<script>
import axios from "axios";
import router from "@/router";

export default {
  data: () => ({
    snackbar: {
      show: false,
      msg: "",
      color: "",
    },
    search: "",
    backendUrl: process.env.VUE_APP_BACKEND_API,
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: "בר קוד", value: "barCode" },
      { text: "שם / תיאור", value: "name" },
      { text: "עמודה", value: "section", filterable: false },
      { text: "כמות", value: "amount", filterable: false },
      { text: "פעולות", value: "actions", sortable: false },
    ],
    items: [],
    editedIndex: -1,
    editedItem: {
      barCode: "",
      name: "",
    },
    defaultItem: {
      id: null,
      barCode: "",
      name: "",
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "פריט חדש" : "עידכון פריט";
    },
  },

  // watch: {
  //   dialog(val) {
  //     val || this.close();
  //   },
  //   dialogDelete(val) {
  //     val || this.closeDelete();
  //   },
  // },

  mounted() {
    axios
      .get(this.backendUrl + "/books")
      .then((response) => (this.items = response.data))
      .catch((reason) => {
        console.log(reason);
        if (reason.response.status === 401) {
          router.push("/login");
        }
      });
  },
  methods: {
    initialize() {
      this.items = [];
    },
    editItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
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

    close() {
      this.dialogDelete = false;
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      console.log(
        "closeDelete: " + this.backendUrl + "/books/" + this.editedItem.id
      );
      this.$nextTick(() => {
        axios
          .delete(this.backendUrl + "/books/" + this.editedItem.id)
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

    save() {
      if (this.editedIndex > -1) {
        axios
          .put(
            this.backendUrl + "/books/" + this.editedItem.id,
            this.editedItem
          )
          .then(() => {
            Object.assign(this.items[this.editedIndex], this.editedItem);
            this.displaySnackbar(this.$t("update_item_success"), "success");
            this.close();
          })
          .catch((reason) => {
            console.log(reason);
            this.displaySnackbar(this.$t("update_item_failed"), "error");
          });
      } else {
        axios
          .post(this.backendUrl + "/books", this.editedItem)
          .then((response) => {
            this.items.push(response.data);
            this.displaySnackbar(this.$t("add_item_success"), "success");
            this.close();
          })
          .catch((reason) => {
            console.log(reason);
            this.displaySnackbar(this.$t("add_item_failed"), "error");
          });
      }
    },
    displayByPackage: function (book) {
      let retValue = book.amount;
      if (book.packageSize > 0 && book.amount > book.packageSize) {
        let reminder = book.amount % book.packageSize;
        let packeges = Math.floor(book.amount / book.packageSize);
        if (packeges > 0) {
          retValue =
            "(" +
            packeges +
            " " +
            this.$t("packages") +
            " * " +
            book.packageSize +
            " )";
        }
        if (reminder > 0) {
          retValue += " + " + reminder;
        }
        retValue += " = " + book.amount;
      }
      return retValue;
    },

    displaySnackbar(msg, color) {
      this.snackbar = {
        show: true,
        msg: msg,
        color: color,
      };
    },
  },
};
</script>

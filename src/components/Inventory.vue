<template>
  <v-data-table
    dense
    :headers="headers"
    :items="items"
    sort-by="calories"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>{{ $t("items") }}</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              פריט חדש
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.barCode"
                      label="בר קוד"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="editedItem.name"
                      label="שם"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="2">
                    <v-text-field
                      v-model="editedItem.amount"
                      label="כמות"
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
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="headline"
              >Are you sure you want to delete this item?
            </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete"
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
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize"> Reset</v-btn>
    </template>
  </v-data-table>
</template>
<script>
import axios from "axios";

export default {
  data: () => ({
    backendUrl: process.env.VUE_APP_BACKEND_API,
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: "בר קוד", value: "barCode" },
      { text: "שם / תיאור", value: "name" },
      { text: "כמות", value: "amount" },
      { text: "פעולות", value: "actions", sortable: false },
    ],
    items: [],
    editedIndex: -1,
    editedItem: {
      barCode: "",
      name: "",
    },
    defaultItem: {
      id: "",
      barCode: "",
      name: "",
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "פריט חדש" : "עידכון פריט";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  mounted() {
    axios
      .get(this.backendUrl + "/books")
      .then((response) => (this.items = response.data))
      .catch((reason) => console.log(reason));
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
      console.log("deleteItemConfirm: " + this.editedItem.id);
      this.items.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      console.log("close: " + this.editedItem.id);
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      console.log(
        "closeDelete: " + this.backendUrl + "/books/" + this.editedItem.id
      );
      this.$nextTick(() => {
        axios
          .delete(this.backendUrl + "/books/" + this.editedItem.id)
          .then((this.editedItem = Object.assign({}, this.defaultItem)))
          .then((this.editedIndex = -1))
          .catch((reason) => console.log(reason));
      });
    },

    save() {
      if (this.editedIndex > -1) {
        axios
          .put(
            this.backendUrl + "/books/" + this.editedItem.id,
            this.editedItem
          )
          // .then((response)return => )
          .catch((reason) => console.log(reason));
        Object.assign(this.items[this.editedIndex], this.editedItem);
      } else {
        axios
          .post(this.backendUrl + "/books", this.editedItem)
          .then((response) => this.items.push(response.data))
          .catch((reason) => console.log(reason));
      }
      this.close();
    },
  },
};
</script>

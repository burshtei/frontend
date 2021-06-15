<template>
  <v-main>
    <v-snackbar
      v-model="snackbar.show"
      :timeout="4000"
      top
      :color="snackbar.color"
    >
      <span>{{ snackbar.msg }}</span>
    </v-snackbar>
    <v-container class="ma-1">
      <v-card>
        <v-row justify="center" align-content="center">
          <v-dialog v-model="dialog" max-width="600px">
            <template v-slot:activator="{ on, attrs }">
              <v-row>
                <v-col>
                  <v-btn
                    class="ma-md-16"
                    color="primary"
                    dark
                    v-bind="attrs"
                    v-on="on"
                    @click="openDialog(true)"
                  >
                    {{ $t("insert_stock") }}
                    <v-icon>mdi-import</v-icon>
                  </v-btn>
                </v-col>
                <v-col>
                  <v-btn
                    class="ma-md-16"
                    color="primary"
                    dark
                    v-bind="attrs"
                    v-on="on"
                    @click="openDialog(false)"
                  >
                    {{ $t("export_stock") }}
                    <v-icon>mdi-export</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </template>
            <v-card>
              <v-card-title v-if="isInsert === true" class="headline">
                {{ $t("insert_stock") }}
              </v-card-title>
              <v-card-title v-else class="headline">
                {{ $t("export_stock") }}
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="2" md="4">
                      <v-text-field
                        v-model="action.barCode"
                        :label="$t('barCode')"
                        required
                        @change="barCodeUpdated($event)"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-text-field
                        :label="$t('name')"
                        required
                        disabled
                        v-bind:value="action.book.name"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="2">
                      <v-text-field
                        v-model="action.amount"
                        :label="$t('amount')"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="2">
                      <v-radio-group v-model="action.target">
                        <v-radio
                          v-for="tr in targetEnum"
                          :key="tr"
                          :label="$t(`${tr}`)"
                          :value="tr"
                        ></v-radio>
                      </v-radio-group>
                    </v-col>
                    <v-col cols="12" sm="10">
                      <v-text-field
                        v-model="action.comment"
                        :label="$t('comment')"
                        required
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
        </v-row>
      </v-card>
    </v-container>
  </v-main>
</template>

<script>
import axios from "axios";

export default {
  data: () => ({
    snackbar: {
      show: false,
      msg: "",
      color: "",
    },
    backendUrl: process.env.VUE_APP_BACKEND_API,
    isInsert: true,
    dialog: false,
    targetEnum: ["kehat", "chish", "bentzi"],
    emptyBook: {
      name: "",
      id: null,
      amount: 0,
    },
    action: {
      amount: 0,
      barCode: "",
      user: null,
      target: null,
      book: {
        name: "",
        id: null,
        amount: 0,
      },
    },
  }),
  methods: {
    openDialog(isInsert) {
      this.isInsert = isInsert;
      this.dialog = true;
    },
    barCodeUpdated(event) {
      axios
        .get(this.backendUrl + "/books/query?barCode=" + event)
        .then((value) => (this.action.book = value.data))
        .catch((reason) => {
          this.action.book = this.emptyBook;
          console.log(reason);
        });
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.action = Object.assign({}, this.action);
      });
    },
    save() {
      if (this.isInsert === false) {
        this.action.amount = -this.action.amount;
      }
      if (this.action.book.id != null) {
        this.action.book.amount += parseInt(this.action.amount);
        let user = JSON.parse(localStorage.getItem("user"));
        this.action.user = user.name;
        axios
          .post(this.backendUrl + "/actions", this.action)
            .then(() => {
              this.displaySnackbar(this.$t("action_saved_success"), "success")
              this.close()
        })
          .catch((reason) => {
            console.log(reason)
            this.displaySnackbar(this.$t("action_saved_failed"), "error")
          });
      }
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

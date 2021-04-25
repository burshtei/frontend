<template>
  <div>
    <v-container class="ma-1">
      <v-card>
        <v-row justify="center" align-content="center">
          <v-dialog v-model="dialog" persistent max-width="600px">
            <template v-slot:activator="{ on, attrs }">
              <v-row>
                <v-col>
                  <v-btn
                    class="ma-md-16"
                    color="primary"
                    dark
                    v-bind="attrs"
                    v-on="on"
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
                  >
                    {{ $t("export_stock") }}
                    <v-icon>mdi-export</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </template>
            <v-card>
              <v-card-title class="headline">
                {{ $t("insert_stock") }}
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="2" md="4">
                      <v-text-field
                        :label="$t('barCode')"
                        required
                        @change="barCodeUpdated($event, isInsert)"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-text-field
                        :label="$t('name')"
                        required
                        disabled
                        v-bind:value="book.name"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="2">
                      <v-text-field
                        :label="$t('amount')"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="2">
                      <v-radio-group>
                        <v-radio
                          v-for="tr in targetEnum"
                          :key="tr"
                          :label="$t(`${tr.toLowerCase()}`)"
                          :value="tr"
                        ></v-radio>
                      </v-radio-group>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="dialog = false">
                  {{ $t("ok") }}
                </v-btn>
                <v-btn @click="dialog = false">
                  {{ $t("cancel") }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data: () => ({
    backendUrl: process.env.VUE_APP_BACKEND_API,
    isInsert: true,
    dialog: false,
    targetEnum: ["KEHAT", "CHISH"],
    book: {},
  }),
  methods: {
    barCodeUpdated(event, isInsert) {
      console.log(isInsert);
      console.log(this.backendUrl + "/books/query?barCode=" + event);
      console.log(this.book);
      axios
        .get(this.backendUrl + "/books/query?barCode=" + event)
        .then((value) => (this.book = value.data))
        .catch(console.log(this.book));
      console.log(this.book);
    },
  },
};
</script>

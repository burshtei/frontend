<template>
  <div>
    <v-container class="ma-1">
      <v-card>
        <v-row justify="center" align-content="center">

          <v-dialog
            v-model="dialog"
            persistent
            max-width="600px"
          >
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
                    {{ $t('insert_stock') }}
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
                    {{ $t('export_stock') }}
                    <v-icon>mdi-export</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </template>
            <v-card>
              <v-card-title class="headline">
                {{ $t('insert_stock') }}
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-text-field
                        label="Barcode*"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                    >
                      <v-text-field
                        label="name"
                        required
                        disabled
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="green darken-1"
                  text
                  @click="dialog = false"
                >
                  Disagree
                </v-btn>
                <v-btn
                  color="green darken-1"
                  text
                  @click="dialog = false"
                >
                  Agree
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
export default {
  data: () => ({
    insert: true,
    dialog: false
  })
}
</script>

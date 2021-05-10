<template>
  <v-main>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-card class="elevation-12">
            <v-toolbar dark color="primary">
              <v-toolbar-title>Login form</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-text-field
                  prepend-icon="person"
                  v-model="login.username"
                  label="Login"
                  type="text"
                ></v-text-field>
                <v-text-field
                  id="password"
                  prepend-icon="lock"
                  v-model="login.password"
                  name="password"
                  label="Password"
                  type="password"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="loginUser" color="primary">Login</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-main>
</template>
<script>
import axios from "axios";
import router from "@/router";

export default {
  data() {
    return {
      backendUrl: process.env.VUE_APP_BACKEND_API,
      login: {
        username: "",
        password: "",
      },
    };
  },

  methods: {
    async loginUser() {
      console.log(this.backendUrl + "/auth/login");
      console.log(this.login);
      try {
        axios
          .post(this.backendUrl + "/auth/login", this.login)
          .then((response) => {
            let token = response.data.access_token;
            localStorage.setItem("token", token);
            axios.defaults.headers.common["Authorization"] = "bearer " + token;
            axios
              .get(this.backendUrl + "/profile", {
                headers: axios.defaults.headers.common,
              })
              .then((response) => {
                let user = response.data;
                localStorage.setItem("user", JSON.stringify(user));
                router.push("/");
              });
          });
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

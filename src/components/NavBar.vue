<template>
  <nav>
    <v-app-bar app color="primary">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <div class="d-flex align-center">
        <v-img
          alt="Kehat Logo"
          class="shrink mr-3"
          src="../assets/kehat_logo.jpg"
          transition="scale-transition"
          width="30"
        />

        <v-img
          class="shrink mt-1 hidden-sm-and-down"
          src="../assets/inven_logo.png"
          width="70"
        />
      </div>
      <span class="mr-2">המחסן של קה"ת - בראשות הרב מנחם בכר</span>
      <v-spacer></v-spacer>
      <v-btn color="grey" @click="singedOut">
        {{ $t("signed_out") }}
        <v-icon>exit_to_app</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer app right v-model="drawer" hide-overlay>
      <v-card class="mx-auto" max-width="300" tile>
        <v-list>
          <v-list-item
            v-for="link in links"
            :key="link.text"
            router
            :to="link.route"
          >
            <v-list-item-action>
              <v-icon>{{ link.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                {{ $t(link.text) }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-navigation-drawer>
  </nav>
</template>

<script>
import router from "@/router";

export default {
  data() {
    return {
      drawer: false,
      links: [
        { icon: "home", text: "inventory", route: "/inventory" },
        { icon: "history", text: "history", route: "/actions" },
        {
          icon: "swap_horizontal_circle",
          text: "actions",
          route: "/exportImport",
        },
      ],
    };
  },
  methods: {
    async singedOut() {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      await router.push("/login");
    },
  },
};
</script>

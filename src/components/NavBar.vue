<template>
  <nav>
    <v-app-bar app color="primary">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <div class="d-flex align-center">
        <v-img
          alt="Kehat Logo"
          class="shrink mr-2"
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
      <v-btn color="grey">
        התנתק
        <v-icon>exit_to_app</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer app right v-model="drawer" hide-overlay>
      <v-list>
        <v-list-item href="/inventory">
          <v-list-item-title>{{ $t("inventory") }}</v-list-item-title>
        </v-list-item>
        <v-list-item href="/actions">
          <v-list-item-title>{{ $t("history") }}</v-list-item-title>
        </v-list-item>
        <v-list-item href="/exportImport">
          <v-list-item-title>{{ $t("actions") }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
    };
  },
};
</script>

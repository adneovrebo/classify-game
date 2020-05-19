<template>
  <v-app>
    <v-app-bar app color="primary" dark>  
      <v-btn to="/" text>
        <v-icon>mdi-play</v-icon>
        <span class="mr-2">Classify Game</span>
      </v-btn>
    </v-app-bar>

    <v-container fill-height fluid>
      <v-row align="center" justify="center">
        <v-col align="center">
          <router-view />
        </v-col>
      </v-row>
    </v-container>

    <v-footer
      dark
      padless
    >
      <v-card
        class="flex"
        flat
        tile
      >
        <v-card-text class="py-2 white--text text-center">
          {{ new Date().getFullYear() }} — <strong>Ådne Øvrebø</strong>
        </v-card-text>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: "App"
};
</script>

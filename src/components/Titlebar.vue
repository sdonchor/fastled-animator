<template>
  <v-card style="border-radius: 0; vertical-align: middle;" color="indigo" outlined class="toolbarContainer pa-5">
    <h1><v-icon xlarge>mdi-led-variant-outline</v-icon>FastLED Animator</h1>
    <v-icon class="darkModeButton" @click.stop="$vuetify.theme.dark = !$vuetify.theme.dark"
      >mdi-theme-light-dark</v-icon
    >
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'Titlebar',
})
export default class extends Vue {}
</script>

<style>
.toolbarContainer {
  position: relative;
  top: 0;
  width: 100%;
}
h1 {
  font-size: 20px;
  color: white;
  display: inline;
  -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: black;
}
.darkModeButton {
  position: absolute !important;
  right: 20px;
}
</style>

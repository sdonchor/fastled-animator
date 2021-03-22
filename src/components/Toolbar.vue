<template>
  <v-card outlined height="50px">
    <div class="toolbar">
      <v-btn color="red" v-if="mode != 'order'" @click.stop="$emit('start-ordering')"
        ><v-icon left>mdi-led-strip-variant</v-icon>Define LED strip
      </v-btn>
      <v-btn color="green" v-if="mode == 'order'" @click="$emit('order-done')">
        <v-icon left>mdi-check</v-icon>Done defining</v-btn
      >
      <template v-if="stripDefined && mode != 'order'">
        <v-btn color="blue" @click.stop="$emit('save-frame')">
          <v-icon left>mdi-content-save-outline</v-icon>Save frame</v-btn
        >

        <v-btn color="blue" @click.stop="$emit('save-new-frame')">
          <v-icon left>mdi-content-save-all-outline</v-icon>Save as new frame</v-btn
        >

        <v-btn color="orange" @click.stop="$emit('clear-frame')">
          <v-icon left>mdi-close-thick</v-icon>
          Clear frame
        </v-btn>

        <v-btn color="blue" @click.stop="$emit('fill-frame')">
          <v-icon left>mdi-format-color-fill</v-icon>
          Fill frame
        </v-btn>

        <v-btn v-if="mode == 'paint'" color="red" @click.stop="$emit('eraser-mode')">
          <v-icon left>mdi-eraser</v-icon>
          Eraser mode
        </v-btn>

        <v-btn v-if="mode == 'erase'" color="blue" @click.stop="$emit('painting-mode')">
          <v-icon left>mdi-brush</v-icon>
          Painting mode
        </v-btn>

        <v-menu offset-y v-if="mode == 'paint'">
          <template v-slot:activator="{ on }">
            <v-btn :color="colorHex" v-on="on"> </v-btn>
          </template>
          <v-color-picker
            value="#000000"
            v-model="colorHex"
            hide-inputs
            show-swatches
            @update:color="colorUpdate"
            class="mx-auto"
          ></v-color-picker>
        </v-menu>
      </template>
    </div>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Color from '../types/Color';
@Component({
  name: 'Toolbar',
})
export default class extends Vue {
  private colorHex: string = '#ffffff';

  @Prop()
  public mode!: string;

  @Prop()
  public stripDefined!: boolean;

  private colorUpdate(val: { hex: string }): void {
    this.colorHex = val.hex.substr(0, 7);
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this.colorHex);
    if (result) {
      let color: Color = {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        hex: this.colorHex,
      };
      this.$emit('color-change', color);
    }
  }
  mounted(): void {
    this.colorUpdate({ hex: '#ffffff' });
  }
}
</script>

<style>
.toolbar {
  display: flex;
  height: 100%;
  align-content: center;
  justify-content: space-between;
}
.toolbar .v-btn {
  margin: 5px;
}
</style>

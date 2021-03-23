<template>
  <v-card outlined height="100%" class="codeGenContainer">
    <v-textarea
      height="600px"
      outlined
      no-resize
      readonly
      class="ma-5 consoleFont"
      v-model="code"
      label="Generated code"
    >
    </v-textarea>
    <v-checkbox
      v-model="prependAllOff"
      @change="generateCode"
      class="ml-5"
      label="Prepend 'AllOff' snippet"
    ></v-checkbox>
    <v-checkbox style="margin-top: -10px;" v-model="comments" @change="generateCode" class="ml-5" label="Comments">
    </v-checkbox>
  </v-card>
</template>

<script lang="ts">
import Frame from '@/types/Frame';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component({
  name: 'CodeGenerator',
})
export default class extends Vue {
  private code = '';
  @Prop()
  public frames!: Frame[];
  private prependAllOff = false;
  private comments = true;

  private generateCode(): void {
    let code = '';
    if (this.prependAllOff) {
      if (this.comments) code += '//ALL OFF start\n';

      this.frames[0].strip.forEach((led, idx) => {
        code += `leds[${idx}]CRGB(0,0,0);\n`;
      });

      if (this.comments) code += '//ALL OFF end\n';
    }
    this.frames.forEach((f, idx) => {
      if (this.comments) code += `//FRAME ${++idx} (${f.duration}ms)\n`;
      f.strip.forEach((led, idx) => {
        code += `leds[${idx}]=CRGB(${led.color.r}, ${led.color.g}, ${led.color.b});\n`;
      });
      code += 'FastLED.show();\n';
      code += `delay(${f.duration});\n`;
    });

    this.code = code;
  }
  @Watch('frames')
  public codeChange(): void {
    this.generateCode();
  }

  mounted(): void {
    if (this.frames.length > 0) {
      this.generateCode();
    }
  }
}
</script>

<style>
.consoleFont textarea {
  font-family: 'Courier New', monospace;
  font-size: 12px;
  line-height: 12px;
}
</style>

<template>
  <v-card height="100%" align="center" justify="center" outlined class="frameEditorContainer">
    <Toolbar
      :mode="mode"
      :stripDefined="strip.length > 0"
      @start-ordering="startOrderingLeds"
      @order-done="saveOrder"
      @color-change="colorChange"
      @save-frame="$emit('save-frame')"
      @save-new-frame="$emit('save-new-frame')"
      @clear-frame="clearFrame"
      @fill-frame="fillFrame(color)"
      @painting-mode="changeMode('paint')"
      @eraser-mode="changeMode('erase')"
    ></Toolbar>
    <div style="width: 50%;" class="editor" align="center" justify="center">
      <v-row align="center" justify="center">
        <v-col cols="12">
          <div :id="'led' + l" class="led" v-for="l in 15 * 15" :key="'led' + l" @click.stop="ledClicked"></div>
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>

<script lang="ts">
import Color from '@/types/Color';
import Led from '@/types/Led';
import { Component, Vue } from 'vue-property-decorator';
import Toolbar from './Toolbar.vue';
import Swal from 'sweetalert2';
import { cloneObject } from '@/utils';
@Component({
  name: 'FrameEditor',
  components: { Toolbar },
})
export default class extends Vue {
  private mode: 'order' | 'paint' | 'erase' | null = 'paint';
  private color: Color = { r: 255, g: 255, b: 255, hex: '#ffffff' };
  private strip: Led[] = [];

  private ledClicked(e: Event): void {
    const square = e.target as HTMLElement;
    if (this.mode == 'order') {
      if (
        this.strip.find((x) => {
          return x.square == square.id;
        })
      ) {
        return;
      }
      if (this.strip.length <= 0) {
        square.style.backgroundColor = 'green';
      }
      this.strip.push({ color: { r: 0, g: 0, b: 0, hex: '#000000' }, square: square.id });
      square.className = 'led active';
    } else if (this.mode == 'paint' || this.mode == 'erase') {
      if (this.strip.length <= 0) {
        Swal.fire({ title: 'Error', text: 'No LED strip defined.', icon: 'error' });
      }
      if (square.style.visibility == 'hidden') {
        return;
      }
      square.style.backgroundColor = this.mode == 'paint' ? this.color.hex : '#000000';
      const led = this.strip.find((e) => {
        return e.square == square.id;
      });
      if (!led) {
        Swal.fire({ title: 'Error', text: 'No LED associated with this square, try defining again.', icon: 'error' });
        return;
      } else {
        led.color = this.mode == 'paint' ? this.color : { r: 0, g: 0, b: 0, hex: '#000000' };
        this.$emit('strip-update', this.strip);
      }
    }
  }
  private colorChange(color: Color): void {
    this.color = color;
  }
  private changeMode(mode: 'order' | 'paint' | 'erase' | null): void {
    this.mode = mode;
    this.$emit('change-mode', mode);
  }
  private startOrderingLeds(): void {
    if (this.strip.length > 0) {
      Swal.fire({
        title: 'Warning',
        text: 'This action will remove all existing frames. Continue?',
        icon: 'warning',
        showCancelButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          this.enterOrderingMode();
        }
      });
    } else {
      this.enterOrderingMode();
    }
  }
  public rerenderSquares(): void {
    this.strip.forEach((e) => {
      const x = document.querySelector(`#${e.square}`) as HTMLElement;
      x.style.backgroundColor = e.color.hex;
    });
  }
  public loadStrip(strip: Led[]): void {
    this.strip = cloneObject(strip) as Led[];
    this.rerenderSquares();
    this.$emit('strip-update', this.strip, false);
  }
  private enterOrderingMode(): void {
    this.changeMode('order');
    this.$emit('remove-frames');
    this.strip = [];
    document.querySelectorAll('.led').forEach((e) => {
      const x = e as HTMLElement;
      x.className = 'led';
      x.style.visibility = 'visible';
      x.style.backgroundColor = '#000000';
    });
  }
  private saveOrder(): void {
    if (this.strip.length <= 0) {
      Swal.fire({ title: 'Error', text: 'No LEDs defined.', icon: 'error' });
      return;
    }
    this.changeMode('paint');
    document.querySelectorAll('.led').forEach((e) => {
      const x = e as HTMLElement;
      x.className = 'led';
      x.style.visibility = 'hidden';
      x.style.backgroundColor = '#000000';
    });
    this.strip.forEach((e) => {
      const x = document.querySelector(`#${e.square}`) as HTMLElement;
      x.style.visibility = 'visible';
    });
    this.$emit('strip-update', this.strip);
  }
  private fillFrame(color: Color): void {
    this.strip.forEach((e) => {
      e.color = color;
      const x = document.querySelector(`#${e.square}`) as HTMLElement;
      x.style.backgroundColor = e.color.hex;
    });
    this.$emit('strip-update', this.strip);
  }
  private clearFrame(): void {
    this.fillFrame({ r: 0, g: 0, b: 0, hex: '#000000' });
  }
}
</script>

<style>
.frameEditorContainer {
  height: 87vh;
}

.led {
  font-size: 8px;
  color: white;
  float: left;
  width: 6%;
  padding-bottom: 6%;
  margin: 0.3%;
  background-color: #000000;
}
.start {
  background-color: green;
}
.end {
  background-color: red;
}
.active {
  -webkit-box-shadow: inset 0px 0px 0px 3px rgb(59, 58, 58);
  -moz-box-shadow: inset 0px 0px 0px 3px rgb(59, 58, 58);
  box-shadow: inset 0px 0px 0px 3px rgb(59, 58, 58);
}
</style>

<template>
  <v-app>
    <v-main>
      <Titlebar></Titlebar>
      <v-container fluid height="87vh" max-height="87vh">
        <v-row>
          <v-col cols="2">
            <FrameList
              @switch-frame="switchFrame"
              @select-frame="selectFrame"
              @add-frame="addFrame"
              @delete-frame="deleteFrame"
              @move-frame="moveFrame"
              @modify-duration="modifyDuration"
              @default-duration-change="defaultDurationChange"
              @duration-all="setAllDuration"
              :currentFrameIndex="currentFrameIndex"
              :frames="frames"
            ></FrameList>
          </v-col>
          <v-col cols="8"
            ><FrameEditor
              ref="editor"
              @change-mode="changeMode"
              @strip-update="stripUpdate"
              @remove-frames="deleteAllFrames"
              @save-frame="saveFrame"
              @save-new-frame="saveNewFrame"
            ></FrameEditor
          ></v-col>
          <v-col cols="2"><CodeGenerator :key="codeIteration" :frames="frames"></CodeGenerator></v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Frame from './types/Frame';
import FrameEditor from './components/FrameEditor.vue';
import FrameList from './components/FrameList.vue';
import CodeGenerator from './components/CodeGenerator.vue';
import Titlebar from './components/Titlebar.vue';
import Led from './types/Led';
import Swal from 'sweetalert2';
import { cloneObject } from './utils';
@Component({
  name: 'App',
  components: { FrameEditor, FrameList, CodeGenerator, Titlebar },
})
export default class extends Vue {
  private frames: Frame[] = [];
  private editedStrip: Led[] = [];
  private currentFrameIndex = -1;
  private unsavedFrame = false;
  private mode: string | null = null;
  private duration = 100;
  private codeIteration = 1;
  public changeMode(mode: string): void {
    this.mode = mode;
  }
  public switchFrame(idx: number): void {
    const swapEditedFrame = () => {
      this.unsavedFrame = false;
      (this.$refs.editor as FrameEditor).loadStrip(this.frames[idx].strip);
    };
    if (this.unsavedFrame) {
      Swal.fire({
        title: 'Warning',
        text: 'Currently edited frame was not saved. Discard changes?',
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: 'No',
        showConfirmButton: true,
        confirmButtonText: 'Yes',
      }).then((result) => {
        if (result.isConfirmed) {
          swapEditedFrame();
        }
      });
    } else {
      swapEditedFrame();
    }
  }
  public selectFrame(idx: number): void {
    this.currentFrameIndex = idx;
  }
  public deleteFrame(idx: number): void {
    this.frames = this.frames.filter((e, index) => {
      return index != idx;
    });
    this.currentFrameIndex = -1;
  }
  public addFrame(duration: number): void {
    if (this.mode == 'order' || this.editedStrip.length <= 0) {
      Swal.fire({
        title: 'Error',
        text: 'Finish defining your LED strip first.',
        icon: 'error',
      });
      return;
    }
    this.frames.push({ duration, strip: cloneObject(this.editedStrip) as Led[] });
    this.unsavedFrame = false;
  }
  public deleteAllFrames(): void {
    this.frames = [];
    this.currentFrameIndex = -1;
  }
  public stripUpdate(strip: Led[], unsaved = true): void {
    this.unsavedFrame = unsaved;
    this.editedStrip = cloneObject(strip) as Led[];
    this.codeIteration++;
  }
  public moveFrame(dir: 'up' | 'down'): void {
    console.log(this.currentFrameIndex);
    if (this.currentFrameIndex == -1) {
      Swal.fire({
        title: 'Error',
        text: 'No frame selected.',
        icon: 'error',
      });
      return;
    }
    if (dir === 'up') {
      if (this.currentFrameIndex <= 0) {
        return;
      }

      [this.frames[this.currentFrameIndex - 1], this.frames[this.currentFrameIndex]] = [
        this.frames[this.currentFrameIndex],
        this.frames[this.currentFrameIndex - 1],
      ];
      this.currentFrameIndex--;
    }
    if (dir === 'down') {
      if (this.currentFrameIndex === this.frames.length - 1) {
        return;
      }
      [this.frames[this.currentFrameIndex], this.frames[this.currentFrameIndex + 1]] = [
        this.frames[this.currentFrameIndex + 1],
        this.frames[this.currentFrameIndex],
      ];
      this.currentFrameIndex++;
    }
    this.codeIteration++;
  }
  private setAllDuration(duration: number) {
    this.frames.forEach((e) => {
      e.duration = duration;
    });
    this.codeIteration++;
  }
  private saveFrame() {
    if (this.currentFrameIndex < 0) {
      Swal.fire({
        title: 'Error',
        text: 'No frame selected.',
        icon: 'error',
      });
      return;
    }
    this.frames[this.currentFrameIndex].strip = cloneObject(this.editedStrip) as Led[];
    this.unsavedFrame = false;
    this.codeIteration++;
  }
  private saveNewFrame() {
    this.frames.push({
      duration: this.duration,
      strip: this.editedStrip,
    });
    this.unsavedFrame = false;
    this.codeIteration++;
  }
  public modifyDuration(idx: number, duration: number): void {
    this.frames[idx].duration = duration;
    this.codeIteration++;
  }
  public defaultDurationChange(duration: number): void {
    this.duration = duration;
  }
}
</script>

<style></style>

<template>
  <v-card outlined class="frameTableContainer" height="100%">
    <v-simple-table dense fixed-header height="100%" class="frameTable">
      <thead>
        <tr>
          <th>Index</th>
          <th>Duration (ms)</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(f, idx) in frames"
          :key="idx"
          @click.stop="selectFrame(idx)"
          :class="currentFrameIndex == idx ? 'activeFrame' : ''"
        >
          <td>{{ idx + 1 }}</td>
          <td>{{ f.duration }}</td>
          <td>
            <v-tooltip left color="darkgray">
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-bind="attrs" v-on="on" color="green" @click="switchFrame(idx)"
                  >mdi-arrow-right-bold-box-outline</v-icon
                >
              </template>
              <span>Open in editor</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-bind="attrs" v-on="on" color="red" @click.stop="deleteFrame(idx)"
                  >mdi-trash-can-outline</v-icon
                >
              </template>
              <span>Delete frame</span>
            </v-tooltip>

            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-bind="attrs" v-on="on" @click.stop="openDurationDialog(idx)">mdi-timer-outline</v-icon>
              </template>
              <span>Edit duration</span>
            </v-tooltip>
          </td>
        </tr>
      </tbody>
    </v-simple-table>
    <v-dialog width="400px" v-model="durationDialog" transition="dialog-bottom-transition">
      <v-card>
        <v-card-title>
          <span>Modify duration for frame {{ modifiedIndex }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field min="0" type="number" v-model="modifiedDuration" label="New duration (ms)"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-btn color="blue" @click.stop="modifyDuration()"><v-icon left>mdi-content-save</v-icon>Save</v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn color="red" @click.stop="durationDialog = false">Cancel</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-card outlined class="newFramePanel">
      <v-row>
        <v-col cols="8">
          <span style="margin-left: 5px;">
            Move selected frame:
          </span>
        </v-col>
        <v-col cols="2">
          <v-tooltip left>
            <template v-slot:activator="{ on, attrs }">
              <v-icon v-bind="attrs" v-on="on" class="addButton" @click.stop="frameUp()"
                >mdi-arrow-up-bold-circle-outline</v-icon
              >
            </template>
            <span>Move the frame up</span>
          </v-tooltip>
        </v-col>
        <v-col cols="2">
          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
              <v-icon v-bind="attrs" v-on="on" class="addButton" @click.stop="frameDown()"
                >mdi-arrow-down-bold-circle-outline</v-icon
              >
            </template>
            <span>Move the frame down</span>
          </v-tooltip>
        </v-col>
      </v-row>

      <v-row height="50px" align="center" justify="center">
        <v-col cols="9">
          <v-text-field
            width="100px"
            class="ml-5 shrink"
            type="number"
            dense
            @change="$emit('default-duration-change', duration)"
            v-model="duration"
            min="10"
            label="Duration (ms) of the new frame"
          ></v-text-field>
        </v-col>
        <v-col cols="3" height="100%" align="center" justify="center">
          <v-tooltip left>
            <template v-slot:activator="{ on, attrs }">
              <v-icon v-bind="attrs" v-on="on" class="addButton" @click.stop="addFrame()" color="success"
                >mdi-plus-circle</v-icon
              >
            </template>
            <span>Add a new frame</span>
          </v-tooltip>
          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
              <v-icon v-bind="attrs" v-on="on" class="addButton" @click.stop="setGlobalDuration()" color="white"
                >mdi-earth</v-icon
              >
            </template>
            <span>Change duration of all frames</span>
          </v-tooltip>
        </v-col>
      </v-row>
    </v-card>
  </v-card>
</template>

<script lang="ts">
import Frame from '@/types/Frame';
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({
  name: 'FrameList',
})
export default class extends Vue {
  @Prop()
  public frames!: Frame[];
  @Prop()
  public currentFrameIndex!: number;

  private duration = 100;
  private modifiedDuration = 100;
  private durationDialog = false;
  private modifiedIndex = -1;

  private openDurationDialog(idx: number): void {
    this.modifiedDuration = this.frames[idx].duration;
    this.modifiedIndex = idx;
    this.durationDialog = true;
  }

  private modifyDuration(): void {
    this.$emit('modify-duration', this.modifiedIndex, this.modifiedDuration);
    this.durationDialog = false;
  }
  private switchFrame(idx: number): void {
    this.$emit('switch-frame', idx);
  }
  private selectFrame(idx: number): void {
    this.$emit('select-frame', idx);
  }

  private deleteFrame(idx: number): void {
    this.$emit('delete-frame', idx);
  }

  private setGlobalDuration(): void {
    this.$emit('duration-all', this.duration);
  }

  private addFrame(): void {
    this.$emit('add-frame', this.duration);
  }

  private frameUp(): void {
    this.$emit('move-frame', 'up');
  }

  private frameDown(): void {
    this.$emit('move-frame', 'down');
  }
}
</script>
<style>
.frameTable {
  max-height: 80vh;
  height: 80vh;
}
.newFramePanel {
  position: absolute;
  bottom: 0;
  height: 120px;
  width: 100%;
}
.frameTableContainer {
  position: relative;
}
.addButton {
  position: relative;
  top: -8px;
}
.activeFrame {
  background-color: lightgreen;
  color: black;
}
</style>

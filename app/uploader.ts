import {Component} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {FileDrop} from './file_drop';
import {ProgrammableFile, addProgrammableFile, Store, State} from './state';
import {BinaryFile} from './programmable_file';
import * as fs from 'fs';

@Component({
  selector: 'uploader',
  styles: [`
    .dropzone-idle {
      height: 100%;
      padding: 15px;
      border: 10px dotted transparent;
    }
    .dropzone-idle.dragover {
      border-color: #EEE;
    }
    .row {
      height: 100%
    }
    h2 {
      text-align: center;
      position: relative;
      top: 40%;
      color: #5cb85c;
    }
  `],
  templateUrl: 'uploader.html',
  directives: [BinaryFile, CORE_DIRECTIVES, FileDrop]
})

export class Uploader {

  private history: ProgrammableFile[] = [];

  constructor() {
    Store.subscribe(state => this.gatherHistory(state));
    this.gatherHistory();
  }

  private fileOver(e: FileList) {
    for (let i = 0; i < e.length; i++) {
      Store.dispatch(addProgrammableFile(e[i]['path']));
    }
  }

  private gatherHistory(state: State = Store.getState()): void {
    this.history = state.history;
  }
}

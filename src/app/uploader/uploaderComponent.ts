import {Component, OnDestroy} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {FileDropDirective} from './fileDropDirective';
import {ProgrammableFile, addProgrammableFile, Store, LPCFlashState} from '../state';
import {ProgrammableFileComponent} from './programmableFileComponent';
import * as fs from 'fs';

@Component({
  selector: 'uploader',
  styles: [`
    .dropzone {
      overflow: auto;
    }
    .dropzone-idle {
      height: 100%;
      padding: 15px;
      border: 4px dotted transparent;
    }
    .dropzone-idle.dragover {
      border-color: #5CB85C;
    }
    .row {
      height: 100%
    }
    h3 {
      text-align: center;
      position: relative;
      top: 40%;
      color: #5CB85C;
    }
    .table>tbody>tr>td:nth-child(1) {
      vertical-align: middle;
    }
  `],
  template: require('./uploader.html'),
  directives: [ProgrammableFileComponent, CORE_DIRECTIVES, FileDropDirective]
})

export class UploaderComponent implements OnDestroy {

  private history: ProgrammableFile[] = [];
  private unsubscribe = () => { };

  constructor() {
    this.unsubscribe = Store.subscribe(state => this.gatherHistory(state));
    this.gatherHistory();
  }

  ngOnDestroy() {
    this.unsubscribe();
  }

  private fileOver(e: FileList) {
    for (let i = 0; i < e.length; i++) {
      Store.dispatch(addProgrammableFile(e[i]['path']));
    }
  }

  private gatherHistory(state: LPCFlashState = Store.getState()): void {
    this.history = state.history;
  }
}

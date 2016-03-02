import {Component} from 'angular2/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES, NgClass, NgStyle} from 'angular2/common';
import {FileDrop} from './file_drop';

@Component({
  selector: 'uploader',
  styles: [`
    .drop-zone { height: 300px }
    .dragover { background: red }
  `],
  templateUrl: 'uploader.html',
  directives: [FileDrop]
})

export class Uploader {

  private fileOver(e: FileList) {
    console.dir(e);
  }

}

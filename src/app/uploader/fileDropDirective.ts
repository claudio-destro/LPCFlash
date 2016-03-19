import { Directive, EventEmitter } from "angular2/core";

@Directive({
  selector: "[fileDrop]",
  events: ["fileOver"],
  host: {
    "(drop)": "onDrop($event)",
    "(dragover)": "onDragOver($event)",
    "(dragleave)": "onDragLeave($event)",
    "[class.dragover]": "hover"
  }
})

export class FileDropDirective {

  private fileOver: EventEmitter<any> = new EventEmitter();
  private hover: boolean = false;

  onDrop(event: DragEvent) {
    this.fileOver.emit(event.dataTransfer.files);
    this.preventAndStop(event);
    this.hover = false;
  }

  onDragOver(event: DragEvent) {
    event.dataTransfer.dropEffect = "copy";
    this.preventAndStop(event);
    this.hover = true;
  }

  onDragLeave(event: DragEvent): any {
    this.preventAndStop(event);
    this.hover = false;
  }

  private preventAndStop(event: Event) {
    event.preventDefault();
    event.stopPropagation();
  }

}
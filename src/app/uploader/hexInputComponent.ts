import {Component, EventEmitter, Input, OnInit, Output} from "angular2/core";
import {CORE_DIRECTIVES, NgModel} from "angular2/common";

@Component({
  selector: "hexInput",
  template: `
    <div class="input-group" [class.has-error]="!isValid">
      <div class="input-group-addon">0x</div>
      <input class="form-control" [(ngModel)]="hexValue" (ngModelChange)="hexValueChange()" [disabled]="disabled" style="font-family: monospace">
    </div>
  `,
  directives: [CORE_DIRECTIVES, NgModel]
})

export class HexInputComponent implements OnInit {

  @Input() disabled: boolean;
  @Input() value: number;
  @Output() valueChange = new EventEmitter();

  private isValid = true;
  private hexValue: string;

  ngOnInit() {
    this.hexValue = (this.value || 0).toString(16).toUpperCase();
  }

  hexValueChange() {
    this.isValid = /^\s*[0-9A-Fa-f]+\s*$/.test(this.hexValue);
    if (this.isValid) {
      this.value = parseInt(this.hexValue.trim(), 16);
      this.valueChange.emit(this.value);
    } else {
      this.valueChange.emit(NaN);
    }
  }

}

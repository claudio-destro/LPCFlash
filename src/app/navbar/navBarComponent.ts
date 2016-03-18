import {Component} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';
import {ProgrammerState, LPCFlashState, Store} from '../state';

@Component({
  selector: 'navBar',
  styles: [`
    a {cursor: pointer}
    .disabled a {cursor: default}
    .disabled {pointer-events: none}
  `],
  template: require('./navBar.html'),
  directives: [ROUTER_DIRECTIVES]
})

export class NavBarComponent {

  private state: ProgrammerState = ProgrammerState.IDLE;

  constructor(private router: Router) {
    Store.subscribe(() => {
      this.state = Store.getState().programmer;
    });
  }
}

import {Component} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';
import {ProgrammerState, State, Store} from './state';

@Component({
  selector: 'navBar',
  styles: [`
    a {cursor: pointer}
    .disabled a {cursor: default}
    .disabled {pointer-events: none}
  `],
  templateUrl: 'nav_bar.html',
  directives: [ROUTER_DIRECTIVES]
})

export class NavBar {

  private state: ProgrammerState = ProgrammerState.IDLE;

  constructor(private router: Router) {
    Store.subscribe(() => {
      this.state = Store.getState().programmer;
    });
  }
}

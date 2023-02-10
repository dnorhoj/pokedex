import { Component } from '@angular/core';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
})
export class StartComponent {
  page = 0;
  constructor(public usersService: UsersService) { }
}

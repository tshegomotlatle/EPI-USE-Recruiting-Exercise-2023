import { Component } from '@angular/core';
import { UserService } from './services/user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Scheduler';
  logged: { loggedIn: string | null; userId: string | null; };
  constructor(private userService: UserService){
    this.logged = this.userService.getSessionData();
    
  }

  
}

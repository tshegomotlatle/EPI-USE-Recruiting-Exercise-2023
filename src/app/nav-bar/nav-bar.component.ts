import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Employee } from '../interfaces/employee';
import { User } from '../interfaces/user';
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  id! : string | null;
  user! : User;
  employeeInfo! : Employee;

  constructor(
    private userService : UserService,
    private router : Router
    ) { }

  async ngOnInit(): Promise<void> {
    this.user = {} as User

    this.employeeInfo ={} as Employee

    this.id = this.userService.getSessionData().userId;
    if (this.id !== null)
    {
      this.user = await this.userService.getUserDataId(this.id) 
      this.employeeInfo = await this.userService.getEmployeeData(this.id);           
    }
    else{
      this.logout();
    }


    
  }

  public logout() : void
  {
    console.log("Log out");
    this.userService.logout();
    this.router.navigateByUrl("/login");
  }

}

import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @Input() username! : string;
  @Input() password! : string;

  constructor(
    private userService : UserService,
    private router : Router
  ) { }

  ngOnInit(): void {
    // this.username = "admin";
    // this.password = "admin@123";
    this.username = "knopel";
    this.password = "jjsdiner";
  }

  login(){
    console.log();
    this.userService.login(this.username,this.password).then(
      (logged) =>
      {
        if (logged)
        {
          this.router.navigateByUrl("/hierarchy")
        }
        else
        {
          alert("Wrong username password combination")
        }
      }
    )
    
  }

}

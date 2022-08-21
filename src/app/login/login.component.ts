import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AES } from 'crypto-js';
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @Input() username! : string;
  @Input() password! : string;
  hashValue = "EPI-USE"

  constructor(
    private userService : UserService,
    private router : Router
  ) { }

  ngOnInit(): void {
    // this.username = "knopel";
    // this.password = "jjsndiner";
    // this.username = "admin";
    // this.password = "admin@123";
  }

  login() : void {
    console.log();
    this.userService.login(this.username,this.password).then(
      (logged) =>
      {
        if (logged)
        {
          this.router.navigateByUrl("/hierarchy")
          // location.reload();
        }
        else
        {
          alert("Wrong username password combination")
        }
      }
    )
    
  }



}

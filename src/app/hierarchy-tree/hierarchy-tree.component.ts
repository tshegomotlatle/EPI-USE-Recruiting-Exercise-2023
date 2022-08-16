import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Employee } from '../interfaces/employee';
import { Schedules } from '../interfaces/schedules';
import { User } from '../interfaces/user';
import { UserService } from '../services/user/user.service';
import {DateFormatPipe } from '../pipes/DateFormat/date-format.pipe'

declare var bootstrap: any;


@Component({
  selector: 'app-hierarchy-tree',
  templateUrl: './hierarchy-tree.component.html',
  styleUrls: ['./hierarchy-tree.component.scss'],
})
export class HierarchyTreeComponent implements OnInit {
  id!: string | null;
  employees!: Employee [];
  user!: User;
  users!: User [];
  selectedUser!: User;
  selectedEmployee!: Employee;
  selectedSchedule!: Schedules;
  employeeInfo!: Employee;

  constructor(private router: Router, 
    private userService: UserService,
    private cdRef: ChangeDetectorRef) {}

  async ngOnInit(): Promise<void> {
  //   document.onmousemove( function(e) {
  //     mouseX = e.pageX; 
  //     mouseY = e.pageY;
  //  });

    this.user = {} as User
    this.selectedUser = {} as User 
    this.employeeInfo = {} as Employee
    this.selectedEmployee = {} as Employee
    this.selectedSchedule = {} as Schedules

    this.id = this.userService.getSessionData().userId;
    if (this.id !== null) {
      this.user = await this.userService.getUserDataId(this.id);
      this.employeeInfo = await this.userService.getEmployeeData(this.id);
      this.employees = await this.userService.getAllEmployeeData();
      this.users = await this.userService.getAllUsers();
      this.initaliseHierachy(this.user, this.user.username).then(
        ()=>{
          // this.assignClick();
        }
      )
    } else {
      this.userService.logout();
      this.router.navigateByUrl('/login');
    }

    
    
  }

  initaliseHierachy(user: User, username: string) : Promise<void> {
    const parent = document.getElementById("parent" + username);

    const subordinates = this.employees.filter((employee) =>{
      return employee.reports_to == user.id
    })
    // console.log(subordinates);
    subordinates.forEach(async (employee) => {
      const subUser = await this.userService.getUserDataId(employee.id)
      if (this.isLeafNode(subUser))
      {
        parent?.appendChild(this.createElementParent(subUser))
        // parent?.insertAdjacentHTML("beforeend", this.createElementParent(subUser))
        // parent?.lastElementChild?.addEventListener("click",() =>{
        //   this.goToEmployee(employee.id);
          
        // })
      }
      else
      {
        parent?.appendChild(this.createElementLeaf(subUser))
        // parent?.insertAdjacentHTML("beforeend", this.createElementLeaf(subUser))
        // parent?.lastElementChild?.addEventListener("click",() =>{
        //   this.goToEmployee(employee.id);
          
        // })
        
      }
      this.initaliseHierachy(subUser, subUser.username)
    })
    
    return new Promise((resolve)=>{resolve()})
  }

  isLeafNode(user: User) {
    const subordinates = this.employees.filter((employee) =>{
      return employee.reports_to == user.id
    })

    // console.log("--------------------------------");
    // console.log(user.first_name + " " + user.surname);
    // console.log(subordinates);
    // console.log("--------------------------------");
    
    return subordinates.length !== 0
  }

  createElementParent(user: User) {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.className = "tf-nc";
    span.innerHTML = user.first_name + " " + user.surname;
    const ul = document.createElement("ul");
    ul.id = "parent" + user.username;
    li.appendChild(span);
    li.appendChild(ul);
    span.addEventListener("click", () => {
     this.goToEmployee(user.id)
    })
    return li
    // return `
    // <li>
    //   <span class="tf-nc">${user.first_name} ${user.surname}</span>
    //   <ul id="parent${user.username}">

    //   </ul>
    // </li>
    // `;

  }

  createElementLeaf(user: User) {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.className = "tf-nc";
    span.innerHTML = user.first_name + " " + user.surname;
    li.appendChild(span);
    span.addEventListener("click", () => {
      this.goToEmployee(user.id)
      
    })
    return li;
    // return `
    // <li>
    //   <span class="tf-nc">${user.first_name} ${user.surname}</span>
    // </li>
    // `;
  }

  async goToEmployee(id : string)  {
    const tempUser = this.users.filter((user) =>
    {
      return user.id == id
    })
    this.selectedEmployee = await this.userService.getEmployeeData(id);
    this.selectedSchedule = await this.userService.getScheduleData(id);
    if (tempUser)
    {
      this.selectedUser = tempUser[0]
      document.getElementById("modalTrigger")?.click()
    }
  }

  // assignClick(){
  //   this.cdRef.detectChanges();
  //   console.log(document.querySelector(".tf-nc"));
    
  //   const boxes = document.querySelector(".tf-nc")?.addEventListener(
  //     "click",() =>{
  //       this.goToEmployee("1")
  //     }
  //   )
  //   console.log(boxes);
    
  // }
}

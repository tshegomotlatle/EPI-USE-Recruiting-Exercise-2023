import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Employee } from '../interfaces/employee';
import { Schedules } from '../interfaces/schedules';
import { User } from '../interfaces/user';
import { UserService } from '../services/user/user.service';

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
  employeeInfo!: Employee;

  constructor(private router: Router, private userService: UserService) {}

  async ngOnInit(): Promise<void> {
  //   document.onmousemove( function(e) {
  //     mouseX = e.pageX; 
  //     mouseY = e.pageY;
  //  });

    this.user = {
      id: '',
      username: '',
      first_name: '',
      password: '',
      surname: '',
    };

    this.selectedUser = {
      id: '',
      username: '',
      first_name: '',
      password: '',
      surname: '',
    };

    this.employeeInfo = {
      id: '',
      title: '',
      reports_to: '',
    };

    this.id = this.userService.getSessionData().userId;
    if (this.id !== null) {
      this.user = await this.userService.getUserDataId(this.id);
      this.employeeInfo = await this.userService.getEmployeeData(this.id);
      this.employees = await this.userService.getAllEmployeeData();
      this.users = await this.userService.getAllUsers();
      await this.initaliseHierachy(this.user, this.user.username);
    } else {
      this.userService.logout();
      this.router.navigateByUrl('/login');
    }
  }

  initaliseHierachy(user: User, username: string) {
    const parent = document.getElementById("parent" + username);

    const subordinates = this.employees.filter((employee) =>{
      return employee.reports_to == user.id
    })
    // console.log(subordinates);
    subordinates.forEach(async (employee) => {
      const subUser = await this.userService.getUserDataId(employee.id)
      if (this.isLeafNode(subUser))
      {
        parent?.insertAdjacentHTML("beforeend", this.createElementParent(subUser))
      }
      else
      {
        parent?.insertAdjacentHTML("beforeend", this.createElementLeaf(subUser))
      }
      this.initaliseHierachy(subUser, subUser.username)
    })
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

  createElementParent(user: User): string {
    return `
    <li>
      <span class="tf-nc">${user.first_name} ${user.surname}</span>
      <ul id="parent${user.username}">

      </ul>
    </li>
    `;
  }

  createElementLeaf(user: User): string {
    return `
    <li>
      <span class="tf-nc">${user.first_name} ${user.surname}</span>
    </li>
    `;
  }

  async goToEmployee(id : string, e : MouseEvent) : Promise<void> {
    const tempUser = this.users.find((user) =>
    {
      return user.id == id
    })
    console.log(tempUser);
    
    if (tempUser)
      this.selectedUser = tempUser
    document.getElementById("modalTrigger")?.click()
  }
}

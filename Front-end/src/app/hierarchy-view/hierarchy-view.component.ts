import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Employee } from '../interfaces/employee';
import { Schedules } from '../interfaces/schedules';
import { User } from '../interfaces/user';
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-hierarchy-view',
  templateUrl: './hierarchy-view.component.html',
  styleUrls: ['./hierarchy-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HierarchyViewComponent implements OnInit {
  id!: string | null;
  user!: User;
  employeeInfo!: Employee;
  scheduleInfo!: Schedules;
  counter! :number

  employees! : Employee [];

  constructor(private userService: UserService, private router: Router) {}

  async ngOnInit(): Promise<void> {
    this.counter = 0;
    this.user = {
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

    this.scheduleInfo = {
      id: '',
      schedule: [
        {
          start_time: '',
          end_time: '',
          title: '',
          description: '',
        },
      ],
    };

    this.id = this.userService.getSessionData().userId;
    if (this.id !== null) {
      this.user = await this.userService.getUserDataId(this.id);
      this.employeeInfo = await this.userService.getEmployeeData(this.id);
      this.scheduleInfo = await this.userService.getScheduleData(this.id);
      this.employees = await this.userService.getAllEmployeeData();
      // console.log(this.employees);
      
      await this.initaliseHierachy(this.user, this.user.username);
      
    } else {
      this.userService.logout();
      this.router.navigateByUrl('/login');
    }
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    const parent = document.getElementById("parent" + "dwyera")
    console.log(parent);
    
  }
  
  async initaliseHierachy(user : User, parentId: string) {
    
    // this.employees.forEach((employee) =>{

    // })
    
    const subordinates = this.employees.filter((employee) =>
    {
      return employee.reports_to == user.id
    })
    console.log(parentId);
    const parent = document.getElementById("parent" + parentId)
    subordinates.forEach(async (employee) =>{
      
      const user= await this.userService.getUserDataId(employee.id)
      // console.log(user);
      console.log(parent);
      if (parent)
      {
        console.log("PARENT =="  + parent.id );
        const schedule = await this.userService.getScheduleData(employee.id);
        parent.insertAdjacentHTML('beforeend',this.createCardElement(user, employee, schedule))
        
        this.initaliseHierachy(user, user.username)
        // console.log(parent);
        // parent.innerHTML += this.createCardElement(user, employee, schedule)
      }
      else{

      }
    })
    
    
  }

  createCardElement(user : User, employeeInfo : Employee, schedule : Schedules) : string{

    let appointments = "";
    for (let k = 0 ; k < schedule.schedule.length; k++)
    {
      appointments += `
      <div class="chip w-100 d-flex justify-content-between mt-2">
        <span>${schedule.schedule[k].start_time.slice(schedule.schedule[k].start_time.indexOf(" "))}-${schedule.schedule[k].end_time.slice(schedule.schedule[k].end_time.indexOf(" "))}</span>
        <span>${schedule.schedule[k].title}</span>
        <span class="material-icons editButton">edit</span>
      </div>
      `;
      
    }
    // console.log(appointments);

    const element = `
    <div class="card mt-3">
        <div class="card-header">
          <a class="btn" data-bs-toggle="collapse" data-bs-target="#${user.username}" id="collapseble1" href="#${user.username}">
            ${user.first_name} ${user.surname} - ${employeeInfo.title}
          </a>
        </div>
        <div id="${user.username}" class="collapse ">
          <div class="card-body">
            <div class="userInformation d-flex">
              <div class="d-flex align-items-center">
                <div class="material-icons userProfile">account_circle</div>
              </div>
              <div class="personalInfo">
                ${user.first_name} ${user.surname}  <br>
                ${employeeInfo.title} <br>
                ${employeeInfo.id} <br>
              </div>
              <div class="schedule">
                ${appointments}
              </div>
            </div>
            <div class="children" id="parent${user.username}">
    
            </div>
          </div>
        </div>
     </div>
    `
    return element;
  }
}

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Employee } from '../interfaces/employee';
import { Schedules } from '../interfaces/schedules';
import { User } from '../interfaces/user';
import { UserService } from '../services/user/user.service';

interface Appointment {
  start_time: string;
  end_time: string;
  title: string;
  description: string;
}

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

  months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ]

  constructor(private userService: UserService, 
    private router: Router) {}

  async ngOnInit(): Promise<void> {
    this.counter = 0;
    this.user = {} as User

    this.employeeInfo = {} as Employee

    this.scheduleInfo = {} as Schedules

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
    // console.log(parent);
    
  }
  
  async initaliseHierachy(user : User, parentId: string) {
    
    // this.employees.forEach((employee) =>{

    // })
    
    const subordinates = this.employees.filter((employee) =>
    {
      return employee.reports_to == user.id
    })
    // console.log(parentId);
    const parent = document.getElementById("parent" + parentId)
    subordinates.forEach(async (employee) =>{
      
      const user= await this.userService.getUserDataId(employee.id)
      // console.log(user);
      // console.log(parent);
      if (parent)
      {
        // console.log("PARENT =="  + parent.id );
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
        <span class="date">${this.tranformDate(schedule.schedule[k].start_time)} ${schedule.schedule[k].start_time.split(" ")[1]} - ${schedule.schedule[k].end_time.slice(schedule.schedule[k].end_time.indexOf(" "))}</span>
        <span class="title">${schedule.schedule[k].title}</span>
        <span class="description">${schedule.schedule[k].description}</span>
      </div>
      `;

      // <span class="date">{{schedule.start_time | dateFormatLong}} {{schedule.start_time | dateFormat}}-{{schedule.end_time | dateFormat}}</span>
      //         <span class="title">{{schedule.title}}</span>
      //         <span class="description " >{{schedule.description}}</span>
      
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
                  <img src="${user.avatar}" alt="" onerror="this.src='assets/user.jpg'">
              </div>
              <div class="personalInfo">
              <span class="name pt-3">${user.first_name} ${user.surname}</span>  <br>
            <span class="employeeTitle pt-3">${employeeInfo.title}</span> <br>
            <span class="employeeId pt-3">${employeeInfo.id}</span> <br>
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

  tranformDate(date: string) : string{
    date = date.split(" ")[0]
    const dateArray = date.split("-");
    // console.log(dateArray);
    
    return dateArray[2] + " " + this.months[parseInt(dateArray[1])] + " " + dateArray[0];
  }
}

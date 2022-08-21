import { Time } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';
import { start } from 'repl';
import { Employee } from '../interfaces/employee';
import { Schedules } from '../interfaces/schedules';
import { User } from '../interfaces/user';
import { DateFormatLongPipe } from '../pipes/DateFormatLong/date-format-long.pipe';
import { UserService } from '../services/user/user.service';
declare var bootstrap: any;

interface Appointment {
  start_time: string;
  end_time: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ScheduleComponent implements OnInit {
  weekdays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'Septemebr',
    'October',
    'Novemeber',
    'December',
  ];
  currentMonthDays!: { date: string; class: string }[];
  previousMonthDays!: string[];
  nextMonthDays!: string[];
  month!: string;
  year!: string;
  styleClass!: string;
  currentDate!: Date;
  selectedDate!: Date;
  currentDay!: string;

  title!: string;
  description!: string;
  start_time!: string;
  end_time!: string;

  schedule!: Schedules;
  editSchedule!: Schedules;
  user!: User;
  formatedDate!: String;
  currentAction!: 'edit' | 'create';
  selectedUser!: string;

  employees = [] as {
    employeeInfo: Employee;
    userInfo: User;
  }[];
  // employeesDetails! : User[]

  constructor(
    private userService: UserService,
    private cdRef: ChangeDetectorRef,
    private renderer: Renderer2
  ) {}

  async ngOnInit(): Promise<void> {
    const date = new Date();
    this.initaliseCalendar(date.getFullYear(), date.getMonth(), 1);
    this.schedule = {} as Schedules;
    this.editSchedule = {} as Schedules;
    this.editSchedule.schedule = [
      {
        start_time: '',
        end_time: '',
        description: '',
        title: '',
      },
    ];
    this.currentAction = 'create';
    const id = localStorage.getItem('userId');
    const sessionID = sessionStorage.getItem('user_id');
    
    if (id) {
      this.user = await this.userService.getUserDataId(id);
      this.schedule = await this.userService.getScheduleData(id);
      this.selectedUser = this.user.id;
      this.employees.push({
        employeeInfo: await this.userService.getEmployeeData(id),
        userInfo: this.user,
      });
      this.assignEmployees(id);
      this.assignAppointments();
    }
  }

  assignAppointments() {
    this.schedule.schedule.forEach((schedule) => {
      const date = schedule.start_time
        .slice(
          schedule.start_time.indexOf(' ') - 2,
          schedule.start_time.indexOf(' ')
        )
        .trim();
      const year = schedule.start_time.slice(0, 4).trim();
      const month = schedule.start_time.slice(5, 7).trim();

      const dayElement = document.getElementById('day' + date.trim());
      if (dayElement) {
        if (
          this.currentDate.getFullYear().toString().trim() == year &&
          '0' + (this.currentDate.getMonth() + 1).toString().trim() == month
        ) {
          //console.log(dayElement);
          //console.log(schedule);
          // dayElement.lastChild?.before(this.createChipElement(schedule))
          this.renderer.appendChild(
            dayElement,
            this.createChipElement(schedule)
          );
          // dayElement.appendChild(this.createChipElement(schedule));
          this.cdRef.detectChanges();
        }
      }
    });
    this.cdRef.detectChanges();
  }

  createChipElement(schedule: Appointment) {
    const spanChip = this.renderer.createElement('span');
    spanChip.classList.add('miniChip');
    spanChip.classList.add('d-flex');
    const spanTime = document.createElement('span');
    spanTime.classList.add('flex-fill');
    spanTime.classList.add('ml-2');
    spanTime.innerHTML = `${schedule.start_time.slice(
      schedule.start_time.indexOf(' ')
    )} -${schedule.end_time.slice(schedule.end_time.indexOf(' '))}`;
    const spanTitle = document.createElement('span');
    spanTitle.classList.add('flex-fill');
    spanTitle.innerHTML = schedule.title;
    spanChip.appendChild(spanTime);
    spanChip.appendChild(spanTitle);
    return spanChip;
  }

  async initaliseCalendar(
    year: number,
    month: number,
    date: number
  ): Promise<void> {
    this.currentMonthDays = [];
    this.previousMonthDays = [];
    this.nextMonthDays = [];
    this.currentDay = '';
    this.selectedDate = new Date();
    this.currentDate = new Date(year, month, date);
    this.month = this.months[this.currentDate.getMonth()];
    this.year = this.currentDate.getFullYear().toString();
    const firstDayOfMonth = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      this.currentDate.getDate()
    );
    const lastDayPrevMonth = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      0
    );
    const lastDayOfMonth = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      0
    );

    const now = new Date();
    // //console.log(now.getDate());
    // //console.log(this.currentDate);

    if (firstDayOfMonth.getDay() == 6) {
      this.styleClass = 'monthDays6';
    } else {
      this.styleClass = 'monthDays5';
    }

    for (
      let k = lastDayPrevMonth.getDate() - firstDayOfMonth.getDay() + 1;
      k <= lastDayPrevMonth.getDate();
      k++
    ) {
      this.previousMonthDays.push(k.toString());
    }
    for (let k = 1; k <= lastDayOfMonth.getDate(); k++) {
      if (
        now.getFullYear() === this.currentDate.getFullYear() &&
        now.getMonth() === this.currentDate.getMonth() &&
        now.getDate() === k
      ) {
        // this.currentDay += " currentDay";
        this.currentMonthDays.push({ date: k.toString(), class: 'currentDay' });
      } else {
        this.currentMonthDays.push({ date: k.toString(), class: '' });
      }
    }
    for (let k = 1; k < 7 - lastDayOfMonth.getDay(); k++) {
      this.nextMonthDays.push(k.toString());
    }
    // this.assignAppointments()
  }

  async changeCalenderMonthPrevious(): Promise<void> {
    if (this.currentDate.getMonth() - 1 < 0) {
      this.initaliseCalendar(
        this.currentDate.getFullYear() - 1,
        11,
        this.currentDate.getDate()
      ).then(() => {
        this.assignAppointments();
        this.cdRef.detectChanges();
      });
    } else {
      await this.initaliseCalendar(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth() - 1,
        this.currentDate.getDate()
      ).then(() => {
        this.assignAppointments();
      });
    }
  }

  async changeCalenderMonthNext(): Promise<void> {
    if (this.currentDate.getMonth() + 1 > 11) {
      await this.initaliseCalendar(
        this.currentDate.getFullYear() + 1,
        0,
        this.currentDate.getDate()
      ).then(() => {
        this.assignAppointments();
      });
    } else {
      await this.initaliseCalendar(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth() + 1,
        this.currentDate.getDate()
      ).then(() => {
        this.assignAppointments();
      });
    }
  }

  openCreateAppointment(day: string): void {
    this.selectedDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      parseInt(day)
    );
    const offset = this.selectedDate.getTimezoneOffset();
    const tempDate = new Date(this.selectedDate.getTime() - offset * 60 * 1000);
    this.formatedDate = tempDate.toISOString().split('T')[0];

    // //console.log();
    // //console.log(this.formatedDate)
    // //console.log( this.schedule.schedule[0]);

    const myOffcanvas = document.getElementById('appointmentDetails');
    const bsOffcanvas = new bootstrap.Offcanvas(myOffcanvas);
    bsOffcanvas.show();
  }

  createAppointment(): void {
    // //console.log(this.start_time);

    const id = localStorage.getItem('userId');
    if (id) {
      // this.schedule = {
      //   id: id,
      //   schedule: [{
      //     start_time: this.formatedDate + " " + this.start_time.toString(),
      //     end_time: this.formatedDate + " " + this.end_time.toString(),
      //     description: this.description,
      //     title: this.title
      //   }]
      // }
      if (this.checkDateValid()) {
        this.schedule.schedule.push({
          start_time: this.formatedDate + ' ' + this.start_time.toString(),
          end_time: this.formatedDate + ' ' + this.end_time.toString(),
          description: this.description,
          title: this.title,
        });
        //console.log(this.schedule);
        this.userService.makeAppointment(this.schedule);
        this.assignAppointments();
      }

      // //console.log('Created');
    }
  }

  checkDateValid() :boolean {
    if (
      this.start_time == undefined ||
      this.end_time == undefined ||
      this.description == undefined ||
      this.title == undefined
      )
      {
        return false;
      }
    console.log(this.selectedDate);
    
    const offset = this.selectedDate.getTimezoneOffset();
    const tempDate = new Date(this.selectedDate.getTime() - offset * 60 * 1000);
    const searchSpace = this.schedule.schedule.filter((schedule) => {
      const startDate = schedule.start_time.slice(
        0,
        schedule.start_time.indexOf(' ')
      );
      // //console.log(startDate);
      // //console.log(
      //   tempDate
      //     .toISOString()
      //     .slice(0, tempDate.toISOString().indexOf('T')).trim() +
      //     ' vs ' +
      //     startDate
      // );

      return (
        tempDate
          .toISOString()
          .slice(0, tempDate.toISOString().indexOf('T'))
          .trim() == startDate.trim()
      );
    });

    if (
      searchSpace[0].description == this.editSchedule.schedule[0].description &&
      searchSpace[0].title == this.editSchedule.schedule[0].title &&
      searchSpace[0].start_time == this.editSchedule.schedule[0].start_time &&
      searchSpace[0].end_time == this.editSchedule.schedule[0].end_time 
    )
    {
      searchSpace.splice(0,2)
    }

    console.log(searchSpace);
    console.log(this.editSchedule);
    
    

    if (this.start_time >= this.end_time) {
      alert('Start time must be earlier than end_time');
    }

    for (let k = 0; k < searchSpace.length; k++) {
      const schedule = searchSpace[k];
      const startTime = schedule.start_time.split(' ')[1];
      const endTime = schedule.end_time.split(' ')[1];

      if (this.start_time >= startTime && this.start_time <= endTime) {
        alert('This appointments start time clashes with another appointment');
        return false;
      }
      if (this.end_time >= startTime && this.end_time <= endTime) {
        alert('This appointments end time clashes with another appointment');
        return false;
      }
    }
    return true;
  }


  editAppointment(
    start_time: string,
    end_time: string,
    title: string,
    description: string,
    event: EventTarget | null
  ): void {
    const chipElement = (<HTMLElement>event).parentElement;

    // //console.log(chipElement?.classList.contains('editing'));
    if (chipElement?.classList.contains('editing')) {
      // //console.log('here');

      chipElement.classList.remove('editing');
      this.description = '';
      this.end_time = '';
      this.start_time = '';
      this.title = '';
      this.currentAction = 'create';
      return;
    }

    const allAppointmentChips = document.getElementsByClassName('chip');
    for (let index = 0; index < allAppointmentChips.length; index++) {
      allAppointmentChips[index].classList.remove('editing');
    }

    const appointment = this.schedule.schedule.find((schedule) => {
      return (
        schedule.description === description &&
        schedule.start_time === start_time &&
        schedule.end_time === end_time &&
        schedule.title === title
      );
    });

    if (appointment !== undefined) {
      //console.log(appointment);
      this.editSchedule.schedule.pop();
      this.editSchedule.schedule.push(appointment);
    }
    this.description = description;
    this.title = title;
    if (end_time.slice(end_time.indexOf(' ')).trim().length == 5)
      this.end_time = end_time.slice(end_time.indexOf(' ')).trim();
    else this.end_time = '0' + end_time.slice(end_time.indexOf(' ')).trim();

    if (start_time.slice(start_time.indexOf(' ')).trim().length == 5)
      this.start_time = start_time.slice(start_time.indexOf(' ')).trim();
    else
      this.start_time = '0' + start_time.slice(start_time.indexOf(' ')).trim();
    chipElement?.classList.add('editing');

    this.currentAction = 'edit';
  }

  updateAppointment(): void {
    if (!this.checkDateValid())
    {
      return;
    }
    else{
      const currentSchedule = this.schedule.schedule.find((schedule) => {
        return (
          schedule.description === this.editSchedule.schedule[0].description &&
          schedule.start_time === this.editSchedule.schedule[0].start_time &&
          schedule.end_time === this.editSchedule.schedule[0].end_time &&
          schedule.title === this.editSchedule.schedule[0].title
        );
      });
  
      this.schedule.schedule.push({
        start_time: this.formatedDate + ' ' + this.start_time,
        end_time: this.formatedDate + ' ' + this.end_time,
        description: this.description,
        title: this.title,
      });
  
      if (currentSchedule) {
        const indexToDelete = this.schedule.schedule.indexOf(currentSchedule);
        //console.log(indexToDelete);
        this.schedule.schedule.splice(indexToDelete, 1);
      }
  
      if (currentSchedule) this.userService.editAppointment(this.schedule);
      else {
        throw Error();
      }
    }
  }

  deleteAppointment(): void {
    const scheduleToDelete = this.schedule.schedule.find((schedule) => {
      return (
        schedule.title === this.editSchedule.schedule[0].title &&
        schedule.description === this.editSchedule.schedule[0].description &&
        schedule.start_time === this.editSchedule.schedule[0].start_time &&
        schedule.end_time === this.editSchedule.schedule[0].end_time
      );
    });
    if (scheduleToDelete) {
      const indexToDelete = this.schedule.schedule.indexOf(scheduleToDelete);
      this.schedule.schedule.splice(indexToDelete, 1);
      this.userService.editAppointment(this.schedule);
      this.closeAppointment()
    }
    else{
      this.closeAppointment()
    }
    //console.log(scheduleToDelete);
  }

  async assignEmployees(id: string): Promise<void> {
    const subordinates = await this.userService.getSubordinates(id);
    subordinates.every(async (employee) => {
      this.employees.push({
        employeeInfo: employee,
        userInfo: await this.userService.getUserDataId(employee.id),
      });
      this.assignEmployees(employee.id);
    });
    // //console.log(this.employees);
  }

  async changeUser(): Promise<void> {
    //console.log('Changing to ' + this.selectedUser);
    this.user = await this.userService.getUserDataId(this.selectedUser);
    this.userService.getScheduleData(this.selectedUser).then((response) => {
      this.schedule = response;
      const date = new Date();
      this.initaliseCalendar(date.getFullYear(), date.getMonth(), 1).then(() =>
        this.assignAppointments()
      );
    });

    //console.log(this.schedule);
  }

  closeAppointment(): void {
    this.currentAction = 'create';
    this.title = '';
    this.description = '';
    this.start_time = '';
    this.end_time = '';
  }
}

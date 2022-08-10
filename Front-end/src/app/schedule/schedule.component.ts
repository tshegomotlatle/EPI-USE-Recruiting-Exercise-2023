import { Time } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Schedules } from '../interfaces/schedules';
import { User } from '../interfaces/user';
import { UserService } from '../services/user/user.service';
declare var bootstrap: any;

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
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
  editSchedule !: Schedules;
  user!: User;
  formatedDate!: String;
  currentAction!: 'edit' | 'create';

  constructor(private userService: UserService) {}

  async ngOnInit(): Promise<void> {
    const date = new Date();
    this.initaliseCalendar(date.getFullYear(), date.getMonth(), 1);
    // this.user
    this.schedule = {} as Schedules;
    this.editSchedule = {} as Schedules;
    this.editSchedule.schedule = [{
      start_time: "",
      end_time: "",
      description: "",
      title: ""
    }];
    this.currentAction = 'create';
    // this.start_time = {} as Time
    // this.end_time = {} as Time
    // this.setCalendarStyling();
    const id = localStorage.getItem('userId');
    if (id) {
      this.user = await this.userService.getUserDataId(id);
      this.schedule = await this.userService.getScheduleData(id);
      // console.log(this.schedule);
    }
  }

  initaliseCalendar(year: number, month: number, date: number): void {
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
    // console.log(now.getDate());
    // console.log(this.currentDate);

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
  }

  changeCalenderMonthPrevious(): void {
    if (this.currentDate.getMonth() - 1 < 0) {
      this.initaliseCalendar(
        this.currentDate.getFullYear() - 1,
        11,
        this.currentDate.getDate()
      );
    } else {
      this.initaliseCalendar(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth() - 1,
        this.currentDate.getDate()
      );
    }
  }

  changeCalenderMonthNext(): void {
    if (this.currentDate.getMonth() + 1 > 11) {
      this.initaliseCalendar(
        this.currentDate.getFullYear() + 1,
        0,
        this.currentDate.getDate()
      );
    } else {
      this.initaliseCalendar(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth() + 1,
        this.currentDate.getDate()
      );
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

    // console.log();
    // console.log(this.formatedDate)
    // console.log( this.schedule.schedule[0]);

    const myOffcanvas = document.getElementById('appointmentDetails');
    const bsOffcanvas = new bootstrap.Offcanvas(myOffcanvas);
    bsOffcanvas.show();
  }

  createAppointment(): void {
    // console.log(this.start_time);

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
      this.schedule.schedule.push({
        start_time: this.formatedDate + ' ' + this.start_time.toString(),
        end_time: this.formatedDate + ' ' + this.end_time.toString(),
        description: this.description,
        title: this.title,
      });
      console.log(this.schedule);

      this.userService.makeAppointment(id, this.schedule);
      console.log('Created');
    }
  }

  editAppointment(
    start_time: string,
    end_time: string,
    title: string,
    description: string,
    event: EventTarget | null
  ): void {
    const chipElement = (<HTMLElement>event).parentElement;

    console.log(chipElement?.classList.contains('editing'));
    if (chipElement?.classList.contains('editing')) {
      console.log('here');

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

    
    
    if (appointment !== undefined)
    {
      console.log(appointment);     
      this.editSchedule.schedule.pop();
      this.editSchedule.schedule.push(appointment);
    }
    this.description = description;
    this.title = title;
    this.end_time = end_time.slice(end_time.indexOf(' ')).trim();
    this.start_time = start_time.slice(start_time.indexOf(' ')).trim();

    chipElement?.classList.add('editing');

    this.currentAction = 'edit';
  }

  updateAppointment(): void {
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
    })

    if (currentSchedule)
    {
      const indexToDelete = this.schedule.schedule.indexOf(currentSchedule)
      console.log(indexToDelete);
      this.schedule.schedule.splice(indexToDelete, 1)
    }

    if (currentSchedule)
      this.userService.editAppointment(this.schedule)
    else
    {
      throw Error()
    }
  }

  deleteAppointment(): void{
    const scheduleToDelete = this.schedule.schedule.find(
    (schedule) => {
      return(
        schedule.title === this.editSchedule.schedule[0].title &&
        schedule.description === this.editSchedule.schedule[0].description &&
        schedule.start_time === this.editSchedule.schedule[0].start_time &&
        schedule.end_time === this.editSchedule.schedule[0].end_time
      ) 
    }
    );
    if (scheduleToDelete)
    {
      const indexToDelete = this.schedule.schedule.indexOf(scheduleToDelete);
      this.schedule.schedule.splice(indexToDelete, 1);
      this.userService.editAppointment(this.schedule)
    }
    console.log(scheduleToDelete);
    
  }
}

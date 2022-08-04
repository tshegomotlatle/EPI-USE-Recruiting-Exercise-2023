import { Component, OnInit } from '@angular/core';
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
  currentMonthDays!: { date: string, class : string} [];
  previousMonthDays!: string[];
  nextMonthDays!: string[];
  month!: string;
  year!: string;
  styleClass!: string;
  currentDate!: Date;
  selectedDate! : Date;
  currentDay!: string;
  constructor() {}

  ngOnInit(): void {
    const date = new Date();
    this.initaliseCalendar(
      date.getFullYear(),
      date.getMonth(),1
    );
    // this.setCalendarStyling();
  }

  initaliseCalendar(
    year: number,
    month: number,
    date: number
  ): void {
    this.currentMonthDays = [];
    this.previousMonthDays = [];
    this.nextMonthDays = [];
    this.currentDay = "";
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
    console.log(now.getDate());
    console.log(this.currentDate);
    

    if (firstDayOfMonth.getDay() == 6) {
      this.styleClass = 'monthDays6';
    } else {
      this.styleClass ='monthDays5';
    }

    

    for (
      let k = lastDayPrevMonth.getDate() - firstDayOfMonth.getDay() + 1;
      k <= lastDayPrevMonth.getDate();
      k++
    ) {
      this.previousMonthDays.push(k.toString());
    }
    for (let k = 1; k <= lastDayOfMonth.getDate(); k++) {
      if (now.getFullYear() === this.currentDate.getFullYear() &&
      now.getMonth() === this.currentDate.getMonth() &&
      now.getDate() === k)
      {
        // this.currentDay += " currentDay";
        this.currentMonthDays.push({date: k.toString(), class : "currentDay"});
      }
      else
      {
        this.currentMonthDays.push({date: k.toString(), class : ""});
      }
    }
    for (let k = 1; k < 7 - lastDayOfMonth.getDay(); k++) {
      this.nextMonthDays.push(k.toString());
    }

  }

  changeCalenderMonthPrevious(): void {

    if ((this.currentDate.getMonth() - 1) < 0)
    {      
      this.initaliseCalendar(
        this.currentDate.getFullYear() - 1,
        11,
        this.currentDate.getDate()
      );
    } 
    else
    {
      this.initaliseCalendar(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth() - 1,
        this.currentDate.getDate()
      );
    }   
  }

  changeCalenderMonthNext(): void {
    if ((this.currentDate.getMonth() + 1) > 11)
    {      
      this.initaliseCalendar(
        this.currentDate.getFullYear() + 1,
        0,
        this.currentDate.getDate()
      );
    } 
    else
    {
      this.initaliseCalendar(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth() + 1,
        this.currentDate.getDate()
      );
    } 
  }

  openCreateAppointment(day : string)
  {
    this.selectedDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), parseInt(day))
    console.log(this.selectedDate);
    const myOffcanvas = document.getElementById('appointmentDetails')
    const bsOffcanvas = new bootstrap.Offcanvas(myOffcanvas)
    bsOffcanvas.show();
    
  }
}

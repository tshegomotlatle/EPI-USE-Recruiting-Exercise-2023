import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormatLong'
})
export class DateFormatLongPipe implements PipeTransform {

  months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ]

  transform(value: string): string {
    value = value.slice(0, value.indexOf(" "))
    const vals = value.split("-")
    // console.log(vals);
    const date = new Date(parseInt(vals[0]), parseInt(vals[1]), parseInt(vals[2]))
    // console.log(day);
    // console.log(month);
    // console.log(year);
    console.log(date.toString());
    
    return date.getDate() + " " + this.months[date.getMonth()] + " " + date.getFullYear();
    
  }

}

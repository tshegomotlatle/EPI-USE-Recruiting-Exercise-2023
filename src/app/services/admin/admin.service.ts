import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from 'src/app/interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private store : AngularFirestore) {

  }

  public loadAllusers(users : User [])
  {
    
    for (let index = 0; index < users.length; index++) {
      const exisitingUserRef = this.store.collection('users', ref => ref.where('id', '==', users[index].id));
      const exisitingUser = exisitingUserRef.valueChanges();
      exisitingUser.subscribe((response) => {
        if (response.length == 0)
        {
          this.store.collection("users").add(users[index]).catch(
            () => {alert("An error occured while storing user data")}
          )
        }
      })
    }
    return true
  }

  public loadEmployeeData(employees : any [])
  {
    console.log("here");

    for (let k = 0; k < employees.length; k++) {
      const employeeRef = this.store.collection('employees', ref => ref.where('id', '==', employees[k].id));
      const employee = employeeRef.valueChanges();
      employee.subscribe((response) => {
        if (response.length == 0)
        {
          this.store.collection("employees").add(employees[k]).catch(
            () => {alert("An error occured while storing user data")}
          )
        }
      });
    }
    return true;
  }

  public loadScheduleData(schedules : any [])
  {
    console.log("here2");

    for (let k = 0; k < schedules.length; k++) {
      const scheduleRef = this.store.collection('schedules', ref => ref.where('id', '==', schedules[k].id));
      const schedule = scheduleRef.valueChanges();
      schedule.subscribe((response) => {
        if (response.length == 0)
        {
          this.store.collection("schedules").add(schedules[k])
          .catch(
            () => {alert("An error occured while storing user data")}
          )
        }
      });
    }
    return true;
  }
}

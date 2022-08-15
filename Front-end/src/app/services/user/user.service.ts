import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { delay } from 'rxjs';
import { Employee } from 'src/app/interfaces/employee';
import { Schedules } from 'src/app/interfaces/schedules';
import { User } from 'src/app/interfaces/user';

// interface scheduleInterface{
//   start_time : string,
//   end_time : string,
//   description : string,
//   title : string,
// }

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private store : AngularFirestore){

  }
  
  getEmployeeData(id : string)  {
    
    const userRef = this.store.collection('employees', ref => ref.where('id', '==', id));
      const user = userRef.valueChanges();
      return new Promise<Employee>((resolve, reject) =>{
        user.subscribe((response) => {
          if (response.length > 0)
           resolve(response[0] as Employee)
          else
            reject(null)
        });
      })

  }
  
  async getAllEmployeeData()  {
    
    
    const userRef = this.store.collection('employees');
    const user = userRef.valueChanges();
    return new Promise<Employee[]>((resolve) =>{
      user.subscribe((response) => {
        // console.log(response);
        
        if (response.length > 1)
         resolve(response as Employee[])
        });
      })
      
    
  }
  
  async getAllUsers()  {
    
    
    const userRef = this.store.collection('users');
    const user = userRef.valueChanges();
    return new Promise<User[]>((resolve) =>{
      user.subscribe((response) => {
        // console.log(response);
        
        if (response.length > 1)
         resolve(response as User[])
        });
      })
      
    
  }
  
  getScheduleData(id : string)  {
    
    const userRef = this.store.collection('schedules', ref => ref.where('id', '==', id));
      const user = userRef.valueChanges();
      return new Promise<Schedules>((resolve, reject) =>{
        user.subscribe((response) => {
          if (response.length > 0)
           resolve(response[0] as Schedules)
          else
            reject(null)
        });
      })

  }

  async login(username : string, password : string){

    return this.getUserDataUsername(username)
    .then(
      (user) =>{
        console.log(user);
        localStorage.setItem("loggedIn","true")
        localStorage.setItem("userId", user.id)
        return true;
      }
    )
    .catch(
      () =>{
        return false;
      }
    )
    
    
  }

  getUserDataUsername(username : string) 
  {
    const userRef = this.store.collection('users', ref => ref.where('username', '==', username));
      const user = userRef.valueChanges();
      return new Promise<User>((resolve, reject) =>{
        user.subscribe((response) => {
          if (response.length > 0)
           resolve(response[0] as User)
          else
            reject(null)
        });
      })
  }

  getUserDataId(id : string) 
  {
    const userRef = this.store.collection('users', ref => ref.where('id', '==', id));
      const user = userRef.valueChanges();
      return new Promise<User>((resolve, reject) =>{
        user.subscribe((response) => {
          if (response.length > 0)
           resolve(response[0] as User)
          else
            reject(null)
        });
      })
  }

  getSessionData() {
    return {
      loggedIn : localStorage.getItem("loggedIn"),
      userId : localStorage.getItem("userId")
    }
  }

  logout(){
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("userId");
  }

  getSubordinates(id : string){
    const userRef = this.store.collection('employees', ref => ref.where('reports_to', '==', id));
      const user = userRef.valueChanges();
      return new Promise<Employee[]>((resolve) =>{
        user.subscribe((response) => {
          // console.log(response);
          
          if (response.length > 0)
          {
            resolve(response as Employee[])
          }
          else
          {
            resolve([])
          }
        });
      })
  }


  public makeAppointment(schedule : Schedules) : void
  {
    // console.log(id, schedule);
     
    let scheduleRef = this.store.collection('schedules', ref => ref.where('id', '==', schedule.id));
      const schedules = scheduleRef.valueChanges({idField: "database_id"});
      schedules.subscribe((response) => {
        scheduleRef = this.store.collection("schedules");
        scheduleRef.doc(response[0].database_id).update({schedule: schedule.schedule})
        // console.log(response);
        return;
      });
}

public editAppointment(schedule : Schedules){
  console.log(schedule);
  this.makeAppointment(schedule)

  // let scheduleRef = this.store.collection('schedules', ref => ref.where('id', '==', id));
  //     const schedules = scheduleRef.valueChanges({idField: "database_id"});
  //     schedules.subscribe((response) => {
  //       scheduleRef = this.store.collection("schedules");
  //       scheduleRef.doc(response[0].database_id).update({schedule: schedule.schedule})
  //       // console.log(response);
  //       return;
  //     });

}
}

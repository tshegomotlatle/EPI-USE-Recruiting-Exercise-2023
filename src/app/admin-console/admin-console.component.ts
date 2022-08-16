import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Employee } from '../interfaces/employee';
import { Schedules } from '../interfaces/schedules';
import { User } from '../interfaces/user';
import { AdminService } from '../services/admin/admin.service';

interface Registered{
  registered_users : [
    User
  ];
}

interface SystemData{
  system_data : {
    employees : [Employee],
    schedules : [Schedules]
  }
}

@Component({
  selector: 'app-admin-console',
  templateUrl: './admin-console.component.html',
  styleUrls: ['./admin-console.component.scss'],
})
export class AdminConsoleComponent implements OnInit {
  selectedOption!: string;
  selectedUser!: string;
  selectedSystem!: string;
  system!: boolean;
  dataToStoreRegistered! : Registered | null;
  dataToStoreSystem! : SystemData | null;
  
  usersCollection! : AngularFirestoreCollection<User>
  users! : Observable<User[]>
  user!: User;
  selectedFile: any;



  constructor(public store : AngularFirestore,
    public adminService : AdminService 
    ) {}

  ngOnInit(): void {
    this.selectedOption = 'system';
    this.selectedSystem = 'selected';
    this.dataToStoreRegistered = null;
  }

  changeActive(option: string): void {
    this.selectedOption = option;

    if (this.selectedOption == 'user') {
      this.selectedSystem = '';
      this.selectedUser = 'selected';
    } else if (this.selectedOption == 'system') {
      this.selectedSystem = 'selected';
      this.selectedUser = '';
    } else {
      alert('error');
    }
  }

  onChange(event: any): void {
    this.selectedFile = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsText(this.selectedFile, 'UTF-8');
    fileReader.onload = () => {
      if (this.selectedOption == 'user')
      {
        const temp: string = fileReader.result as string;
        this.dataToStoreRegistered = JSON.parse(temp)
      }
      else
      {
        const temp: string = fileReader.result as string;
        this.dataToStoreSystem = JSON.parse(temp)

      }
    };
    fileReader.onerror = (error) => {
      console.log(error);
    };
  }

  storeFile(): void {

    
    if (this.selectedFile !== undefined) //Check if file has been chosen
    {
      //Checks what type of file the user is submitting
      if (this.selectedOption == 'user') {
        if (this.dataToStoreRegistered !== null)
        this.adminService.loadAllusers(this.dataToStoreRegistered.registered_users)
      } else  {
        if (this.dataToStoreSystem !== null)
        {
          console.log(this.dataToStoreSystem.system_data.employees);
          
          this.adminService.loadEmployeeData(this.dataToStoreSystem.system_data.employees);
          this.adminService.loadScheduleData(this.dataToStoreSystem.system_data.schedules);
        }
      }
      
      alert("Sucessfully added system data")
      
    }
    else
    {
      alert("Select a file")
    }
  }
  
  update(): void {
    console.log(this.dataToStoreRegistered);
  }
}

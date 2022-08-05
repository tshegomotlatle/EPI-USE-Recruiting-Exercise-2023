import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';


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
  dataToStore! : JSON;
  
  usersCollection! : AngularFirestoreCollection<User>
  users! : Observable<User[]>
  user!: User;



  constructor(public store : AngularFirestore) {}

  ngOnInit(): void {
    this.selectedOption = 'system';
    this.selectedSystem = 'selected';
    // this.usersCollection = this.store.collection("users");
    // this.users = this.usersCollection.valueChanges();
    // this.users.subscribe(
    //   (response) =>{
    //     console.log(response);
        
    //   }
    // )
    // this.user.first_name = "TshegoTesting";
    // this.user.surname = "TshegoTesting";
    // this.user.username = "TshegoTesting";
    // this.user.password = "TshegoTesting";

    this.user = {
      first_name : "Tshego",
      id : "ufgwlefigbweifgvbw",
      surname : "Motlatle",
      username : "Motlatle",
      password : "Motlatle",
    }
    console.log(this.user);
    
    
  }

  changeActive(option: string): void {
    this.selectedOption = option;

    if (this.selectedOption == 'user') {
      console.log('user');
      this.selectedSystem = '';
      this.selectedUser = 'selected';
    } else if (this.selectedOption == 'system') {
      console.log('system');
      this.selectedSystem = 'selected';
      this.selectedUser = '';
    } else {
      alert('error');
    }
  }

  onChange(event: any): void {
    const selectedFile = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsText(selectedFile, 'UTF-8');
    fileReader.onload = () => {
      const temp: string = fileReader.result as string;
      this.dataToStore = JSON.parse(temp)
    };
    fileReader.onerror = (error) => {
      console.log(error);
    };
  }

  storeFile(): void {
    console.log(this.dataToStore);
    
  }
  
  update(): void {
    console.log(this.dataToStore);
  }
}

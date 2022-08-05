import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-console',
  templateUrl: './admin-console.component.html',
  styleUrls: ['./admin-console.component.scss'],
})
export class AdminConsoleComponent implements OnInit {
  selectedOption!: string;
  selectedUser!: string;
  selectedSystem!: string;
  user!: boolean;
  system!: boolean;
  dataToStore! : JSON;


  constructor() {}

  ngOnInit(): void {
    this.selectedOption = 'system';
    this.selectedSystem = 'selected';
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

  store(): void {
    console.log(this.dataToStore);
    
  }
  
  update(): void {
    console.log(this.dataToStore);
  }
}

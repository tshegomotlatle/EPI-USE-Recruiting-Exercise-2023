import { Component, Input, OnInit } from '@angular/core';
import { User } from '../interfaces/user';
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  @Input() user!: User;
  @Input() password!: string;
  @Input() confirmPassword!: string;
  changePassword!: boolean;
  file!: File;

  constructor(private userService: UserService) {}

  async ngOnInit(): Promise<void> {
    this.user = {} as User;
    this.changePassword = false;
    const session = this.userService.getSessionData();
    if (session.userId) {
      this.user = await this.userService.getUserDataId(session.userId);
      console.log(this.user);
    }
  }

  togglePasswordInputs(): void {
    if (this.changePassword) this.changePassword = false;
    else {
      this.changePassword = true;
    }
  }

  update(): void {
    if (this.changePassword == false) {
      if (this.file !== undefined) {
        this.userService.updateUser(this.user);
        this.userService.uploadPhoto(this.file, this.user.id).then(() => {
          alert('Successfully editted profile');
        });
      } else {
        this.userService.updateUser(this.user).then(() => {
          alert('Successfully editted profile');
        });
      }
    } else {
      if (this.password === this.confirmPassword) {
        this.user.password = this.password;
        if (this.file !== undefined) {
          this.userService.updateUser(this.user);
          this.userService.uploadPhoto(this.file, this.user.id).then(() => {
            alert('Successfully editted profile');
          });
        } else {
          this.userService.updateUser(this.user).then(() => {
            alert('Successfully editted profile');
          });
        }
      }
    }
  }

  fileUpload(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = (e) => {
        this.user.avatar = reader.result as string;
      };

      reader.readAsDataURL(this.file);
    }
  }

  fileUploadTrigger() {
    document.getElementById('fileUpload')?.click();
  }
}

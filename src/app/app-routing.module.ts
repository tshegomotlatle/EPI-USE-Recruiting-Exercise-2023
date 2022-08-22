import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminConsoleComponent } from './admin-console/admin-console.component';
import { IsLoggedGuard } from './guards/is-logged.guard';
import { HierarchyComponent } from './hierarchy/hierarchy.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { UserService } from './services/user/user.service';

const routes: Routes = [
  { path: 'schedule', component: ScheduleComponent, canActivate: [IsLoggedGuard]  },
  { path: 'hierarchy', component: HierarchyComponent, canActivate: [IsLoggedGuard] },
  { path: '',   redirectTo: '/hierarchy', pathMatch: 'full'},
  { path: 'admin', component: AdminConsoleComponent, canActivate: [IsLoggedGuard]  },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [IsLoggedGuard]  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [IsLoggedGuard, UserService,  [{provide: LocationStrategy, useClass: HashLocationStrategy}],]
})
export class AppRoutingModule { }

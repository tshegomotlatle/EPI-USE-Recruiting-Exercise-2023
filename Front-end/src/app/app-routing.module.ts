import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminConsoleComponent } from './admin-console/admin-console.component';
import { HierarchyComponent } from './hierarchy/hierarchy.component';
import { ScheduleComponent } from './schedule/schedule.component';

const routes: Routes = [
  { path: 'hierarchy', component: HierarchyComponent },
  { path: 'schedule', component: ScheduleComponent },
  { path: 'admin', component: AdminConsoleComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

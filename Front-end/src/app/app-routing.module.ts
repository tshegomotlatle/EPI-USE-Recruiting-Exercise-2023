import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HierarchyComponent } from './hierarchy/hierarchy.component';
import { ScheduleComponent } from './schedule/schedule.component';

const routes: Routes = [
  { path: 'hierarchy', component: HierarchyComponent },
  { path: 'schedule', component: ScheduleComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

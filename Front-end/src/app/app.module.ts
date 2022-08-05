import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HierarchyComponent } from './hierarchy/hierarchy.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { HierarchyViewComponent } from './hierarchy-view/hierarchy-view.component';
import { FormsModule } from '@angular/forms';
import { HierarchyTreeComponent } from './hierarchy-tree/hierarchy-tree.component';
import { AdminConsoleComponent } from './admin-console/admin-console.component';
import { environment } from 'src/environments/environment';

// import { AngularFireModule } from '@angular/fire';
import {AngularFireModule} from '@angular/fire/compat'
import { AngularFirestoreModule } from '@angular/fire/compat/firestore/'

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    HierarchyComponent,
    ScheduleComponent,
    HierarchyViewComponent,
    HierarchyTreeComponent,
    AdminConsoleComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    AngularFireModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

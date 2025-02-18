import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { SearchComponent } from './features/search/search.component';
import { NewsComponent} from './features/news/news.component';
import { AccountComponent } from './features/account/account.component';
import { TaskListComponent } from "./features/tasks/task-list/task-list.component";
import { TaskDetailComponent } from "./features/tasks/task-detail/task-detail.component";
import { NewTaskComponent } from "./features/tasks/new-task/new-task.component";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'tasks', component: TaskListComponent },
  { path: 'task/new', component: NewTaskComponent },
  { path: 'task/:id', component: TaskDetailComponent },
  { path: 'search', component: SearchComponent },
  { path: 'news', component: NewsComponent },
  { path: 'account', component: AccountComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

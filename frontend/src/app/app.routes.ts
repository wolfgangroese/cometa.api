import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { SearchComponent } from './features/search/search.component';
import { NewsComponent} from './features/news/news.component';
import { AccountComponent } from './features/account/account.component';
import { TaskListComponent } from "./features/tasks/task-list/task-list.component";
import { TaskDetailComponent } from "./features/tasks/task-detail/task-detail.component";
import { NewTaskComponent } from "./features/tasks/new-task/new-task.component";
import { TaskQuickAddComponent } from './features/tasks/task-quick-add/task-quick-add.component';
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { AuthTestComponent } from "./features/auth-test/auth-test.component";
import { SkillsManagementComponent } from './features/skills-management/skills-management.component';
import { UserManagementComponent } from "./features/user-management/user-management.component";
import { AuthGuard } from './guards/auth.guard';
import {OrganizationsListComponent} from "./features/organizations-list/organizations-list.component";
import {OrganizationMembersComponent} from "./features/organization-members/organization-members.component";



export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'tasks', component: TaskListComponent, canActivate: [AuthGuard] },
  { path: 'task/new', component: NewTaskComponent, canActivate: [AuthGuard] },
  { path: 'task/quick-add', component: TaskQuickAddComponent, canActivate: [AuthGuard] },
  { path: 'task/:id', component: TaskDetailComponent, canActivate: [AuthGuard] },
  { path: 'search', component: SearchComponent, canActivate: [AuthGuard] },
  { path: 'news', component: NewsComponent, canActivate: [AuthGuard] },
  { path: 'account', component: AccountComponent, canActivate: [AuthGuard] },
  { path: 'auth-test', component: AuthTestComponent },
  { path: 'skills', component: SkillsManagementComponent, canActivate: [AuthGuard] },
  { path: 'users', component: UserManagementComponent, canActivate: [AuthGuard] },
  { path: 'organizations', component: OrganizationsListComponent, canActivate: [AuthGuard] },
  { path: 'members', component: OrganizationMembersComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

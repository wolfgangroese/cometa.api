import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { SearchComponent } from './features/search/search.component';
import { NewsComponent} from './features/news/news.component';
import { AccountComponent } from './features/account/account.component';
import { TodoListComponent } from "./features/todo-list/todos-list.component";
import { TodoDetailComponent } from "./features/todo-detail/todo-detail.component";
import { CreateTodoComponent } from "./features/create-todo/create-todo.component";


export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'todos', component: TodoListComponent },
  { path: 'todo/new', component: CreateTodoComponent },
  { path: 'todo/:id', component: TodoDetailComponent },
  { path: 'search', component: SearchComponent },
  { path: 'nachrichten', component: NewsComponent },
  { path: 'account', component: AccountComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

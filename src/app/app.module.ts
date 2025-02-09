import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { TodoListComponent } from './features/todos/todo-list/todos-list.component';
import { TodoService } from './services/todo.service';
import { AppRoutingModule } from './app.routes';
import { HeaderComponent } from './shell/header/header.component';
import { HomeComponent } from "./features/home/home.component";
import { NewsComponent } from "./features/news/news.component";
import { TodoDetailComponent } from "./features/todos/todo-detail/todo-detail.component";
import { SearchComponent } from "./features/search/search.component";
import { AccountComponent } from "./features/account/account.component";
import { MenubarModule } from "primeng/menubar";
import { provideHttpClient } from "@angular/common/http";
import { FormsModule} from "@angular/forms";
import { InputTextModule } from "primeng/inputtext";
import { CalendarModule } from "primeng/calendar";
import { NewTodoComponent } from "./features/todos/new-todo/new-todo.component";
import { AuthService } from "./services/auth.service";

@NgModule({
  declarations: [

  ],
  imports: [
    BrowserModule,
    AppComponent,
    TodoListComponent,
    AppRoutingModule,
    HeaderComponent,
    HomeComponent,
    NewsComponent,
    TodoDetailComponent,
    SearchComponent,
    AccountComponent,
    MenubarModule,
    FormsModule,
    InputTextModule,
    CalendarModule,
    NewTodoComponent
  ],
  providers: [
    TodoService,
    AuthService,
  provideHttpClient()
  ],
})
export class AppModule { }

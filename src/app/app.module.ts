import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { TodoListComponent } from './features/todo-list/todos-list.component';
import { TodoService } from './services/todo.service';

@NgModule({
  declarations: [
    TodoListComponent
  ],
  imports: [
    BrowserModule,
    AppComponent
  ],
  providers: [TodoService],
  bootstrap: [AppComponent]
})
export class AppModule { }

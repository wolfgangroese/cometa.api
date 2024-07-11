import { Component } from '@angular/core';
import {CommonModule} from "@angular/common";
import {Todo} from "../../models/todo.model";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  todos: Todo[] = [];
}

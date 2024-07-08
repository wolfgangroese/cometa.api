import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from "./shell/header/header.component";
import {FooterComponent} from "./shell/footer/footer.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent]
})
export class AppComponent {
  title = 'cometa';
}

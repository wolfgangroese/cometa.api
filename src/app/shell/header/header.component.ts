import { Component, OnInit } from '@angular/core';
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {MenubarModule} from "primeng/menubar";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: true,
  styleUrls: ['./header.component.scss'],
  imports: [CommonModule, RouterModule, MenubarModule]
})
export class HeaderComponent implements OnInit {
  items: any[] | undefined;

  ngOnInit() {
    this.items = [
      { label: 'Home', icon: 'pi pi-home', routerLink: ['/home'] },
      { label: 'Todos', icon: 'pi pi-check-circle', routerLink: ['/todos'] },
      { label: 'Search', icon: 'pi pi-search', routerLink: ['/search'] },
      { label: 'Nachrichten', icon: 'pi pi-envelope', routerLink: ['/nachrichten'] },
      { label: 'Account', icon: 'pi pi-user', routerLink: ['/account'] }
    ];
  }
}

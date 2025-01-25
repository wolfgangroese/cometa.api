import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';

interface MenuItem {
  label: string;
  icon: string;
  routerLink: string[];
}


@Component({
    selector: 'app-footer',
    standalone: true,
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    imports: [CommonModule, RouterModule, MenubarModule]
})
export class FooterComponent implements OnInit {
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      { label: 'Home', icon: 'pi pi-home', routerLink: ['/home'] },
      { label: 'Todos', icon: 'pi pi-check-circle', routerLink: ['/todos'] },
      { label: 'New Todo', icon: 'pi pi-plus', routerLink: ['/todo/new'] },
      { label: 'Nachrichten', icon: 'pi pi-envelope', routerLink: ['/nachrichten'] },
      { label: 'Search', icon: 'pi pi-search', routerLink: ['/search'] },
      { label: 'Account', icon: 'pi pi-user', routerLink: ['/account'] }
    ];
  }
}

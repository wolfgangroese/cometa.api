import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, MenubarModule]
})
export class FooterComponent implements OnInit {
  items: any[] | undefined;

  ngOnInit() {
    this.items = [
      { label: 'Home', icon: 'pi pi-home', routerLink: ['/home'] },
      { label: 'New Todo', icon: 'pi pi-plus', routerLink: ['/todo/new'] },
      { label: 'Todos', icon: 'pi pi-check-circle', routerLink: ['/todos'] },
      { label: 'Search', icon: 'pi pi-search', routerLink: ['/search'] },
      { label: 'Nachrichten', icon: 'pi pi-envelope', routerLink: ['/nachrichten'] },
      { label: 'Account', icon: 'pi pi-user', routerLink: ['/account'] }
    ];
  }
}

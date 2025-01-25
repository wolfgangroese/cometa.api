import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

interface MenuItem {
  label: string;
  icon: string;
  routerLink: string[];
}


@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  currentLabel= 'COMETA';
  items: MenuItem[] = [
    { label: 'Home', icon: 'pi pi-home', routerLink: ['/home'] },
    { label: 'List', icon: 'pi pi-check-circle', routerLink: ['/todos'] },
    { label: 'Add', icon: 'pi pi-plus', routerLink: ['/todo/new'] },
    { label: 'News', icon: 'pi pi-envelope', routerLink: ['/nachrichten'] },
    { label: 'Search', icon: 'pi pi-search', routerLink: ['/search'] },
    { label: 'Account', icon: 'pi pi-user', routerLink: ['/account'] },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Beobachte Navigation-Änderungen
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const currentRoute = this.router.url;
        this.updateCurrentLabel(currentRoute);
      });
  }

  updateCurrentLabel(currentRoute: string): void {
    // Finde das passende Label zur aktuellen Route
    const matchedItem = this.items.find(item =>
      currentRoute.startsWith(item.routerLink[0]) // Prüft den Start der Route
    );
    this.currentLabel = matchedItem ? matchedItem.label : 'Details'; // Standardwert, falls nichts gefunden wird
  }
}

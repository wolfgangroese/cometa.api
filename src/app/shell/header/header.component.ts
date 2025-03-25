import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

interface MenuItem {
  label: string;
  icon: string;
  routerLink: string[];
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  currentLabel = 'COMETA';
  currentUser: User | null = null;
  showAccountMenu = false;
  totalRewards = 0;

  items: MenuItem[] = [
    { label: 'Home', icon: 'pi pi-home', routerLink: ['/home'] },
    { label: 'List', icon: 'pi pi-check-circle', routerLink: ['/tasks'] },
    { label: 'Add', icon: 'pi pi-plus', routerLink: ['/task/new'] },
    { label: 'News', icon: 'pi pi-envelope', routerLink: ['/news'] },
    { label: 'Search', icon: 'pi pi-search', routerLink: ['/search'] },
    { label: 'Account', icon: 'pi pi-user', routerLink: ['/account'] },
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // Beobachte Navigation-Änderungen
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const currentRoute = this.router.url;
        this.updateCurrentLabel(currentRoute);
      });

    // Abonniere den aktuellen Benutzer vom AuthService
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadUserRewards();
      }
    });
  }

  updateCurrentLabel(currentRoute: string): void {
    // Finde das passende Label zur aktuellen Route
    const matchedItem = this.items.find(item =>
      currentRoute.startsWith(item.routerLink[0]) // Prüft den Start der Route
    );
    this.currentLabel = matchedItem ? matchedItem.label : 'Details'; // Standardwert, falls nichts gefunden wird
  }

  loadUserRewards(): void {
    this.userService.getUserRewards().subscribe({
      next: (rewards) => {
        this.totalRewards = rewards;
      },
      error: (err) => {
        console.error('Error loading user rewards:', err);
      }
    });
  }

  toggleAccountMenu(event: Event): void {
    event.stopPropagation();
    this.showAccountMenu = !this.showAccountMenu;
  }

  closeAccountMenu(event: Event): void {
    event.stopPropagation();
    this.showAccountMenu = false;
  }

  @HostListener('document:keydown.escape')
  onEscapeKeydown() {
    if (this.showAccountMenu) {
      this.showAccountMenu = false;
    }
  }

  async logout(): Promise<void> {
    this.authService.logout();
    this.closeAccountMenu(new Event('click'));
    try {
      await this.router.navigate(['/login']);
    } catch (error) {
      console.error('Navigation failed:', error);
    }
  }
}

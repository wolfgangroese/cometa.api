import { Component, OnInit, HostListener } from '@angular/core';
import {Router, NavigationEnd, RouterLink} from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { OrganizationService } from '../../services/organization.service';
import { User } from '../../models/user.model';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import {Organization} from "../../models/organization.model";

interface MenuItem {
  label: string;
  icon: string;
  routerLink: string[];
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ToastModule,
    DropdownModule,
    FormsModule
  ],
  providers: [MessageService],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  currentLabel = 'COMETA';
  currentUser?: User | null = null;
  showAccountMenu = false;
  totalRewards = 0;

  // Organization related properties
  organizations: Organization[] = [];
  selectedOrganization?: Organization;
  showOrgSelector = false;

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
    private userService: UserService,
    private orgService: OrganizationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    console.log('📣 Header currentUser:', this.currentUser);

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
        this.loadOrganizations();
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

  loadOrganizations(): void {
    this.orgService.getOrganizations().subscribe({
      next: (orgs) => {
        this.organizations = orgs;
        if (orgs.length > 0) {
          this.selectedOrganization = orgs[0]; // Default to first org
        }
      },
      error: (err) => {
        console.error('Error loading organizations:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load organizations'
        });
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

  toggleOrgSelector(event: Event): void {
    event.stopPropagation();
    this.showOrgSelector = !this.showOrgSelector;
  }

  switchOrganization(organization: Organization): void {
    this.orgService.switchOrganization(organization.id).subscribe({
      next: () => {
        this.selectedOrganization = organization;
        this.showOrgSelector = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Switched to ${organization.name}`
        });

        // Reload current page to refresh data with new organization
        window.location.reload();
      },
      error: (err) => {
        console.error('Error switching organization:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to switch organization'
        });
      }
    });
  }

  @HostListener('document:keydown.escape')
  onEscapeKeydown() {
    if (this.showAccountMenu) {
      this.showAccountMenu = false;
    }
    if (this.showOrgSelector) {
      this.showOrgSelector = false;
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

  // Helper method to check if user is Admin or Staff
  isAdminOrStaff(): boolean {
    return this.authService.hasAnyRole(['Admin', 'Staff']);
  }

  // Create new organization
  createNewOrganization(): void {
    this.router.navigate(['/organization/new']);
    this.closeAccountMenu(new Event('click'));
  }

  // Go to organization management
  manageOrganizations(): void {
    this.router.navigate(['/organizations']);
    this.closeAccountMenu(new Event('click'));
  }
}

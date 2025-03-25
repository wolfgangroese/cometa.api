import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { NgIf } from "@angular/common";
import { Router, RouterLink } from "@angular/router";
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  imports: [
    NgIf,
    RouterLink,
    ButtonModule
  ],
  standalone: true
})
export class AccountComponent implements OnInit {
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }

 async logout(): Promise<void> {
    this.authService.logout();
    await this.router.navigate(['/login']);
  }
}

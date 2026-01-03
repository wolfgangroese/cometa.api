import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { NgIf } from "@angular/common";
import { Router, RouterLink } from "@angular/router";
import { ButtonModule } from 'primeng/button';
import {UserService} from "../../services/user.service";

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
  totalRewards = 0;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      if (user) {
        this.loadUserRewards();
      }
    });
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

 async logout(): Promise<void> {
    this.authService.logout();
    await this.router.navigate(['/login']);
  }
}

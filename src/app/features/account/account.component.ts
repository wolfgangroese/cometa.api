import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  imports: [
    NgIf
  ],
  standalone: true
})
export class AccountComponent implements OnInit {
  currentUser: User | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      console.log('📥 AccountComponent empfängt Benutzer:', user);
      this.currentUser = user;
    });
  }
}

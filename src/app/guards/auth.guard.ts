import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const currentUser = this.authService.getCurrentUserSync();

    if (currentUser) {
      // Benutzer ist eingeloggt
      return true;
    }

    // Nicht eingeloggt, zu Login-Seite umleiten
    return this.router.createUrlTree(['/login']);
  }
}

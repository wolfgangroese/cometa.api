import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  Organization,
  CreateOrganizationDto,
  UpdateOrganizationDto,
  InviteMemberDto,
  UpdateMemberRoleDto
} from '../models/organization.model';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  private apiUrl = `${environment.api.baseUrl}/organizations`;

  // New: Add a subject to track current organization
  private currentOrganizationSubject = new BehaviorSubject<Organization | null>(null);
  currentOrganization$ = this.currentOrganizationSubject.asObservable();

  constructor(private http: HttpClient) {
    // Try to restore current organization from session storage on init
    this.loadCurrentOrganizationFromStorage();
  }

  private loadCurrentOrganizationFromStorage(): void {
    const storedOrg = sessionStorage.getItem('currentOrganization');
    if (storedOrg) {
      try {
        const org = JSON.parse(storedOrg);
        this.currentOrganizationSubject.next(org);
      } catch (e) {
        console.error('Error parsing stored organization:', e);
        sessionStorage.removeItem('currentOrganization');
      }
    }
  }

  // Get all organizations for current user
  getOrganizations(): Observable<Organization[]> {
    return this.http.get<Organization[]>(this.apiUrl).pipe(
      tap(orgs => {
        // If we have orgs but no current org selected, select the first one
        if (orgs.length > 0 && !this.currentOrganizationSubject.value) {
          // Find the org that matches the user's currentOrganizationId
          // This should be handled in the component instead
        }
      }),
      catchError(error => {
        console.error('Error fetching organizations:', error);
        return throwError(() => error);
      })
    );
  }

  // Get a specific organization by ID
  getOrganization(id: string): Observable<Organization> {
    return this.http.get<Organization>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Error fetching organization with ID ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  // Create a new organization
  createOrganization(data: CreateOrganizationDto): Observable<Organization> {
    return this.http.post<Organization>(this.apiUrl, data).pipe(
      tap(org => {
        // Update current organization after creation
        this.currentOrganizationSubject.next(org);
        sessionStorage.setItem('currentOrganization', JSON.stringify(org));
      }),
      catchError(error => {
        console.error('Error creating organization:', error);
        return throwError(() => error);
      })
    );
  }

  // Update an organization
  updateOrganization(id: string, data: UpdateOrganizationDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data).pipe(
      tap(() => {
        // Update the current organization if it's the one being edited
        const current = this.currentOrganizationSubject.value;
        if (current && current.id === id) {
          const updated = { ...current, ...data };
          this.currentOrganizationSubject.next(updated);
          sessionStorage.setItem('currentOrganization', JSON.stringify(updated));
        }
      }),
      catchError(error => {
        console.error(`Error updating organization with ID ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  // Delete an organization
  deleteOrganization(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        // If deleting current organization, remove it from our state
        const current = this.currentOrganizationSubject.value;
        if (current && current.id === id) {
          this.currentOrganizationSubject.next(null);
          sessionStorage.removeItem('currentOrganization');
        }
      }),
      catchError(error => {
        console.error(`Error deleting organization with ID ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  // Invite a member to an organization
  inviteMember(orgId: string, data: InviteMemberDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/${orgId}/members`, data).pipe(
      catchError(error => {
        console.error(`Error inviting member to organization with ID ${orgId}:`, error);
        return throwError(() => error);
      })
    );
  }

  // Remove a member from an organization
  removeMember(orgId: string, userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${orgId}/members/${userId}`).pipe(
      catchError(error => {
        console.error(`Error removing member from organization with ID ${orgId}:`, error);
        return throwError(() => error);
      })
    );
  }

  // Update a member's role
  updateMemberRole(orgId: string, userId: string, data: UpdateMemberRoleDto): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${orgId}/members/${userId}/role`, data).pipe(
      catchError(error => {
        console.error(`Error updating member role in organization with ID ${orgId}:`, error);
        return throwError(() => error);
      })
    );
  }

  // Switch to a different organization
  switchOrganization(orgId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/switch/${orgId}`, {}).pipe(
      tap(() => {
        // Find the organization in our cache and set it as current
        this.getOrganization(orgId).subscribe({
          next: (org) => {
            this.currentOrganizationSubject.next(org);
            sessionStorage.setItem('currentOrganization', JSON.stringify(org));
          }
        });
      }),
      catchError(error => {
        console.error(`Error switching to organization with ID ${orgId}:`, error);
        return throwError(() => error);
      })
    );
  }

  // Get the current organization (synchronously)
  getCurrentOrganization(): Organization | null {
    return this.currentOrganizationSubject.value;
  }
}

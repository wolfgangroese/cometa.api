import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor(private authService: AuthService) { }

  /**
   * Check if the current user can edit all task properties
   * Only Admin and Staff can fully edit tasks
   */
  canEditTaskProperties(): boolean {
    return this.authService.hasAnyRole(['Admin', 'Staff']);
  }

  /**
   * Check if the current user can edit only the task status
   * All authenticated users (including Performers) can edit status
   */
  canEditTaskStatus(): boolean {
    return true; // All authenticated users can edit status
  }

  /**
   * Check if the current user can create new tasks
   * Only Admin and Staff can create tasks
   */
  canCreateTasks(): boolean {
    return this.authService.hasAnyRole(['Admin', 'Staff']);
  }

  /**
   * Check if the current user can delete tasks
   * Only Admin and Staff can delete tasks
   */
  canDeleteTasks(): boolean {
    return this.authService.hasAnyRole(['Admin', 'Staff']);
  }

  /**
   * Check if the current user is the task assignee
   * @param assigneeId ID of the task assignee
   */
  isTaskAssignee(assigneeId: string | null | undefined): boolean {
    const currentUser = this.authService.getCurrentUserSync();
    if (!currentUser || !assigneeId) {
      return false;
    }
    return currentUser.id === assigneeId;
  }

  /**
   * Check if task is available for pickup (waiting status and not assigned)
   */
  isTaskAvailableForPickup(status: any, assigneeId: string | null | undefined): boolean {
    // Check if task is in waiting status (could be number 3 or string 'Waiting')
    const isWaiting = 
      status === 3 || 
      status === 'Waiting' || 
      (typeof status === 'string' && status.toLowerCase() === 'waiting');
    
    // Task is available if it's waiting and not assigned
    return isWaiting && !assigneeId;
  }
}

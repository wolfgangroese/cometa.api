import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillsManagementComponent } from './skills-management.component';

describe('SkillsManagementComponent', () => {
  let component: SkillsManagementComponent;
  let fixture: ComponentFixture<SkillsManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillsManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkillsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

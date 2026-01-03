import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationNewComponent } from './organization-new.component';

describe('OrganizationNewComponent', () => {
  let component: OrganizationNewComponent;
  let fixture: ComponentFixture<OrganizationNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizationNewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizationNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

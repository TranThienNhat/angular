import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProductUpdateComponent } from './admin-product-update.component';

describe('AdminProductUpdateComponent', () => {
  let component: AdminProductUpdateComponent;
  let fixture: ComponentFixture<AdminProductUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProductUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminProductUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProductAddComponent } from './admin-product-add.component';

describe('AdminProductUpdateComponent', () => {
  let component: AdminProductAddComponent;
  let fixture: ComponentFixture<AdminProductAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProductAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminProductAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrixEffect } from './matrix-effect';

describe('MatrixEffect', () => {
  let component: MatrixEffect;
  let fixture: ComponentFixture<MatrixEffect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatrixEffect]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatrixEffect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

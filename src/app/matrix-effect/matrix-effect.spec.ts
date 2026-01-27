import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrixEffectComponent } from './matrix-effect';

describe('MatrixEffect', () => {
  let component: MatrixEffectComponent;
  let fixture: ComponentFixture<MatrixEffectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatrixEffectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatrixEffectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

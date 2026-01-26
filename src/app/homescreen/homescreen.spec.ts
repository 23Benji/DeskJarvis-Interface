import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Homescreen } from './homescreen';

describe('Homescreen', () => {
  let component: Homescreen;
  let fixture: ComponentFixture<Homescreen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Homescreen]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Homescreen);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

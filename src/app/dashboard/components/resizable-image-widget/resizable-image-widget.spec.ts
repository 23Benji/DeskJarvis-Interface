import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResizableImageWidget } from './resizable-image-widget';

describe('ResizableImageWidget', () => {
  let component: ResizableImageWidget;
  let fixture: ComponentFixture<ResizableImageWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResizableImageWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResizableImageWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

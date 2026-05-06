import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResizableImageWidgetComponent } from './resizable-image-widget';

describe('ResizableImageWidgetComponent', () => {
  let component: ResizableImageWidgetComponent;
  let fixture: ComponentFixture<ResizableImageWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResizableImageWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResizableImageWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

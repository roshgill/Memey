import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContentCleanComponent } from './content-clean.component';

describe('ContentCleanComponent', () => {
  let component: ContentCleanComponent;
  let fixture: ComponentFixture<ContentCleanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContentCleanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentCleanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

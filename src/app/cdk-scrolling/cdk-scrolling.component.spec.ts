import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CdkScrollingComponent } from './cdk-scrolling.component';

describe('CdkScrollingComponent', () => {
  let component: CdkScrollingComponent;
  let fixture: ComponentFixture<CdkScrollingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CdkScrollingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CdkScrollingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

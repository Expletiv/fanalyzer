import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecuritiesComponent } from './securities.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('SecuritiesComponent', () => {
  let component: SecuritiesComponent;
  let fixture: ComponentFixture<SecuritiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecuritiesComponent],
      providers: [provideAnimationsAsync()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecuritiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

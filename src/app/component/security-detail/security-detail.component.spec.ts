import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityDetailComponent } from './security-detail.component';
import { provideHttpClient } from '@angular/common/http';

describe('SecurityDetailComponent', () => {
  let component: SecurityDetailComponent;
  let fixture: ComponentFixture<SecurityDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecurityDetailComponent],
      providers: [provideHttpClient()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecurityDetailComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('symbol', 'AAPL');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

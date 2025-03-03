import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YahooFinanceChartComponent } from './yahoo-finance-chart.component';
import { provideHttpClient } from '@angular/common/http';

describe('SimpleChartComponent', () => {
  let component: YahooFinanceChartComponent;
  let fixture: ComponentFixture<YahooFinanceChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YahooFinanceChartComponent],
      providers: [provideHttpClient()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YahooFinanceChartComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('symbol', 'AAPL');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

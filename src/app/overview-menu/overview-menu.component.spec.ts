import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewMenuComponent } from './overview-menu.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('OverviewMenuComponent', () => {
  let component: OverviewMenuComponent;
  let fixture: ComponentFixture<OverviewMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverviewMenuComponent, BrowserAnimationsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverviewMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

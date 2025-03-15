import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XmlMissingMessageComponent } from './xml-missing-message.component';
import { provideHttpClient } from '@angular/common/http';

describe('XmlMissingMessageComponent', () => {
  let component: XmlMissingMessageComponent;
  let fixture: ComponentFixture<XmlMissingMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [XmlMissingMessageComponent],
      providers: [provideHttpClient()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(XmlMissingMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

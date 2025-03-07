import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PpXmlFileUploaderComponent } from './pp-xml-file-uploader.component';
import { provideHttpClient } from '@angular/common/http';

describe('PpXmlFileUploaderComponent', () => {
  let component: PpXmlFileUploaderComponent;
  let fixture: ComponentFixture<PpXmlFileUploaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PpXmlFileUploaderComponent],
      providers: [provideHttpClient()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PpXmlFileUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

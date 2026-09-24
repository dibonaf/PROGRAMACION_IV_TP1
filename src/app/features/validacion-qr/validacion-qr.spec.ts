import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ValidacionQr } from './validacion-qr';

describe('ValidacionQr', () => {
  let component: ValidacionQr;
  let fixture: ComponentFixture<ValidacionQr>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidacionQr],
    }).compileComponents();

    fixture = TestBed.createComponent(ValidacionQr);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

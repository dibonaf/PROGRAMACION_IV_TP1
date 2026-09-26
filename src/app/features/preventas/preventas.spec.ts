import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Preventas } from './preventas';

describe('Preventas', () => {
  let component: Preventas;
  let fixture: ComponentFixture<Preventas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Preventas],
    }).compileComponents();

    fixture = TestBed.createComponent(Preventas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

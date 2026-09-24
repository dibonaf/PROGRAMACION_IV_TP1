import { TestBed } from '@angular/core/testing';
import { FuncionesService} from './funciones.service';

describe('Funciones', () => {
  let service: FuncionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FuncionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

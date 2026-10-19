import { TestBed } from '@angular/core/testing';

import { TripData } from './trip-data';
import { provideHttpClient, HttpRequest } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

describe('TripData', () => {
  let service: TripData;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()]
    });

    service = TestBed.inject(TripData);
    httpMock = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should send database query params', () => {

    service.getTrips({
      search: 'TEST021',
      maxPrice: 500,
      sort: 'priceAsc',
      page: 1,
      limit: 10
    }).subscribe();

    const req = httpMock.expectOne((request: HttpRequest<unknown>) =>
      request.method === 'GET' &&
      request.url === 'http://localhost:3000/api/trips'
    );
    expect(req.request.params.get('search')).toBe('TEST021');
    expect(req.request.params.get('maxPrice')).toBe('500');
    expect(req.request.params.get('sort')).toBe('priceAsc');
    expect(req.request.params.get('page')).toBe('1');
    expect(req.request.params.get('limit')).toBe('10');

    req.flush([]);
  });
});

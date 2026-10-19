import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { TripListing } from './trip-listing';
import { Trip } from '../models/trip';
import { TripData } from '../services/trip-data';

describe('TripListing Filters', () => {
  let component: TripListing;

  const TestTrips: Trip[] = [
    {
      _id: '1',
      code: 'PAR',
      name: 'Paris Vacation',
      resort: 'Central Hotel',
      perPerson: 900,
      length: '5 nights',
      start: new Date('2026-01-01'),
      image: '',
      description: ''
    },
    {
      _id: '2',
      code: 'ROM',
      name: 'Rome Adventure',
      resort: 'Grand Resort',
      perPerson: 1500,
      length: '7 nights',
      start: new Date('2026-02-01'),
      image: '',
      description: ''
    }
  ];

  beforeEach(() => {
    component = new TripListing(
      {} as TripData,
      {} as Router,
      {} as ChangeDetectorRef
    );

    component.allTrips = TestTrips.map(trip => ({ ...trip }));
  });

  it('should search trip names regardless of case', () => {
    component.searchTerm = 'PARIS';
    component.applyFilters();

    expect(component.trips.length).toBe(1);
    expect(component.trips[0].code).toBe('PAR');
  });

  it('should filter trips by max price', () => {
    component.maxPrice = 1000;
    component.applyFilters();

    expect(component.trips.length).toBe(1);
    expect(component.trips[0].code).toBe('PAR');
  });

  it('should sort from low to high', () => {
    component.allTrips.reverse();
    component.sortOption = 'priceLow';
    component.applyFilters();

    expect(component.trips[0].code).toBe('PAR');
    expect(component.trips[1].code).toBe('ROM');
  });

  it('should sort from high to low', () => {
    component.sortOption = 'priceHigh';
    component.applyFilters();

    expect(component.trips[0].code).toBe('ROM');
    expect(component.trips[1].code).toBe('PAR');
  });

  it('should sort trips alphabetically', () => {
    component.allTrips.reverse();
    component.sortOption = 'name';
    component.applyFilters();

    expect(component.trips[0].code).toBe('PAR');
    expect(component.trips[1].code).toBe('ROM');
  });

  it('should keep original collection unaltered', () => {
    component.sortOption = 'priceHigh';
    component.applyFilters();

    expect(component.trips[0].code).toBe('ROM');
    expect(component.trips[1].code).toBe('PAR');

    expect(component.allTrips[0].code).toBe('PAR');
    expect(component.allTrips[1].code).toBe('ROM');
  });
});



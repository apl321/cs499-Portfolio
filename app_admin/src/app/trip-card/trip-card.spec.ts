import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripCard } from './trip-card';

describe('TripCard', () => {
  let component: TripCard;
  let fixture: ComponentFixture<TripCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('trip', {
      _id: '1',
      code: 'PAR',
      name: 'Paris Vacation',
      resort: 'Central Hotel',
      perPerson: 900,
      length: '5 nights',
      start: new Date('2026-01-01'),
      image: '',
      description: ''
    });
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

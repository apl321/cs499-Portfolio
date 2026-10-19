import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {CommonModule} from '@angular/common';
import { TripCard } from '../trip-card/trip-card';
import { Trip } from '../models/trip';
import { TripData, TripQuery } from '../services/trip-data';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-trip-listing',
  standalone: true,
  imports: [CommonModule, FormsModule, TripCard],
  templateUrl: './trip-listing.html',
  styleUrl: './trip-listing.css',
  providers: [TripData]

})
export class TripListing implements OnInit {
  trips: Trip[] = [];
  allTrips: Trip[] = [];
  message: string = '';
  searchTerm: string = '';
  maxPrice: number | null = null;
  sortOption: string = 'none';
  page: number = 1;
  pageSize: number = 10; //ten should be enough

  public applyFilters(): void {
    //starts with entire trip list
    let filteredTrips = [...this.allTrips];
    //searches list for matching info
    const search = this.searchTerm.trim().toLowerCase();

    if (search) {
      filteredTrips = filteredTrips.filter((trip: Trip) =>
        trip.name.toLowerCase().includes(search) ||
        trip.resort.toLowerCase().includes(search) ||
        trip.code.toLowerCase().includes(search)
      );
    }

    if (this.maxPrice !== null) {
      filteredTrips = filteredTrips.filter(
        (trip: Trip) => trip.perPerson <= this.maxPrice!
      );
    }
    //sort based on selected option
    switch (this.sortOption) {
      case 'priceLow':
        filteredTrips.sort((a: Trip, b: Trip) =>
          a.perPerson - b.perPerson);
        break;

      case 'priceHigh':
        filteredTrips.sort((a: Trip, b: Trip) =>
          b.perPerson - a.perPerson);
        break;

      case 'name':
        filteredTrips.sort((a: Trip, b: Trip) =>
          a.name.localeCompare(b.name));
        break;
    }
    this.trips = filteredTrips;
  }
  constructor(
    private tripData: TripData,
    private router: Router,
    private changeDetector: ChangeDetectorRef
  ) {
    console.log('trip-listing constructor');
  }
  public addTrip(): void {
    this.router.navigate(['add-trip']);
  }
  //pagination reset on new search
  public applyServerFilters(): void {
    this.page = 1;
    this.getStuff();
  }

  public nextPage(): void {
    if (this.trips.length === this.pageSize) {
      this.page++;
      this.getStuff();
    }
  }

  public previousPage(): void {
    if (this.page > 1) {
      this.page--;
      this.getStuff();
    }
  }

  private getStuff(): void {
    const sortMap: Record<string, string> = {
      priceLow: 'priceAsc',
      priceHigh: 'priceDesc',
      name: 'name'
    };
    const query: TripQuery = {
      search: this.searchTerm,
      maxPrice: this.maxPrice,
      sort: sortMap[this.sortOption],
      page: this.page,
      limit: this.pageSize
    };
    this.tripData.getTrips(query).subscribe({
      next: (value: Trip[]) => {
        this.allTrips = [...value];
        this.trips = [...value];

        if (value.length > 0) {
          this.message = 'There are ' + value.length + ' trips on this page';
        }
        else {
          this.message = 'No matching trips found.';
        }

        this.changeDetector.detectChanges();
      },
      error: (error: any) => {
        console.error('Error loading trips', error);
        this.message = 'Unable to retrieve trips.';
        this.changeDetector.detectChanges();
      }
    });
  }

  ngOnInit(): void {
    console.log('ngOnInit');
    this.getStuff();
  }
}

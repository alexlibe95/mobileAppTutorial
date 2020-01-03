import { Injectable } from '@angular/core';
import { Booking } from './booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private Bookings: Booking[] = [
    new Booking(
      'b1',
      'p3',
      'Bora bora Mansion',
      '2000012',
      2
    ),
    new Booking(
      'b2',
      'p2',
      'New Jerssey Mansion',
      '2000034',
      1
    ),
    new Booking(
      'b3',
      'p5',
      'Palace Mansion',
      '2000012',
      4
    ),
    new Booking(
      'b4',
      'p1',
      'Manhattan Mansion',
      '2000013',
      2
    )
  ];

  get bookings() {
    return [...this.Bookings];
  }

  constructor() { }
}

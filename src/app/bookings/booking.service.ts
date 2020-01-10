import { Injectable } from '@angular/core';
import { Booking } from './booking.model';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { take, tap, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private Bookings = new BehaviorSubject<Booking[]>([]);


  get bookings() {
    return this.Bookings.asObservable();
  }

  constructor(private authService: AuthService) {}

  addBooking(
    placeId: string,
    placeTitle: string,
    placeImage: string,
    firstName: string,
    lastName: string,
    guestNumber: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    const newBooking = new Booking(
      Math.random().toString(),
      placeId,
      this.authService.UserId,
      placeTitle,
      placeImage,
      firstName,
      lastName,
      guestNumber,
      dateFrom,
      dateTo
    );
    return this.Bookings.pipe(take(1), delay(1000), tap(bookings => {
      this.Bookings.next(bookings.concat(newBooking));
    }));
  }

  cancelBooking(bookingId: string)  {
    return this.Bookings.pipe(take(1), delay(1000), tap(bookings => {
      this.Bookings.next(bookings.filter(b => b.id !== bookingId));
    }));
  }
}

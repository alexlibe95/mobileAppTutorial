import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take, tap, delay, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { AuthService } from '../auth/auth.service';

import { Booking } from './booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private Bookings = new BehaviorSubject<Booking[]>([]);


  get bookings() {
    return this.Bookings.asObservable();
  }

  constructor(
    private authService: AuthService,
    private http: HttpClient
    ) {}

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
    let generatedId: string;
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
    return this.http.post<{name: string}>(
      'https://ionic-angular-mobile-1c42d.firebaseio.com/bookings.json',
      {...newBooking, id: null}
    ).pipe(
      switchMap(resData => {
        generatedId = resData.name;
        return this.bookings;
      }),
      take(1),
      tap(bookings => {
        newBooking.id = generatedId;
        this.Bookings.next(bookings.concat(newBooking));
      })
    );

  }

  cancelBooking(bookingId: string)  {
    return this.Bookings.pipe(take(1), delay(1000), tap(bookings => {
      this.Bookings.next(bookings.filter(b => b.id !== bookingId));
    }));
  }
}

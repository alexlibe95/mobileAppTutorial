import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';

import { Place } from './place.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  today: Date = new Date();
  until: Date = new Date(new Date().setFullYear(new Date().getFullYear() + 1));

  private Places = new BehaviorSubject <Place[]> (
    [
      new Place(
        'p1',
        'Manhattan Mansion',
        'In the heart of NY City.',
        'https://i.picsum.photos/id/1029/500/500.jpg',
        149.99,
        this.today,
        this.until,
        'abc'
      ),
      new Place(
        'p2',
        'New Jerssey Mansion',
        'In the heart of NY City.',
        'https://i.picsum.photos/id/1048/500/500.jpg',
        110.00,
        this.today,
        this.until,
        'abcii'
      ),
      new Place(
        'p3',
        'Bora bora Mansion',
        'In the heart of NY City.',
        'https://i.picsum.photos/id/1075/500/500.jpg',
        89.99,
        this.today,
        this.until,
        'abcc'
      ),
      new Place(
        'p4',
        'Saint George Mansion',
        'In the heart of NY City.',
        'https://i.picsum.photos/id/1076/500/500.jpg',
        120.00,
        this.today,
        this.until,
        'abc'
      ),
      new Place(
        'p5',
        'Palace Mansion',
        'In the heart of NY City.',
        'https://i.picsum.photos/id/164/500/500.jpg',
        145.50,
        this.today,
        this.until,
        'abc'
      ),
      new Place(
        'p6',
        'New Castle Mansion',
        'In the heart of NY City.',
        'https://i.picsum.photos/id/1054/500/500.jpg',
        45.00,
        this.today,
        this.until,
        'abc'
      )
    ]
  );

  get places() {
    return this.Places.asObservable();
  }

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) { }

  getPlace(id: string) {
    return this.Places.pipe(take(1), map(places => {
      return {...places.find(p => p.id === id)};
    }));
  }

  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date) {
    let generatedId: string;
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      'https://i.picsum.photos/id/1054/500/500.jpg',
      price,
      dateFrom,
      dateTo,
      this.authService.UserId
    );
    return this.http
    .post<{name: string}>('https://ionic-angular-mobile-1c42d.firebaseio.com/offered-places.json',
    {
      ...newPlace,
      id: null
    })
    .pipe(
      switchMap(resData => {
        generatedId = resData.name;
        return this.Places;
      }),
      take(1),
      tap(places => {
        newPlace.id = generatedId;
        this.Places.next(places.concat(newPlace));
      })
    );
    // return this.Places.pipe(
    //   take(1),
    //   delay(1000),
    //   tap (places => {
    //     this.Places.next(places.concat(newPlace));
    //   })
    // );
  }

  updatePlace(placeId: string, title: string, description: string) {
    return this.Places.pipe(take(1),
    delay(1000),
    tap(places => {
      const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
      const updatedPlaces = [...places];
      const oldPlace = updatedPlaces[updatedPlaceIndex];
      updatedPlaces[updatedPlaceIndex] = new Place(
        oldPlace.id,
        title,
        description,
        oldPlace.imgUrl,
        oldPlace.price,
        oldPlace.availableFrom,
        oldPlace.availableTo,
        oldPlace.userId
      );
      this.Places.next(updatedPlaces);
    }));
  }

}

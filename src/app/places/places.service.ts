import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, of } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';

import { Place } from './place.model';
import { AuthService } from '../auth/auth.service';
import { PlaceLocation } from './location.model';

interface PlaceData {
  availableFrom: string;
  availableTo: string;
  description: string;
  imgUrl: string;
  price: number;
  title: string;
  userId: string;
  location: PlaceLocation;
}

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  today: Date = new Date();
  until: Date = new Date(new Date().setFullYear(new Date().getFullYear() + 1));

  private Places = new BehaviorSubject<Place[]>([]);

  get places() {
    return this.Places.asObservable();
  }

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) { }

  getPlace(id: string) {
    return this.http
      .get<PlaceData>(
        `https://ionic-angular-mobile-1c42d.firebaseio.com/offered-places/${id}.json`
      ).pipe(
        map(placeData => {
          return new Place(
            id,
            placeData.title,
            placeData.description,
            placeData.imgUrl,
            placeData.price,
            new Date(placeData.availableFrom),
            new Date(placeData.availableTo),
            placeData.userId,
            placeData.location
          );
        })
      );
  }

  fetchPlaces() {
    return this.http
      .get<{ [key: string]: PlaceData }>('https://ionic-angular-mobile-1c42d.firebaseio.com/offered-places.json')
      .pipe(map(resData => {
        const places = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            places.push(
              new Place(
                key,
                resData[key].title,
                resData[key].description,
                resData[key].imgUrl,
                resData[key].price,
                new Date(resData[key].availableFrom),
                new Date(resData[key].availableTo),
                resData[key].userId,
                resData[key].location
              )
            );
          }
        }
        return places;
      }),
        tap(places => {
          this.Places.next(places);
        })
      );
  }

  addPlace(
    title: string,
    description: string,
    price: number,
    dateFrom: Date,
    dateTo: Date,
    location: PlaceLocation
  ) {
    let generatedId: string;
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      'https://i.picsum.photos/id/1054/500/500.jpg',
      price,
      dateFrom,
      dateTo,
      this.authService.UserId,
      location
    );
    return this.http
      .post<{ name: string }>('https://ionic-angular-mobile-1c42d.firebaseio.com/offered-places.json',
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
    let updatedPlaces: Place[];
    return this.Places.pipe(
      take(1),
      switchMap(places => {
        if (!places || places.length === 0) {
          return this.fetchPlaces();
        } else {
          return of(places);
        }
      }),
      switchMap(places => {
        const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
        updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new Place(
          oldPlace.id,
          title,
          description,
          oldPlace.imgUrl,
          oldPlace.price,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userId,
          oldPlace.location
        );
        return this.http
          .put(
            `https://ionic-angular-mobile-1c42d.firebaseio.com/offered-places/${placeId}.json`,
            { ...updatedPlaces[updatedPlaceIndex], id: null }
          );
      }),
      tap(() => {
        this.Places.next(updatedPlaces);
      }));

  }

}

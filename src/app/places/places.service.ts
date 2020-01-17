import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, of } from 'rxjs';
import { take, map, tap, switchMap } from 'rxjs/operators';

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

function base64toBlob(base64Data, contentType) {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = window.atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(sliceSize);

  for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);
    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType});
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
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http
      .get<PlaceData>(
        `https://ionic-angular-mobile-1c42d.firebaseio.com/offered-places/${id}.json?auth=${token}`
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
      })
    );
  }

  fetchPlaces() {
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http
        .get<{ [key: string]: PlaceData }>(`https://ionic-angular-mobile-1c42d.firebaseio.com/offered-places.json?auth=${token}`);
      }
    ),
    map(resData => {
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
        }
      ));
  }

  uploadImage(image: File | string) {
    let imageFile;
    if (typeof image === 'string') {
      try {
        imageFile = base64toBlob(image.replace('data:image/jpeg;base64,', ''), 'image/jpeg');
      } catch (error) {
        console.log(error);
      }
    } else {
      imageFile = image;
    }
    const uploadData = new FormData();
    uploadData.append('image', imageFile);
    return this.authService.token.pipe(take(1), switchMap(token => {
      return this.http.post<{imageUrl: string, imagePath: string}>(
        'https://us-central1-ionic-angular-mobile-1c42d.cloudfunctions.net/storeImage',
        uploadData, {headers: {Authorization: 'Bearer ' + token}}
      );
    }));
  }

  addPlace(
    title: string,
    description: string,
    price: number,
    dateFrom: Date,
    dateTo: Date,
    location: PlaceLocation,
    imageUrl: string
  ) {
    let generatedId: string;
    let newPlace: Place;
    let fetchedUserId: string;
    return this.authService.UserId.pipe(
      take(1),
      switchMap(UserId => {
        fetchedUserId = UserId;
        return this.authService.token;
      }),
      take(1),
      switchMap(token => {
      if (!fetchedUserId) {
        throw new Error('No user found!');
      }
      newPlace = new Place(
        Math.random().toString(),
        title,
        description,
        imageUrl,
        price,
        dateFrom,
        dateTo,
        fetchedUserId,
        location
      );
      return this.http
        .post<{ name: string }>(
          `https://ionic-angular-mobile-1c42d.firebaseio.com/offered-places.json?auth=${token}`,
          {
            ...newPlace,
            id: null
          });
    }), switchMap(resData => {
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
    let fetchedToken: string;
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        fetchedToken = token;
        return this.places;
      }),
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
            `https://ionic-angular-mobile-1c42d.firebaseio.com/offered-places/${placeId}.json?auth=${fetchedToken}`,
            { ...updatedPlaces[updatedPlaceIndex], id: null }
          );
      }),
      tap(() => {
        this.Places.next(updatedPlaces);
      }));

  }

}

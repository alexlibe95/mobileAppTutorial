import { Injectable } from '@angular/core';
import { Place } from './place.model';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places : Place[] = [
    new Place(
      'p1',
      'Manhattan Mansion',
      'In the heart of NY City.',
      'https://i.picsum.photos/id/1029/500/500.jpg',
      149.99
    ),
    new Place(
      'p2',
      'New Jerssey Mansion',
      'In the heart of NY City.',
      'https://i.picsum.photos/id/1048/500/500.jpg',
      110.00
    ),
    new Place(
      'p3',
      'Bora bora Mansion',
      'In the heart of NY City.',
      'https://i.picsum.photos/id/1075/500/500.jpg',
      89.99
    ),
    new Place(
      'p4',
      'Saint George Mansion',
      'In the heart of NY City.',
      'https://i.picsum.photos/id/1076/500/500.jpg',
      120.00
    ),
    new Place(
      'p5',
      'Palace Mansion',
      'In the heart of NY City.',
      'https://i.picsum.photos/id/164/500/500.jpg',
      145.50
    ),
    new Place(
      'p6',
      'New Castle Mansion',
      'In the heart of NY City.',
      'https://i.picsum.photos/id/1054/500/500.jpg',
      45.00
    )
  ];

  get places() {
    return [...this._places];
  }

  getPlace(id: string) {
    return {
      ...this._places.find(p => p.id === id)
    };
  }

  constructor() { }
}

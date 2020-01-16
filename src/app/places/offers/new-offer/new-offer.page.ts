import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

import { PlacesService } from '../../places.service';
import { PlaceLocation } from '../../location.model';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {

  form: FormGroup;

  constructor(
    private placesService: PlacesService,
    private router: Router,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      description: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      price: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)]
      }),
      dateFrom: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      dateTo: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      location: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      image: new FormControl(null, {
        updateOn: 'blur'
      })
    });
  }

  onCreateOffer() {
    if (!this.form.valid || !this.form.get('image').value) {
      return;
    }
    this.loadingCtrl.create({
      message: 'Creating place...'
    }).then(loadingEl => {
      loadingEl.present();
      this.placesService.uploadImage(
        this.form.get('image').value
      )
      .pipe(
        switchMap(uploadRes => {
          return this.placesService.addPlace(
            this.form.value.title,
            this.form.value.description,
            +this.form.value.price,
            new Date (this.form.value.dateFrom),
            new Date (this.form.value.dateTo),
            this.form.value.location,
            uploadRes.imageUrl
          );
        })
      )
      .subscribe(() => {
        loadingEl.dismiss();
        this.form.reset();
        console.log('Successfully created');
        this.router.navigate(['/places/tabs/offers']);
      });
    });
  }

  onLocationPicked(location: PlaceLocation) {
    this.form.patchValue({location});
  }

  onImagePicked(image: string | File) {
    this.form.patchValue({image});
  }
}

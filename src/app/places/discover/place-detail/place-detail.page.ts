import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, ModalController, ActionSheetController, LoadingController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

import { PlacesService } from '../../places.service';
import { Place } from '../../place.model';
import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';
import { BookingService } from '../../../bookings/booking.service';
import { AuthService } from '../../../auth/auth.service';
import { MapModalComponent } from '../../../shared/map-modal/map-modal.component';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  place: Place;
  isBookable = false;
  isLoading = false;
  private placeSub: Subscription;

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private placesService: PlacesService,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private bookingService: BookingService,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/discover');
        return;
      }
      this.isLoading = true;
      let fetchedUserId: string;
      this.authService.UserId.pipe(
        take(1),
        switchMap(UserId => {
        if (!UserId) {
          throw new Error('Found no user!');
        }
        fetchedUserId = UserId;
        return this.placesService.getPlace(paramMap.get('placeId'));
      })).subscribe(place => {
        this.place = place;
        this.isBookable = place.userId !== fetchedUserId;
        this.isLoading = false;
      }, error => {
        this.alertCtrl.create(
          {
            header: 'An error ocurred!',
            message: 'Something went wrong...',
            buttons: [{
              text: 'Okay',
              handler: () => {
                this.alertCtrl.dismiss();
                this.router.navigate(['/places/tabs/discover']);
              }
            }]
          }
        ).then(alertEl => {
          alertEl.present();
        });
      });
    });
  }

  onBookPlace() {
    this.actionSheetCtrl.create({
      header: 'Choose an Action',
      buttons: [
        {
          text: 'Select Date',
          handler: () => {
            this.openBookingModal('select');
          }
        },
        {
          text: 'Random Date',
          handler: () => {
            this.openBookingModal('random');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    }).then( actionSheetEl => {
      actionSheetEl.present();
    });
  }

  openBookingModal( mode: 'select' | 'random' ) {
    console.log(mode);
    this.modalCtrl.create({
      component: CreateBookingComponent,
      componentProps: { selectedPlace: this.place, selectedMode: mode }
    }).then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    }).then( resultData => {
      if (resultData.role === 'confirm') {
        this.loadingCtrl
        .create({ message: 'Booking place...' })
        .then(loadingEl => {
          loadingEl.present();
          this.bookingService.addBooking(
            this.place.id,
            this.place.title,
            this.place.imgUrl,
            resultData.data.bookingData.firstName,
            resultData.data.bookingData.lastName,
            resultData.data.bookingData.guestNumber,
            resultData.data.bookingData.startDate,
            resultData.data.bookingData.endDate,
          ).subscribe(() => {
            loadingEl.dismiss();
          });
        });
      }
    });
  }

  onShowFullMap() {
    this.modalCtrl.create({component: MapModalComponent, componentProps: {
      center: {lat: this.place.location.lat, lng: this.place.location.lng},
      selectable: false,
      closeButtonText: 'Close',
      title: this.place.title,
      zoom: 16
    }})
    .then(modalEl => {
      modalEl.present();
    });
  }

  ngOnDestroy() {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }

}

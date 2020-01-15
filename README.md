# mobileAppTutorial
Ionic 4 - Build iOS, Android & Web Apps with Ionic & Angular (Udemy)

- npm install
- ng build
- npx cap add android
- npx cap add ios

ADD <android:usesCleartextTraffic="true"> -> AndroidManifest.xml

- npx cap open android || ionic capacitor run android -l --address IPv4
- npx cap open ios || ionic capacitor run ios -l --address IPv4

--------------------------------------------------------------------
Create folder src/environmnets/

- environment.prod.ts

  export const environment = {
    production: true,
    googleMapsApiKey: 'API-KEY'
  };

- environment.ts

  export const environment = {
    production: false,
    googleMapsApiKey: 'API-KEY'
  };

----------------------------------------------------------------

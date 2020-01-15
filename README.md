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

-environment.prod.ts

  export const environment = {
    production: true,
    googleMapsApiKey: 'API-KEY'
  };

-environment.ts

  // This file can be replaced during build by using the `fileReplacements` array.
  
  // `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
  
  // The list of file replacements can be found in `angular.json`.

  export const environment = {
    production: false,
    googleMapsApiKey: 'API-KEY'
  };

  
  // For easier debugging in development mode, you can import the following file
  // to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.

  // This import should be commented out in production mode because it will have a negative impact
  // on performance if an error is thrown.
   
  // import 'zone.js/dist/zone-error';  
  // Included with Angular CLI.

----------------------------------------------------------------

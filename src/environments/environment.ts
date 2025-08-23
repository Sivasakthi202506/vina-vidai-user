// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  firebase: {
    apiKey: 'AIzaSyB8SEsMbunAn5PxC5WhLpBZSsAA2AhgV64',
    authDomain: 'myproject-4f301.firebaseapp.com',
    projectId: 'myproject-4f301',
    storageBucket: 'myproject-4f301.appspot.com',
    messagingSenderId: '572265693753',
    appId: '1:572265693753:web:52fc007ce08c77414b43e8'  // ✅ fixed key name and value
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

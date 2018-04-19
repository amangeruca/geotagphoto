import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';

import { AuthManager } from '../providers/auth/auth'; 
import { DataTrans } from '../providers/datatrans/datatrans'
import { AlbumsProv } from '../providers/albums/albums'
import { Util } from '../providers/util/util'

// import { SecStorage } from '../providers/securestorage/securestorage';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  // rootPage:any = TabsPage;
  rootPage:any = LoginPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, auth: AuthManager, datatrans: DataTrans, albumsprov: AlbumsProv, utils: Util) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      /*
      not know hot to use it try later
      */ 
      // secstorage.defineLoginStorage();
      
      statusBar.styleDefault();
      splashScreen.hide();
    });

    auth.authUser.subscribe(jwt => {
      if (jwt) {
        albumsprov.getAlbum().toPromise()
          .then(()=> this.rootPage = TabsPage)
          .catch(()=> utils.showToastAlert("Error getting albums on first login"))
      }
      else{
        albumsprov.resetStoredAlbums()
          .then(()=> this.rootPage = LoginPage)

      }
    });

    auth.checkLogin();
  }
}

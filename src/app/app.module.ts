import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Camera } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { SQLite} from '@ionic-native/sqlite';
import { Toast } from '@ionic-native/toast';
import { File } from '@ionic-native/file';
import { Geolocation } from '@ionic-native/geolocation';
import { FilePath } from '@ionic-native/file-path';

import { Database } from '../providers/database/database'
import { Util } from '../utils/util/util'
import { Geoloc } from '../utils/geoloc/geoloc'

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    HomePage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    HomePage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    ImagePicker,
    SQLite,
    Toast,
    File,
    Geolocation,
    FilePath,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Database,
    Util,
    Geoloc
  ]
})
export class AppModule {}

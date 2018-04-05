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
import { File } from '@ionic-native/file';
import { Geolocation } from '@ionic-native/geolocation';
import { FilePath } from '@ionic-native/file-path';
import { FileTransfer } from '@ionic-native/file-transfer';

import { Database } from '../providers/database/database';
import { Util } from '../utils/util/util';
import { Geoloc } from '../utils/geoloc/geoloc';
import { Ftrans } from '../utils/ftrans/ftrans'

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
    File,
    Geolocation,
    FilePath,
    FileTransfer,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Database,
    Util,
    Geoloc,
    Ftrans
  ]
})
export class AppModule {}

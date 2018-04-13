import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { MyApp } from './app.component';

import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { DetailsPage } from '../pages/details/details';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Camera } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { SQLite} from '@ionic-native/sqlite';
import { File } from '@ionic-native/file';
import { Geolocation } from '@ionic-native/geolocation';
import { FilePath } from '@ionic-native/file-path';
import { FileTransfer } from '@ionic-native/file-transfer';
import { HTTP } from '@ionic-native/http';
import { Dialogs } from '@ionic-native/dialogs';
// import { SecureStorage } from '@ionic-native/secure-storage';

import { Database } from '../providers/database/database';
import { Util } from '../providers/util/util';
import { Geoloc } from '../providers/geoloc/geoloc';
import { DataTrans } from '../providers/datatrans/datatrans';
import { AuthManager } from '../providers/auth/auth';
// import { SecStorage } from '../providers/securestorage/securestorage';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    TabsPage,
    HomePage,
    ListPage,
    DetailsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot() //remove it if we implement secure storage
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    TabsPage,
    HomePage,
    ListPage,
    DetailsPage
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
    HTTP,
    Dialogs,
    // SecureStorage,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Database,
    Util,
    Geoloc,
    AuthManager,
    DataTrans
  ]
})
export class AppModule {}

import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Storage } from '@ionic/storage'; //remove it if we implement secure storage

import { Database } from '../../providers/database/database'
import { Util } from '../../providers/util/util'
import { Geoloc } from '../../providers/geoloc/geoloc'
import { DataTrans } from '../../providers/datatrans/datatrans'
import { AlbumsProv } from '../../providers/albums/albums'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  remBtnDisabled: boolean = true;
  arcBtnDisabled: boolean = true;

  private homeInput: any =  {};
  public albums: any = [];
  public base64Image: string;
  private photo: any;

  constructor(public navCtrl: NavController, public platform: Platform, private camera: Camera, private imagePicker: ImagePicker, 
              private db: Database, private util: Util, private file: File, private geoloc: Geoloc, private filepath: FilePath,
              private datatrans: DataTrans, private diagno: Diagnostic, private storage: Storage, private albumprov: AlbumsProv) {

    //connect db album to the post request
    albumprov.listAlbum.subscribe(
      data=>{
        this.fillAlbum(data);
      }
    );

    //load stored albums
    albumprov.checkAlbums();

  }

  onTakePicture(){
    console.log("on take Picture");
    this.checkGpsAvailability()
    // .then(()=>{
    //   return this.checkCameraAvailability()
    // })
    .then(()=> this.takePicture())
    .catch(e => this.util.showToastAlert(e))
  }
  
  onAddPicture(){
    console.log("on take Picture");
    this.checkGpsAvailability()
      .then(()=> this.addPicture())
      .catch(e => this.util.showToastAlert(e))
  }

  checkCameraAvailability(){
    return this.diagno.isCameraAuthorized()
      .then((authorized)=>{
        if(authorized){
          return Promise.resolve();
        }
        else{
          return this.getCameraAuthorization();
        }
      })
  }

  getCameraAuthorization(){
    return this.diagno.requestCameraAuthorization()
      .then((status) => {
        if (status == this.diagno.permissionStatus.GRANTED){
          return Promise.resolve();
        }
        else {
          return Promise.reject("Application need camera authorization!");
        }
      })
  }

  checkGpsAvailability(){
    return this.diagno.isLocationAuthorized()
    .then((authorized)=>{
      if(authorized){
        return this.diagno.isGpsLocationAvailable();
      }
      else{
        return this.getLocationAuthorization()
      }
    })
    .then((available)=>{
      if(available){
        return Promise.resolve();
      }
      else{
        return Promise.reject("Cannot access GPS. Please enable it!");
      }
    })
  }

  getLocationAuthorization(){
    return this.diagno.requestLocationAuthorization()
      .then((status) => {
        if (status == this.diagno.permissionStatus.GRANTED){
          return this.diagno.isGpsLocationAvailable();
        }
        else {
          return Promise.reject("Impossible to proceed without authorization!");
        }
      })
  }

  takePicture(){
    const options:CameraOptions = {
        quality: 100,
        // destinationType: this.camera.DestinationType.DATA_URL,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        correctOrientation: true
    };

    //loading mask
    this.util.showHideMask();

    //initialize photo
    this.photo = {};

    const promises = [
      this.geoloc.getGeoloc(), 
      this.camera.getPicture(options)
    ];
    
    //excute all promise and wait they end good
    Promise.all(promises)
      .then(promvals => {

        console.log('promise all');

        //get promise then response
        var coords = promvals[0].coords;
        var imgdata = promvals[1];

        //save data to photoobject
        this.photo.coords = coords;
        this.photo.imgdata = imgdata;

        //add photo to form
        // this.base64Image = 'data:image/jpeg;base64,' + imgdata;
        this.base64Image = imgdata;

        //store name and path from imgdata
        this.photo.path = imgdata.substr(0, this.photo.imgdata.lastIndexOf('/') + 1);
        this.photo.name = imgdata.substr(this.photo.imgdata.lastIndexOf('/') + 1);

        //enable bottom and hide mask
        this.setDisablePhotoBtn(false);
        this.util.showHideMask();

      })
      .catch( e => {
        console.log('promise catch')
        this.util.showHideMask();
        let msg = !!e.message ? e.message : e;
        this.util.showToastAlert("Error adding photo: " + msg);
      
      })
  }

  addPicture(){
    const options:ImagePickerOptions = {
      maximumImagesCount: 1
    };

    const promises = [
      this.geoloc.getGeoloc(), 
      this.imagePicker.getPictures(options)
    ]
    
    //loading mask
    this.util.showHideMask();

    //initialize photo
    this.photo = {};

    //excute all promise and wait they end good
    Promise.all(promises)
      .then(promvals => {
        //get promise then response
        var coords = promvals[0].coords;
        var imgdata = promvals[1][0]

        //save data to photoobject
        this.photo.coords = coords;
        this.photo.imgdata = imgdata;

        //add photo to form
        // this.base64Image = 'data:image/jpeg;base64,' + imgdata;
        this.base64Image = imgdata;

        //new promise to define filepath
        return this.filepath.resolveNativePath(imgdata);
      })
      .then(filePath => {
        this.setPhotoFilePath(filePath);
        this.setDisablePhotoBtn(false);
        this.util.showHideMask();

      })
      .catch( e => {
          this.util.showHideMask();
          this.util.showToastAlert("Error getting photo from gallery: " + e.message);
      })

  }

  removePicture(){
    this.base64Image = null;
    this.photo = null;
    this.homeInput =  {};
    this.setDisablePhotoBtn(true);

  }

  archivePicture(){
    this.fillPhotoObject()
    .then((photo)=>{
      this.addPhotoToStore(photo);
    })
    .catch((e)=>{
      this.util.showToastAlert("Error when archive picture" + e.exception);
    })

  }
  
  syncPicture(){
      var upload_list = [],
      id_uploaded_list = [];

      //search for record not stored remotly
      this.db.getTagPhotoNotStored()
      .then(res=>{
        console.log("then 1 sync picture");
        this.util.showHideMask();

        let rows = res.rows;
        if (rows.length > 0) {

          //for every row do the upload by adding then to an array of promise 
          for(let i = 0; i < rows.length; i++){
            var item = rows.item(i),
            item_id = item.id;

            upload_list.push(this.datatrans.upload(item));
            id_uploaded_list.push(item_id);
          }
          return Promise.all(upload_list);

        }
      }, (e)=>{
          console.log("error get not stored: " + e);
          throw e;
          
      }).
      then(()=>{
        console.log("then 2 sync picture");
        let ids = id_uploaded_list.join();
        return this.db.setTagPhotoAsStored(ids);
        
      }, (e)=>{
        console.log("error uploading photos: " + e.exception);
        throw e;
      
      }).
      then(success => {
        this.util.showHideMask();
        this.util.showToast("Photo remotly synchronized");

      })
      .catch((e)=>{
        this.util.showHideMask();
        this.util.showToastAlert("Error sync remote store: " + e.exception);

      })

  }

/////////
  fillPhotoObject(){
    return this.storage.get('jwt')
      .then((data)=>{
          if(data){
              let id_user = data.id_user;
              return Promise.resolve(id_user);
          }
          else{
              return Promise.reject("Can not get id_user");
          }
        })
      .then((id_user)=>{
        let dt_txt = this.util.getDateTime(),
          imgname = id_user + "_" + dt_txt + ".jpg",
          appsrc = this.file.dataDirectory + imgname,
          photo = {
            path: this.photo.path,
            name: this.photo.name,
            imgdata: this.photo.imgdata,
            imgname: imgname,
            appsrc: appsrc,
            id_user: id_user,
            id_album:!!this.homeInput.album ? this.homeInput.album : 0,
            note: this.homeInput.note,
            datapick: this.util.getDate(),
            coords: this.photo.coords,
            isstored: 0
          };

        return Promise.resolve(photo);

      })
  }

  //create the photo name by the userid e datatime. so il will be unique
  getTagPhotoId(): string{
    let usr: string = '1',
    dt_txt = this.util.getDateTime();
    return usr + "_" + dt_txt;

  }

  //copy the file into an app directory and store information in db
  addPhotoToStore(photo){
    console.log(photo);
    var rowid: number = null;
    this.util.showHideMask();
    this.file.copyFile(photo.path, photo.name, this.file.dataDirectory, photo.imgname)
    .then(success =>{
        return this.db.addTagPhoto(photo);

    })
    .then(success =>{
        console.log("addTagPhoto Success: " + success)
        rowid = success.insertId;
        this.util.showToast("Photo localy stored");
        this.removePicture();
        return this.datatrans.upload(photo);

    })
    .then(success=>{
        this.util.showHideMask();
        this.util.showToast("Photo remote stored");
        this.db.setTagPhotoAsStored(rowid);

    }, failure=>{
        console.log(failure);
        this.util.showHideMask();
        this.util.showToastWarm("Impossible to storephoto remotly: " + failure.message);

    })
    .then(success=>{
        console.log("set remotly stored");

    })
    .catch((e)=>{
        this.util.showHideMask();
        this.util.showToastAlert("Error storing photo locally: " + e.message);

    })
  }

  //eneble disable btn on toolbar
  setDisablePhotoBtn(value: boolean){
    this.remBtnDisabled = value;
    this.arcBtnDisabled = value;

  }

  //get the path and the name of the photo
  setPhotoFilePath(filePath){
    if (this.platform.is('android')){
      this.photo.path = filePath.substr(0, filePath.lastIndexOf('/') + 1)
      this.photo.name = this.photo.imgdata.substring(this.photo.imgdata.lastIndexOf('/') + 1, this.photo.imgdata.length);
    }else{
      this.photo.path = this.photo.imgdata.substr(0, this.photo.imgdata.lastIndexOf('/') + 1);
      this.photo.name = this.photo.imgdata.substr(this.photo.imgdata.lastIndexOf('/') + 1);
    }
  }

  //read the remote json and fill the album array
  fillAlbum(data){
    this.albums = data;
  }
}

import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';

import { Database } from '../../providers/database/database'
import { Util } from '../../utils/util/util'
import { Geoloc } from '../../utils/geoloc/geoloc'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  remBtnDisabled: boolean = true;
  arcBtnDisabled: boolean = true;
  syncBtnDisabled: boolean = true;

  private base64Image: string;
  private photo: any;
  private photoFilePath: any;

  constructor(public navCtrl: NavController, public platform: Platform, private camera: Camera, private imagePicker: ImagePicker, 
              private db: Database, private util: Util, private file: File, private geoloc: Geoloc, private filepath: FilePath) {

  }

  takePicture(){
    const options:CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
    };

    //initialize photo
    this.photo = {}

    //retrive coordinate from gps
    let coord =  this.getPosition()
    if (coord) {
      this.photo.coord = coord;
    }else{
      this.util.showToast("It is not possible to get position. Try again");
      return
    }

    this.camera.getPicture(options)
      .then((ImageData) => {
          this.base64Image = 'data:image/jpeg;base64,' + ImageData;
          this.setPhotoFilePath(ImageData);
          this.setDisablePhotoBtn(false);
        },
        (err) => {
          console.log(err);
        });
  }

  addPicture(){
    const options:ImagePickerOptions = {
      maximumImagesCount: 1
    };

    this.imagePicker.getPictures(options)
      .then((results) => {
          if(results.length>0) {
            this.base64Image = 'data:image/jpeg;base64,' + results[0]
          }else{
            console.log("errore on imagePicker");
        }}, 
        (err) => {
          console.log(err);
        }
    );

  }

  remPicture(){
    this.base64Image = null;
    this.photo = null;
    this.setDisablePhotoBtn(true);

  }

  archivePicture(){
    this.fillPhotoObject();
    this.addPhotoToStore();
    //try to upload//////
    this.remPicture();

  }
  
  syncPicture(){}

/////////

  fillPhotoObject(){
    let dt_txt = this.util.getDateTime(),
    id_user = 1,
    id = id_user + "_" + dt_txt,
    appsrc = this.file.dataDirectory + id + '.jpg';

    this.photo.id = dt_txt;
    this.photo.id_user = id_user;
    this.photo.appsrc = appsrc;
    this.photo.id_album = 1;
    this.photo.note = "note";
    this.photo.datapick = this.util.getDate();
    this.photo.isstored = false;

  }

  getPosition(): any{
    let resp = this.geoloc.getGeoloc(),
    coord = resp.coord;
    return coord;

  }

  //create the photo name by the userid e datatime. so il will be unique
  getTagPhotoId(): string{
    let usr: string = '1',
    dt_txt = this.util.getDateTime();
    return usr + "_" + dt_txt;

  }

  //copy the file into an app directory and store information in db
  addPhotoToStore(){
    let store_fname = this.photo.id + '.jpg';
    this.file.copyFile(this.photoFilePath.path, this.photoFilePath.name, this.file.dataDirectory, store_fname)
      .then(success =>{
        this.db.addTagPhoto(this.photo);
      })
      .catch(e=>console.log(e))

  }

  //eneble disable btn on toolbar
  setDisablePhotoBtn(value: boolean){
    this.remBtnDisabled = value;
    this.syncBtnDisabled = value;
    this.arcBtnDisabled = value;

  }

  //get the path and the name of the photo
  setPhotoFilePath(imagePath: string){
    this.filepath.resolveNativePath(imagePath)
      .then(filePath => {
        if (this.platform.is('android')){
          this.photoFilePath.path = filePath.substr(0, filePath.lastIndexOf('/') + 1)
          this.photoFilePath.name = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
        }else{
          this.photoFilePath.path = imagePath.substr(imagePath.lastIndexOf('/') + 1);
          this.photoFilePath.name = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        };
      }, (e)=>{
          console.log("Error while getting currents path")
      })

  }
}

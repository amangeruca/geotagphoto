import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';

import { Database } from '../../providers/database/database'
import { Util } from '../../utils/util/util'
import { Geoloc } from '../../utils/geoloc/geoloc'
import { Ftrans } from '../../utils/ftrans/ftrans'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  remBtnDisabled: boolean = true;
  arcBtnDisabled: boolean = true;

  public base64Image: string;
  private photo: any;
  private loadingMask: any;

  constructor(public navCtrl: NavController, public platform: Platform, private camera: Camera, private imagePicker: ImagePicker, 
              private db: Database, private util: Util, private file: File, private geoloc: Geoloc, private filepath: FilePath,
              private ftrans: Ftrans) {

  }

  takePicture(){
    const options:CameraOptions = {
        quality: 100,
        // destinationType: this.camera.DestinationType.DATA_URL,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
    };

    //loading mask
    this.showHideMask();

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
        this.showHideMask();

      })
      .catch( e => {
        console.log('promise catch')
        this.showHideMask();
        this.util.showToast("Error adding photo: " + e.message);
      
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
    this.showHideMask();

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
        this.showHideMask();

      })
      .catch( e => {
          this.showHideMask();
          this.util.showToast("Error getting photo from gallery: " + e);
      })

  }

  removePicture(){
    this.base64Image = null;
    this.photo = null;
    this.setDisablePhotoBtn(true);

  }

  archivePicture(){
    this.fillPhotoObject();
    this.addPhotoToStore();

  }
  
  syncPicture(){
      this.db.getTagPhotoNotStored()
      .then(res=>{
          let rows = res.rows;
          if (rows.length > 0) {
            this.doSyncPicture(rows);
          }
      })
  }

/////////

  fillPhotoObject(){
    let dt_txt = this.util.getDateTime(),
    id_user = 1,
    imgname = id_user + "_" + dt_txt + ".jpg",
    appsrc = this.file.dataDirectory + imgname;

    this.photo.id_user = id_user;
    this.photo.imgname = imgname;
    this.photo.appsrc = appsrc;
    this.photo.id_album = 1;
    this.photo.note = "note";
    this.photo.datapick = this.util.getDate();
    this.photo.isstored = 0;

  }

  //create the photo name by the userid e datatime. so il will be unique
  getTagPhotoId(): string{
    let usr: string = '1',
    dt_txt = this.util.getDateTime();
    return usr + "_" + dt_txt;

  }

  //copy the file into an app directory and store information in db
  addPhotoToStore(){
    console.log(this.photo);
    var rowid: number = null;
    this.showHideMask();
    this.file.copyFile(this.photo.path, this.photo.name, this.file.dataDirectory, this.photo.imgname)
    .then(success =>{
        return this.db.addTagPhoto(this.photo);

    })
    .then(success =>{
        console.log("addTagPhoto Success: " + success)
        rowid = success.insertId;
        let photo = this.photo;
        this.util.showToast("Photo localy stored");
        this.removePicture();
        return this.ftrans.upload(photo);

    })
    .then(success=>{
        this.showHideMask();
        this.util.showToast("Photo remote stored");
        this.db.setTagPhotoAsStored(rowid);

    }, failure=>{
        console.log(failure);
        this.showHideMask();
        this.util.showToast("Error storing photo remotly: " + failure.exception);

    })
    .then(success=>{
        console.log("set remotly stored");

    })
    .catch((e)=>{
        this.showHideMask();
        this.util.showToast("Error storing photo locally: " + e.message);

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

  showHideMask(){
    if(!!this.loadingMask){
      this.loadingMask.dismiss();
      this.loadingMask = null;
    }else{
      this.loadingMask = this.util.showLoadingCtrl();
    }

  }

  doSyncPicture(rows){
    this.showHideMask();
    var first_promise_list = [];
    var id_list = []
    for(let i = 0; i < rows.length; i++){
      let item = rows.item(i);
      id_list.push(item.id);
      first_promise_list.push(this.ftrans.upload(rows.item(i)));
 
    }

    Promise.all(first_promise_list)
    .then(success => {
      var last_promise_list = []
      for(let j = 0; j < id_list.length; j++){
        last_promise_list.push(this.db.setTagPhotoAsStored(id_list[j]));
      }
      return Promise.all(last_promise_list);

    }, (e) => {
      this.showHideMask();
      this.util.showToast("Error sync photo remotly: " + e.message);

    })
    .then(success => {
      this.showHideMask();
      this.util.showToast("Photo remotly synchronized");

    })
    .catch((e)=>{
      this.showHideMask();
      this.util.showToast("Error storing photo locally: " + e.message);

    })

  }
}

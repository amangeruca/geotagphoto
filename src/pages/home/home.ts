import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  remBtnDisabled: boolean = true;
  syncBtnDisabled: boolean = true;

  public base64Image: string;

  constructor(public navCtrl: NavController, private camera: Camera,
              private imagePicker: ImagePicker) {

  }

  takePicture(){
    const options:CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then((ImageData) => {
        this.base64Image = 'data:image/jpeg;base64,' + ImageData;
    }, (err) => {
        console.log(err);
    });
  }

  addPicture(){
    const options:ImagePickerOptions = {
      maximumImagesCount: 1
    };

    this.imagePicker.getPictures(options).then((results) => {
      if(results.length>0) {
        this.base64Image = 'data:image/jpeg;base64,' + results[0]
      }else{
        console.log("errore on imagePicker");
      }}, (err) => {
      console.log(err);
      }
    );
  }

  remPicture(){}

  syncPicture(){}
}

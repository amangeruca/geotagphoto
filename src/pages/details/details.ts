import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import L from "leaflet";

@Component({
  selector: 'page-details',
  templateUrl: 'details.html'
})
export class DetailsPage {
  private photo: any = {};
  private map: L.Map;
  private center: L.PointTuple;
  private photoLayer: L.Marker;

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

/*
  PAGE EVENT
*/
  // uns when the page has loaded. This event only happens once per page being created.
  ionViewDidLoad() {
    console.log('ionViewDidLoad MapPage');
    this.photo = this.navParams.data;
    // this.center = [28.644800, 77.216721];
    this.createLeafletMap();

  }

  //Runs when the page has fully entered and is now the active page.
  ionViewDidEnter(){
    let data = this.navParams.data;
    this.center = [data.x, data.y];
    this.updateLeafletMap();

  }
/*----*/

  createLeafletMap(){
    this.map = L.map('map', {
      zoom: 16
    });

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  }

  updateLeafletMap(){
    if(!!this.photoLayer && !!this.map){
      this.photoLayer.removeFrom(this.map)
    }
    this.photoLayer = new L.Marker(this.center);
    this.map.addLayer(this.photoLayer);
    this.map.panTo(this.center);

  }

}

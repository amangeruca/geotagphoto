import { Injectable } from '@angular/core';
import { Geolocation, GeolocationOptions } from '@ionic-native/geolocation';
 
@Injectable()
export class Geoloc {
    
    options: GeolocationOptions;

    constructor(private geolocation: Geolocation) {
        this.options = {
            timeout: 60000,
            enableHighAccuracy: true
        }
    }

    getGeoloc(): any{
        this.geolocation.getCurrentPosition(this.options)
            .then((resp)=>{
                return resp;
            })
            .catch((e)=>{
                console.log("error on geolocation", e)
            })
    }

}
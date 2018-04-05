import { Injectable } from '@angular/core';
import { Geolocation, GeolocationOptions } from '@ionic-native/geolocation';
 
@Injectable()
export class Geoloc {
    
    options: GeolocationOptions;

    constructor(private geolocation: Geolocation) {
        this.options = {
            timeout: 20000,
            enableHighAccuracy: true
        }
    }

    getGeoloc(): any{
        return this.geolocation.getCurrentPosition(this.options)

    }

}
import { Injectable } from '@angular/core';
import { Toast } from '@ionic-native/toast';
 
@Injectable()
export class Util {

    constructor(public toastCtrl: Toast) {
    }

    public showToast(txt){
        this.toastCtrl.show(txt, '5000', 'center');
    }

    public getDate(): string{
        let d = new Date(),
        dt = [this.padNumber(d.getFullYear(), 4), this.padNumber(d.getMonth()+1, 2), this.padNumber(d.getDate(), 2)],
        dt_txt = dt.join('/');
        return dt_txt
    }

    public getDateTime(): string{
        let d = new Date(),
        dt = [this.padNumber(d.getFullYear(), 4), this.padNumber(d.getMonth()+1, 2), this.padNumber(d.getDate(), 2),
            this.padNumber(d.getUTCHours(),2), this.padNumber(d.getUTCMinutes(), 2), this.padNumber(d.getUTCSeconds(), 2)],
        dt_txt = dt.join('');
        return dt_txt;
    }

    private padNumber(num: number , size: number ): string{
        let s: string = num + "";
        while (s.length < size) s = "0" + s;
        return s; 
    }

}
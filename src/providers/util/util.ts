import { Injectable } from '@angular/core';
import { ToastController, LoadingController } from 'ionic-angular';
import { Dialogs } from '@ionic-native/dialogs';
 
@Injectable()
export class Util {
    private loadingMask: any;

    constructor(public toast: ToastController, public loadingCtrl: LoadingController, public dialog: Dialogs) {
    }

    private createToast(txt): any{
        let toast = this.toast.create({
            message: txt,
            position: 'bottom',
            duration: 3000
        });
        return toast;
    }

    public showToast(txt): void{
        let toast = this.createToast(txt);
        toast.present();
    }

    private createLoadingCtrl(): any{
        let loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        return loading;
    }

    public showLoadingCtrl(): any{
        let loading = this.createLoadingCtrl();
        loading.present();
        return loading;
    }

    public getDate(): string{
        let d = new Date(),
        dt = [this.padNumber(d.getFullYear(), 4), this.padNumber(d.getMonth()+1, 2), this.padNumber(d.getDate(), 2)],
        dt_txt = dt.join('/');
        return dt_txt;
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

    public showConfirm(msg: string, title: string): any{
        return this.dialog.confirm(msg, title);

    }

    public showHideMask(){
        if(!!this.loadingMask){
          this.loadingMask.dismiss();
          this.loadingMask = null;
        }else{
          this.loadingMask = this.showLoadingCtrl();
        }
    
    }
    

}
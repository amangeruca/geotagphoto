import { Injectable } from '@angular/core';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { HTTP } from '@ionic-native/http';
// import { SecStorage } from '../securestorage/securestorage';
import { Storage } from '@ionic/storage'; //remove it if we implement secure storage
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/switchMap';

@Injectable()
export class DataTrans {
    private ftransObj: FileTransferObject;
    private url: string = "http://192.168.1.202:8080/g7-web/";
    private api: any = {
        upload_data: 'AppPhoto_submit',
        login_submit: 'AppPhoto_login'
    };
    
    constructor(private transfer: FileTransfer, public storage: Storage, private http: HTTP) {
        this.ftransObj = this.transfer.create();
    }

    upload(photo): any{
        let fpath = photo.appsrc
        let options: FileUploadOptions = {
            fileName: photo.imgname,
            params: photo,
            mimeType: 'multipart/form-data',
            chunkedMode: true    
        };
        return this.ftransObj.upload(fpath, this.url + this.api.upload_data, options);

    }

    defineHeaders(){
        // let headers = new Headers({
        //     'Accept': 'application/json',
        //     'Content-Type': 'application/json; charset=utf-8'
        // });

        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=utf-8'      
        }

        return this.storage.get('jwt')
        .then((data)=>{
            if(data){
                headers["id_user"] = data.id_user;
                headers["token"] = data.token;
            }
            return headers

        })
    }
    
    postLogin(data): Observable<any> {
        return this.post(this.url + this.api.login_submit, data);
    }  

    post(url, data): Observable<any> {
        return Observable
        .fromPromise(this.defineHeaders())
        .switchMap((headers) => 
            this.http.post(url, data, headers)
        );
    }  

    
}
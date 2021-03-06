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
    private url: string = "http://192.168.1.203:8080/g7-web/";
    private api: any = {
        upload_data: 'AppPhoto_submit',
        login_submit: 'AppPhoto_login',
        get_album: 'AppPhoto_getAlbum',
    };
    
    constructor(private transfer: FileTransfer, public storage: Storage, private http: HTTP) {
        this.ftransObj = this.transfer.create();
    }

    upload(photo): any{
        let headers = {}
        return this.defineHeaders(headers)
            .then((headers)=>{
                let fpath = photo.appsrc,
                    options: FileUploadOptions = {
                        fileName: photo.imgname,
                        params: photo,
                        mimeType: 'multipart/form-data',
                        // chunkedMode: true,
                        chunkedMode: false,
                        headers: headers    
                    };
                return this.ftransObj.upload(fpath, this.url + this.api.upload_data, options);
            })
    }

    defineHeaders(headers){
        return this.storage.get('jwt')
        .then((data)=>{
            if(data){
                headers["id_user"] = (data.id_user).toString();;
                headers["token"] = data.token;
            }
            return headers;
        })
    }
    
    postLogin(data): Observable<any> {
        return this.post(this.url + this.api.login_submit, data);
    }  

    postGetAlbum(): Observable<any>{
        return this.post(this.url + this.api.get_album, {})
            // .subscribe(response=>{
            //     this.albums.next(response.data);
            // })
    }

    post(url, data): Observable<any> {
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=utf-8'      
        };
        return Observable
        .fromPromise(this.defineHeaders(headers))
        .switchMap((headers) => 
            this.http.post(url, data, headers)
        );
    }  

    
}
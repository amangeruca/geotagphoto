import { Injectable } from '@angular/core';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';

@Injectable()
export class Ftrans {
    private ftransObj: FileTransferObject;
    private url: string = "http://192.168.1.202:8080/g7-web/";
    private api: any = {
        upload_data: 'AppPhoto_submit'
    };
    
    constructor(private transfer: FileTransfer) {
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

}
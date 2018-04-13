import { Injectable } from '@angular/core';
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage';
 
@Injectable()
export class SecStorage {
    private loginStorage: SecureStorageObject;

    constructor(private secureStorage: SecureStorage) { }

    defineLoginStorage(){
        this.secureStorage.create('login-info')
        .then((storage: SecureStorageObject)=>{
            this.loginStorage = storage;
            console.log(storage);
        }, (e)=>{
            console.log("error creating storage: " + e.exception);
        })
    }

    getLoginInfo(): any{
        this.loginStorage.get('jwt')
        .then(
            data => {
                console.log("get login info ", data)
                return data;
            },
            e => {
                console.log("error getting loginInfo: " + e.exception);
            }
        );
    }

    setLoginInfo(jwt): void{
        this.loginStorage.set('jwt', jwt)
        .catch(e=>{
            console.log("error setting loginInfo: " + e.exception);
        })
    }
    
}
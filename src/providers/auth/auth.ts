import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import {tap} from 'rxjs/operators/tap';
import { DataTrans } from '../datatrans/datatrans'
import { Storage } from '@ionic/storage'; //remove it if we implement secure storage
// import { SecStorage } from '../securestorage/securestorage';

@Injectable()
export class AuthManager {

    authUser = new ReplaySubject<any>(1);

    constructor(private datatrans: DataTrans, private store: Storage) {}

    login(data): Observable<any> {
        return this.datatrans.postLogin(data)
            //pipe chain the functional operator togheter
            .pipe(
            //tap perform a side effect for every emmision but return oservable identifcal to source
                tap(jwt=>{
                    this.storeJwtResponse(jwt);
                })
            )
    }

    logout(){
        console.log("logout on authmanager")
        this.removeJwt()
            .then(()=> this.authUser.next(null))
    }

    checkLogin(){
        this.getJwt()
            .then(
                jwt => {
                    if (jwt){
                        this.authUser.next(jwt);
                    }
                }
            ),
                (err)=>{
                    this.removeJwt()
                        .then(()=>{
                            this.authUser.next(null);
                        })
                } 
    }

    private storeJwtResponse(jwt: any){
        return this.storeJwt(jwt)
            .then(() => this.authUser.next(jwt))
            .then(() => jwt)
    }

    getJwt(){
        return this.store.get('jwt');

    }

    storeJwt(jwt){
        var data = JSON.parse(jwt.data);
        return this.store.set('jwt', data.value);

    }

    removeJwt(){
        return this.store.remove('jwt')
    }
}
import { ModelAlbum } from '../../models/albums';
import { Injectable } from '@angular/core';
import { DataTrans} from '../datatrans/datatrans'
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { tap } from 'rxjs/operators/tap';
import { Storage } from '@ionic/storage';

@Injectable()
export class AlbumsProv {
    listAlbum = new ReplaySubject<ModelAlbum[]>(1);

    constructor(private datatrans: DataTrans, private store: Storage){}

    getAlbum(): Observable<ModelAlbum[]> {
        return this.datatrans.postGetAlbum()
            .pipe(
                tap(rsp=>{ 
                    this.storeAlbumResponse(JSON.parse(rsp.data).albums);
                })
            )
    }

    checkAlbums(){
        this.getStoredAlbums()
            .then((albums)=> this.listAlbum.next(albums))
    }

    private storeAlbumResponse(albums: ModelAlbum[]){
        return this.storeAlbums(albums)
            .then(() => this.listAlbum.next(albums))
    }

    getStoredAlbums(){
        return this.store.get('albums');

    }

    storeAlbums(albums){
        return this.store.set('albums', albums);

    }

    resetStoredAlbums(){
        return this.store.remove('albums');
    }


}
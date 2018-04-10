import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, List } from 'ionic-angular';
import { Database } from '../../providers/database/database'
import { Util } from '../../utils/util/util'
import { DetailsPage } from '../details/details';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})

export class ListPage {
  @ViewChild(List) list: List;
  public photos: any = [];
  
  constructor(public navCtrl: NavController,  public navParams: NavParams, public db: Database, public util: Util) {}

/*
  PAGE EVENT
*/

  //Runs when the page is about to enter and become the active page.
  ionViewWillEnter(){
    this.updateList();

  }

/*----*/

  updateList(){
    this.photos = [];
    this.db.getTagPhotos()
    .then(res =>{
        let rows = res.rows;
        for (let i = 0; i < rows.length; i++) {
          this.photos.push(rows.item(i));
        }

    })
    .catch(e=>{
        console.log("error on get tag photos");
        this.util.showToast("Error getting photos list: " + e.exception);
        
      })
      
    }
    
  deleteListItem(pid){
    console.log("Delete list item: " + pid);
    this.util.showConfirm("Eliminare la foto selezionata", "Conferma")
    .then(res => {
      if (res == 1 && pid > -1){
        console.log("remove photo from list");
        let photo = this.photos[pid],
        photo_id = photo.id;
        this.photos.splice(pid,1);
        return this.db.remTagPhoto(photo_id);
      }
      this.list.closeSlidingItems();
        
    })
    .then((res)=>{
      if(!!res){
        this.util.showToast("Item removed!");
      }

    })
    .catch(e=>{
      console.log("error removing photo from list: " + e);
      this.list.closeSlidingItems();

    })
  }

  viewPositionItem(pid){
      console.log("View position item: " + pid);
      let photo = this.photos[pid];
      this.navCtrl.push(DetailsPage, photo);

  }

}

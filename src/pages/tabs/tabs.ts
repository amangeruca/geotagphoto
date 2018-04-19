import { Component } from '@angular/core';
import { MenuController } from 'ionic-angular';

import { ListPage } from '../list/list';
import { HomePage } from '../home/home';
import { AuthManager } from '../../providers/auth/auth';
import { Util } from '../../providers/util/util';
import { AlbumsProv } from '../../providers/albums/albums';

@Component({
  templateUrl: 'tabs.html'
})

export class TabsPage {

  tab1Root = HomePage;
  tab2Root = ListPage;

  constructor(private auth: AuthManager, public util: Util, public albumsprov: AlbumsProv, public menu: MenuController) {}

  logOut(){
    console.log("logout");
    this.util.showConfirm("Uscire dall'applicazione?", "Conferma")
    .then(res => {
      if (res == 1){
        this.auth.logout();
      }
    })
  }

  showSettings(){
    console.log("settings");
    this.menu.toggle();
  }

  onClickInfo(){
    console.log("Open Info!")
    this.menu.toggle()
  }

  onClickUpdateAlbums(){
    this.menu.toggle()
    this.updateAlbums()
  }

  updateAlbums(){
    this.util.showHideMask();
    this.albumsprov.getAlbum().toPromise()
    .then(()=>{
        this.util.showHideMask(); 
        this.util.showToast("Albums updated!")

      })
      .catch(e=>{
        this.util.showHideMask(); 
        this.util.showToastAlert("Error updating albums")
        
      })
  }
}

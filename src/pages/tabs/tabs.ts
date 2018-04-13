import { Component } from '@angular/core';

import { ListPage } from '../list/list';
import { HomePage } from '../home/home';
import { AuthManager } from '../../providers/auth/auth'
import { Util } from '../../providers/util/util'


@Component({
  templateUrl: 'tabs.html'
})

export class TabsPage {

  tab1Root = HomePage;
  tab2Root = ListPage;

  constructor(private auth: AuthManager, public util: Util) {}

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
  }
}

import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Util } from '../../providers/util/util'
import { AuthManager } from '../../providers/auth/auth'
import { finalize } from 'rxjs/operators/finalize';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loginInput: any = {};
  private loadingMask: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public util: Util, private auth: AuthManager) {
  }

  login(){
    console.log("login from login");

    //present mask
    this.util.showHideMask();

    this.auth.login(this.loginInput)
      .pipe(finalize(() => {
            console.log("apre login")
            this.util.showHideMask();
          }))
      .subscribe(
        ()=>{
          console.log("done login from login")
        },
        error=>{
          console.log("Error login from login", error)
          this.handleError(error);
        }
      )
  }

  handleError(error: any){
    let msg: string;
    if (error.status && error.status === 401){
      msg = 'Login Failed. Check user name and password';
    }
    else{
      msg = 'Unexpected error: ${error.statusText}'
    }

    this.util.showToast(msg);
  }

}

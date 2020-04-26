import { Component } from '@angular/core';

import { Platform } from "@ionic/angular"
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Subscription } from 'rxjs';
import { ToastService } from 'ng-zorro-antd-mobile';
import { JPush } from 'plugins/jpush-phonegap-plugin/ionic/jpush/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  backButtonPressed: boolean = false; //用于判断返回键是否触发
  customBackActionSubscription: Subscription;
  backClicked: any;
  constructor(
    public platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private toast: ToastService,
    private jPush: JPush

  ) {
    platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.initializeApp();
    });
  }

  initializeApp() {
    this.jPush.init();
    this.jPush.setDebugMode(true);
  }
}

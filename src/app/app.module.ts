import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { IonicModule, IonicRouteStrategy, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgZorroAntdMobileModule, ToastService } from 'ng-zorro-antd-mobile';
import { TabsComponent } from './tabs/tabs.component';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { ForgetComponent } from "./components/forget/forget.component";
import { TabMyComponent } from "./components/tabContent/tab-my/tab-my.component";
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { MypetsComponent } from "./components/tabContent/tab-my/mypets/mypets.component";
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { Camera } from "@ionic-native/camera/ngx";
import { ImagePicker } from "@ionic-native/image-picker/ngx";
import { Base64 } from "@ionic-native/base64/ngx";
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { MyinfoComponent } from "./components/tabContent/tab-my/myinfo/myinfo.component";
import { ChangePwdComponent } from "./components/tabContent/tab-my/change-pwd/change-pwd.component";
import { TabFeedComponent } from "./components/tabContent/tab-feed/tab-feed.component";
import { PetserviceService } from "./services/petservice/petservice.service";
import { JPushService } from "./services/JPush/jpush.service";
import { PetSelectModalComponent } from "./components/tabContent/tab-feed/pet-select-modal/pet-select-modal.component";
import { NzButtonModule } from 'ng-zorro-antd/button';
import { TabVedioComponent } from "./components/tabContent/tab-vedio/tab-vedio.component";
import { EquipmentComponent } from "./components/tabContent/tab-my/equipment/equipment.component";
import { UserService } from "./services/User/user.service";
import { FoodService } from "./services/food/food.service";
registerLocaleData(zh);

@NgModule({
  declarations: [TabVedioComponent,EquipmentComponent
    ,PetSelectModalComponent,TabFeedComponent,ChangePwdComponent,MyinfoComponent, AppComponent, TabsComponent, LoginComponent, RegisterComponent, ForgetComponent, TabMyComponent, MypetsComponent],
  entryComponents: [PetSelectModalComponent],
  imports: [NzButtonModule
    ,NzCheckboxModule, NzAvatarModule, NzDrawerModule, RouterModule, NzInputModule, ReactiveFormsModule, NzFormModule, BrowserModule, IonicModule.forRoot(), AppRoutingModule, BrowserAnimationsModule, FormsModule, HttpClientModule, NgZorroAntdMobileModule, NgZorroAntdModule],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: NZ_I18N, useValue: zh_CN },
    Camera,
    ImagePicker,
    Base64,
    PetserviceService,
    JPushService,
    UserService,
    FoodService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  lastTime: number = 0;
  exitTime: number = 2000;
  constructor(
    private platform: Platform,
    private router: Router,
    private toast: ToastService) {
    // this.backButtonEvent();
  }
  // backButtonEvent() {
  //   this.platform.backButton.subscribe(() => {
  //     if (this.router.url.indexOf('login') > -1) {
  //       if (new Date().getTime() - this.lastTime < this.exitTime) {
  //         navigator['app'].exitApp();
  //       } else {
  //         this.toast.info('Toast position top', 1000, null, false, 'bottom');
  //         this.lastTime=new Date().getTime();
  //       }
  //     }
  //   })
  // }

}

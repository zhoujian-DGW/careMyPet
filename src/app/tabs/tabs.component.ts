import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Platform, ToastController } from '@ionic/angular';
import { ToastService } from 'ng-zorro-antd-mobile';
import { async } from '@angular/core/testing';

@Component({
  selector: 'tabs',
  templateUrl: './tabs.component.html'
})
export class TabsComponent implements OnInit {
  @ViewChild('tab_my', { static: false }) tab_my;



  hidden: boolean = false;
  fullScreen: boolean = false;
  topFlag: boolean = false;
  tintColor: string = '#108ee9';
  unselectedTintColor: string = '#888';
  tabbarStyle: object = { height: '400px' };
  selectedIndex: number = 1;
  phone: string;
  backClicked: boolean = false;





  constructor(private activeRouter: ActivatedRoute, private platform: Platform, private toast: ToastService,
    private router: Router, private toastController: ToastController) {
    this.platform.ready().then(() => {
      document.addEventListener('backbutton', () => {
        if (this.backClicked) {
          navigator['app'].exitApp();
        }
        this.presentToast().then(() => {
          this.backClicked = true;
          setTimeout(() => this.backClicked = false, 2000);
        });
      }
      );
    });
  }
  ngOnInit(): void {
   this.phone=sessionStorage.getItem('phone');
  }
  showTabBar(event) {
    event.preventDefault();
    this.hidden = !this.hidden;
  }

  showNextTabBar(event) {
    event.preventDefault();
    const PANE_COUNT = 4;
    if (this.selectedIndex == PANE_COUNT - 1) {
      this.selectedIndex = 0;
    } else {
      this.selectedIndex++;
    }
    console.log('selectedIndex: ', this.selectedIndex);
  }

  showFullScreen(event) {
    event.preventDefault();
    this.fullScreen = !this.fullScreen;
    this.tabbarStyle = this.fullScreen
      ? {
        position: 'fixed',
        height: '100%',
        width: '100%',
        top: 0
      }
      : { height: '400px' };
  }

  changePosition(event) {
    event.preventDefault();
    this.topFlag = !this.topFlag;
  }

  tabBarTabOnPress(pressParam: any) {
    console.log('onPress Params: ', pressParam);
    let navigationExtras: NavigationExtras = { queryParams: { 'phone': this.phone }, fragment: 'anchor' };
    this.selectedIndex = pressParam.index;
    switch (this.selectedIndex) {
      case 0: this.router.navigate(['main/feed'],navigationExtras);break;
      case 1: this.router.navigate(['/main/my'], navigationExtras);break;
      case 2: this.router.navigate(['/main/my'], navigationExtras); break;
      case 3: this.router.navigate(['/main/my'], navigationExtras); break;
    }
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: '再按一次退出应用！',
      duration: 2000,
    });
    toast.present();
  }

}

import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ModalService, ToastService } from 'ng-zorro-antd-mobile';
import { Platform } from '@ionic/angular';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
export class UserInfo {
  birthday: string = '';
  address: string = '';
  sex: string = '';
  realname: string = '';
  authorization: number = 1;
  password: string = '';
  phone: string = '';
  cardId: string = '';
  email: string = '';
  username: string = '';
  constructor() { };
  setter(birthday: string, address: string,
    sex: string, realname: string, authorization: number,
    password: string, phone: string, cardId: string, email: string, username: string) {
    this.birthday = birthday;
    this.address = address;
    this.sex = sex;
    this.realname = realname;
    this.authorization = authorization;
    this.password = password;
    this.phone = phone;
    this.cardId = cardId;
    this.email = email;
    this.username = username;
  }
  clone(): UserInfo {
    let userInfo: UserInfo = new UserInfo();
    userInfo.setter(this.birthday, this.address, this.sex, this.realname,
      this.authorization, this.password, this.phone, this.cardId, this.email, this.username);
    return userInfo;
  }
}
@Component({
  selector: 'app-tab-my',
  templateUrl: './tab-my.component.html',
  styleUrls: ['./tab-my.component.scss'],
})
export class TabMyComponent implements OnInit {
  visiable: boolean = false;



  title: string;
  animation: boolean = false;
  phone: string;
  @ViewChild('mypet', { static: true }) mypet;
  httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };




  //更改密码时的参数
  passwordChange: any = {
    phone: '',
    oldpwd: '',
    newpwd: ''
  }
  //确认密码
  tmppwd: string;
  constructor(private http: HttpClient, private modal: ModalService, private toast: ToastService, private platform: Platform,
    private activeRouter: ActivatedRoute, private router: Router) {



  }

  ngOnInit() {
    this.visiable = false;
    this.phone=sessionStorage.getItem('phone');
    //this.getUserInfo();
  }

  Myinfo() {
    this.title = '个人信息';
    this.visiable = true;
    let navigationExtras: NavigationExtras = { queryParams: { 'phone': this.phone }, fragment: 'anchor' };
    this.router.navigate(['/main/my/myinfo'], navigationExtras);

  }
  close() {
    let navigationExtras: NavigationExtras = { queryParams: { 'phone': this.phone }, fragment: 'anchor' };
    this.router.navigate(['/main/my'], navigationExtras).then(() => {
      this.visiable = false;
    });
  }

  changePwd() {
    this.title = '修改密码';
    let navigationExtras: NavigationExtras = { queryParams: { 'phone': this.phone }, fragment: 'anchor' };
    this.router.navigate(['/main/my/changepwd'], navigationExtras).then(() => {
      this.visiable = true;
    });

  }
  showMyPet() {
    this.title = '我的宠物';
    let navigationExtras: NavigationExtras = { queryParams: { 'phone': this.phone }, fragment: 'anchor' };
    this.router.navigate(['/main/my/mypets'], navigationExtras).then(() => {
      this.visiable = true;
    });
  }

  showMyEquipment(){
    this.title="我的喂食器";
    let navigationExtras: NavigationExtras = { queryParams: { 'phone': this.phone }, fragment: 'anchor' };
    this.router.navigate(['/main/my/equipment'], navigationExtras).then(() => {
      this.visiable = true;
    });
  }

}

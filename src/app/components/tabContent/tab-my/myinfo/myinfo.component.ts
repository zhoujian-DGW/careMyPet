import { Component, OnInit } from '@angular/core';
import { ModalService, ToastService } from 'ng-zorro-antd-mobile';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Platform } from '@ionic/angular';
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
  selector: 'app-myinfo',
  templateUrl: './myinfo.component.html',
  styleUrls: ['./myinfo.component.scss'],
})
export class MyinfoComponent implements OnInit {



  httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  idCardToShow: string;
  realnameToShow: string;
  userInfo: UserInfo = new UserInfo();
  userInfoTmp: UserInfo = new UserInfo();
  minDate: Date = new Date("1900-01-01");
  maxDate: Date = new Date();

  animating: boolean = false;
  modalRef: any;

  //更改密码时的参数
  passwordChange: any = {
    phone: '',
    oldpwd: '',
    newpwd: ''
  }
  phone: any;
  Modalvisible: boolean = false;

  constructor(private modal: ModalService, private http: HttpClient, private toast: ToastService
    , private activeRouter: ActivatedRoute, private platform: Platform, private router: Router) { }

  ngOnInit() {
    this.activeRouter.queryParams.subscribe((data) => {
      this.phone = data.phone;
      this.getUserInfo();
    });
  }




  usernameClick() {
    this.makeModal('更改用户名', '输入新的用户名', (inputTmp) => {
      if (inputTmp != '') {
        this.userInfoTmp.username = inputTmp;
      }
    });
  }

  phoneClick() {
    this.makeModal('更改手机号', '输入新手机号', (inputTmp) => {
      if (inputTmp != '') {
        this.userInfoTmp.phone = inputTmp;
      }
    });
  }

  sexClick() {
    this.modal.operation([
      { text: '男', onPress: () => this.userInfoTmp.sex = '男' },
      { text: '女', onPress: () => this.userInfoTmp.sex = '女' }
    ]);
  }

  emailClick() {
    this.makeModal('更改邮箱', '输入新邮箱', (inputTmp) => {
      let myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
      if (!myreg.test(inputTmp)) {
        this.toast.fail('邮箱格式错误！');
      } else {
        this.userInfoTmp.email = inputTmp;
      }
    });
  }
  onOk(result: Date) {
    this.userInfoTmp.birthday = this.currentDateFormat(result, 'yyyy-mm-dd');
  }
  currentDateFormat(date, format: string = 'yyyy-mm-dd HH:MM'): any {
    const pad = (n: number): string => (n < 10 ? `0${n}` : n.toString());
    return format
      .replace('yyyy', date.getFullYear())
      .replace('mm', pad(date.getMonth() + 1))
      .replace('dd', pad(date.getDate()))
      .replace('HH', pad(date.getHours()))
      .replace('MM', pad(date.getMinutes()))
      .replace('ss', pad(date.getSeconds()));
  }

  realClick() {
    this.Modalvisible = true;
    console.log(this.Modalvisible);
  }

  makeModal(title: string, message: string, callback: any) {
    this.modalRef = this.modal.prompt(title,
      message,
      [{ text: '取消' }, {
        text: '保存', onPress: (inputTmp) => {
          callback(inputTmp);
        }
      }],
    );
  }

  getUserInfo() {
    this.animating = true;
    let api = 'http://120.55.90.231:8080/CareMypet/user/selectone';
    this.http.post(api, { phone: this.phone }, this.httpOptions).subscribe(response => {
      let result: any = response;
      this.userInfo.setter(result.birthday, result.address, result.sex, result.realname,
        result.authorization, result.password, result.phone, result.cardId, result.email, result.username);
      this.userInfoTmp = this.userInfo.clone();
      if (this.userInfoTmp.cardId != ' ') {
        this.idCardToShow = this.userInfoTmp.cardId.substring(0, 6) + "********" + this.userInfoTmp.cardId.substring(14, this.userInfoTmp.cardId.length - 1);
      } else {
        this.idCardToShow = '未绑定';
      }
      if (this.userInfoTmp.realname == ' ') {
        this.realnameToShow = '未绑定';
      } else {
        this.realnameToShow = this.userInfoTmp.realname;
      }
      this.passwordChange.phone = this.userInfoTmp.phone;
      this.animating = false;
    });
  }

  saveChange() {
    let api = "http://120.55.90.231:8080/CareMypet/user/updateuser";
    let data: any = Object.assign(this.userInfoTmp, { newphone: this.userInfoTmp.phone });
    this.http.post(api, data, this.httpOptions).subscribe(result => {
      let response: any = result;
      if (response.status == 'ok') {
        this.toast.success("修改成功", 1000);
      }
      if (response.status == 'exist') {
        this.toast.fail("手机号已经被注册！", 1000);
      }
    }, (error: Error) => {
      this.toast.fail('发生了未知错误', 1000);
      console.log(error);
    })
  }

  cancelChange() {
    this.userInfoTmp = this.userInfo.clone();
    console.log(this.userInfoTmp);
  }

  modalClose() {
    this.Modalvisible = false;
  }

  //点击真实姓名时触发
  realnameClick() {
    console.log(this.userInfo);
    if (this.userInfo.realname == ' ') {
      this.makeModal('真实姓名', '输入真实姓名', (realname) => {
        this.realnameToShow = realname;
      });
    }
  }

  //身份证点击时触发
  idCardClick() {
    if (this.userInfo.cardId == ' ') {
      this.makeModal('身份证号', '输入身份证号码', (cardId) => {
        this.idCardToShow = cardId;
      });
    }
  }

  save() {
    if (!(this.realnameToShow == '未绑定' || this.realnameToShow == '')) {
      this.userInfoTmp.realname = this.realnameToShow;
    }
    if (!(this.idCardToShow == '未绑定' || this.idCardToShow == '')) {
      this.userInfoTmp.cardId = this.idCardToShow;
    }
    this.Modalvisible = false;
  }
  //实名信息放弃修改时触发
  cancel() {
    this.Modalvisible = false;
  }

}

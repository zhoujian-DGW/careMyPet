import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { ToastService } from 'ng-zorro-antd-mobile';
import { JPush } from "../../../../plugins/jpush-phonegap-plugin/ionic/jpush/ngx";
import { UserService } from 'src/app/services/User/user.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

  phone: string = '';
  password: string = '';
  result: any;
  animating: boolean = false;
  device_id: any;//设备编号
  equipment_id: any;//喂食器编号
  constructor(private jpush: JPush,
    private activeRouter: ActivatedRoute, private router: Router, private http: HttpClient, private toast: ToastService,
    private userServie: UserService
  ) {

  }

  ngOnInit() {
    // this.phone = this.activeRouter.snapshot.params['phone'];
    this.activeRouter.queryParams.subscribe(data => {
      this.phone = data.phone;
      this.equipment_id = sessionStorage.getItem("equipment_id");
    });
  }
  forget() {
    if (this.phone == undefined || this.phone == '') {
      this.toast.fail('请输入手机号', 1000);
    } else {
      // this.router.navigate(['/forget', this.phone]);
      // let navigationExtras: NavigationExtras = { queryParams: { 'phone': this.phone }, fragment: 'anchor' };
      // this.router.navigate(['/forget'], navigationExtras);
      sessionStorage.setItem('phone', this.phone.replace(/\s*/g, ""));
      this.router.navigate(['/forget']);
    }
  }
  login() {
    if (this.phone == undefined) {
      this.toast.fail('手机号不能为空', 1000);
    } else if (this.password == '') {
      this.toast.fail('密码不能为空', 1000);
    } else {
      let api = "http://120.55.90.231:8080/CareMypet/user/login";
      this.animating = true;
      //this.router.navigateByUrl('/main');
      this.http.post(api, { phone: this.phone.replace(/\s*/g, ""), password: this.password }, this.httpOptions).subscribe(response => {
        this.result = response;
        if (this.result.status == 'error') {
          this.toast.fail('用户名或密码错误', 1000);
        }
        if (this.result.status == 'ok') {
          this.toast.success('登陆成功', 1000);
          this.jpush.getRegistrationID().then((device_id: any) => {
            this.device_id = device_id;
            if (device_id) {//成功获取手机编号
              this.userServie.postDeviceId(this.phone.replace(/\s*/g, ""), this.device_id).then((result) => {
              }, (error) => {
                console.log(error);
              })
            }
          });//获取设备标识
          if (this.equipment_id) {//如果注册时填写了设备号
            this.userServie.postEquipmentId(this.phone.replace(/\s*/g, ""), this.equipment_id).then((result) => {
              console.log(result);
            }, (error) => {
              console.log(error);
            })
          }
          setTimeout(() => {
            sessionStorage.setItem('phone', this.phone.replace(/\s*/g, ""));
            this.router.navigate(['/main/feed']);
          }, 1000);
        }
        this.animating = false;
      }, (error: Error) => {
        console.log(error);
        this.animating = false;
        this.toast.fail('无法连接到网络', 1000);
      });
    }
  }
}

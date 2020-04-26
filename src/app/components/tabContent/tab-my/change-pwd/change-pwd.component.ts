import { Component, OnInit,Output,EventEmitter } from '@angular/core';
import { ToastService } from 'ng-zorro-antd-mobile';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-change-pwd',
  templateUrl: './change-pwd.component.html',
  styleUrls: ['./change-pwd.component.scss'],
})
export class ChangePwdComponent implements OnInit {

  @Output() private outer=new EventEmitter<string>();

  phone:string;
  constructor(private toast:ToastService,private http:HttpClient,private activatedRoute:ActivatedRoute,
    private router:Router) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(data=>{
      this.passwordChange.phone=data.phone;
      this.phone=data.phone;
    });
  }

  //更改密码时的参数
  passwordChange: any = {
    phone: '',
    oldpwd: '',
    newpwd: ''
  }
  //确认密码
  tmppwd: string;
  visiable:boolean=true;

  httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };


  changePassword() {
    if (this.tmppwd != this.passwordChange.newpwd) {
      this.toast.fail('两次输入的密码不一致', 1000);
    }
    else {
      let api = 'http://120.55.90.231:8080/CareMypet/user/updatepassword';
      console.log(this.passwordChange);
      this.http.post(api, this.passwordChange, this.httpOptions).subscribe(response => {
        let result: any = response;
        if (result.status == 'oldpwderror') {
          this.toast.fail('旧密码输入错误', 1000);
        }
        if (result.status == 'ok') {
          this.toast.success('修改成功', 1000);
          this.passwordChange.oldpwd = '';
          this.passwordChange.newpwd = '';
          this.tmppwd = '';
        }
      }, (error: Error) => {
        this.toast.fail('发生了意外错误', 1000);
      })
    }
  }

  cancel(){
    let navigationExtras: NavigationExtras = { queryParams: { 'phone': this.phone,'visiable':false }, fragment: 'anchor' };
    this.router.navigate(['/main/my'],navigationExtras);
  }

}

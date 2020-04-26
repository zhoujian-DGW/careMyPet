import { Component, OnInit } from '@angular/core';
import { ToastService } from 'ng-zorro-antd-mobile';
import { Router, NavigationExtras } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
export interface QuestionAndAnswer {
  question: string;
  answer: string;
}
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  password: string = '';
  ensure: string = '';
  username: string = '';
  phone: string = '';
  questionList: Array<string> = ['你的真实姓名是什么', '你父亲的名字是什么', '你的小学叫什么名字',
    '你的中学叫什么名字', '你的职业是什么', '你最喜欢的音乐是什么', '你最喜欢的电影是什么', '你最喜欢的运动是什么'];
  qaa1: QuestionAndAnswer = { question: this.questionList[0], answer: '' };
  qaa2: QuestionAndAnswer = { question: this.questionList[1], answer: '' };
  qaa3: QuestionAndAnswer = { question: this.questionList[2], answer: '' };
  answerList: Array<QuestionAndAnswer> = [];
  userInfo: any;
  httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

  equipment_id:any;//喂食器设备号
  constructor(private toast: ToastService, private router: Router, private http: HttpClient) { }
  ngOnInit() {
  }
  register() {
    if (this.password != this.ensure) {
      this.toast.fail('两次输入的密码不一致', 1000);
    } else if (this.username == '') {
      this.toast.fail('用户名不能为空', 1000);
    } else if (this.ensure == '' || this.password == '') {
      this.toast.fail('密码不能为空', 1000);
    } else if (this.qaa1.question == this.qaa2.question || this.qaa1.question == this.qaa2.question ||
      this.qaa2.question == this.qaa3.question) {
      this.toast.fail('密保问题不能重复');
    } else if (this.qaa1.answer == '' || this.qaa2.answer == '' || this.qaa3.answer == '') {
      this.toast.fail('请填写密保问题的答案', 1000);
    }
    else {
      //还需要调用注册服务
      this.userInfo = {
        phone: this.phone.replace(/\s*/g, ""),
        password: this.password,
        username: this.username,
        QuestionAndAnswer: [this.qaa1, this.qaa2, this.qaa3]
      }
      let api = 'http://120.55.90.231:8080/CareMypet/user/register';
      this.http.post(api, this.userInfo, this.httpOptions).subscribe((response) => {
        let result: any = response;
        switch (result.status) {
          case 'ok':
            this.toast.success('注册成功', 1000);
            sessionStorage.setItem("equipment_id",this.equipment_id);
            setTimeout(() => { let navigationExtras: NavigationExtras = { queryParams: { 'phone': this.phone }, fragment: 'anchor' };
            this.router.navigate(['login'],navigationExtras);
          }, 1000);
            break;
          case 'exist': this.toast.fail('手机号已被注册', 1000);
            break;
          case 'questionerror': this.toast.fail('密保问题或答案有误', 1000);
            break;
          case 'othererror': this.toast.fail('未知错误', 1000); break;
        }
      });
    }
  }
}

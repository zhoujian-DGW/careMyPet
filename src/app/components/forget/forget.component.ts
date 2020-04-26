import { Component, OnInit } from '@angular/core';
import { QuestionAndAnswer } from '../register/register.component';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastService, ModalService } from 'ng-zorro-antd-mobile';

@Component({
  selector: 'app-forget',
  templateUrl: './forget.component.html',
  styleUrls: ['./forget.component.scss'],
})
export class ForgetComponent implements OnInit {

  httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

  animating: boolean = true;
  phone: any;
  questionList: Array<QuestionAndAnswer> = [];
  qaa: QuestionAndAnswer = { question: '', answer: '' };
  constructor(private modal: ModalService, private activeRouter: ActivatedRoute, private http: HttpClient, private toast: ToastService, private router: Router) {
  }
  ngOnInit() {

    this.phone = sessionStorage.getItem('phone');
    console.log(this.phone);
    this.phone = this.phone.replace(/\s*/g, "");
    let api = 'http://120.55.90.231:8080/CareMypet/user/selectquestion';
    this.http.post(api, { phone: this.phone.replace(/\s*/g, "") }, this.httpOptions).subscribe(response => {
      let result: any = response;
      if (result.Status == 'ok') {

        for (let i = 0; i < result.QuestionAndAnswer.length; i++) {
          this.questionList.push(result.QuestionAndAnswer[i]);
        };
        this.qaa.question = this.questionList[0].question;
        this.animating = false;
      }
    }, (error: Error) => {
      this.animating = false;
      this.toast.fail('发生了未知错误', 1000);
      setTimeout(() => {
        this.router.navigate(['/login', this.phone]);
      }, 1000)
    });

  }
  check() {
    let api = 'http://120.55.90.231:8080/CareMypet/user/checkquestion';
    if (this.qaa.answer == '') {
      this.toast.fail('请输入答案！');
    } else {
      this.animating = true;
      let info = {
        phone: this.phone,
        question: this.qaa.question,
        answer: this.qaa.answer
      }
      this.http.post(api, info, this.httpOptions).subscribe(response => {
        let result: any = response;
        switch (result.status) {
          case 'ok': this.toast.success('验证成功！', 1000); setTimeout(() => { this.changePassword() }, 1000)//跳转至密码修改
            break;
          case 'answererror': this.toast.fail('答案错误！', 1000); break;
        }
        this.animating = false;
      }, (error: Error) => {
        this.toast.fail('未知错误', 1000);
        this.animating = false;
      });
    }
  }
  changePassword() {
    this.modal.prompt('更改密码',
      '请输入新密码',
      [{ text: '取消' }, {
        text: '提交', onPress: password => {
          if (password == '' || password == undefined) {
            this.toast.fail('请输入新密码！', 1000);
          } else {
            let api = 'http://120.55.90.231:8080/CareMypet/user/forgetpassword';
            let info = {
              phone: this.phone,
              newpwd: password
            }
            this.http.post(api, info, this.httpOptions).subscribe(response => {
              let result: any = response;
              if (result.status == 'ok') {
                this.toast.success('修改成功！', 1000);
                setTimeout(() => this.router.navigate(['/login', this.phone]), 1000);
              }
            }, (error: Error) => {
              this.toast.fail('未知错误', 1000);
            })
          }
        }
      }],
      'secure-text');
  }
}

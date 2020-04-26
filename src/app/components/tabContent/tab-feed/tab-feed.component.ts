import { Component, OnInit } from '@angular/core';
import { PetserviceService } from 'src/app/services/petservice/petservice.service';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { PetSelectModalComponent } from "./pet-select-modal/pet-select-modal.component";
import { ModalController } from '@ionic/angular';
import { async } from '@angular/core/testing';
import { ModalService, ToastService } from 'ng-zorro-antd-mobile';
import { FoodService } from 'src/app/services/food/food.service';
import * as moment from "moment/moment";
export class FeedTime {
  time;//喂食时间
  quantity;//喂食量
  switch;//开关
  flag;//状态[新增的（new),修改的（update）,已有的（exist）]
  constructor(time: string, quantity: number, enable: boolean, flag: string) {
    this.time = time;
    this.quantity = quantity;
    this.switch = enable;
    this.flag = flag;
  }
}
@Component({
  selector: 'app-tab-feed',
  templateUrl: './tab-feed.component.html',
  styleUrls: ['./tab-feed.component.scss'],
})
export class TabFeedComponent implements OnInit {
  phone: string;
  petList = [];//宠物列表
  petSelected: any = { id: null, type: '', sex: '', birthday: null, petphoto: '', health: '健康', name: '', selected: false }//选中的宠物
  feedSettings = {};
  animating: boolean = false;
  listTest: any = ['aaa', 'aaa', 'aaa', "aaa"];
  feedList: Array<FeedTime>;//喂食时间表

  edit: boolean = false;//是否修改

  loading: boolean = false;//提交按钮是否loading
  buttonText: string = "保存修改";//button上的字

  selectedIndex: any;

  constructor(private petService: PetserviceService, private activatedRoute: ActivatedRoute,
    private route: Router, private modalController: ModalController, private modal: ModalService,
    private feed: FoodService, private toast: ToastService) {
    this.phone = sessionStorage.getItem('phone');
    this.feedList = new Array<FeedTime>();
    
  }


  ngOnInit() {

    this.phone = sessionStorage.getItem('phone');
    this.getPetList(this.phone, (value) => {
      this.petList = value;
      this.petSelected = this.petList[0];
      this.initList();
    });

  }
  
  initList() {
    this.feedList.length=0;
    let data = {
      phone: this.phone,
      pet_id: this.petSelected.id
    }
    this.feed.getFeedTime(data).then((response: any) => {
      if (response.status == "ok") {
        response.food.forEach((item) => {
          let swt = item.switch == "on" ? true : false;
          this.feedList.push(new FeedTime(item.time, item.quantity, swt, "exist"));
        })
      }
    }, error => {
      console.log(error);
    }).then(() => this.feedList.sort((a,b)=>{
      return this.parseTime(a.time)-this.parseTime(b.time);
     }));
  }

  parseTime(time:any){//将使时间转换为秒数,HH:MM
    let hour=time.substring(0,2);
    let minute=time.substring(3,4);
    return parseInt(hour)*3600+minute;
  }
  getPetList(phone, next?) {
    this.petService.getPetList(phone, (data) => {
      next(data.pet);
    }, (message: any) => {
      console.log('fail');//失败的时候还需要处理
    })
  }


  async presentModal() {
    const modal = this.modalController.create({
      component: PetSelectModalComponent,
      componentProps: {
        'petList': this.petList
      }
    });
    (await modal).present();
    const { data } = await (await modal).onDidDismiss();
    if (data != undefined) {
      this.petSelected = data.petSelected;
      this.initList();
    }
  }

  addOne() {//添加一个喂食设置，点击加号触发
    this.feedList.push(new FeedTime(this.feed.currentDateFormat(new Date(),"HH:MM:ss"), 0, true, "new"));
    this.edit = true;
  }

  deleteOne(index) {
    if (this.feedList[index].flag != "new") {
      let data={
        phone:this.phone,
        pet_id:this.petSelected.id,
        time:this.feedList[index].time
      }
      console.log(data);
      this.feed.deleteFeedTime(data).then((response)=>{
        console.log(response);
      },(error:Error)=>{
        console.log(error.message);
      });
      //调用api删除喂食时间
    }
    this.feedList.splice(index, 1);
  }

  savechanges() {//保存修改
    this.loading = true;
    this.postData().then(() => {
      
      this.buttonText="保存成功";
    }, () => {
      this.buttonText="保存失败";
      this.toast.fail("还未绑定设备，或者设备离线！")
    }).then(()=>this.loading=false).then(()=>this.initList());
    setTimeout(()=>{
      this.edit=false;
      this.buttonText="保存修改";
    },2000);
  }
  async postData() {//提交数据
    let fail=[];
    this.feedList.forEach(item => {
      let data = {
        phone: this.phone,
        pet_id: this.petSelected.id,
        time:item.time.substr(0,item.time.length-3),
        quantity: item.quantity,
        switch: item.switch ? "on" : "off"
      }
      console.log(data);
      if (item.flag == "new") {
        this.feed.addFeedTime(data).then((response) => {
          //console.log(response);
        }, (error:Error) => {
          fail.push(error.message);
          //console.log(error);
        })
      }
      if (item.flag == "update") {
        return this.feed.updateFeedTime(data).then((response) => {
          console.log(response);
        }, (error) => {
          fail.push(error.message);
          //console.log(error);
        });
      }
    });
    return new Promise((resolve,reject)=>{
      resolve("ok");
      reject(fail);
    });
  }
  showFood(i) {
    this.modal.prompt("喂食设置", "输入喂食量（克）", [{ text: "取消" }, {
      text: "确定", onPress: value => {
        let reg = /^\d+$/;
        if (reg.test(value)) {
          this.needUpdate(i);
          this.feedList[i].quantity = value;
        }
      }
    }]
    );
  }
  needUpdate(i) {
    if (this.feedList[i].flag != "new") {
      this.feedList[i].flag = "update";
    }
    this.edit = true;
  }
}

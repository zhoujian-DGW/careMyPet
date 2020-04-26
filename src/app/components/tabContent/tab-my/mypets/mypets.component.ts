import { Component, OnInit, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActionSheetService, ToastService, ModalService } from 'ng-zorro-antd-mobile';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ImagePicker, ImagePickerOptions } from "@ionic-native/image-picker/ngx";
import { Base64 } from "@ionic-native/base64/ngx";
import { Platform } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

//宠物基本信息
export interface pet {
  id: number,
  type: string,
  name: string,
  sex: string,
  birthday: any,
  health: string,
  petphoto: string //头像路径
  selected: boolean
}
@Component({
  selector: 'app-mypets',
  templateUrl: './mypets.component.html',
  styleUrls: ['./mypets.component.scss'],
})

export class MypetsComponent implements OnInit {

  //测试数据
  pets: pet[] = [];
  base64Img: string = '';//转换为base64的图片字符串
  phone: string;

  isDelete: boolean = false;//是否在进行删除操作

  isVisiable: boolean = false;//对话框是否可见

  minDate: Date = new Date("1900-01-01");//日期选择器最小日期
  maxDate: Date = new Date();//最大日期

  animating: boolean = false;//活动指示器开关

  httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };//http响应头

  cardVisiable: boolean = false;//宠物卡片对话框是否显示

  //用于展示的宠物详情
  detail: any = { id: null, type: '', sex: '', birthday: null, petphoto: this.base64Img, health: '健康', name: '', selected: false };

  PetToAdd: pet = {
    id: null, type: '', sex: '', birthday: null, petphoto: this.base64Img, health: '健康', name: '', selected: false
  };
  constructor(private http: HttpClient, private actionSheet: ActionSheetService, private camera: Camera,
    private imagePicker: ImagePicker, private base64: Base64, private toast: ToastService,
    private modal: ModalService, private platform: Platform, private activatedRoute: ActivatedRoute) {

  }

  ngOnInit() {
    this.getPetList();
  }

  private cameraOpt: CameraOptions = {//调用相机时的参数

    quality: 50,
    destinationType: this.camera.DestinationType.DATA_URL, // Camera.DestinationType.FILE_URI,
    sourceType: 1, // Camera.PictureSourceType.CAMERA,
    encodingType: 0, // Camera.EncodingType.JPEG,
    mediaType: 0, // Camera.MediaType.PICTURE,
    allowEdit: true,
    correctOrientation: true
  };

  private Pickeroptions: ImagePickerOptions = {
    maximumImagesCount: 1,
    outputType: 1
  };
  // 启动拍照功能
  private startCamera(callback?) {
    this.camera.getPicture(this.cameraOpt).then((imageData) => {
      this.base64Img = 'data:image/jpeg;base64,' + imageData;
      callback();
    }, (err) => {
     
    });
  }

  //打开相册
  private onpenAlbum(callback?) {
    this.imagePicker.getPictures(this.Pickeroptions).then((imageURI) => {
      this.base64Img = 'data:image/jpeg;base64,' + imageURI;
      callback();
      //还需要调用api上传
    }, (error: Error) => {
      this.toast.fail('无法打开相册');
    })
  }

  //选择头像
  choosePhoto = (message, callback?) => { //i是点击的头像序号
    let BUTTONS = ['拍照', '从手机相册中选择'];
    this.actionSheet.showActionSheetWithOptions(
      {
        options: BUTTONS,
        title: '头像选择',
        message: message,
        maskClosable: true
      },
      buttonIndex => {
        if (buttonIndex == 0) {
          this.startCamera(callback);//启动照相机
        }
        if (buttonIndex == 1) {
          this.onpenAlbum(callback);//启动相册
        }
      }
    )
  }
  //测试用方法
  test() {
    console.log('test');
  }

  addPet() {//新增宠物
    this.isVisiable = true;
    console.log('addPet');
  }

  deletePet() {//点击删除宠物按钮
    console.log('deletePet');
    this.isDelete = true;
  }

  confirmDelete() {//确认删除按钮

    this.modal.alert('删除宠物', '你确定要删除选中的宠物吗？', [
      { text: '取消', onPress: () => console.log('cancel') },
      {
        text: '确定', onPress: () => {
          for (let i = 0; i < this.pets.length; i++) {
            if (this.pets[i].selected) {
              this.animating = true;
              let api = "http://120.55.90.231:8080/CareMypet/pet/deletepet"
              this.http.post(api, { id: this.pets[i].id }, this.httpOptions).subscribe(response => {
                let result: any = response;
                if (result.status == 'ok') {
                  this.toast.success('删除成功', 1000);
                  this.animating = false;
                }
              }, (error: Error) => {
                this.toast.fail('发生了未知错误', 1000);
                this.animating = false;
              });
              this.pets.splice(i, 1);
              i--;
              this.isDelete = !this.isDelete;
            }
          }
        }
      }
    ]);
  }

  cancel() {//取消删除
    console.log('cancel');
    this.isDelete = false;
  }

  cancelAdd() {//取消添加宠物
    this.isVisiable = false;
  }
  //查看详细信息
  showDetail(i) {
    this.cardVisiable = true;
    this.detail = this.pets[i];
    let age = this.calculateAge(this.detail.birthday);
    let condition: any = {};
    this.detail = Object.assign(this.detail, { age: age });
    this.getLittleStatus(this.pets[i], 'recent', result => {
      //console.log(result);
      if (result.status == 'error') {
        condition = {
          temperature: '未测量',
          health: '健康',
          height: '未测量',
          heavy: '未测量',
          time: this.currentDateFormat(new Date())
        }
      } else {
        condition = result.petcondition[0];
        condition.time = this.currentDateFormat(new Date(condition.time));
      }
      this.detail = Object.assign(this.detail, condition);
    });
    console.log(this.detail);
  }

  calculateAge(birthday) {//计算年龄
    let today: Date = new Date();
    let day: number = Math.floor((today.getTime() - new Date(birthday).getTime()) / (24 * 60 * 60 * 1000));
    let age = Math.floor(day / 360) + '岁' + Math.floor(day % 360 / 30) + '个月' + Math.floor(day % 360 % 30) + '天';
    return age;
  }
  /**格式化日期 */
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

  onOk(result: Date) {//日期选择器格式化日期后执行
    this.PetToAdd.birthday = this.currentDateFormat(result, 'yyyy-mm-dd');
  }

  addPetConfirm() {//确认添加宠物时触发
    let api = "http://120.55.90.231:8080/CareMypet/pet/addpet"
    this.PetToAdd.petphoto = this.base64Img;
    let data: any = Object.assign(this.PetToAdd, { phone: this.phone });
    if (this.checkCorrect()) {
      this.animating = true;
      this.http.post(api, data, this.httpOptions).subscribe(response => {
        let result: any = response;
        if (result.status == 'ok') {
          this.toast.success('添加成功！', 1000);
          this.isVisiable = false;
          setTimeout(() => { this.getPetList() }, 1000);
        }
        if (result.status == 'error') {
          this.toast.fail('添加失败！')
        }
        if (result.status == 'photoerror') {
          this.toast.success('添加成功，但头像上传失败！为您更换了默认头像！');
        }
        this.animating = false;
        this.PetToAdd = {
          id: null, type: '', sex: '', birthday: null, petphoto: this.base64Img, health: '健康', name: '', selected: false
        };
        this.base64Img = '';
      }, (error: Error) => {

        this.toast.fail('发生了未知错误！');
        this.animating = false;

      })
    }

  }


  checkCorrect() {//检查信息输入的正确性
    if (this.PetToAdd.name == '') {
      this.toast.fail("请输入宠物名称", 1000);
      return false;
    }
    if (this.PetToAdd.type == '') {
      this.toast.fail('请输入宠物类型', 1000);
      return false;
    }
    if (this.PetToAdd.sex == '') {
      this.toast.fail('请输入宠物性别', 1000);
      return false;
    }
    if (this.PetToAdd.sex != '公' && this.PetToAdd.sex != '母') {
      this.toast.fail('请正确输入宠物性别(公，母)');
      return false;
    }
    if (this.PetToAdd.birthday == null) {
      this, this.toast.fail('请选择宠物的生日');
      return false;
    }
    return true;
  }

  getPetList() {

    this.activatedRoute.queryParams.subscribe((data) => {
      this.animating = true;
      this.pets = [];
      this.phone=data.phone;
      let api = "http://120.55.90.231:8080/CareMypet/pet/selectpet";
      this.http.post(api, { phone: data.phone }, this.httpOptions).subscribe(response => {
        let result: any = response;
        if (result.status == "ok") {
          for (let i = 0; i < result.pet.length; i++) {
            let petTmp: pet = {
              id: result.pet[i].id,
              type: result.pet[i].type,
              name: result.pet[i].name,
              sex: result.pet[i].sex,
              birthday: result.pet[i].birthday,
              health: result.pet[i].health,
              petphoto: result.pet[i].petphoto,
              selected: false
            }
            this.pets.push(petTmp);
          }
        } else {
          this.toast.success('您还未添加宠物，点击添加按钮进行添加吧！');
        }
        this.animating = false;
      }, (error: Error) => {
        this.toast.fail('发生了未知错误');
        this.animating = false;
        console.log(error);
      });
    });
  }
  updatePet(pet: any) {//更新宠物信息
    console.log(pet);
    let api = "http://120.55.90.231:8080/CareMypet/pet/updatepet";
    this.http.post(api, pet, this.httpOptions).subscribe(response => {
      let result: any = response;
      if (result.status == 'ok') {
        this.getPetList();
      } else {
        this.toast.fail('修改失败');
      }
    }, (error: Error) => {
      console.log(error);
      this.toast.fail('发生了意外错误！');
    });
    this.base64Img = '';
  }

  /**history:recent,week,month,year */
  getLittleStatus(pet: pet, history: string, callback: any) {//获取宠物小状态
    this.animating = true;
    let api = "http://120.55.90.231:8080/CareMypet/pet/selpetcon"
    let data = {
      id: pet.id,
      history: history,
      num: 0
    };
    this.http.post(api, data, this.httpOptions).subscribe(response => {
      callback(response);
      this.animating = false;
    }, (error: Error) => {
      this.toast.fail('发生了未知错误！');
      this.animating = false;
    });
  }

  onCardClose() {//在宠物卡片关闭时触发
    this.updatePet(this.detail);//更新宠物信息
  }

  updatePetPhoto() {//更新宠物照片
    this.choosePhoto('', () => { this.detail.petphoto = this.base64Img; });
  }

  updatePetName(name) {//更新宠物名称
    this.detail.name = name;
  }

  showUpdateNameModal() {
    this.modal.prompt('更改宠物名称', '输入新的名称', [{ text: '取消' }, {
      text: '修改', onPress: value => {
        this.updatePetName(value);
      }
    }]);
  }

  showUpdateTypeModal() {
    this.modal.prompt('更改宠物类型', '输入新的类型', [{ text: '取消' }, {
      text: '修改', onPress: value => {
        this.detail.type = value;
      }
    }]);
  }

  updateBirthday(birthday: Date) {
    this.detail.age = this.calculateAge(birthday);
    let dateTmp: Date = this.currentDateFormat(birthday, "yyyy-mm-dd");
    this.detail.birthday = dateTmp;
  }

  updateSex() {
    this.modal.operation([
      { text: '公', onPress: () => this.detail.sex = '公' },
      { text: '母', onPress: () => this.detail.sex = '母' }
    ]);
  }

}

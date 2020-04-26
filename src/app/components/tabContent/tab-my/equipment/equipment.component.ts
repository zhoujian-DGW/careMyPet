import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/User/user.service';
import { ToastComponent, ToastModule, ToastService } from 'ng-zorro-antd-mobile';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.scss'],
})
export class EquipmentComponent implements OnInit {
 statusList={
    0:"未绑定喂食器",
    1:"在线",
    2:"离线"
  }
  status:any;
  equipment_id: any;//喂食器编号
  phone: any;
  disabled: boolean = true;//是否绑定了设备
  canSubmit: boolean = false;//是否可以提交
  loading: boolean = false;//按钮加载
  condition: string = ""//提交状态
  canEdit: boolean = true;
  constructor(private userService: UserService, private toast: ToastService) {
  Object.freeze(this.statusList);
  }

  ngOnInit() {
    this.phone = sessionStorage.getItem("phone");
    console.log(this.phone);
    this.initValues();
  }

  submit() {//提交设备号
    this.loading = true;
    this.condition = "中";
    this.equipment_id && this.userService.postEquipmentId(this.phone, this.equipment_id).then((response: any) => {
      console.log(this.phone);
      console.log(this.equipment_id);
      console.log(response);
      if (response.status == "ok") {
        this.loading = false;
        this.condition = "成功";
        this.disabled = true;
        this.canSubmit = false;
        this.initValues();
      }
    }, (error) => {
      this.loading = false;
      this.condition = "失败";
    }).then(() => { this.canEdit = true });
  }

  initValues() {
    this.userService.getequipments(this.phone).then((response: any) => {
      console.log(typeof response);
      this.status = this.statusList[response.equip_status];
       this.equipment_id = response.equipment_id;
      if (response.equip_status=="0") {
        this.canSubmit=true;
        this.canEdit=false;
        this.disabled=false;
      }
    }, error => {
      this.toast.fail("网络连接异常");
    });
  }

  editEquipment() {
    this.canSubmit = true;
    this.disabled = false;
    this.canEdit = false;
    this.condition="";
  }

}

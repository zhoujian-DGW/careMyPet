import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  constructor(private http:HttpClient) { }

  public async postDeviceId(phone,deviceid){
    let api="http://120.55.90.231:8080/CareMypet/user/loginequip";
    const para={
      "phone":phone,
      "registration_id":deviceid
    };
    return new Promise((resolve,reject)=>{
      this.http.post(api,para,this.httpOptions).subscribe((response)=>{
        let result:any=response;
        console.log(result);
        resolve(result);
      },error=>{
        reject(error);
      })
    })
  }

  public async postEquipmentId(phone,equipid){
    let api="http://120.55.90.231:8080/CareMypet/user/updateequip";
    const para={
      phone:phone,
      equipment_id:equipid
    };
    console.log(para);
    return new Promise((resolve,reject)=>{
      this.http.post(api,para,this.httpOptions).subscribe((response)=>{
        resolve(response);
      },error=>reject(error));
    })
  }

  public async getequipments(phone){
    let api="http://120.55.90.231:8080/CareMypet/user/equipstatus";
    const param={
      phone:phone
    }
    return new Promise((resolve,reject)=>{
      this.http.post(api,param,this.httpOptions).subscribe((response:any)=>{
        console.log(response);
        resolve(response);
      },error=>reject(error))
    })
  }
}

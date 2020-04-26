import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
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
@Injectable({
  providedIn: 'root'
})
export class PetserviceService {

  httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };//http响应头

  constructor(private http:HttpClient) {

   }

  getPetList(phone,success,fail){
     let api="http://120.55.90.231:8080/CareMypet/pet/selectpet";
     this.http.post(api,{phone:phone},this.httpOptions).subscribe((response=>{
       success(response);
     }),(error:Error)=>{fail('请求数据失败')});
   }

}

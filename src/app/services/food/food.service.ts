import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { resolve } from 'url';

@Injectable({
  providedIn: 'root'
})
export class FoodService {//喂食的增删改查

  private httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  constructor(private http: HttpClient) { }

  async addFeedTime(data) {
    let api = "http://120.55.90.231:8080/CareMypet/pet/addfood";
    return this.doPost(api, data);
  }
  async getFeedTime(data) {
    let api = "http://120.55.90.231:8080/CareMypet/pet/selectfood";
    return this.doPost(api, data);
  }
  async updateFeedTime(data) {
    let api = "http://120.55.90.231:8080/CareMypet/pet/updatefood";
    return this.doPost(api, data);
  }
  async deleteFeedTime(data) {
    let api = "http://120.55.90.231:8080/CareMypet/pet/deletefood";
    return this.doPost(api, data);
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
  private async doPost(api, data) {
    return new Promise((resolve, reject) => {
      this.http.post(api, data, this.httpOptions).subscribe((response) => {
        resolve(response);
      }, (error) => reject(error));
    });
  }
}

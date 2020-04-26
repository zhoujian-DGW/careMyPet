import { Component, OnInit, Input } from '@angular/core';
import { ModalService } from 'ng-zorro-antd-mobile';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-pet-select-modal',
  templateUrl: './pet-select-modal.component.html',
  styleUrls: ['./pet-select-modal.component.scss'],
})
export class PetSelectModalComponent implements OnInit {

  petList:[];
  constructor(private modalController:ModalController,private navParams: NavParams) { 
    this.petList=navParams.get('petList');
  }

  ngOnInit() {}

  cancel(){
    this.modalController.dismiss();
  }

  selectPet(i){
    this.modalController.dismiss({
      "petSelected":this.petList[i]
    });
  }
}

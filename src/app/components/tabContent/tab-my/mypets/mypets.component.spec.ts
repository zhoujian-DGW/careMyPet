import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MypetsComponent } from './mypets.component';

describe('MypetsComponent', () => {
  let component: MypetsComponent;
  let fixture: ComponentFixture<MypetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MypetsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MypetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TabVedioComponent } from './tab-vedio.component';

describe('TabVedioComponent', () => {
  let component: TabVedioComponent;
  let fixture: ComponentFixture<TabVedioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabVedioComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TabVedioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

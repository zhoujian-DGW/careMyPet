import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TabMyComponent } from './tab-my.component';

describe('TabMyComponent', () => {
  let component: TabMyComponent;
  let fixture: ComponentFixture<TabMyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabMyComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TabMyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { NgModule, Component } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from "./components/register/register.component";
import { LoginComponent } from "./components/login/login.component";
import { TabsComponent } from "./tabs/tabs.component";
import { ForgetComponent } from "./components/forget/forget.component";
import { TabMyComponent } from "./components/tabContent/tab-my/tab-my.component";
import { MyinfoComponent } from "./components/tabContent/tab-my/myinfo/myinfo.component";
import { ChangePwdComponent } from "./components/tabContent/tab-my/change-pwd/change-pwd.component";
import { MypetsComponent } from "./components/tabContent/tab-my/mypets/mypets.component";
import { TabFeedComponent } from "./components/tabContent/tab-feed/tab-feed.component";
import { TabVedioComponent } from "./components/tabContent/tab-vedio/tab-vedio.component";
import { EquipmentComponent } from "./components/tabContent/tab-my/equipment/equipment.component";
const routes: Routes = [
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'main',
    component: TabsComponent,
    children: [
      {
        path: 'my',
        component: TabMyComponent,
        children:[{
          path:'myinfo',
          component:MyinfoComponent
        },{
          path:'changepwd',
          component:ChangePwdComponent
        },{
          path:'mypets',
          component:MypetsComponent
        },{
          path:"equipment",
          component:EquipmentComponent
        }]
      },{
        path:'feed',
        component:TabFeedComponent
      },{
        path:'vedio',
        component:TabVedioComponent
      }
    ]
  },
  {
    path: 'forget',
    component: ForgetComponent
  },
  {
    path: '**',
    component: LoginComponent
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

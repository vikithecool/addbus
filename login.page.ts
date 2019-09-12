
import { Component, OnInit, Injectable, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Router } from '@angular/router';
import { WebserviceService } from '../services/webservice.service';
import { DatatransferService } from '../services/datatransfer.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';

declare var $;

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  loading: any;
 
  private loginapi = this.getdata.appconstant + 'user/login';


  constructor(public loadingController: LoadingController,public toastController: ToastController,private Formbuilder: FormBuilder, private router: Router, private makeapi: WebserviceService, private http: Http, private getdata: DatatransferService) { 
    this.session();

     if (this.session() != null) {
      this.router.navigateByUrl('/home');
    }
    else{
      this.router.navigateByUrl('/login');
    }
    this.loginForm = Formbuilder.group({
      'contactno': [''],
      'password': [''],
    });
  }

  ngOnInit() {
    this.session();

     if (this.session() != null) {
      this.router.navigateByUrl('/home');
    }
    else{
      this.router.navigateByUrl('/login');
    }
  }

  /** Get Session Data */
  session() {
    return JSON.parse(localStorage.getItem("myDirectSession"));
  }

  /** Login Form On submit */
  loginUser() {
    this.presentLoading(); 
    var reqdata=this.loginForm.value;
    reqdata.status=1;
    let logindata = JSON.stringify(reqdata);
    return this.makeapi.method(this.loginapi, logindata, "post")
      .subscribe(data => {
        if (data.message == "Success") {
          localStorage.setItem("myDirectSession", JSON.stringify(data.result));
          this.loginForm.reset();
          this.loading.dismiss().then(() => {
            this.router.navigate(['/home']);
        });
        }
        else {
          this.loading.dismiss().then(() => {
            this.presentToast(data.message)   
          });        
        }
        
      },
        Error => {
          
        });
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
        message: 'Please wait',
        duration: 2000
    });
    return await this.loading.present();
}

  /** Show notofication */
  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  signup() {
    this.router.navigateByUrl('/signup');
	}
  forgot(){
    this.router.navigateByUrl('/forgotpassword');
  }
}

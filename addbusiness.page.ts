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
import { ToastController } from '@ionic/angular'
import { LoadingController } from '@ionic/angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { Subscription } from 'rxjs';
import { PortService, CategoryService } from '../services';
import { Port } from '../types';

declare var $;

@Component({
  selector: 'app-addbusiness',
  templateUrl: './addbusiness.page.html',
  styleUrls: ['./addbusiness.page.scss'],
})
export class AddbusinessPage implements OnInit {
  imgPreview = 'assets/images/blank-avatar.jpg';
  businessForm: FormGroup;
  user_id:any;
  businessname:any
  email:any
  state:any
  startaddress:any
  pincode:any
  firstname:any
  contactno:any
  city:any;
  loading: any;
  lastname:any;
  endaddress:any;
  finallogofile:any;
  filename:any;
  usertype:any;
  img1;
  whatsappno:any;
  validateField:any="false"
  avatar: any;
  fileData;
  cities: any = [];
  places: any = [];
  states: any = [];
  pincodes: any = [];
  ports: Port[];
  port: Port;
  page = 2;
  portsSubscription: Subscription;
  categorysSubscription: Subscription;
  categorys: any = [];

  emailvalidation = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+")){1,}@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  numbervalidation = /^[0-9,/]+$/;
  alphanumeric = /^[a-zA-Z0-9]+$/;
  alphawithdot = /^[a-zA-Z. ]+$/;
  decimalnumber = /^(0|[1-9]\d*)(\.\d+)?$/;
  passwordvalidation = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;


  private addbusinessApi = this.getdata.appconstant + 'bi/addBusiness';
  private addBusinessWithImageApi = this.getdata.appconstant + 'bi/addBusinessWithImage';
  private getAllCategoriesApi = this.getdata.appconstant + 'bi/getAllCategory';
  private fetchplaceApi = this.getdata.appconstant + 'bi/getPlace';
  private fetchpincodeApi = this.getdata.appconstant + 'bi/getPincode';
  private fetstateApi = this.getdata.appconstant + 'bi/getState';


  constructor(public loadingController: LoadingController,public toastController: ToastController,private Formbuilder: FormBuilder, private router: Router, private makeapi: WebserviceService, private http: Http, private getdata: DatatransferService, private portService: PortService, private categoryService: CategoryService) { 

    this.user_id = this.getdata.sessiondata()._id;
    this.lastname = this.getdata.sessiondata().lastname;
    this.endaddress = this.getdata.sessiondata().endaddress;
    this.email = this.getdata.sessiondata().email;
    this.state = this.getdata.sessiondata().state;
    this.startaddress = this.getdata.sessiondata().startaddress;
    this.pincode = this.getdata.sessiondata().pincode;
    this.firstname = this.getdata.sessiondata().firstname;
    this.city = this.getdata.sessiondata().city;
    this.contactno = this.getdata.sessiondata().contactno;
    this.whatsappno = this.getdata.sessiondata().whatsappno;
    this.usertype = this.getdata.sessiondata().usertype;

  


    this.businessForm = Formbuilder.group({
      'name': ['',Validators.compose([Validators.required])],
      'description': ['',Validators.compose([Validators.required])],
      'website': [''],
      'category' : ['',Validators.compose([Validators.required])],
      'state': ['', Validators.compose([Validators.required])],
      'city': ['', Validators.compose([Validators.required])],
      'pincode': ['', Validators.compose([Validators.required])],
      'endaddress': ['', Validators.compose([Validators.required])],
      'startaddress': ['', Validators.compose([Validators.required])],
      'template' : ['',Validators.compose([Validators.required])],
      'sun_start_time': [''],
      'sun_end_time': [''],
      'mon_start_time' : [''],
      'mon_end_time' : [''],
      'tues_start_time': [''],
      'tues_end_time': [''],
      'wed_start_time' : [''],
      'wed_end_time' : [''],
      'thurs_start_time': [''],
      'thurs_end_time': [''],
      'fri_start_time' : [''],
      'fri_end_time' : [''],
      'sat_start_time': [''],
      'sat_end_time': [''],


    });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    this.validateField = 'true';
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }
  
  ngOnInit() {
    this.loadCategories();
 
  }
  
  choose_file(event) {

    console.log(event.target.files)
    let fileList: FileList = event.target.files;
    console.log(fileList)
    if (fileList.length > 0) {
      let file: File = fileList[0];
      this.finallogofile = file;
      this.filename = this.finallogofile.name;

      console.log(this.filename);
      console.log(this.finallogofile)

    }
  }

  changeListener(event) {
    if(event.target.files && event.target.files[0]){
      let reader = new FileReader();

      reader.onload = (event:any) => {
        this.img1 = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
      let fileList: FileList = event.target.files;  
      let file: File = fileList[0];
      this.finallogofile = file;
      this.filename = this.finallogofile.name;
      console.log(file);
  }

  addbusiness() {

    this.presentLoading();
    if (this.businessForm.valid) {
        var reqdata = this.businessForm.value;
        
        if ((this.finallogofile != '') && (this.finallogofile != null) && (this.finallogofile != 'undefined') && (this.finallogofile != undefined)) {
            let finalformdata: FormData = new FormData();
            finalformdata.append("image", this.finallogofile);
            finalformdata.append("name", reqdata.name);
            finalformdata.append("description", reqdata.description);
            finalformdata.append("category", reqdata.category.name);
            finalformdata.append("city", reqdata.city.name);
            finalformdata.append("lastname", this.lastname);
            finalformdata.append("endaddress", reqdata.endaddress.place);
            finalformdata.append("state", reqdata.state);
            finalformdata.append("startaddress", reqdata.startaddress);
            finalformdata.append("pincode", reqdata.pincode);
            finalformdata.append("firstname", this.firstname);
            finalformdata.append("contactno", this.contactno);
            finalformdata.append("whatsappno", this.whatsappno);
            finalformdata.append("user_id", this.user_id);
            finalformdata.append("email", this.email);
            finalformdata.append("template", reqdata.template);
            finalformdata.append("website", reqdata.website);
         
            finalformdata.append("sun_start_time", reqdata.sun_start_time);
            finalformdata.append("sun_end_time", reqdata.sun_end_time);
            finalformdata.append("mon_start_time", reqdata.mon_start_time);
            finalformdata.append("mon_end_time", reqdata.mon_start_time);
            finalformdata.append("tues_start_time", reqdata.tues_start_time);
            finalformdata.append("tues_end_time", reqdata.tues_end_time);
            finalformdata.append("wed_start_time", reqdata.wed_start_time);
            finalformdata.append("wed_end_time", reqdata.wed_end_time);
            finalformdata.append("thurs_start_time", reqdata.thurs_start_time);
            finalformdata.append("thurs_end_time", reqdata.thurs_end_time);
            finalformdata.append("fri_start_time", reqdata.fri_start_time);
            finalformdata.append("fri_end_time", reqdata.fri_end_time);
            finalformdata.append("sat_start_time", reqdata.sat_start_time);
            finalformdata.append("sat_end_time", reqdata.sat_end_time);

            return this.makeapi.method(this.addBusinessWithImageApi, finalformdata, 'file')
                .subscribe(
                    data => {
                        if (data.message == "Success") {
                          
                            this.loading.dismiss().then(() => {
                                this.router.navigate(['/yourbusiness']);
                               
                            });

                        } else {
                          this.presentToast(data.message);
                            this.loading.dismiss().then(() => {

                            });
                        }
                    },
                    Error => {});

        } else {

           console.log(reqdata);
          //  reqdata.city=this.city;
           reqdata.lastname=this.lastname;
          //  reqdata.endaddress=this.endaddress;
           reqdata.email=this.email;
          //  reqdata.state=this.state;
          //  reqdata.startaddress=this.startaddress;
          //  reqdata.pincode=this.pincode;
           reqdata.firstname=this.firstname;
           reqdata.contactno=this.contactno;
           reqdata.whatsappno=this.whatsappno;
           reqdata.city = reqdata.city.name;
           reqdata.endaddress = reqdata.endaddress.place;
           reqdata.category = reqdata.category.name;
           reqdata.user_id = this.user_id;

            return this.makeapi.method(this.addbusinessApi, reqdata, 'post')
                .subscribe(data => {
                        if (data.message == "Success") {
                            this.loading.dismiss().then(() => {
                                this.router.navigate(['/yourbusiness']);

                            });
                        } else {
                          this.presentToast(data.message);
                            this.loading.dismiss().then(() => {

                            });
                        }

                    },
                    Error => {});
        }
    } else {
        this.markFormGroupTouched(this.businessForm);
    }
}

async presentToast(msg) {
  const toast = await this.toastController.create({
    message: msg,
    duration: 2000
  });
  toast.present();
}

  async presentLoading() {
    this.loading = await this.loadingController.create({
        message: 'Please wait',
        duration: 2000
    });
    return await this.loading.present();
}

  categories:any;
  loadCategories() {
    console.log(1)
    return this.makeapi.method(this.getAllCategoriesApi, '', "post")
      .subscribe(data => {
        console.log(data)
        this.categories = data.result;
      },
        Error => {
        });
  }
  goback() {
    this.router.navigateByUrl('/yourbusiness');
  }

  filterPorts(ports: Port[], text: string) {
    return ports.filter(port => {
      return port.name.toLowerCase().indexOf(text) !== -1;
    });
  }

  searchPorts(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    let text = event.text.trim().toLowerCase();
    event.component.startSearch();

    // Close any running subscription.
    if (this.portsSubscription) {
      this.portsSubscription.unsubscribe();
    }

    if (!text) {
      // Close any running subscription.
      if (this.portsSubscription) {
        this.portsSubscription.unsubscribe();
      }

      event.component.items = this.portService.getPorts(1, 15);

      // Enable and start infinite scroll from the beginning.
      this.page = 2;
      event.component.endSearch();
      event.component.enableInfiniteScroll();
      return;
    }

    this.portsSubscription = this.portService.getPortsAsync().subscribe(ports => {
      // Subscription will be closed when unsubscribed manually.
      if (this.portsSubscription.closed) {
        return;
      }

      event.component.items = this.filterPorts(ports, text);
      event.component.endSearch();
    });
  }

  getMorePorts(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    let text = (event.text || '').trim().toLowerCase();

    // There're no more ports - disable infinite scroll.
    if (this.page > 300) {
      event.component.disableInfiniteScroll();
      return;
    }

    this.portService.getPortsAsync(this.page, 15).subscribe(ports => {
      ports = event.component.items.concat(ports);

      if (text) {
        ports = this.filterPorts(ports, text);
      }

      event.component.items = ports;
      event.component.endInfiniteScroll();
      this.page++;
    });
  }

  filterCategorys(ports: Port[], text: string) {
    return ports.filter(port => {
      return port.name.toLowerCase().indexOf(text) !== -1;
    });
  }

  searchCategory(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    let text = event.text.trim().toLowerCase();
    event.component.startSearch();

    // Close any running subscription.
    if (this.categorysSubscription) {
      this.categorysSubscription.unsubscribe();
    }

    if (!text) {
      // Close any running subscription.
      if (this.categorysSubscription) {
        this.categorysSubscription.unsubscribe();
      }

      event.component.items = this.categoryService.getPorts(1, 15);

      // Enable and start infinite scroll from the beginning.
      this.page = 2;
      event.component.endSearch();
      event.component.enableInfiniteScroll();
      return;
    }

    this.categorysSubscription = this.categoryService.getPortsAsync().subscribe(ports => {
      // Subscription will be closed when unsubscribed manually.
      if (this.categorysSubscription.closed) {
        return;
      }

      event.component.items = this.filterCategorys(ports, text);
      event.component.endSearch();
    });
  }

  getMoreCategorys(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    let text = (event.text || '').trim().toLowerCase();

    // There're no more ports - disable infinite scroll.
    if (this.page > 300) {
      event.component.disableInfiniteScroll();
      return;
    }

    this.categoryService.getPortsAsync(this.page, 15).subscribe(ports => {
      ports = event.component.items.concat(ports);

      if (text) {
        ports = this.filterCategorys(ports, text);
      }

      event.component.items = ports;
      event.component.endInfiniteScroll();
      this.page++;
    });
  }

  district: any;
  getplace(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    this.presentLoading();
    this.district = event.value.country.ports[0].name;
    var reqdata = { 'city': event.value.country.ports[0].name };
    return this.makeapi.method(this.fetchplaceApi, reqdata, "post")
      .subscribe(data => {
        this.loading.dismiss().then(() => {
          // this.places = data.result;
          var json = data.result;
          this.places = json.reduceRight(function (r, a) {
            r.some(function (b) { return a.place === b.place; }) || r.push(a);
            return r;
          }, []);
        });
      },
        Error => {
          this.loading.dismiss();
        });

  }

  getstateList(keyvalue) {
    this.presentLoading();
    var reqdata = { 'pincode': keyvalue };
    return this.makeapi.method(this.fetstateApi, reqdata, "post")
      .subscribe(data => {
        this.loading.dismiss().then(() => {
          var json = data.result;
          // this.states
          this.states = json.reduceRight(function (r, a) {
            r.some(function (b) { return a.state === b.state; }) || r.push(a);
            return r;
          }, []);
        });

      },
        Error => {
          this.loading.dismiss();
        });
  }

  getpincode(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    this.presentLoading();
    var reqdata = { 'place': event.value.place, 'city': this.district };
    return this.makeapi.method(this.fetchpincodeApi, reqdata, "post")
      .subscribe(data => {
        this.loading.dismiss().then(() => {
          // this.pincodes = data.result;
          var json = data.result;
          this.pincodes = json.reduceRight(function (r, a) {
            r.some(function (b) { return a.place === b.place; }) || r.push(a);
            return r;
          }, []);
        });

      },
        Error => {
          this.loading.dismiss();
        });
  }
  
  
}


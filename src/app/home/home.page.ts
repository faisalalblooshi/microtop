import { Component, ViewChild } from '@angular/core';
import { IonContent, LoadingController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AngularFirestore } from 'angularfire2/firestore';
import { AlertController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  contactUs:FormGroup;cusemail;
  subscription:FormGroup;
  seg;mobile;options=[];
  @ViewChild(IonContent,{static :true}) content: IonContent;
  public isShown: boolean = false;loading;
  constructor(public platform:Platform,public loadingCtrl: LoadingController, private formBuilder: FormBuilder,private afs:AngularFirestore,private alertCtrl: AlertController) { 
    this.seg='Home'

   

    var TxtRotate = function(el, toRotate, period) {
      this.toRotate = toRotate;
      this.el = el;
      this.loopNum = 0;
      this.period = parseInt(period, 10) || 2000;
      this.txt = '';
      this.tick();
      this.isDeleting = false;
    };
    
    TxtRotate.prototype.tick = function() {
      var i = this.loopNum % this.toRotate.length;
      var fullTxt = this.toRotate[i];
    
      if (this.isDeleting) {
        this.txt = fullTxt.substring(0, this.txt.length - 1);
      } else {
        this.txt = fullTxt.substring(0, this.txt.length + 1);
      }
    
      this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';
    
      var that = this;
      var delta = 300 - Math.random() * 100;
    
      if (this.isDeleting) { delta /= 2; }
    
      if (!this.isDeleting && this.txt === fullTxt) {
        delta = this.period;
        this.isDeleting = true;
      } else if (this.isDeleting && this.txt === '') {
        this.isDeleting = false;
        this.loopNum++;
        delta = 500;
      }
    
      setTimeout(function() {
        that.tick();
      }, delta);
    };
    
    window.onload = function() {
      var elements = document.getElementsByClassName('txt-rotate');
      for (var i=0; i<elements.length; i++) {
        var toRotate = elements[i].getAttribute('data-rotate');
        var period = elements[i].getAttribute('data-period');
        if (toRotate) {
          new TxtRotate(elements[i], JSON.parse(toRotate), period);
        }
      }
      // INJECT CSS
      var css = document.createElement("style");
      css.type = "text/css";
      css.innerHTML = ".txt-rotate > .wrap { border-right: 0.08em solid #666 }";
      document.body.appendChild(css);
    };
   
  }

  scrollTo(element:string) {
    if(element=='home'){
      this.content.scrollToTop(2000);
    }
    else{
      let yOffset = document.getElementById(element).offsetTop;
    this.content.scrollToPoint(0, yOffset, 2000)

    }
    
  }
  ngOnInit() {  
    this.subscription=this.formBuilder.group({
      subemail: ['', Validators.compose([Validators.maxLength(70), Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'), Validators.required])]
         
    })    
          this.contactUs = this.formBuilder.group({
           
            Mobile : new FormControl('', [
              Validators.required,
              Validators.pattern("^[0-9]*$"),
              Validators.minLength(8),
            ]),
            LastName : new FormControl('', Validators.required),
            more : new FormControl('', Validators.required),
            FirstName: new FormControl('',Validators.required),
            email: ['', Validators.compose([Validators.maxLength(70), Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'), Validators.required])]
          });

       
        }

        onSubmit(values){
          this.presentLoadingDefault();
          var id=this.afs.createId()
          this.afs.doc(`Bahrain/${id}`).set({
            fname:this.contactUs.value.FirstName,
            lname:this.contactUs.value.LastName,
           more:this.contactUs.value.more,
           email:this.contactUs.value.email,
           phone:this.contactUs.value.Mobile,
          createdon: new Date(),
          options:this.options
         
                   }).then(()=>{
                     this.loading.dismiss().then(()=>{
                        this.presentAlert()
                     })
                    
                   })
        }
      add(value){
        if(this.options.includes(value)){
          var i=this.options.indexOf(value)
          this.options.splice(i,1)
        }
        else{
this.options.push(value)
        }
      }
      async  presentAlert() {
        let alert =await this.alertCtrl.create({
          header: 'Thank you for your Interest in Microtop',
          message: 'Someone from our team will contact you shortly...',
          buttons: [  {
            text: 'Okay',
            handler: () => {
              location.reload();
            }}]
        });
       await alert.present()
      }
      logScrollStart(){
      }
      logScrolling(){

      }
      logScrollEnd(){
      }
    async  presentLoadingDefault() {
         this.loading =await this.loadingCtrl.create({
          message: 'Please wait...'
        });
      
       await this.loading.present();
      
      }
      mailto(email) {
        window.open(`mailto:${email}`, '_system');
     }
     onEmail(value){
      var id=this.afs.createId()
      this.afs.doc(`Subscriptions/${id}`).set({
       email:this.subscription.value.subemail
     
               }).then(()=>{
                this.joinmail()
                
               })

     }
     async  joinmail() {
      let alert =await this.alertCtrl.create({
        message: 'Subscribed to Newsletter successfully!',
        buttons: [  {
          text: 'Okay',
          handler: () => {
            this.cusemail=''
          }}]
      });
     await alert.present()
    }
  
}

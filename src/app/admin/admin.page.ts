import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import * as firebase from 'firebase/app';
import { firebaseConfig } from '../credentials';

import { AngularFirestore } from 'angularfire2/firestore';
firebase.initializeApp(firebaseConfig)
@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
contactuses=[];show=false;
  constructor(private alertCtrl:AlertController,private afstore:AngularFirestore) {
    this.afstore.collection('Bahrain',ref=>(ref.orderBy('createdon',"desc"))).get().subscribe((contactus)=>{
contactus.forEach((contact)=>{
  if(contact.data().options.length>0){
     this.contactuses.push({
    fname:contact.data().fname,
    lname:contact.data().lname,
    email:contact.data().email,
    phone:contact.data().phone,
    options:contact.data().options,
    more:contact.data().more,
    date:contact.data().createdon.toDate()
    
  })
  }
  else{
    this.contactuses.push({
      fname:contact.data().fname,
      lname:contact.data().lname,
      email:contact.data().email,
      phone:contact.data().phone,
      more:contact.data().more,
      date:contact.data().createdon.toDate(),
      options:'N/A',
      
    })

  }
 
})
    })
    console.log(this.contactuses)

   }

  ngOnInit() {
  }
  ionViewWillEnter(){
    this.presentPrompt()

  }
 async presentPrompt() {
    let alert =await this.alertCtrl.create({
      backdropDismiss :false,
      message: 'Authentication Required',
      inputs: [
        {
          name: 'username',
          placeholder: 'Email'
        },
        {
          name: 'password',
          placeholder: 'Password',
          type: 'password'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Login',
          handler: data => {
           firebase.auth().signInWithEmailAndPassword(data.username,data.password).then((user)=>{
            this.show=true;

           }).catch((err)=>{
             this.presentPrompt()
           })
          
          }
        }
      ]
    });
  await  alert.present();
  }

}

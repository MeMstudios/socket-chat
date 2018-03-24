import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';


/**
 * Generated class for the ChatRoomPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat-room',
  templateUrl: 'chat-room.html',
})
export class ChatRoomPage {
  messages = [];
  nickname = '';
  message = '';
  typeEvent = {};
 //typing = false;
 
  constructor(private navCtrl: NavController, private navParams: NavParams, private socket: Socket, private toastCtrl: ToastController) {
    this.nickname = this.navParams.get('nickname');
 
    this.getMessages().subscribe(message => {
      this.messages.push(message);
    });
    this.getTyping().subscribe(isTyping => {
      this.typeEvent = isTyping;
    });
 
    this.getUsers().subscribe(data => {
      let user = data['user'];
      if (data['event'] === 'left') {
        this.showToast('User left: ' + user);
      } else {
        this.showToast('User joined: ' + user);
      }
    });
    /*
    this.isTyping().subscribe(typing => {
      let user = typing['user'];
      if (typing['event'] === 'isTyping') {
        this.showToast(user + ' is typing...');
      } else {
        this.showToast(user + ' stopped typing.');
      }
    });
    */
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatRoomPage');
  }

  sendMessage() {
    this.socket.emit('add-message', { text: this.message });
    this.message = '';
  }
 
  getMessages() {
    let observable = new Observable(observer => {
      this.socket.on('message', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }
 
  getUsers() {
    let observable = new Observable(observer => {
      this.socket.on('users-changed', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  typing(event: KeyboardEvent) {
    //var now = moment().milliseconds();
    this.socket.emit('typing');
    
  }
  getTyping() {
    let observable = new Observable(observer => {
      this.socket.on('isTyping', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }

  ionViewWillLeave() {
    this.socket.disconnect();
  }
 
  showToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

}

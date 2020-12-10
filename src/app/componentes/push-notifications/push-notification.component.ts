import { Component, OnInit } from '@angular/core';
import { PushNotificationsService } from 'ng-push-ivy';
import { WebsocketService } from '../../services/websocket.service';
import { NotificationService } from '../../services/notification.service';
import { AppNotification } from '../../models/app-notification';

const icon = new Map([
  ['info', 'assets/bell-info.png'],
  ['warn', 'assets/bell-warning.png']
]);
@Component({
  selector: 'app-root',
  templateUrl: './push-notification.component.html',
  styleUrls: ['./push-notification.component.scss']
})
export class AppComponent implements OnInit {

  title = 'Web push Notifications!';
  counter: number;

  constructor(private pushNotifications: PushNotificationsService,
              private notificationService: NotificationService,
              private websocketService: WebsocketService) {
    this.pushNotifications.requestPermission();
    // this.counter = 0;
  }

  ngOnInit() {
    if(localStorage.getItem('counter') == null){
      localStorage.setItem('counter', "0");
    }
    this.counter = parseInt(localStorage.getItem('counter'))
    this.connect();
  }
  connect(): void {
    this.websocketService.connect();

    this.counter = parseInt(localStorage.getItem('counter'))
    console.log("connect")
    // subscribe receives the value.
    this.notificationService.notificationMessage.subscribe((data) => {
      console.log('receive message', data);
      this.notify(data);
    });
  }

  disconnect(): void {
    this.websocketService.disconnect();
  }


  notify(message: AppNotification): void {
    // this.counter++;
    let counterLocal = parseInt(localStorage.getItem('counter'))
    counterLocal++
    console.log(this.counter)
    console.log(counterLocal)
    localStorage.setItem('counter', counterLocal.toString()) 

    const options = {
      body: message.content,
      icon: icon.get(message.type.toLowerCase())
    };
    this.pushNotifications.create('New Alert', options).subscribe(
      res => console.log(res),
      err => console.log(err)
    );
  }
}

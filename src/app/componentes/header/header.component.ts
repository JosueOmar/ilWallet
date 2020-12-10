import { Component, OnInit } from '@angular/core';
import { PushNotificationsService } from 'ng-push-ivy';
import { WebsocketService } from '../../services/websocket.service';
import { NotificationService } from '../../services/notification.service';
import { AppNotification } from '../../models/app-notification';
import {NgxNotificationDirection, NgxNotificationMsgService, NgxNotificationStatusMsg} from 'ngx-notification-msg'

const icon = new Map([
  ['info', 'assets/bell-info.png'],
  ['warn', 'assets/bell-warning.png']
]);
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  counter: number;
  constructor(private readonly ngxNotificationMsgService: NgxNotificationMsgService, private pushNotifications: PushNotificationsService,
    private notificationService: NotificationService,
    private websocketService: WebsocketService) {
this.pushNotifications.requestPermission();
this.counter = 0;


}

  ngOnInit(): void {
    this.connect();
  }
  connect(): void {
    this.websocketService.connect();

    // subscribe receives the value.
    this.notificationService.notificationMessage.subscribe((data) => {
      console.log('receive message', data);
      this.notify(data);
    });
  }
  notify(message: AppNotification): void {
    console.log(JSON.parse(localStorage.getItem('dataUser')).id)
    console.log(message.clienteId)
    if(message.clienteId == JSON.parse(localStorage.getItem('dataUser')).id){

      this.counter++;
      const options = {
        body: message.content,
        icon: icon.get(message.type.toLowerCase())
      };
      this.pushNotifications.create('New Alert', options).subscribe(
        res => console.log(res),
        err => console.log(err)
        );
        
        this.ngxNotificationMsgService.open({
          status: NgxNotificationStatusMsg.SUCCESS,
      header: 'Wallet',
      messages: [options.body],
      direction: NgxNotificationDirection.TOP_RIGHT,
      delay: 10000,
      displayProgressBar : true
    });
  }
    
  }
}

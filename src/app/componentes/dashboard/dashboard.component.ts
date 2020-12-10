import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../../services/cliente.service';
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
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public clientes: any = []
  public idCliente: any = 0
  public clienteData: any = {}
  public name: any = ''

  constructor(private ClienteService: ClienteService, private readonly ngxNotificationMsgService: NgxNotificationMsgService, private pushNotifications: PushNotificationsService,
    private notificationService: NotificationService,
    private websocketService: WebsocketService) { 
      this.pushNotifications.requestPermission();
    }

  ngOnInit(): void {
    this.getClientes();
    this.connect();
    // this.wiwi()
  }

  getClientes() {
    this.ClienteService.getClientes()
      .subscribe(
        res => {
          this.clientes = res;
          this.filteCliente(this.clientes)
          console.log(res)
        },
        err => console.error(err)
      );
  }

  filteCliente(clientes: any) {
    this.idCliente = JSON.parse(localStorage.getItem('dataUser')).id
    this.clienteData = clientes.filter((cliente: any) => {
      return cliente.clienteId == this.idCliente
    })

    console.log('this.clienteData', this.clienteData)
    this.name = this.clienteData[0].nombre
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

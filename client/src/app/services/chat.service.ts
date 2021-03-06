import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs/Rx';
import {WebsocketService} from './websocket.service';

export interface Message {
  author: string,
  message: string
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  public message: Subject<Message>;
  // CHAT_URL = 'wss://stormy-crag-43772.herokuapp.com';
  CHAT_URL = 'ws://localhost:8080';

  constructor(
    private wsService:WebsocketService
  ){
    this.message = <Subject<any>>wsService
    .connect(this.CHAT_URL) 
    .map((response:MessageEvent) =>{
        let data = JSON.parse(response.data);
        // console.log(JSON.parse(response.data));
        return data;
    })
  }
}

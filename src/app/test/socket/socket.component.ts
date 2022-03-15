import { Component, OnInit } from '@angular/core';
import Pusher from 'pusher-js';
import { Subject, Observable } from 'rxjs';
import { Chat } from './chat';
import { HttpService } from './../../http.service';

@Component({
	selector: 'app-socket',
	templateUrl: './socket.component.html',
	styleUrls: ['./socket.component.scss']
})
export class SocketComponent implements OnInit {

	public chats: Chat[];
	public inputchat: string;

	constructor(
		private http: HttpService,
	) { 
		this.chats = [];
	}

	ngOnInit(): void {
		this.initEcho();
	}

	public initEcho(){
		var pusherClient = new Pusher('9c3d01b311d85e369fd4', {
			cluster: 'ap1'
		});
		const channel = pusherClient.subscribe('video.1');
		pusherClient.bind(
			'video_chat',
			(data: {body: string, created_at: string, user: any}) => {
				this.chats.push(new Chat(data.user, data.body, new Date(data.created_at)));
				setTimeout(()=>{
					var objDiv = document.getElementById("dialog");
					objDiv.scrollTop = objDiv.scrollHeight;
				}, 20);
			}
		);
	}

	public doChat(){
		const params = {
			body: this.inputchat,
			videoId: 1,
		};
		this.http.sendPostRequest('testDoChat', params).subscribe((response)=>{

		}, (error)=>{

		});
	}

}

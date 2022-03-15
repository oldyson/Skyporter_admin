import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { HttpService } from './../../http.service';
import { GlobalService } from './../../global.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

	public email: string;
	public fullname: string;
	public gender: string;
	public church: any;

  constructor(
  	private cookie: CookieService,
  	private http: HttpService,
  	public global: GlobalService,
	) { 
  	this.email = "";
  	this.fullname = "";
  	this.gender = "";

  	this.church = JSON.parse(localStorage.getItem('church'));
	}

  ngOnInit(): void {
  	if(this.cookie.get('username')) {
  		this.fullname = this.cookie.get('username');
  	}

  	if(this.cookie.get('usergender')) {
  		this.gender = this.cookie.get('usergender');
  	}

  	if(this.cookie.get('useremail')) {
  		this.email = this.cookie.get('useremail');
  	}
  }

}

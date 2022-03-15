import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { HttpService } from './../../../http.service';
import { GlobalService } from './../../../global.service';
import {
	faList as fasList
} from '@fortawesome/pro-solid-svg-icons';
import * as $ from 'jquery';

@Component({
	selector: 'app-admin-routing',
	templateUrl: './admin-routing.component.html',
	styleUrls: ['./admin-routing.component.scss']
})
export class AdminRoutingComponent implements OnInit {

	public username: string;
	public fasList = fasList;
	public menus: any;
	public church: any;

	constructor(
		public cookie: CookieService,
		private http: HttpService,
		private router: Router,
		private global: GlobalService
	) {
		// CHECK dulu apakah cookie user name tersedia?
		if (!this.cookie.check('username')) {
			this.clearStorage();
		}
		if (localStorage.getItem('applicationfeatures') == null
			|| localStorage.getItem('church') == null) {
			this.clearStorage();
		}
		// kalo sessionnya ga ketemu keluar

		this.username = this.cookie.get('username');
		this.menus = JSON.parse(localStorage.getItem('applicationfeatures'));
		this.church = JSON.parse(localStorage.getItem('church'));

		this.menus.forEach(($ii) => {
			$ii.showdetail = false;
		});
	}

	ngOnInit(): void {

		$('#menu-toggle').click((e) => {
			e.preventDefault();
			$('#wrapper').toggleClass('toggled');
		});
	}

	public toggleDetail($index): void {
		const prev = this.menus[$index].showdetail;
		// hide semua
		this.menus.forEach(($ii) => {
			$ii.showdetail = false;
		});
		this.menus[$index].showdetail = prev ? false : true;
	}

	public setCurrentPage($header, $detail): void {
		localStorage.setItem('currentpage', JSON.stringify($detail));
		localStorage.setItem('currentheaderpage', JSON.stringify($header));
	}

	public logout(): void {
		const self = this;
		const params = {
			deviceToken: 'nothing'
		};
		this.http.sendPostRequest2('auth/logout', params).subscribe(() => {
			self.clearStorage();
		}, () => {
			self.clearStorage();
		});
	}

	public clearStorage(): void {
		this.global.admin = null;
		if (localStorage.getItem('applicationfeatures')) {
			localStorage.removeItem('applicationfeatures');
		}
		if (localStorage.getItem('church')) {
			localStorage.removeItem('church');
		}
		this.cookie.delete('username');
		this.cookie.delete('useremail');
		this.cookie.delete('usergender');
		this.cookie.delete('accessToken');
		this.router.navigateByUrl('');
	}

}

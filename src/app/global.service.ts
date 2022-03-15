import { Injectable } from '@angular/core';
import { environment } from './../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
	providedIn: 'root'
})
export class GlobalService {
	public api: string;

	public clientPublicIP: string = null;
	public accessToken: string = null;
	public tokenType: string = null;
	public defaultresolution: number;
	public version = '';
	public bodybackground: string = null;
	public bodybackgroundimage: string = null;
	public loginmodalshown = false;
	public refreshstatus = 0;

	public videogroupcategories = [];
	public timediff: number;
	public defaultpaginate: number;

	public admin: any; // ini seluruh data admin
	public appName: string;

	constructor(
		private cookie: CookieService,
		private router: Router
	) {
		this.api = this.setProtocol(environment.apiUrl);
		this.defaultresolution = 720;
		this.version = environment.version;
		this.appName = environment.appName;
		this.refreshstatus = 0;
		this.defaultpaginate = 12;
	}

	public setProtocol(url: string): string {
		if (url != null) {
			if (location.protocol !== 'https:' ) {
				// kalo http
				return url.replace('https://', 'https://');
			} else if (location.protocol === 'https:') {
				// ubah jadi https
				return url.replace('http://', 'https://');
			}
		}
		return '';
	}

	public resetbackground(): void {
		this.bodybackground = 'white';
		this.bodybackgroundimage = null;
	}

}

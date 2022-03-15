import { Injectable } from '@angular/core';
import { environment } from './../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalService } from './global.service';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
	providedIn: 'root'
})
export class HttpService {

	constructor(
		private httpClient: HttpClient,
		private global: GlobalService,
		private cookie: CookieService,
		private router: Router,
	) { }

	sendGetRequest(url: string): Observable<object> {
		const reqHeader = new HttpHeaders({
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Credentials': 'true',
			'Access-Control-Allow-Headers': 'Content-Type',
		});
		return this.httpClient.get(this.global.api + url, { headers: reqHeader });
	}

	sendPostRequest(url: string, data: object): Observable<object> {
		const reqHeader = new HttpHeaders({
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Credentials': 'true',
			'Access-Control-Allow-Headers': 'Content-Type',
		});
		return this.httpClient.post(this.global.api + url, data, {
			headers: reqHeader
		});
	}

	sendPostRequest2(url: string, params: object = null): Observable<object> {
		const accessToken = this.cookie.get('accessToken');
		const reqHeader = new HttpHeaders({
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + accessToken,
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Credentials': 'true',
			'Access-Control-Allow-Headers': 'Content-Type',
		});
		const sendParams = {
			adminPass: environment.adminPass
		};
		if (params != null) {
			Object.assign(sendParams, params);
		}
		return this.httpClient.post(this.global.api + url, sendParams, {
			headers: reqHeader
		});
	}

	sendGetRequest2(url: string, params: any = null): Observable<object> {
		const accessToken = this.cookie.get('accessToken');
		const reqHeader = new HttpHeaders({
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + accessToken,
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Credentials': 'true',
			'Access-Control-Allow-Headers': 'Content-Type',
		});
		const sendParams = {
			adminPass: environment.adminPass
		};
		if (params != null) {
			Object.assign(sendParams, params);
		}
		return this.httpClient.get(this.global.api + url, { headers: reqHeader, params: sendParams });
	}

	sendPostUpload(url: string, data: FormData, extra = null): Observable<object> {
		const accessToken = this.cookie.get('accessToken');
		const reqHeader = new HttpHeaders({
			Authorization: 'Bearer ' + accessToken,
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Credentials': 'true',
			'Access-Control-Allow-Headers': 'Content-Type',
		});
		const p3 = {
			headers: reqHeader,
		};
		if (extra != null) {
			Object.assign(p3, extra);
		}
		data.append('adminPass', environment.adminPass);

		return this.httpClient.post(this.global.api + url, data, p3);
	}


	public dologout(url= null): void  {
		const self = this;
		this.logoutajax(() => {

			self.global.accessToken = null;
			self.global.tokenType = null;

			self.cookie.delete('accessToken', '/');
			self.cookie.delete('tokenType', '/');

			if (url == null) {
				window.location.reload();
			} else {
				self.router.navigateByUrl(url);
			}
		}, () => {
			self.global.accessToken = null;
			self.global.tokenType = null;

			self.cookie.delete('accessToken', '/');
			self.cookie.delete('tokenType', '/');

			if (url == null) {
				window.location.reload();
			} else {
				self.router.navigateByUrl(url);
			}
		});
	}

	public logoutajax(whendone = null, whenfailed = null): void  {
		const data = {

		};
		this.sendPostRequest2('logout', data).subscribe((response: any) =>  {
			if (response != null) {
				if (whendone instanceof Function) {
					whendone(response);
				} else {
					console.log('Need callback function whendone in header.component.ts on deleteajax function');
				}
			} else {
				// kalo token dibuang dari twcdevices, dia masuk ke sini
				if (whenfailed instanceof Function) {
					console.log('Error: return delete api was null');
					whenfailed('');
				}
			}
		}, (error: any) => {
			// kalo token expired dia masuk kesini / server down
			console.log(error, 'error');
			whenfailed();
		});
	}

	public getNowTime(whendone= null): void {
		let nowtime = null;
		const xhr = new XMLHttpRequest();
		xhr.open('GET', this.global.api + 'nowtime');
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.onload = (): void =>  {
			if (xhr.status === 200) {
				nowtime = xhr.responseText;
			} else if (xhr.status !== 200 ) {
				nowtime = null;
			}

			if (whendone instanceof Function) {
				nowtime = new Date(nowtime);
				whendone(nowtime);
			}
			return nowtime;
		};
		xhr.send();
	}

	public clientPublicIPajax(whendone= null, whenfailed= null): void {
		this.httpClient.get('https://api.ipify.org?format=json').subscribe((response: any) =>  {
			if (response != null) {
				if (whendone instanceof Function) {
					whendone(response);
				} else {
					console.log('Need callback function getclientpublicip in http.service.ts on clientPublicIPajax function');
				}
			} else {
				if (whenfailed instanceof Function) {
					console.log('Error: return getclientpublicip api was null');
					whenfailed('');
				}
			}
		});
	}

	public sendGetResourceFile(url: string): Observable<object> {
		const reqHeader = new HttpHeaders({
			'Content-Type': 'application/json',
			'Accept': '*',
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Credentials': 'true',
			'Access-Control-Allow-Methods': 'GET',
			'Access-Control-Allow-Headers': 'Content-Type',
			'Content-Disposition': 'attachment'
		});
		return this.httpClient.get(url, {responseType: 'blob' as 'json'});
	}
}

import { Component, OnInit, ViewChild } from '@angular/core';
import swal from 'sweetalert2';
import { environment } from './../../../../environments/environment';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { HttpService } from './../../../http.service';
import { GlobalService } from './../../../global.service';
import { PopupModalComponent } from './../../../components/popup-modal/popup-modal.component';
import * as $ from 'jquery';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

	@ViewChild('mymodal', {static: false}) private modal: PopupModalComponent;
	public user: any;
	public isloading: boolean;
	public version: string;
	public lastUpdate: string;

	constructor(
		private http: HttpService,
		public global: GlobalService,
		private router: Router,
		private cookie: CookieService
	) {
		this.isloading = false;
		this.user = {
			username: environment.production ? '' : 'it@jpcc.org',
			password: environment.production ? '' : environment.adminPass,
			type: 'Admin'
		};
		this.version = environment.version;
		this.lastUpdate = environment.lastUpdate;
	}

	ngOnInit(): void {
		if(this.version != localStorage.getItem('last_version')){
			this.getAppchange();
			localStorage.setItem('last_version', environment.version);
		}
		// CHECK dulu apakah cookie user name tersedia?
		if (this.cookie.check('username')) {
			// this.router.navigateByUrl('admin');
			console.log('ada username');
		}
		if (localStorage.getItem('applicationfeatures') !== null
			|| localStorage.getItem('church') !== null) {
			// this.router.navigateByUrl('admin');
			console.log('ada localStorage');
		}
		// kalo sessionnya ketemu masuk ke loginan

		$('#username').focus();
	}

	public year(): string {
		return (new Date()).getFullYear() + '';
	}

	public login(): void {
		const ttl = 600;
		if (this.isloading === false) {
			this.isloading = true;
			this.http.sendPostRequest('auth/login', this.user).subscribe((response: any) => {
				if (response.api_status) {
					this.global.admin = response.data;
					try {
						localStorage.setItem('applicationfeatures', JSON.stringify(response.data.applicationfeatures));
						localStorage.setItem('church', JSON.stringify(response.data.church));

						this.cookie.set('username', response.data.user.fullname, ttl, '/');
						this.cookie.set('useremail', response.data.user.email, ttl, '/');
						this.cookie.set('usergender', response.data.user.gender, ttl, '/');
						this.cookie.set('accessToken', response.data.token, ttl, '/');


						/*let temp = '';
						let found = false;
						response.data.applicationfeatures.forEach(($ii) => {
							if ($ii.applicationfeaturedetails.length > 0) {
								$ii.applicationfeaturedetails.forEach(($jj) => {
									if ($jj.url != null && found === false) {
										temp += $jj.url;
										found = true;
									}
								});
							}
						});
						if (!found) {
							this.modal.show('Error', 'No Menu can be accessed.', 'danger');
						}
						this.router.navigateByUrl('/admin/' + temp);*/

						this.router.navigateByUrl('/admin');
					} catch (error) {
						// on error
						console.log(error);
					}
				} else {
					swal.fire({
						title: 'Error',
						text: response.message,
						icon: 'warning',
						confirmButtonText: 'OK',
					}).then(() => {
						// NOTHING
					});
				}
				this.isloading = false;
			}, (error: any) => {
				swal.fire({
					title: 'Error 505',
					text: error.message,
					icon: 'warning',
					confirmButtonText: 'OK',
				}).then(() => {
					// NOTHING
				});
				this.isloading = false;
			});
		}
	}

	public onInputKeydown(event, locFocus: string): void {
		if (event.key === 'Enter') {
			event.preventDefault();
			if (locFocus === 'username') {
				if (this.user.username.length <= 3) {
					$('#username').focus();
				} else {
					$('#password').focus();
				}
			} else if (locFocus === 'password') {
				if (this.user.username.length >= 4) {
					this.login();
				} else {
					$('#password').focus();
					$('#password').select();
				}
			}
		}
	}

	public getAppchange(){
		const params = {
			version: localStorage.getItem('last_version') ? localStorage.getItem('last_version') : null,
			type: 'web' 
		};
		this.http.sendGetRequest2('appchange/get-list', params).subscribe((response: any) => {
			if (response.api_status === true) {
				let patchnotes = "";
				if(response.data.appchanges.length > 0){
					patchnotes += "<div style='text-align: left'>";
					response.data.appchanges.forEach(($ii) => {
						patchnotes += "Version "+$ii.version+"<br>";
						patchnotes += "<ul>";
						$ii.appchangelogs.forEach(($jj) => {
							patchnotes += "<li>" + $jj.text + "</li>";
						});
						patchnotes += "</ul>";
					});
					patchnotes += "</div>";
				}
				if(patchnotes.length > 0){
					swal.fire({
						title: 'Patch Notes',
						html: patchnotes,
						confirmButtonText: 'OK',
					}).then(() => {
						// NOTHING
					});
				}
			} else {
				swal.fire({
					title: 'Error',
					text: response.message,
					icon: 'warning',
					confirmButtonText: 'OK',
				}).then(() => {
					// NOTHING
				});
			}
		}, (error: any) => {
			swal.fire({
				title: 'Error 505',
				text: error.message,
				icon: 'warning',
				confirmButtonText: 'OK',
			}).then(() => {
				// NOTHING
			});
		});
	}

}

import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from './../../../http.service';
import { HelperService } from './../../../helper.service';
import { GlobalService } from './../../../global.service';
import { UserdetailprogramComponent } from './userdetailprogram/userdetailprogram.component';
import swal from 'sweetalert2';


@Component({
	selector: 'app-userdetail',
	templateUrl: './userdetail.component.html',
	styleUrls: ['./userdetail.component.scss']
})
export class UserdetailComponent implements OnInit {

	@ViewChild('tabprogram', { static: false }) private tabprogram: UserdetailprogramComponent;

	public isloading: boolean;
	public userId: number;
	public user: any;
	public test: string = 'https://myjpcc.org/files/user/photos/asdf.jpg';
	public activeTab: string;

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private http: HttpService,
		private helper: HelperService,
		public global: GlobalService,
	) {
		this.isloading = false;
		this.activeTab = 'information';
		this.activatedRoute.queryParams.subscribe((params) => {
			this.userId = params['id'];
			this.activeTab = params['tab'] === 'information' || params['tab'] === 'program' || params['tab'] === 'journey' ? params['tab'] : 'information';
		});
	}

	ngOnInit(): void {
		this.getUserProfile();
	}

	public getUserProfile():void {
		if (this.isloading === false) {
			this.isloading = true;
			const params = {
				id: this.userId,
			};
			this.http.sendGetRequest2('user/profile', params).subscribe((response: any) => {
				if (response.api_status) {
					const nowtime = new Date();
					this.user = response.data.user;
					this.user.birthdate = this.helper.getDatetime(this.user.birthdate);
					this.user.birthplace = this.helper.toTitleCase(this.user.birthplace);
					let diff = '';
					if (this.user.birthdate != null) {
						const birth = new Date(this.user.birthdate);
						diff = this.helper.dateDiffInString(birth, nowtime);
					}
					this.user.age = diff;
					this.user.bloodtype = this.user.bloodtype?.toUpperCase();
					this.user.phone = this.helper.phoneToWAStyle(this.user.phone);
					if (this.user.userfamily != null) {
						this.user.userfamily.marriage_at = this.helper.getDatetime(this.user.userfamily.marriage_at);
						if (this.user.userfamily.userfamilychilds.length > 0) {
							this.user.userfamily.userfamilychilds.forEach((child) => {
								if (child.user == null) {
									child.birthday = this.helper.getDatetime(child.birthday);
									diff = '';
									if (child.birthday != null) {
										const birth = new Date(child.birthday);
										diff = this.helper.dateDiffInString(birth, nowtime);
									}
									child.age = diff;
								} else {
									child.user.birthdate = this.helper.getDatetime(child.user.birthdate);
									diff = '';
									if (child.user.birthdate != null) {
										const birth = new Date(child.user.birthdate);
										diff = this.helper.dateDiffInString(birth, nowtime);
									}
									child.age = diff;
								}
							});

							// kalo ada childnya, di sorting dari yg paling besar
							this.user.userfamily.userfamilychilds.sort(this.compare);
						}
					}
					this.user.baptismdate = this.helper.getDatetime(this.user.baptismdate);
					this.user.baptismcity = this.helper.toTitleCase(this.user.baptismcity);
					if (this.user.userprogramcodes.length > 0) {
						this.user.userprogramcodes.forEach((upc) => {
							upc.created_at = this.helper.getDatetime(upc.created_at);
							upc.updated_at = this.helper.getDatetime(upc.updated_at);
						});
					}
				} else {
					swal.fire({
						title: 'Error',
						text: response.message,
						icon: 'warning',
						confirmButtonText: 'OK',
					});
				}

				if (this.activeTab === 'program' && this.user != null) {
					// masuk sini kalo dari awal uda ke select program
					setTimeout(() => {
						this.tabprogram.getProgramHistory(this.user.id);
					}, 10);
				}

				this.isloading = false;
			}, (error: any) => {
				swal.fire({
					title: 'Error ' + error.status,
					html: this.helper.changeEOLToBr(error.error.message),
					icon: 'warning',
					confirmButtonText: 'OK',
				});
				this.isloading = false;
			});
		}
	}

	public setActiveTab(tabstring: string): void {
		this.activeTab = tabstring;
		if (tabstring === 'program' && this.user != null ) {
			// masuk sini kalo dari awal yang di select bukan program,
			// tapi pas klik program masuk ke sini
			setTimeout(() => {
				this.tabprogram.getProgramHistory(this.user.id);
			}, 10);
		}
	}

	public compare( a, b ): number {
		if ( a.age > b.age ) {
			return -1;
		}
		if ( a.age < b.age ) {
			return 1;
		}
		return 0;
	}

}

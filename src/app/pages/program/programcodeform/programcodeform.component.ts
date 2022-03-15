import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from './../../../http.service';
import { GlobalService } from './../../../global.service';
import { HelperService } from './../../../helper.service';
import { PopupModalComponent } from './../../../components/popup-modal/popup-modal.component';
import swal from 'sweetalert2';

import {
	faExclamationTriangle as fasExclamationTriangle,
} from '@fortawesome/pro-solid-svg-icons';

@Component({
	selector: 'app-programcodeform',
	templateUrl: './programcodeform.component.html',
	styleUrls: ['./programcodeform.component.scss']
})

export class ProgramcodeformComponent implements OnInit {
	@ViewChild('mymodal', {static: false}) private modal: PopupModalComponent;

	public fasExclamationTriangle = fasExclamationTriangle;
	public programCodeType: string;
	public programCodeId: string;
	public programcode: any;
	public gender: any;
	public ministryRoleList: any;
	public maritalStatusList: any;
	public smallgroupRoleList: any;
	public programCodeList: any;
	public ministryRoleAll: any;
	public maritalStatusAll: any;
	public programCodeAll: any;
	public smallgroupRoleAll: any;
	public saveLoading: boolean;
	public detailLoading: boolean;
	public getProgramCode: any;
	public tooltipMessage: any;
	public maskSgNameByChurch: string;

	constructor(
		private activatedRoute: ActivatedRoute,
		public http: HttpService,
		public global: GlobalService,
		public helper: HelperService,
		public router: Router,
	) {
		this.maskSgNameByChurch = JSON.parse(localStorage.getItem('applicationfeatures')).filter(item => item.name === 'small-group')[0]?.applicationfeaturechurches[0]?.showname || 'small group';
		this.programCodeType = this.activatedRoute.snapshot.paramMap.get('type').toLowerCase();
		this.programCodeType = this.programCodeType.charAt(0).toUpperCase() + this.programCodeType.slice(1);

		this.activatedRoute.queryParams.subscribe(params => {
			this.programCodeId = params.id;
		});

		this.saveLoading = false;
		this.detailLoading = false;

		this.tooltipMessage = {
			requiredFamily: 'Agar dapat mendaftar, peserta wajib telah mendaftarkan keluarganya di gereja.',
			requiredChild: 'Agar dapat mendaftar, peserta wajib telah mendaftarkan anggota anak di gereja.',
			requiredLeader: `Peserta yang mendaftar butuh persetujuan dari leader ${this.maskSgNameByChurch} pada group masing-masing.`,
			requiredAdmin: `Peserta yang mendaftar butuh persetujuan dari salah satu admin ${this.maskSgNameByChurch} yang terdaftar pada gereja.`,
			requiredUser: 'Pendaftar hanya dapat mendaftarkan (orang lain) yang sudah mempunyai account gereja. Untuk pembuat transaksi, wajib mempunyai account gereja.',
			requiredCouple: 'Peserta hanya mendaftar berpasang-pasangan (laki & perempuan) dan wajib tidak mempunyai  keluarga dan siap menikah',
			requiredFiles: 'Peserta dapat mengupload beberapa dokumen yang diperlukan',
			requiredSelectChild: 'Peserta wajib memilih anak yang ingin didaftarkan',
			requiredNewCouple: 'Peserta hanya mendaftar berpasang-pasangan (laki & perempuan) dan wajib tidak mempunyai  keluarga dan belum siap menikah',
			withSpouse: 'Suami / istri peserta akan ikut didaftarkan dalam '+ this.programCodeType + ' (peserta tetap bisa mendaftar walau tidak memiliki suami / istri)'
		};

		this.maritalStatusAll = {
			isloading: true,
			maritalstatuses: []
		};

		this.smallgroupRoleAll = {
			isloading: true,
			smallgroupmemberroles: []
		};

		this.programCodeAll = {
			isloading: true,
			programcodes: []
		};

		this.ministryRoleAll = {
			isloading: true,
			ministrymemberroles: []
		};

		this.ministryRoleList = [];
		this.maritalStatusList = [];
		this.programCodeList = [];
		this.smallgroupRoleList = [];
		this.getProgramCode = [];
		if (this.programCodeId == null) {
			this.programcode = {
				type: this.programCodeType,
				codename: null,
				name: null,
				numbersession: null,
				minattenddays: null,
				reqgender: null,
				reqfamily: false,
				reqchildren: false,
				leaderapproval: false,
				adminapproval: false,
				ministryroleid: null,
				classprerequisiteid: null,
				maritalstatusid: null,
				isuser: false,
				iscouple: false,
				isnewcouple: false,
				withspouse: false,
				agemin: null,
				agemax: null,
				isselectchild: false,
				isreqfiles: false,
				maritaldatemin: null,
				maritaldatemax: null,
				programcodereqsgroles: []
			};
			this.addProgramCodeReqSGRoleList();
		} else {
			this.getProgramCodeDetail(this.programCodeId);
		}

		this.gender = [
			{
				id: 'All',
				name: 'All',
			},
			{
				id: 'Male',
				name: 'Male',
			},
			{
				id: 'Female',
				name: 'Female',
			}
		];
		// smallgroupmemberroles:[{"smallgroupmemberrole_id":1, "iscoreteam":1}]
	}

	ngOnInit(): void {
		this.getMinistryRole();
		this.getMaritalStatus();
		this.getAllProgramCode();
		this.getAllSmallgroupRole();
	}

	public saveProgramCode(): void {
		if (this.saveLoading == false) {
			if (this.programcode.name == null) {
				swal.fire({
					title: 'Error',
					text: this.programCodeType+' Title must be filled',
					icon: 'warning',
					confirmButtonText: 'OK'
				});
				return;
			} else if (this.programcode.name.trim().length <= 4) {
				swal.fire({
					title: 'Warning',
					text: this.programCodeType+' Title length must be greater than 4 characters',
					icon: 'warning',
					confirmButtonText: 'OK'
				});
				return;
			} else if (this.programcode.numbersession == null) {
				swal.fire({
					title: 'Warning',
					text: this.programCodeType+' Total Session must be filled',
					icon: 'warning',
					confirmButtonText: 'OK'
				});
				return;
			} else if (this.programcode.minattenddays == null) {
				swal.fire({
					title: 'Warning',
					text: this.programCodeType+' Minimum Attend Days must be filled',
					icon: 'warning',
					confirmButtonText: 'OK'
				});
				return;
			} else if (this.programcode.agemin == null) {
				swal.fire({
					title: 'Warning',
					text: this.programCodeType+' Minimum Age must be filled',
					icon: 'warning',
					confirmButtonText: 'OK'
				});
				return;
			} else if (this.programcode.agemax == null) {
				swal.fire({
					title: 'Warning',
					text: this.programCodeType+' Maximum Age must be filled',
					icon: 'warning',
					confirmButtonText: 'OK'
				});
				return;
			} else if (this.programcode.reqgender == null) {
				swal.fire({
					title: 'Warning',
					text: this.programCodeType+' Gender must be filled',
					icon: 'warning',
					confirmButtonText: 'OK'
				});
				return;
			} else if (this.programcode.minattenddays > this.programcode.numbersession) {
				swal.fire({
					title: 'Warning',
					text: this.programCodeType+' Minimum Attend Days cannot more than '+this.programCodeType+' Total Session',
					icon: 'warning',
					confirmButtonText: 'OK'
				});
				return;
			} else if (this.programcode.agemin > this.programcode.agemax) {
				swal.fire({
					title: 'Warning',
					text: this.programCodeType+' Minimum Age cannot more than '+this.programCodeType+' Maximum Age',
					icon: 'warning',
					confirmButtonText: 'OK'
				});
				return;
			}
			this.saveLoading = true;
			if (this.programcode.gender == 'All') {
				this.programcode.gender = null;
			}
			this.programcode.classprerequisiteid = this.programCodeList.join(',');
			this.programcode.maritalstatusid = this.maritalStatusList.join(',');
			if (this.ministryRoleList != null) {
				this.programcode.ministryroleid = this.ministryRoleList.join(',');
			}
			this.programcode.reqfamily = this.programcode.reqfamily ? 1 : 0;
			this.programcode.reqchildren = this.programcode.reqchildren ? 1 : 0;
			this.programcode.leaderapproval = this.programcode.leaderapproval ? 1 : 0;
			this.programcode.adminapproval = this.programcode.adminapproval ? 1 : 0;
			this.programcode.isuser = this.programcode.isuser ? 1 : 0;
			this.programcode.iscouple = this.programcode.iscouple ? 1 : 0;
			const self = this;
			this.smallgroupRoleList.forEach(function (smallgroupRole) {
				self.programcode.programcodereqsgroles.splice(self.programcode.programcodereqsgroles.length, 0, {'smallgroupmemberrole_id': smallgroupRole.id, 'iscoreteam': smallgroupRole.iscoreteam});
			});
			this.programcode.programcodereqsgroles = JSON.stringify(this.programcode.programcodereqsgroles);
			if(!this.programcode.iscouple){
				this.programcode.maritaldatemax = null;
				this.programcode.maritaldatemin = null;
			}
			this.http.sendPostRequest2('programcode/save', this.programcode).subscribe((response: any) => {
				if (response.api_status) {
					swal.fire({
						title: 'Success',
						icon: 'success',
						confirmButtonText: 'OK'
					}).then(() => {
						self.router.navigateByUrl(`admin/program/${this.programCodeType.toLowerCase()}/list-code`);
					});
				}
			}, (error: any) => {
				console.log(error);
			});
		}
	}

	public addProgramCodeReqSGRoleList(): void {
		this.smallgroupRoleList.splice(this.smallgroupRoleList.length, 0, {id: 1, iscoreteam: false});
	}

	public removeProgramCodeReqSGRoleList(indexofelement): void {
		this.smallgroupRoleList.splice(indexofelement, 1);
	}

	public getMinistryRole(): void {
		const self = this;
		this.ministryRoleAll.isloading = true;
		this.http.sendGetRequest2('ministrymemberrole/get').subscribe((response: any) => {
			if (response.api_status) {
				self.ministryRoleAll.ministrymemberroles = response.data.ministrymemberroles;
				this.ministryRoleAll.isloading = false;
			} else {
				swal.fire({
					title: 'Error',
					text: response.message,
					icon: 'warning',
					confirmButtonText: 'OK'
				});
			}
		}, (error: any) => {
			swal.fire({
				title: 'Error ' + error.status,
				html: this.helper.changeEOLToBr(error.error.message),
				icon: 'warning',
				confirmButtonText: 'OK'
			});
		});
	}

	public getMaritalStatus(): void {
		const self = this;
		this.maritalStatusAll.isloading = true;
		this.http.sendGetRequest2('maritalstatus/get').subscribe((response: any) => {
			if (response.api_status) {
				self.maritalStatusAll.maritalstatuses = response.data.maritalstatuses;
				this.maritalStatusAll.isloading = false;
			} else {
				swal.fire({
					title: 'Error',
					text: response.message,
					icon: 'warning',
					confirmButtonText: 'OK'
				});
			}
		}, (error: any) => {
			swal.fire({
				title: 'Error ' + error.status,
				html: this.helper.changeEOLToBr(error.error.message),
				icon: 'warning',
				confirmButtonText: 'OK'
			});
		});
	}

	public getAllSmallgroupRole(): void {
		const self = this;
		this.smallgroupRoleAll.isloading = true;
		this.http.sendGetRequest2('smallgroupmemberrole/get').subscribe((response: any) => {
			if (response.api_status) {
				self.smallgroupRoleAll.smallgroupmemberroles = response.data.smallgroupmemberroles;
				this.smallgroupRoleAll.isloading = false;
			} else {
				swal.fire({
					title: 'Error',
					text: response.message,
					icon: 'warning',
					confirmButtonText: 'OK'
				});
			}
		}, (error: any) => {
			swal.fire({
				title: 'Error ' + error.status,
				html: this.helper.changeEOLToBr(error.error.message),
				icon: 'warning',
				confirmButtonText: 'OK'
			});
		});
	}

	public getAllProgramCode(): void {
		const self = this;
		this.programCodeAll.isloading = true;
		this.http.sendGetRequest2('programcode/all-list?type='+this.programCodeType).subscribe((response: any) => {
			if (response.api_status) {
				self.programCodeAll.programcodes = response.data.programcodes;
				self.programCodeAll.isloading = false;
			} else {
				swal.fire({
					title: 'Error',
					text: response.message,
					icon: 'warning',
					confirmButtonText: 'OK'
				});
			}
		}, (error: any) => {
			swal.fire({
				title: 'Error ' + error.status,
				html: this.helper.changeEOLToBr(error.error.message),
				icon: 'warning',
				confirmButtonText: 'OK'
			});
		});
	}

	public getProgramCodeDetail(programCodeId): void {
		const self = this;
		this.detailLoading = true;
		this.http.sendGetRequest2('programcode/detail?id='+programCodeId).subscribe((response: any) => {
			if (response.api_status) {
				self.getProgramCode = response.data.programcode[0];

				self.getProgramCode.programcodereqministryroles.forEach( function (ministry) {
					self.ministryRoleList.splice(self.ministryRoleList.length, 0, ministry.ministrymemberrole_id);
				});
				self.getProgramCode.programcodereqsgroles.forEach( function (sgrole) {
					self.smallgroupRoleList.splice(self.smallgroupRoleList.length, 0, {id: sgrole.smallgroupmemberrole_id, iscoreteam: sgrole.iscoreteam});
				});
				self.getProgramCode.programcodereqmarstatuses.forEach( function (marstatus) {
					self.maritalStatusList.splice(self.maritalStatusList.length, 0, marstatus.maritalstatus_id);
				});
				self.getProgramCode.programcodereqprcodes.forEach( function (prcode) {
					self.programCodeList.splice(self.programCodeList.length, 0, prcode.programcodereq_id);
				});

				self.getProgramCode.reqfamily = self.getProgramCode.reqfamily == 1 ? true : false;
				self.getProgramCode.reqchildren = self.getProgramCode.reqchildren == 1 ? true : false;
				self.getProgramCode.leaderapproval = self.getProgramCode.leaderapproval == 1 ? true : false;
				self.getProgramCode.adminapproval = self.getProgramCode.adminapproval == 1 ? true : false;
				self.getProgramCode.isuser = self.getProgramCode.isuser == 1 ? true : false;
				self.getProgramCode.iscouple = self.getProgramCode.iscouple == 1 ? true : false;
				self.getProgramCode.isselectchild = self.getProgramCode.isselectchild == 1 ? true : false;
				self.getProgramCode.isreqfiles = self.getProgramCode.isreqfiles == 1 ? true : false;
				self.getProgramCode.isnewcouple = self.getProgramCode.isnewcouple == 1 ? true : false;

				self.programcode = {
					id: self.getProgramCode.id,
					type: self.programCodeType,
					codename: self.getProgramCode.codename,
					name: self.getProgramCode.name,
					numbersession: self.getProgramCode.numbersession,
					minattenddays: self.getProgramCode.minattenddays,
					reqgender: self.getProgramCode.reqgender != null ? self.getProgramCode.reqgender : 'All',
					reqfamily: self.getProgramCode.reqfamily,
					reqchildren: self.getProgramCode.reqchildren,
					leaderapproval: self.getProgramCode.leaderapproval,
					adminapproval: self.getProgramCode.adminapproval,
					isuser: self.getProgramCode.isuser,
					iscouple: self.getProgramCode.iscouple,
					agemin: self.getProgramCode.agemin,
					agemax: self.getProgramCode.agemax,
					isnewcouple: self.getProgramCode.isnewcouple,
					withspouse: self.getProgramCode.withspouse,
					isreqfiles: self.getProgramCode.isreqfiles,
					isselectchild: self.getProgramCode.isselectchild,
					maritaldatemin: self.getProgramCode.maritaldatemin,
					maritaldatemax: self.getProgramCode.maritaldatemax,
					ministryroleid: null,
					classprerequisiteid: null,
					maritalstatusid: null,
					programcodereqsgroles: []
				};
				self.detailLoading = false;
			} else {
				swal.fire({
					title: 'Error',
					text: response.message,
					icon: 'warning',
					confirmButtonText: 'OK'
				});
			}
		}, (error: any) => {
			swal.fire({
				title: 'Error ' + error.status,
				html: this.helper.changeEOLToBr(error.error.message),
				icon: 'warning',
				confirmButtonText: 'OK'
			});
			self.detailLoading = false;
		});
	}


}

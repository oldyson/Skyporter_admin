import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from './../../../http.service';
import { HelperService } from './../../../helper.service';
import { BreakoutComponent } from './breakout/breakout.component';
import { PriceComponent } from './price/price.component';
import { markdown } from 'markdown';
import swal from 'sweetalert2';

@Component({
	selector: 'app-programform',
	templateUrl: './programform.component.html',
	styleUrls: ['./programform.component.scss']
})
export class ProgramformComponent implements OnInit {
	@ViewChild('programbreakoutlist', {static: false}) programbreakoutlist: BreakoutComponent;
	@ViewChild('programpricelist', {static: false}) programpricelist: PriceComponent;
	public program: any;
	public isTypeLoading: boolean;
	public isCodeLoading: boolean;
	public isCodeDataLoading: boolean;
	public isCampusRoomLoading: boolean;
	public programtypes: any;
	public programcodes: any;
	public banner: any;
	public programType: string;
	public programTypeTitleCase: string;
	public campusrooms: any;
	public gender: any;
	public maritalStatusList: any;
	public maritalStatusAll: any;
	public programCodeList: any;
	public programCodeAll: any;
	public users: any;
	public volunteerList: any;
	public isVolunteerLoading: boolean;
	public roles: any;
	public isRoleLoading: boolean;
	public isLoading: boolean;
	public imageSrc: string;
	public filename: string;
	public tooltipMessage: any;
	public maskSgNameByChurch: string;
	public approvalDocuments: any;

	constructor(
		public activatedRoute: ActivatedRoute,
		public helper: HelperService,
		public router: Router,
		public http: HttpService
	) {
		this.programType = this.activatedRoute.snapshot.paramMap.get('type').toLowerCase();
		this.programTypeTitleCase = this.helper.toTitleCase(this.programType)
		if (this.programType !== 'class' && this.programType !== 'event') {
			this.router.navigateByUrl('/');
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
		this.maritalStatusList = [];
		this.programCodeList = [];
		this.isCodeDataLoading = true;
		this.maskSgNameByChurch = JSON.parse(localStorage.getItem('applicationfeatures')).filter(item => item.name === 'small-group')[0]?.applicationfeaturechurches[0]?.showname || 'small group';
		this.tooltipMessage = {
			requiredFamily: 'Agar dapat mendaftar, peserta wajib telah mendaftarkan keluarganya di gereja.',
			requiredChild: 'Agar dapat mendaftar, peserta wajib telah mendaftarkan anggota anak di gereja.',
			requiredLeader: `Peserta yang mendaftar butuh persetujuan dari leader ${this.maskSgNameByChurch} pada group masing-masing.`,
			requiredAdmin: `Peserta yang mendaftar butuh persetujuan dari salah satu admin ${this.maskSgNameByChurch} yang terdaftar pada gereja.`,
			requiredUser: 'Pendaftar hanya dapat mendaftarkan (orang lain) yang sudah mempunyai account gereja. Untuk pembuat transaksi, wajib mempunyai account gereja.',
			requiredCouple: 'Peserta hanya mendaftar berpasang-pasangan (laki & perempuan) dan wajib tidak mempunyai  keluarga.',
			requiredFiles: 'Peserta dapat mengupload beberapa dokumen yang diperlukan',
			requiredSelectChild: 'Peserta wajib memilih anak yang ingin didaftarkan',
			requiredNewCouple: 'Peserta hanya mendaftar berpasang-pasangan (laki & perempuan) dan wajib tidak mempunyai  keluarga dan belum siap menikah',
			withSpouse: 'Suami / istri peserta akan ikut didaftarkan dalam '+ this.programType + ' (peserta tetap bisa mendaftar walau tidak memiliki suami / istri)'
		};
		this.program = {
			id: null,
			programtype_id: null,
			programcode_id: null,
			document_id: null,
			name: null,
			description: '',
			description2: null,
			terms: null,
			agemin: 0,
			agemax: 127,
			minattenddays: 1,
			leaderapproval: false,
			adminapproval: false,
			isopenregist: false,
			iscouple: false,
			isnewcouple: false,
			withspouse: false,
			isselectchild: false,
			isreqfiles: false,
			maritaldatemin: null,
			maritaldatemax: null,
			isuser: true,
			isreqpayment: false,
			programstart_at: this.helper.dateToDatetimelocal(new Date(Date.now())),
			programend_at: this.helper.dateToDatetimelocal(new Date(Date.now())),
			registerstart_at: this.helper.dateToDatetimelocal(new Date(Date.now())),
			registerend_at: this.helper.dateToDatetimelocal(new Date(Date.now())),
			publishstart_at: this.helper.dateToDatetimelocal(new Date(Date.now())),
			publishend_at: this.helper.dateToDatetimelocal(new Date(Date.now())),
			termShow: false,
			description2Show: false,
			programbreakouts: [],
			programprices: [],
			saveLoading: false,
			isEditable: 1
		};
		this.approvalDocuments = [];
		this.volunteerList = [];
		this.isLoading = false;
		this.addProgramBreakout();
		this.getProgramCodes();
		this.getProgramTypes();
		this.getCampusRooms();
		this.getUsersForVolunteers();
		this.getAllRoles();
		this.activatedRoute.queryParams.subscribe(params => {
			this.program.id = params.id;
		});
		this.maritalStatusAll = {
			isloading: true,
			maritalstatuses: []
		};
		if (this.program.id != null) {
			this.getDataByID();
		}
	}

	public onChangeDescription(value: any): void {
		this.program.description = markdown.toHTML(value);
	}

	public getTotalSessions(): void {
		let total = 0;
		this.program.programbreakouts.forEach(($ii) => {
			$ii.programbreakoutdates.forEach(() => {
				total++;
			});
		});
		this.program.totalsessions = total;
	}

	public addProgramBreakout(): void {
		const temp = {
			program_id: null,
			campusroom_id: null,
			location: null,
			locationaddress: null,
			name: 'Breakout ' + (this.program.programbreakouts.length + 1),
			speaker: null,
			maxseating: 0,
			maxstanding: 0,
			maxbaby: 0,
			isreqcheckin: true,
			ischeckforall: false,
			programbreakoutdates: []
		};
		this.program.programbreakouts.push(temp);
		const lastIndexProgramBreakouts = this.program.programbreakouts.length - 1;
		this.addProgramBreakoutDate(lastIndexProgramBreakouts +'');
		this.getTotalSessions();
	}

	public addProgramBreakoutDate(index: string): void {
		const idx: number = parseInt(index, 10);
		const temp = {
			programbreakout_id: null,
			qrcode_id: 0,
			isallday: true,
			timestart_at: null,
			timeend_at: null,
			starttime: '00:00',
			endtime: '23:59',
			date: this.helper.dateToDatetimelocal(new Date(Date.now())).split('T')[0],
		};
		this.program.programbreakouts[idx].programbreakoutdates.push(temp);
		this.getTotalSessions();
		this.updateProgramStartEnd();
	}

	ngOnInit(): void {
		this.getMaritalStatus();
	}

	public getProgramCodes(): void {
		const self = this;
		this.isCodeLoading = true;
		const params = {
			type: this.helper.toTitleCase(this.programType)
		};
		this.http.sendGetRequest2('programcode/all-list', params).subscribe((response: any) => {
			if (response.api_status) {
				self.programcodes = response.data.programcodes;
			} else {
				swal.fire({
					title: 'Error',
					text: response.message,
					icon: 'warning',
					confirmButtonText: 'OK'
				});
			}
			self.isCodeLoading = false;
		}, (error: any) => {
			swal.fire({
				title: 'Error ' + error.status,
				html: this.helper.changeEOLToBr(error.error.message),
				icon: 'warning',
				confirmButtonText: 'OK'
			});
			self.isCodeLoading = false;
		});
	}

	public getProgramTypes(): void {
		const self = this;
		this.isTypeLoading = true;
		const params = {
			type: this.helper.toTitleCase(this.programType)
		};
		this.http.sendGetRequest2('programtype/get', params).subscribe((response: any) => {
			if (response.api_status) {
				self.programtypes = response.data.programtype;
			} else {
				swal.fire({
					title: 'Error',
					text: response.message,
					icon: 'warning',
					confirmButtonText: 'OK'
				});
			}
			self.isTypeLoading = false;
		}, (error: any) => {
			swal.fire({
				title: 'Error ' + error.status,
				html: this.helper.changeEOLToBr(error.error.message),
				icon: 'warning',
				confirmButtonText: 'OK'
			});
			self.isTypeLoading = false;
		});

	}

	public getCampusRooms(): void {
		const self = this;
		this.isCampusRoomLoading = true;
		this.http.sendGetRequest2('church/all-campus').subscribe((response: any) => {
			if (response.api_status) {
				self.campusrooms = [];
				const campuses = response.data.campus_list;
				campuses.forEach(($campus) => {
					$campus.campusrooms.forEach(($campusroom) => {
						self.campusrooms.push($campusroom);
					});
				});
			} else {
				swal.fire({
					title: 'Error',
					text: response.message,
					icon: 'warning',
					confirmButtonText: 'OK'
				});
			}
			self.isCampusRoomLoading = false;
		}, (error: any) => {
			swal.fire({
				title: 'Error ' + error.status,
				html: this.helper.changeEOLToBr(error.error.message),
				icon: 'warning',
				confirmButtonText: 'OK'
			});
			self.isCampusRoomLoading = false;
		});

	}

	public getUsersForVolunteers(): void {
		const self = this;
		this.isVolunteerLoading = true;
		this.http.sendGetRequest2('user/get?showColoumn=fullname').subscribe((response: any) => {
			if (response.api_status) {
				self.users = response.data.user;
			} else {
				swal.fire({
					title: 'Error',
					text: response.message,
					icon: 'warning',
					confirmButtonText: 'OK'
				});
			}
			self.isVolunteerLoading = false;
		}, (error: any) => {
			swal.fire({
				title: 'Error ' + error.status,
				html: this.helper.changeEOLToBr(error.error.message),
				icon: 'warning',
				confirmButtonText: 'OK'
			});
			self.isVolunteerLoading = false;
		});
	}

	public getAllRoles(): void {
		const self = this;
		this.isRoleLoading = true;
		this.roles = [];
		this.http.sendGetRequest2('role/all?applicationId=1').subscribe((response: any) => {
			if (response.api_status) {
				response.data.roles.forEach(($role) => {
					$role.type = 'role';
					self.roles.push($role);
				});
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
		this.http.sendGetRequest2('smallgroupmemberrole/get').subscribe((response: any) => {
			if (response.api_status) {
				response.data.smallgroupmemberroles.forEach(($role) => {
					$role.type = 'smallgroupmemberrole';
					self.roles.push($role);
				});
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
		this.http.sendGetRequest2('ministrymemberrole/get').subscribe((response: any) => {
			if (response.api_status) {
				response.data.ministrymemberroles.forEach(($role) => {
					$role.type = 'ministrymemberrole';
					self.roles.push($role);
				});
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
		this.isRoleLoading = false;
	}

	public getDataByID(): void {
		const self = this;
		if (this.program.id != null) {
			const params = {
				id: this.program.id,
			};
			this.isLoading = true;
			this.http.sendGetRequest2('program/detail', params).subscribe((response: any) => {
				if (response.api_status) {
					this.program = response.data.program;
					this.program.reqgender = response.data.program.reqgender == "" || response.data.program.reqgender == null ? "All" : response.data.program.reqgender;
					if (response.data.program.programstart_at)
						this.program.programstart_at = this.helper.dateToDatetimelocal(new Date(response.data.program.programstart_at));
					if (response.data.program.programend_at)
						this.program.programend_at = this.helper.dateToDatetimelocal(new Date(response.data.program.programend_at));
					if (response.data.program.registerstart_at)
						this.program.registerstart_at = this.helper.dateToDatetimelocal(new Date(response.data.program.registerstart_at));
					if (response.data.program.registerend_at)
						this.program.registerend_at = this.helper.dateToDatetimelocal(new Date(response.data.program.registerend_at));
					if (response.data.program.publishstart_at)
						this.program.publishstart_at = this.helper.dateToDatetimelocal(new Date(response.data.program.publishstart_at));
					if (response.data.program.publishend_at)
						this.program.publishend_at = this.helper.dateToDatetimelocal(new Date(response.data.program.publishend_at));
					response.data.program.programbreakouts.forEach(($programbreakout) => {
						$programbreakout.programbreakoutdates.forEach(($programbreakoutdate) => {
							$programbreakoutdate.date = this.helper.makeDate($programbreakoutdate.timestart_at, 'yyyy-MM-dd');
							$programbreakoutdate.starttime = this.helper.makeTime($programbreakoutdate.timestart_at);
							$programbreakoutdate.endtime = this.helper.makeTime($programbreakoutdate.timeend_at);
						});
					});
					this.program.programbreakouts = response.data.program.programbreakouts;
					response.data.program.programprices.forEach(($programprice) => {
						if ($programprice.availablestart_at || $programprice.availableend_at) {
							$programprice.interval = true;
							$programprice.availablestart_at = this.helper.dateToDatetimelocal(new Date($programprice.availablestart_at));
							$programprice.availableend_at = this.helper.dateToDatetimelocal(new Date($programprice.availableend_at));
						}
						if ($programprice.ministrymemberrole_id != null) {
							$programprice.role = $programprice.ministrymemberrole;
							$programprice.role.type = 'ministrymemberrole';
						} else if ($programprice.smallgroupmemberrole_id != null) {
							$programprice.role = $programprice.smallgroupmemberrole;
							$programprice.role.type = 'smallgroupmemberrole';
						} else if ($programprice.role_id != null) {
							// $programprice.role = $programprice.role;
							$programprice.role.type = 'role';
						} else {
							$programprice.role = 0;
						}
					});
					this.program.programprices = response.data.program.programprices;
					if (response.data.program.programvolunteers != null) {
						response.data.program.programvolunteers.forEach(($programvolunteer) => {
							this.volunteerList.push($programvolunteer.user_id);
						});
					}
					self.program.reqgender = response.data.program.reqgender == null ? "All" : response.data.program.reqgender;
					response.data.program.programreqmarstatuses.forEach( function (marstatus) {
						self.maritalStatusList.splice(self.maritalStatusList.length, 0, marstatus.maritalstatus_id);
					});
					response.data.program.programreqprcodes.forEach( function (prcode) {
						self.programCodeList.splice(self.programCodeList.length, 0, prcode.programcodereq_id);
					});
					response.data.program.programleaderapprovaldocuments.forEach(($ii) => {
						$ii.document.checked = true;
						self.approvalDocuments.push($ii.document);
					});
					this.isCodeDataLoading = false;
					this.getTotalSessions();
				} else {
					swal.fire({
						title: 'Error',
						text: response.message,
						icon: 'warning',
						confirmButtonText: 'OK'
					});
				}
				this.isLoading = false;
			}, (error: any) => {
				swal.fire({
					title: 'Error ' + error.status,
					html: this.helper.changeEOLToBr(error.error.message),
					icon: 'warning',
					confirmButtonText: 'OK'
				});
				this.isLoading = false;
			});
		}
	}

	public removeProgramBreakout(index: string): void {
		const idx: number = parseInt(index, 10);
		if (this.program.programbreakouts.length > 1) {
			this.program.programbreakouts.splice(idx, 1);
			if (this.programbreakoutlist.currentViewIndex-1 >= 0 && this.programbreakoutlist.currentViewIndex>idx) {
				this.programbreakoutlist.changeViewIndex(this.programbreakoutlist.currentViewIndex-1);
			} else if (this.programbreakoutlist.currentViewIndex<=idx && this.programbreakoutlist.currentViewIndex>=this.program.programbreakouts.length) {
				this.programbreakoutlist.changeViewIndex(this.program.programbreakouts.length-1);
			} else if (this.programbreakoutlist.currentViewIndex<=idx && this.programbreakoutlist.currentViewIndex<this.program.programbreakouts.length) {
				//
			} else {
				this.programbreakoutlist.changeViewIndex(0);
			}
		} else {
			swal.fire({
				title: 'Error',
				text: 'Cannot delete all breakouts!',
				icon: 'warning',
				confirmButtonText: 'OK'
			});
		}
		this.getTotalSessions();
	}

	public addProgramPrice(): void {
		const temp = {
			program_id: null,
			ministrymemberrole_id: null,
			smallgroupmemberrole_id: null,
			role_id: null,
			iscoreteam: false,
			name: 'Price ' + (this.program.programprices.length + 1),
			price: 0,
			availablestart_at: null,
			availableend_at: null,
			interval: false,
			role: 0
		};
		this.program.programprices.push(temp);
	}

	public removeProgramPrice(index: string): void {
		const idx: number = parseInt(index, 10);
		if (this.program.programprices.length > 0) {
			this.program.programprices.splice(idx, 1);
		}
	}

	public removeProgramBreakoutDate(index: string): void {
		const idx: number = parseInt(index, 10);
		if (this.program.programbreakouts[this.programbreakoutlist.currentViewIndex].programbreakoutdates.length > 1) {
			this.program.programbreakouts[this.programbreakoutlist.currentViewIndex].programbreakoutdates.splice(idx, 1);
		} else {
			swal.fire({
				title: 'Error',
				text: 'Cannot delete all sessions!',
				icon: 'warning',
				confirmButtonText: 'OK'
			});
		}
	}

	public saveProgram(status: string): void {
		if (!this.program.saveLoading) {
			this.program.saveLoading = true;
			if (this.program.name == null) {
				swal.fire({
					title: 'Error',
					text: this.helper.toTitleCase(this.programType)+' Title must be filled',
					icon: 'warning',
					confirmButtonText: 'OK'
				});
				this.program.saveLoading = false;
				return;
			} else if (this.program.name.length <= 4) {
				swal.fire({
					title: 'Warning',
					text: this.helper.toTitleCase(this.programType)+' Title length must be greater than 4 characters',
					icon: 'warning',
					confirmButtonText: 'OK'
				});
				this.program.saveLoading = false;
				return;
			} else if (this.program.name.length > 50) {
				swal.fire({
					title: 'Warning',
					text: this.helper.toTitleCase(this.programType)+' Title length must be shorter than 50 characters',
					icon: 'warning',
					confirmButtonText: 'OK'
				});
				this.program.saveLoading = false;
				return;
			} else if (this.program.description == null) {
				swal.fire({
					title: 'Warning',
					text: this.helper.toTitleCase(this.programType)+' description must be filled',
					icon: 'warning',
					confirmButtonText: 'OK'
				});
				this.program.saveLoading = false;
				return;
			} else if (this.program.description != null && this.program.description.length < 30) {
				swal.fire({
					title: 'Warning',
					text: this.helper.toTitleCase(this.programType)+' description must be at least 30 characters.',
					icon: 'warning',
					confirmButtonText: 'OK'
				});
				this.program.saveLoading = false;
				return;
			} else if (this.program.totalsessions == null) {
				swal.fire({
					title: 'Warning',
					text: this.helper.toTitleCase(this.programType)+' Total Session must be filled',
					icon: 'warning',
					confirmButtonText: 'OK'
				});
				this.program.saveLoading = false;
				return;
			} else if (this.program.minattenddays == null) {
				swal.fire({
					title: 'Warning',
					text: this.helper.toTitleCase(this.programType)+' Minimum Attend Days must be filled',
					icon: 'warning',
					confirmButtonText: 'OK'
				});
				this.program.saveLoading = false;
				return;
			} else if (this.program.agemin == null) {
				swal.fire({
					title: 'Warning',
					text: this.helper.toTitleCase(this.programType)+' Minimum Age must be filled',
					icon: 'warning',
					confirmButtonText: 'OK'
				});
				this.program.saveLoading = false;
				return;
			} else if (this.program.agemax == null) {
				swal.fire({
					title: 'Warning',
					text: this.helper.toTitleCase(this.programType)+' Maximum Age must be filled',
					icon: 'warning',
					confirmButtonText: 'OK'
				});
				this.program.saveLoading = false;
				return;
			} else if (this.program.minattenddays > this.program.totalsessions) {
				swal.fire({
					title: 'Warning',
					text: this.helper.toTitleCase(this.programType)+' Minimum Attend Days cannot be more than '+this.programType+' Total Session',
					icon: 'warning',
					confirmButtonText: 'OK'
				});
				this.program.saveLoading = false;
				return;
			} else if (this.program.agemin > this.program.agemax) {
				swal.fire({
					title: 'Warning',
					text: this.helper.toTitleCase(this.programType)+' Minimum Age cannot be more than '+this.programType+' Maximum Age',
					icon: 'warning',
					confirmButtonText: 'OK'
				});
				this.program.saveLoading = false;
				return;
			} else if (this.program.programcode_id == null) {
				swal.fire({
					title: 'Warning',
					text: this.helper.toTitleCase(this.programType)+' Code must be selected',
					icon: 'warning',
					confirmButtonText: 'OK'
				});
				this.program.saveLoading = false;
				return;
			} else if (this.program.programtype_id == null) {
				swal.fire({
					title: 'Warning',
					text: this.helper.toTitleCase(this.programType)+' type must be selected',
					icon: 'warning',
					confirmButtonText: 'OK'
				});
				this.program.saveLoading = false;
				return;
			} else if (this.program.programstart_at == null || this.program.programend_at == null) {
				swal.fire({
					title: 'Warning',
					text: this.helper.toTitleCase(this.programType)+' start time and end time must be filled',
					icon: 'warning',
					confirmButtonText: 'OK'
				});
				this.program.saveLoading = false;
				return;
			} else if (this.program.programstart_at > this.program.programend_at) {
				swal.fire({
					title: 'Warning',
					text: this.helper.toTitleCase(this.programType)+' start time cannot be after end time',
					icon: 'warning',
					confirmButtonText: 'OK'
				});
				this.program.saveLoading = false;
				return;
			}
			const programbreakouts = JSON.parse(JSON.stringify(this.program.programbreakouts));
			const programprices = JSON.parse(JSON.stringify(this.program.programprices));
			if(this.program.iscouple == false){
				this.program.maritaldatemax = null;
				this.program.maritaldatemin = null;
			}
			let locationError = 0;
			let emptyDateError = 0;
			programbreakouts.forEach(($programbreakout) => {
				if ($programbreakout.campusroom_id == null && $programbreakout.location == null) {
					locationError = 1;
				}
				$programbreakout.isreqcheckin = $programbreakout.isreqcheckin? 1 : 0;
				$programbreakout.ischeckforall = $programbreakout.ischeckforall? 1 : 0;
				$programbreakout.programbreakoutdates.forEach(($programbreakoutdate) => {
					if ($programbreakoutdate.date == null) {
						emptyDateError = 1;
					}
					if (!$programbreakoutdate.isallday) {
						$programbreakoutdate.timestart_at = $programbreakoutdate.date+' '+$programbreakoutdate.starttime;
						$programbreakoutdate.timeend_at = $programbreakoutdate.date+' '+$programbreakoutdate.endtime;
					} else {
						$programbreakoutdate.timestart_at = $programbreakoutdate.date+' '+'00:00:00';
						$programbreakoutdate.timeend_at = $programbreakoutdate.date+' '+'23:59:00';
					}
					$programbreakoutdate.isallday = $programbreakoutdate.isallday? 1 : 0;

					if ('date' in $programbreakoutdate)
						delete $programbreakoutdate.date;
					if ('starttime' in $programbreakoutdate)
						delete $programbreakoutdate.starttime;
					if ('endtime' in $programbreakoutdate)
						delete $programbreakoutdate.endtime;
					if ('programbreakoutdate_qrcode' in $programbreakoutdate)
						delete $programbreakoutdate.programbreakoutdate_qrcode;
					if ('programbreakoutdate_qrcode_value' in $programbreakoutdate)
						delete $programbreakoutdate.programbreakoutdate_qrcode_value;
					if ('programticketattendances' in $programbreakoutdate)
						delete $programbreakoutdate.programticketattendances;
					if ('timetype' in $programbreakoutdate)
						delete $programbreakoutdate.timetype;
					if ('programticketattendance_byuser' in $programbreakoutdate)
						delete $programbreakoutdate.programticketattendance_byuser;

				});
			});
			if (locationError == 1) {
				swal.fire({
					title: 'Warning',
					text: this.helper.toTitleCase(this.programType)+' location must be selected or filled',
					icon: 'warning',
					confirmButtonText: 'OK'
				});
				this.program.saveLoading = false;
				return;
			} else if (emptyDateError == 1) {
				swal.fire({
					title: 'Warning',
					text: this.helper.toTitleCase(this.programType)+' session date must be filled',
					icon: 'warning',
					confirmButtonText: 'OK'
				});
				this.program.saveLoading = false;
				return;
			}
			programprices.forEach(($programprice) => {
				if ($programprice.role != null) {
					if ($programprice.role != 0) {
						if ($programprice.role.type === 'role') {
							$programprice.ministrymemberrole_id = null;
							$programprice.smallgroupmemberrole_id = null;
							$programprice.role_id = $programprice.role.id;
						} else if ($programprice.role.type === 'ministrymemberrole') {
							$programprice.role_id = null;
							$programprice.smallgroupmemberrole_id = null;
							$programprice.ministrymemberrole_id = $programprice.role.id;
						} else if ($programprice.role.type === 'smallgroupmemberrole') {
							$programprice.ministrymemberrole_id = null;
							$programprice.role_id = null;
							$programprice.smallgroupmemberrole_id = $programprice.role.id;
						}
					} else {
						$programprice.ministrymemberrole_id = null;
						$programprice.role_id = null;
						$programprice.smallgroupmemberrole_id = null;
					}
				}
				if ('role' in $programprice)
					delete $programprice.role;
				if ('interval' in $programprice)
					delete $programprice.interval;
				$programprice.iscoreteam = $programprice.iscoreteam? 1 : 0;
				if ($programprice.interval) {
					$programprice.availablestart_at = this.helper.dateToLaravelformat(new Date($programprice.availablestart_at));
					$programprice.availableend_at = this.helper.dateToLaravelformat(new Date($programprice.availableend_at));
				}
			});

			if (this.banner != null) {
				const self = this;
				const formData = new FormData();
				formData.append('name', this.program.name);
				formData.append('description', this.program.description);
				if (this.program.description2 != null)
					formData.append('description2', this.program.description2);
				formData.append('agemin', this.program.agemin);
				formData.append('agemax', this.program.agemax);
				formData.append('programstart_at', this.helper.dateToLaravelformat(new Date(this.program.programstart_at)));
				formData.append('programend_at', this.helper.dateToLaravelformat(new Date(this.program.programend_at)));
				formData.append('minattenddays', this.program.minattenddays);
				formData.append('publishstart_at', this.helper.dateToLaravelformat(new Date(this.program.publishstart_at)));
				formData.append('publishend_at', this.helper.dateToLaravelformat(new Date(this.program.publishend_at)));
				formData.append('programcode_id', this.program.programcode_id);
				formData.append('programtype_id', this.program.programtype_id);
				formData.append('reqchildren', this.program.reqchildren ? '1' : '0');
				formData.append('reqfamily', this.program.reqfamily ? '1' : '0');
				formData.append('leaderapproval', this.program.leaderapproval ? '1' : '0');
				formData.append('adminapproval', this.program.adminapproval ? '1' : '0');
				formData.append('isuser', this.program.isuser ? '1' : '0');
				formData.append('iscouple', this.program.iscouple ? '1' : '0');
				formData.append('isselectchild', this.program.isselectchild ? '1' : '0');
				formData.append('isnewcouple', this.program.isnewcouple ? '1' : '0');
				formData.append('withspouse', this.program.withspouse ? '1' : '0');
				formData.append('isreqfiles', this.program.isreqfiles ? '1' : '0');
				formData.append('maritaldatemin', this.program.maritaldatemin);
				formData.append('maritaldatemax', this.program.maritaldatemax);
				formData.append('reqgender', this.program.reqgender == "All" ? null : this.program.reqgender);
				formData.append('classprerequisiteid' , this.programCodeList.join(','));
				formData.append('maritalstatusid' , this.maritalStatusList.join(','));
				if (this.program.ishighlight) {
					formData.append('ishighlight', '1');
				} else {
					formData.append('ishighlight', '0');
				}
				formData.append('registerstart_at', this.helper.dateToLaravelformat(new Date(this.program.registerstart_at)));
				formData.append('registerend_at', this.helper.dateToLaravelformat(new Date(this.program.registerend_at)));
				if (this.program.terms != null)
					formData.append('terms', this.program.terms);
				if(this.banner != null)
					formData.append('banner', this.banner, this.banner.name);
				if (this.volunteerList.length > 0) {
					formData.append('volunteerList', this.volunteerList.join(','));
				} else {
					formData.append('volunteerList', '');
				}
				formData.append('status', status);
				formData.append('programprices', JSON.stringify(programprices));
				if (this.program.isopenregist) {
					formData.append('isopenregist', '1');
				} else {
					formData.append('isopenregist', '0');
				}
				formData.append('programbreakouts', JSON.stringify(programbreakouts));
				if (this.program.isreqpayment) {
					formData.append('isreqpayment', '1');
				} else {
					formData.append('isreqpayment', '0');
				}
				if (this.program.id != null)
					formData.append('id', this.program.id);
				if(this.approvalDocuments.length > 0 && this.program.leaderapproval == 1){
					// FROM array to string
					let documentIds = "";
					this.approvalDocuments.forEach(($ii) => {
						if ($ii.checked) {
							documentIds += documentIds === '' ? $ii.id : ',' + $ii.id;
						}
					});
					formData.append('documentIds', documentIds);
				}
				this.http.sendPostUpload('program/save', formData).subscribe((response: any) => {
					if (response.api_status) {
						self.router.navigateByUrl('admin/program/' + self.programType.toLowerCase() + '/list');
					} else {
						swal.fire({
							title: 'Error',
							text: response.message,
							icon: 'warning',
							confirmButtonText: 'OK'
						});
					}
					self.program.saveLoading = false;
				}, (error: any) => {
					swal.fire({
						title: 'Error ' + error.status,
						html: this.helper.changeEOLToBr(error.error.message),
						icon: 'warning',
						confirmButtonText: 'OK'
					});
					self.program.saveLoading = false;
				});
			} else {
				let documentIds = "";
				if(this.approvalDocuments.length > 0 && this.program.leaderapproval == 1){
					// FROM array to string
					this.approvalDocuments.forEach(($ii) => {
						if ($ii.checked) {
							documentIds += documentIds === '' ? $ii.id : ',' + $ii.id;
						}
					});
				}
				const params = {
					name: this.program.name,
					description: this.program.description,
					description2: this.program.description2,
					agemin: this.program.agemin,
					agemax: this.program.agemax,
					reqchildren: this.program.reqchildren ? 1:0,
					reqfamily: this.program.reqfamily ? 1:0,
					leaderapproval: this.program.leaderapproval ? 1:0,
					adminapproval: this.program.adminapproval ? 1:0,
					isuser: this.program.isuser ? 1:0,
					iscouple: this.program.iscouple ? 1:0,
					reqgender: this.program.reqgender == "All" ? null : this.program.reqgender,
					classprerequisiteid: this.programCodeList.join(','),
					maritalstatusid: this.maritalStatusList.join(','),
					programstart_at: this.helper.dateToLaravelformat(new Date(this.program.programstart_at)),
					programend_at: this.helper.dateToLaravelformat(new Date(this.program.programend_at)),
					minattenddays: this.program.minattenddays,
					publishstart_at: this.helper.dateToLaravelformat(new Date(this.program.publishstart_at)),
					publishend_at: this.helper.dateToLaravelformat(new Date(this.program.publishend_at)),
					programcode_id: this.program.programcode_id,
					programtype_id: this.program.programtype_id,
					ishighlight: this.program.ishighlight? 1 : 0,
					registerstart_at: this.helper.dateToLaravelformat(new Date(this.program.registerstart_at)),
					registerend_at: this.helper.dateToLaravelformat(new Date(this.program.registerend_at)),
					terms: this.program.terms,
					banner: null,
					volunteerList: this.volunteerList? this.volunteerList.join(',') : null,
					status: status,
					programprices: JSON.stringify(programprices),
					isopenregist: this.program.isopenregist? 1 : 0,
					programbreakouts: JSON.stringify(programbreakouts),
					isreqpayment: this.program.isreqpayment? 1 : 0,
					isselectchild: this.program.isselectchild? 1 : 0,
					isreqfiles: this.program.isreqfiles? 1 : 0,
					isnewcouple: this.program.isnewcouple? 1 : 0,
					withspouse: this.program.withspouse? 1 : 0,
					maritaldatemin: this.program.maritaldatemin,
					maritaldatemax: this.program.maritaldatemax,
					id: this.program.id,
					documentIds: documentIds != "" ? documentIds : null,
				};

				const self = this;
				// console.log(programbreakouts);
				this.http.sendPostRequest2('program/save', params).subscribe((response: any) => {
					if (response.api_status === true) {
						self.router.navigateByUrl('admin/program/' + self.programType.toLowerCase() + '/list');
					} else {
						swal.fire({
							title: 'Error',
							text: response.message,
							icon: 'warning',
							confirmButtonText: 'OK'
						});
					}
					self.program.saveLoading = false;
				}, (error: any) => {
					console.log(error);
					swal.fire({
						title: 'Error ' + error.status,
						html: this.helper.changeEOLToBr(error.error.message),
						icon: 'warning',
						confirmButtonText: 'OK'
					});
				});
				this.program.saveLoading = false;
			}
		}
	}

	public onFileChange(event):void {
		const reader = new FileReader();
		if (event.target.files[0] && event.target.files.length) {
			this.banner = event.target.files[0];
			reader.readAsDataURL(this.banner);
			reader.onload = (): void => {
				this.imageSrc = reader.result as string;
				this.filename = this.banner.name;
			};
		}
	}

	public updateProgramStartEnd():void {
		const self = this;
		let minTimestamp = null;
		let maxTimestamp = null;
		this.program.programbreakouts.forEach(($ii) => {
			$ii.programbreakoutdates.forEach(($jj) => {
				if (minTimestamp == null)
					minTimestamp = self.helper.dateToDatetimelocal(new Date($jj.date + 'T' + $jj.starttime));
				if (maxTimestamp == null)
					maxTimestamp = self.helper.dateToDatetimelocal(new Date($jj.date + 'T' + $jj.endtime));
				if ($jj.date <= minTimestamp)
					minTimestamp = self.helper.dateToDatetimelocal(new Date($jj.date + 'T' + $jj.starttime));
				if ($jj.date >= maxTimestamp)
					maxTimestamp = self.helper.dateToDatetimelocal(new Date($jj.date + 'T' + $jj.endtime));
			});
		});
		this.program.programstart_at = minTimestamp;
		this.program.programend_at = maxTimestamp;
	}

	public updateIsReqPayment():void {
		const self = this;
		this.program.isreqpayment = false;
		this.program.programprices.forEach(($ii) => {
			if ($ii.price != 0)
				self.program.isreqpayment = true;
		});
	}

	public onChangeProgramCode(value: string): void{
		const self = this;
		if(value != null){
			this.isCodeDataLoading = true;
			this.http.sendGetRequest2('programcode/detail?id='+value).subscribe((response: any) => {
				if (response.api_status) {
					// console.log(response.data.programcode);
					const programCodeData = response.data.programcode[0];
					self.program.reqgender = programCodeData.reqgender == null ? "All" : programCodeData.reqgender;
					self.program.reqfamily = programCodeData.reqfamily;
					self.program.reqchildren = programCodeData.reqchildren;
					self.program.leaderapproval = programCodeData.leaderapproval;
					self.program.adminapproval = programCodeData.adminapproval;
					self.program.isuser = programCodeData.isuser;
					self.program.iscouple = programCodeData.iscouple;
					self.program.isselectchild = programCodeData.isselectchild;
					self.program.isnewcouple = programCodeData.isnewcouple;
					self.program.withspouse = programCodeData.withspouse;
					self.program.isreqfiles = programCodeData.isreqfiles;
					self.program.maritaldatemin = programCodeData.maritaldatemin;
					self.program.maritaldatemax = programCodeData.maritaldatemax;
					self.program.agemin = programCodeData.agemin;
					self.program.agemax = programCodeData.agemax;

					self.maritalStatusList = [];
					programCodeData.programcodereqmarstatuses.forEach( function (marstatus) {
						self.maritalStatusList.splice(self.maritalStatusList.length, 0, marstatus.maritalstatus_id);
					});

					self.programCodeList = [];
					programCodeData.programcodereqprcodes.forEach( function (prcode) {
						self.programCodeList.splice(self.programCodeList.length, 0, prcode.programcodereq_id);
					});
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
			this.isCodeDataLoading = false;
		}
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


	public uploadApprovalFile(file): void {
		const self = this;
		const formData = new FormData();
		formData.append('file', file[0], file.name);
		this.http.sendPostUpload('programleaderapprovaldocument/upload', formData).subscribe((response: any) => {
			if (response.api_status) {
				response.data.createdData.document.checked = false;
				self.approvalDocuments.push(response.data.createdData.document);
			} else {

			}
		}, (error: any) => {
		});
	}

	public toggleFile(doc): void {
		doc.checked = doc.checked ? false : true;
	}
}

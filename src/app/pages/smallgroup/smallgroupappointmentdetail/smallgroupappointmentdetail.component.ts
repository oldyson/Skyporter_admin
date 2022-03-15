import { Component, OnInit, ViewChild } from '@angular/core';
import swal from 'sweetalert2';
import { ListtableComponent } from './../../../components/listtable/listtable.component';
import { ListattendancetableComponent } from './../../../components/listattendancetable/listattendancetable.component';
import { PopupModalComponent } from './../../../components/popup-modal/popup-modal.component';
import { HttpService } from './../../../http.service';
import { GlobalService } from './../../../global.service';
import { HelperService } from './../../../helper.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	selector: 'app-smallgroupappointmentdetail',
	templateUrl: './smallgroupappointmentdetail.component.html',
	styleUrls: ['./smallgroupappointmentdetail.component.scss']
})
export class SmallgroupappointmentdetailComponent implements OnInit {
	@ViewChild('mymodal', {static: false}) private modal: PopupModalComponent;
	@ViewChild(ListtableComponent) listtable: ListtableComponent;
	@ViewChild('listtableattendance', { static: false }) private listtableattendance: ListattendancetableComponent;
	public datas;
	public keys;
	public navigations;
	public page;
	public keyword: string;
	public sortkey: number;
	public isloading: boolean;
	public dataInfo = [];
	public memberCount;

	public smallgroupappointmentId: number;
	public smallgroupappointment: any;
	public smallgroupmemberLeader: any;
	public smallgroupmemberUpperleader: any;
	public smallgroupmemberUpperupperleader: any;


	// constructor(
	// 	private activatedRoute: ActivatedRoute,
	// 	private router: Router,
	// 	private http: HttpService,
	// ) {
	// 	this.smallgroupappointmentId = null;
	// 	this.activatedRoute.queryParams.subscribe((params) => {
	// 		this.smallgroupappointmentId = params['id'];
	// 		if (params['id'] === '0') {
	// 			this.router.navigateByUrl('admin/smallgroup/list-appointments'); //redirect ke list-appointments
	// 		}
	// 	});

	// 	if (this.smallgroupappointmentId == null) {
	// 		this.router.navigateByUrl('admin/smallgroup/list-appointments'); //redirect ke list-appointments
	// 	}
	// }

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private http: HttpService,
		private global: GlobalService,
		private helper: HelperService,
	) {
		this.keyword = null;
		this.sortkey = 0; // index 0 = 1
		this.isloading = true; // kepake di listtable
		this.memberCount = 0;

		this.smallgroupappointmentId = null;
		this.activatedRoute.queryParams.subscribe((params) => {
			this.smallgroupappointmentId = params['id'];
			if (params['id'] === '0') {
				this.router.navigateByUrl('admin/smallgroup/list-appointments'); //redirect ke list-appointments
			}
		});

		if (this.smallgroupappointmentId == null) {
			this.router.navigateByUrl('admin/smallgroup/list-appointments'); //redirect ke list-appointments
		}

		// showtype:
		// number, text, datetime,
		this.keys = [
			{
				label: 'Name',
				value: 'name',
				showtype: 'text',
				minwidth: false,
				priority: 0,
				opensort: false,
				sortcolumn: 'title',
				sortorder: 'ASC'
			},
			{
				label: 'Role',
				value: 'role',
				showtype: 'text',
				minwidth: false,
				priority: 0,
				opensort: false,
				nullvalue: 'No Small Group',
				align: 'center',
				sortorder: 'ASC'
			},
			{
				label: 'Attendance',
				value: `checkbox-1`,
				showtype: 'attendance',
				minwidth: false,
				priority: 0,
				opensort: false,
				maxlength: null,
				align: 'center',
				sortorder: 'ASC'
			},
		];
	
		// for (let index = 0; index < 3; index++) {
		// 	this.keys.push({
		// 		label: 'Attendance',
		// 		value: `checkbox-${index + 1}`,
		// 		showtype: 'attendance',
		// 		align: 'center',
		// 		minwidth: false,
		// 		priority: 0,
		// 		opensort: false
		// 	});
		// }
	}

	ngOnInit(): void {
		this.getData();
	}

	public sortDataBy(column: string): void {
		const self = this;
		this.keys.forEach(($ii, $i) => {
			if ($ii.sortcolumn != null) {
				if ($ii.sortcolumn === column) {
					// kalo sama baru di cek
					if ($ii.sortorder === ''
						|| $ii.sortorder === 'DESC') {
						$ii.sortorder = 'ASC';
					} else {
						$ii.sortorder = 'DESC';
					}
					self.sortkey = $i; // save indexnya
				}
			}
		});

		// bersihin data sort selain index sortkey
		this.keys.forEach(($ii, $i) => {
			if ($i !== self.sortkey) {
				$ii.sortorder = '';
			}
		});

		this.getData();
	}

	public getData(): void {
		const params = {
			id: this.smallgroupappointmentId
		};
		this.http.sendGetRequest2('smallgroupappointment/detail', params).subscribe((response: any) => {
			console.log(response);

			// on success
			try {
				if (response.api_status === true) {
					const appointments = response.data.smallgroupappointment.smallgroupappointmentattendances;
					this.smallgroupappointment = response.data.smallgroupappointment;
					this.smallgroupmemberLeader = response.data.smallgroupappointment_leader;
					this.smallgroupmemberUpperleader = response.data.smallgroupappointment_upperleader;
					this.smallgroupmemberUpperupperleader = response.data.smallgroupappointment_upperupperleader;
	
					this.dataInfo.push({
						type: 'Category',
						value: this.smallgroupappointment.smallgroupappointmenttype.name
					});
					this.dataInfo.push({
						type: 'Date',
						value: this.helper.makeDate(this.smallgroupappointment.appointmentdatetime)
					});
					this.dataInfo.push({
						type: 'Time',
						value: this.helper.makeTime(this.smallgroupappointment.appointmentdatetime)
					});
					this.dataInfo.push({
						type: 'Created By',
						value: this.smallgroupappointment.created_by
					});
					this.dataInfo.push({
						type: 'Attendee',
						value: '0'
					});
					this.dataInfo.push({
						type: 'RSVP',
						value: 'Yes'
					});
					this.dataInfo.push({
						type: 'Additional Info',
						value: this.smallgroupappointment.notes
					});

					this.dataInfo.push({
						type: 'Notes',
						value: this.smallgroupappointment.description
					});
	
					let temp;
				
					this.datas = [];
					this.memberCount = appointments.length;
					
					appointments.forEach(($ii) => {
						let membername;
						let memberrole;
						let memberstatus;

						// let index = appointments.findIndex(x => x.id === $ii.id)

						if ($ii.smallgroupmember != null) {
							if ($ii.smallgroupmember.user != null) {
								membername = $ii.smallgroupmember.user.fullname;
							}
	
							if ($ii.smallgroupmember.user2 != null) {
								membername = membername + $ii.smallgroupmember.user2.fullname;
							}
	
							if ($ii.smallgroupmember.smallgroupmemberrole != null){
								memberrole = $ii.smallgroupmember.smallgroupmemberrole.name
							}
						}
						else {
							if ($ii.user != null) {
								membername = $ii.user.fullname;
							}
							else {
								membername = $ii.name
							}
	
							memberrole = "Visitor"
						}

						if ($ii.status === "Present") {
							memberstatus = true;
						}
						else {
							memberstatus = false;
						}
					
						temp = {
							id: $ii.id,
							name: '<b>' + membername + '</b>',
							role: memberrole,
							[`checkbox-1`]: {
								id: $ii.id,
								status: memberstatus,
								loading: false,
							}
						};
	
						if ($ii.smallgroup_id != null) {
							temp.actions.push({
								label: 'View Small Group',
								url: '/admin/smallgroup/detail?id=' + $ii.smallgroup_id,
								type: ''
							});
						}

						this.datas.push(temp);
					});
	
					// self.navigations = {
					// 	from: response.data.smallgroupappointments.from,
					// 	to: response.data.smallgroupappointments.to,
					// 	total: response.data.smallgroupappointments.total,
					// 	last_page: response.data.smallgroupappointments.last_page,
					// 	per_page: response.data.smallgroupappointments.per_page,
					// 	current_page: response.data.smallgroupappointments.current_page,
					// 	search_by: 'Appointment Name'
					// };
	
				} else {
					swal.fire({
						title: 'Error 200',
						text: response.message,
						icon: 'warning',
						showCancelButton: false,
						confirmButtonText: 'OK'
					});
				}
			}
			catch (error) {
				swal.fire({
					title: 'Error',
					text: response.message,
					icon: 'warning',
					confirmButtonText: 'OK',
				});
			}
			finally {
				this.isloading = false
			}
			
		}, (error: any) => {
			// on error
			swal.fire({
				title: 'Error ' + error.status,
				html: this.helper.changeEOLToBr(error.error.message),
				icon: 'warning',
				showCancelButton: false,
				confirmButtonText: 'OK'
			});
		});
	}

	public appointmentAction(data: any): void {
		let status;
	
		if (data.status === true){
			status = 'Canceled';
		}
		else {
			status = 'Present';
		}
		
		this.http.sendPostRequest2('smallgroupappointmentattendance/action', {
			id: data.id,
			status: status
		}).subscribe((response: any) => {
			console.log(data.id)
			console.log(response);
			this.listtableattendance.doneToggle(data.id);
		});
	}
}

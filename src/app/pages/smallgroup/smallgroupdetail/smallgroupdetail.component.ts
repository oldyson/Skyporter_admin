import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from './../../../http.service';
import { GlobalService } from './../../../global.service';
import { HelperService } from './../../../helper.service';
import { TransfermemberComponent } from './transfermember/transfermember.component';
import {
	faUser as fasUser,
	faChevronDown as fasChevronDown
} from '@fortawesome/pro-solid-svg-icons';
import swal from 'sweetalert2';

@Component({
	selector: 'app-smallgroupdetail',
	templateUrl: './smallgroupdetail.component.html',
	styleUrls: ['./smallgroupdetail.component.scss']
})
export class SmallgroupdetailComponent implements OnInit {
	@ViewChild('transfermembermodal') transferMember: TransfermemberComponent;

	public maskSgNameByChurch;
	public fasUser = fasUser;
	public fasChevronDown = fasChevronDown;
	public sgId: number;
	public dataInfo;
	public loading: boolean;
	public contentData;
	public maxHeightContent;
	public isloadingExport;

	constructor(
		private http: HttpService,
		private global: GlobalService,
		private helper: HelperService,
		private router: Router,
		private activatedRoute: ActivatedRoute,
	) {
		this.maskSgNameByChurch = JSON.parse(localStorage.getItem('applicationfeatures')).filter(item => item.name === 'small-group')[0]?.applicationfeaturechurches[0]?.showname || 'small group';
		this.loading = true;
		this.isloadingExport = false;
		this.sgId = null;
		this.maxHeightContent = '9999px';
		this.activatedRoute.queryParams.subscribe(params => {
			this.sgId = parseInt(params.id, 10);
		});

		if (this.sgId == null) {
			// redirect back to list
			this.router.navigateByUrl('admin/smallgroup/list');
		}

		this.contentData = [];

		this.dataInfo = {
			title: '',
			smallGroupLeader: '',
			smallGroupDetail: [],
			multiplicationDetail: [],
			smallGroupParentDetail: []
		};
	}

	ngOnInit(): void {
		this.getData();
	}

	public showPopup(): void {
		this.transferMember.showDialog();
	}

	public exportDetailSmallGroup():void {
		swal.fire({
			title: 'Are you sure?',
			icon: 'question',
			showCancelButton: true,
			confirmButtonText: 'Export'
		}).then((result) => {
			if (result.isConfirmed) {
				this.isloadingExport = true;
				this.http.sendGetRequest2('smallgroupmember/export/filtered?smallgroupId=' + this.sgId).subscribe((response: any) => {
					if (response.api_status) {
						const link = document.createElement('a');
						link.href = response.data.path;
						link.download = response.data.path;
						document.body.appendChild(link);
						link.click();
						document.body.removeChild(link);
					} else {
						swal.fire({
							title: 'Error',
							text: response.message,
							icon: 'warning',
							confirmButtonText: 'OK'
						});
					}
					this.isloadingExport = false;
				}, (error: any) => {
					swal.fire({
						title: 'Error ' + error.status,
						html: this.helper.changeEOLToBr(error.error.message),
						icon: 'warning',
						confirmButtonText: 'OK'
					});
					this.isloadingExport = false;
				});
			}
		});
	}

	public toggleAccordion(event, index): void {
		const element = event.target;
		element.classList.toggle('active');
		this.contentData[index].isActive = !this.contentData[index].isActive;

		const panel = element.nextElementSibling;
		panel.style.maxHeight = panel.scrollHeight + 'px';
	}

	public getData(): void {
		this.loading = true;
		this.dataInfo = {
			title: '',
			smallGroupLeader: '',
			smallGroupDetail: [],
			multiplicationDetail: [],
			smallGroupParentDetail: []
		};
		this.contentData = [];

		const request = [{
			url: `smallgroup/detail?id=${this.sgId}`,
			type: 'Info'
		}, {
			url: `smallgroup/member-list?smallgroupId=${this.sgId}`,
			type: 'Content User'
		}];

		if (request.length) {
			request.forEach(item => {
				this.http.sendGetRequest2(item.url).subscribe((response: any) => {
					if (response.api_status) {
						switch (item.type) {
							case 'Info':
								this.getDataInfo(response.data);
								response.data.smallgroup.smallgrouprequests.forEach(($ii)=> {
									if ($ii.smallgroupmember != null){
										$ii.smallgroupmember.actions = [
											{
												label: 'View user',
												url: `admin/user/detail?id=${$ii.smallgroupmember.user_id}`,
												type: '',
												// apimethod: 'POST',
												apiurl: null,
												apiparams: {}
											}
										];
									}else{
										$ii.smallgroupmember = {};
										$ii.smallgroupmember.user = $ii.user;
										$ii.smallgroupmember.actions = [
											{
												label: 'View user',
												url: `admin/user/detail?id=${$ii.smallgroupmember.user.id}`,
												type: '',
												// apimethod: 'POST',
												apiurl: null,
												apiparams: {}
											}
										];
									}
								})

								this.getDataContentNewTransfer(response.data.smallgroup.smallgrouprequests);
								this.getDataContentNewRequest(response.data.smallgroup.smallgrouprequests);
								this.getDataContentProbations(response.data.smallgroup.smallgrouprequests);
								break;
							case 'Content User':
								this.getDataContentUsers(response.data);
								break;
							default:
								break;
						}
					}
					this.loading = false;
				}, (error: any) => {
					swal.fire({
						title: 'Error',
						text: error.message,
						icon: 'warning',
						confirmButtonText: 'OK',
					});
				});
			});
		}
	}

	public getDataContentProbations(data: any): void {
		const tempUsers = data.filter(item => {
			return item.status === 'Probation';
		});
		this.contentData.push({
			title: 'Probations',
			isActive: false,
			datas: tempUsers.map(item => {
				return item.smallgroupmember;
			})
		});
	}

	public getDataContentNewRequest(data: any): void {
		const tempUsers = data.filter(item => {
			return !item.smallgroupmember_id && item.status === 'Pending';
		});
		this.contentData.push({
			title: 'New Request',
			isActive: false,
			datas: tempUsers.map(item => {
				return item.smallgroupmember;
			})
		});
	}

	public getDataContentNewTransfer(data: any): void {
		const tempUsers = data.filter(item => {
			return item.smallgroupmember_id && item.status === 'Pending';
		});
		this.contentData.push({
			title: 'New Transfer',
			isActive: false,
			datas: tempUsers.map(item => {
				return item.smallgroupmember;
			})
		});
	}

	public getDataContentUsers(data: any): void {
		let tempUsers = [];
		const coreTeam = [];
		const defaultMember = [];
		data.smallgroupmembers.filter(item => {
			return !item.iscoreteam;
		}).map(value => {
			defaultMember.push({
				...value,
				actions: [
					{
						label: 'View user',
						url: `admin/user/detail?id=${value.user_id}`,
						type: '',
						// apimethod: 'POST',
						apiurl: null,
						apiparams: {}
					}
				],
			});
			if (value.user2_id) {
				defaultMember.push({
					...value,
					user: value.user2,
					actions: [
						{
							label: 'View user',
							url: `admin/user/detail?id=${value.user2_id}`,
							type: '',
							// apimethod: 'POST',
							apiurl: null,
							apiparams: {}
						}
					],
				});
			}
		});
		data.smallgroupmembers.filter(item => {
			return item.iscoreteam;
		}).map(value => {
			coreTeam.push({
				...value,
				actions: [
					{
						label: 'View user',
						url: `admin/user/detail?id=${value.user_id}`,
						type: '',
						// apimethod: 'POST',
						apiurl: null,
						apiparams: {}
					}
				]
			});
			if (value.user2_id) {
				coreTeam.push({
					...value,
					user: value.user2,
					actions: [
						{
							label: 'View user',
							url: `admin/user/detail?id=${value.user2_id}`,
							type: '',
							// apimethod: 'POST',
							apiurl: null,
							apiparams: {}
						}
					]
				});
			}
		});

		if (data.smallgroupmember_leader.user) {
			// LEADER 1
			tempUsers[0] = {
				smallgroupmemberrole: data.smallgroupmember_leader.smallgroupmemberrole,
				iscoreteam: false,
				isleader: true,
				user: data.smallgroupmember_leader.user,
				actions: [
					{
						label: 'View User',
						url: `admin/user/detail?id=${data.smallgroupmember_leader.user_id}`,
						type: '',
						// apimethod: 'POST',
						apiurl: null,
						apiparams: {}
					}
				]
			};
		}

		if (data.smallgroupmember_leader.user2) {
			// LEADER 1
			tempUsers[1] = {
				smallgroupmemberrole: data.smallgroupmember_leader.smallgroupmemberrole,
				iscoreteam: false,
				isleader: true,
				user: data.smallgroupmember_leader.user2,
				actions: [
					{
						label: 'View User',
						url: `admin/user/detail?id=${data.smallgroupmember_leader.user2_id}`,
						type: '',
						// apimethod: 'POST',
						apiurl: null,
						apiparams: {}
					}
				]
			};
		}

		if (data.smallgroupmember_leader2?.user) {
			// LEADER 2
			tempUsers[1] = {
				smallgroupmemberrole: data.smallgroupmember_leader2.smallgroupmemberrole,
				iscoreteam: false,
				isleader: true,
				user: data.smallgroupmember_leader2.user,
				actions: [
					{
						label: 'View User',
						url: `admin/user/detail?id=${data.smallgroupmember_leader2.user_id}`,
						type: '',
						// apimethod: 'POST',
						apiurl: null,
						apiparams: {}
					}
				]
			};
		}

		if (data.smallgroupmember_leader2?.user2) {
			// LEADER 2
			tempUsers[1] = {
				smallgroupmemberrole: data.smallgroupmember_leader2.smallgroupmemberrole,
				iscoreteam: false,
				isleader: true,
				user: data.smallgroupmember_leader2.user2,
				actions: [
					{
						label: 'View User',
						url: `admin/user/detail?id=${data.smallgroupmember_leader2.user2_id}`,
						type: '',
						// apimethod: 'POST',
						apiurl: null,
						apiparams: {}
					}
				]
			};
		}

		tempUsers = [...tempUsers, ...coreTeam, ...defaultMember];
		this.contentData.push({
			title: 'Leaders & CoreTeams & Members',
			isActive: true,
			datas: tempUsers
		});
	}

	public getDataInfo(data: any): void {
		const smallGroup = data.smallgroup || {};
		const multiplication = data.smallgroup_multiplicatorlist || [];
		const leader = data.smallgroupmember_upperleader || {};
		const upperLeader = data.smallgroupmember_upperupperleader || {};
		const leaderSmallGroup = data.smallgroup_leadersmallgroup || {};
		const upperLeaderSmallGroup = data.smallgroup_upperleadersmallgroup || {};

		// title small group
		this.dataInfo.id = smallGroup.id;
		this.dataInfo.title = smallGroup.name;
		this.dataInfo.smallgroupLevel = smallGroup.smallgroupleader?.smallgroupmemberrole?.level;
		//small group leader name
		this.dataInfo.smallGroupLeader = [
			smallGroup.smallgroupleader?.user?.fullname,
			smallGroup.smallgroupleader?.user2?.fullname,
		];

		this.transferMember.getSmallGroup(this.dataInfo.smallgroupLevel);

		//small group detail
		this.dataInfo.smallGroupDetail.push({
			type: `${this.maskSgNameByChurch} Leader Substitute`,
			value: smallGroup.smallgroupleader2?.user?.fullname,
			value2: smallGroup.smallgroupleader2?.user2?.fullname
		});
		this.dataInfo.smallGroupDetail.push({
			type: 'Campus',
			value: smallGroup.campus?.name
		});
		this.dataInfo.smallGroupDetail.push({
			type: 'Level',
			value: smallGroup.smallgroupleader?.smallgroupmemberrole?.name
		});
		this.dataInfo.smallGroupDetail.push({
			type: 'Category',
			value: smallGroup.smallgroupcategory?.name
		});
		this.dataInfo.smallGroupDetail.push({
			type: 'Age Range',
			value: `${smallGroup.agemin} - ${smallGroup.agemax}`
		});
		this.dataInfo.smallGroupDetail.push({
			type: 'Full Address',
			value: smallGroup.addressfull
		});
		this.dataInfo.smallGroupDetail.push({
			type: 'Short Address',
			value: smallGroup.address
		});
		this.dataInfo.smallGroupDetail.push({
			type: 'Day | Time',
			value: `${smallGroup.appointmentdefaultday ? this.helper.days[smallGroup.appointmentdefaultday]?.title : 'No Data'} | ${smallGroup.appointmentdefaulttime || 'No Data'}`
		});
		this.dataInfo.smallGroupDetail.push({
			type: 'Status',
			value: smallGroup.status
		});
		this.dataInfo.smallGroupDetail.push({
			type: 'Established in',
			value: smallGroup.established_at && this.helper.makeDate(smallGroup.established_at)
		});
		this.dataInfo.smallGroupDetail.push({
			type: `${this.maskSgNameByChurch} Description`,
			value: smallGroup.description
		});

		//multiplication detail
		this.dataInfo.multiplicationDetail.push({
			type: 'Groups',
			value: multiplication.map(item => {
				return item.name;
			})
		});

		//smallgroup parent detail
		this.dataInfo.smallGroupParentDetail.push({
			type: 'Facilitator',
			value: [
				leader.user?.fullname,
				leader.user2?.fullname
			]
		});
		this.dataInfo.smallGroupParentDetail.push({
			type: 'Facilitator Group',
			value: [
				leaderSmallGroup.name
			]
		});
		this.dataInfo.smallGroupParentDetail.push({
			type: 'Head Facilitator',
			value: [
				upperLeader.user?.fullname,
				upperLeader.user2?.fullname
			]
		});
		this.dataInfo.smallGroupParentDetail.push({
			type: 'Head Facilitator Group',
			value: [
				upperLeaderSmallGroup.name
			]
		});
	}
}

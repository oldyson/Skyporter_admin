import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from './../../../http.service';
import { GlobalService } from './../../../global.service';
import { HelperService } from './../../../helper.service';
import { InputformComponent } from 'src/app/components/inputform/inputform.component';
import {
	faSpinner as fadSpinner,
} from '@fortawesome/pro-duotone-svg-icons';
import swal from 'sweetalert2';

@Component({
	selector: 'app-ministryform',
	templateUrl: './ministryform.component.html',
	styleUrls: ['./ministryform.component.scss']
})
export class MinistryformComponent implements OnInit {
	@ViewChild('subgroupDropdown', { static: false }) private subgroupDropdown: InputformComponent;

	public fadSpinner = fadSpinner;

	public selectedTabIndex: number;
	public tabs: any;
	public groups: any;
	public subgroups: any;
	public users: any;
	public status: any;
	public genders: any;
	public programs: any;
	public banner: any;
	public imageSrc: string;
	public filename: string;

	public group: any;
	public subgroup: any;
	public ministry: any;
	public levels: any;

	public ministryId: any;

	public isLoadingData: boolean;
	public isLoadingInput: boolean;
	public isLoadingUsers: boolean;
	public isLoadingGroups: boolean;
	public isLoadingPrograms: boolean;
	public isLoadingLevels: boolean;

	constructor(
		public activatedRoute: ActivatedRoute,
		public router: Router,
		public http: HttpService,
		public global: GlobalService,
		public helper: HelperService
	) {
		this.activatedRoute.queryParams.subscribe(params => {
			this.ministryId = parseInt(params.id, 10);
		});
		this.isLoadingInput = false;
		this.isLoadingUsers = false;
		this.isLoadingGroups = false;
		this.isLoadingPrograms = false;
		this.isLoadingData = false;
		this.isLoadingLevels = false;
		this.users = [];
		this.groups = [];
		this.subgroups = [];
		this.programs = [];
		this.levels = [];
		this.tabs = [
			{
				label: 'Group Head',
				value: 'Group'
			},
			{
				label: 'Sub-Group',
				value: 'Subgroup'
			},
			{
				label: 'Ministry',
				value: 'Ministry'
			}
		];
		this.group = {
			mgName: null,
			mgShortname: null,
			mgUserId: null,
			mgUser2Id: null
		};
		this.subgroup = {
			msgMinistrygroupId: null,
			msgName: null,
			msgShortname: null,
			msgUserId: null,
			msgUser2Id: null
		};
		this.ministry = {
			mGroupId: null,
			mSubgroupId: null,
			mName: '',
			mDescription: '',
			mStatus: 'Open',
			sgMinLevel: null,
			mAgeMin: 0,
			mAgeMax: 127,
			mImage: null,
			mImageUrl: null,
			mGender: 'allGender',
			programcodeId: [],
			mhUserId: null,
			kvUserId: null
		};
		this.status = [
			{
				id: 'Open',
				name: 'Open'
			},
			{
				id: 'Full',
				name: 'Full'
			},
			{
				id: 'Closed',
				name: 'Closed'
			}
		];
		this.genders = [
			{
				id: 'allGender',
				name: 'All Gender'
			},
			{
				id: 'Male',
				name: 'Male'
			},
			{
				id: 'Female',
				name: 'Female'
			}
		];
	}

	ngOnInit(): void {
		this.changeSelectedTabIndex(0);
		this.getGroups();
		this.getLevels();
		this.getAllUsers();
		this.getPrograms();
		this.generateInitParam();
	}

	public checkNaN(value: any): boolean {
		return isNaN(value);
	}

	public generateInitParam(): void {
		this.activatedRoute.queryParams.subscribe(params => {
			const id = params['id'];
			if (id !== undefined) {
				this.ministryId = parseInt(id, 10);
				this.changeSelectedTabIndex(2);
				this.getMinistryDetail(this.ministryId);
			}
		});
	}

	public changeSelectedTabIndex(index: number): void {
		this.selectedTabIndex = index;
	}

	public getLevels(): void {
		if (!this.isLoadingLevels) {
			this.isLoadingLevels = true;
			this.http.sendGetRequest2('smallgroup/all-level').subscribe((response: any) => {
				this.isLoadingLevels = false;
				if (response.api_status === true) {
					this.levels = response.data.smallgroup_level;
				} else {
					this.showErrorDialog(response.message);
				}
			}, (error: any) => {
				this.isLoadingLevels = false;
				this.showErrorDialog(error.message);
			});
		}
	}

	public getMinistryDetail(ministryId: number): void {
		if (!this.isLoadingData) {
			this.isLoadingData = true;
			const param = {
				id: ministryId
			};
			this.http.sendGetRequest2('ministry/detail', param).subscribe((response: any) => {
				this.isLoadingData = false;
				if (response.api_status === true) {
					const ministryData = response.data.ministry;
					const ministryGroup = ministryData.ministrygroup;
					const ministrySubGroup = ministryData.ministrysubgroup;
					const ministryPreReqPrograms = ministryData.ministryprereqprograms;
					const ministryMembers = ministryData.ministrymembers;
					const programcodeIds = [];
					const mhUserIds = [];
					const kvUserIds = [];
					const mGroupId = ministrySubGroup ? ministrySubGroup?.ministrygroup?.id : ministryGroup?.id;
					let mImageUrl = null;

					ministryPreReqPrograms.forEach(item => {
						programcodeIds.push(item.programcode_id);
					});

					ministryMembers.forEach(item => {
						if (item?.ministrymemberrole?.level === 4) {
							mhUserIds.push(item?.user?.id);
						} else if (item?.ministrymemberrole?.level === 3) {
							kvUserIds.push(item?.user?.id);
						}
					});

					if (ministryData.document!=null&&ministryData.document.url!=null) {
						mImageUrl = ministryData?.document?.url;
					}

					this.ministry = {
						id: ministryData.id,
						mGroupId: ministrySubGroup ? ministrySubGroup?.ministrygroup?.id : ministryGroup?.id,
						mSubgroupId: ministrySubGroup?.id,
						mName: ministryData?.name,
						mDescription: ministryData?.description,
						mStatus: ministryData?.status,
						sgMinLevel: ministryData?.sgmemberroleminlevel,
						mAgeMin: ministryData?.agemin,
						mAgeMax: ministryData?.agemax,
						mImageUrl: mImageUrl,
						mGender: ministryData?.gender,
						programcodeId: programcodeIds,
						mhUserId: mhUserIds,
						kvUserId: kvUserIds
					};

					this.getSubGroups(mGroupId);
				} else {
					this.showErrorDialog(response.message);
				}
			}, (error: any) => {
				this.isLoadingData = false;
				this.showErrorDialog(error.message);
			});
		}
	}

	public getGroups(): void {
		if (!this.isLoadingGroups) {
			this.isLoadingGroups = true;
			this.http.sendGetRequest2('ministry/filters', null).subscribe((response: any) => {
				this.isLoadingGroups = false;
				if (response.api_status === true) {
					const groupList = response.data.ministrygroups;
					this.groups = [];
					let group;

					groupList.forEach(($data) => {
						group = {
							id: $data.id,
							name: $data.name,
							subgroups: $data.ministrysubgroups
						};
						this.groups.push(group);
					});
				} else {
					this.showErrorDialog(response.message);
				}
			}, (error: any) => {
				this.isLoadingGroups = false;
				this.showErrorDialog(error.message);
			});
		}
	}

	public onChangeGroup(value: any): void {
		this.ministry.mSubgroupId = null;
		this.getSubGroups(value);
	}

	public getSubGroups(groupId: number): void {
		this.groups.forEach(($dataGroup) => {
			if ($dataGroup.id === groupId) {
				const subgroupList = $dataGroup.subgroups;
				this.subgroups = [];
				let subgroup;

				subgroupList.forEach(($data) => {
					subgroup = {
						id: $data.id,
						name: $data.name
					};
					this.subgroups.push(subgroup);
				});
			}
		});
	}

	public getAllUsers(): void {
		if (!this.isLoadingUsers) {
			this.isLoadingUsers = true;
			const param = {
				withMember: true
			};
			this.http.sendGetRequest2('user/get', param).subscribe((response: any) => {
				this.isLoadingUsers = false;
				if (response.api_status === true) {
					const userList = response.data.user;
					this.users = [];
					let user;

					userList.forEach(($data) => {
						user = {
							id: $data.id,
							name: $data.fullname
						};
						this.users.push(user);
					});
				} else {
					this.showErrorDialog(response.message);
				}
			}, (error: any) => {
				this.isLoadingUsers = false;
				this.showErrorDialog(error.message);
			});
		}
	}

	public getPrograms(): void {
		if (!this.isLoadingPrograms) {
			this.isLoadingPrograms = true;
			const param = {
				type: 'Class'
			};
			this.http.sendGetRequest2('programcode/all-list', param).subscribe((response: any) => {
				this.isLoadingPrograms = false;
				if (response.api_status === true) {
					const programList = response.data.programcodes;
					this.programs = [];
					let program;

					programList.forEach(($data) => {
						program = {
							id: $data.id,
							name: $data.name
						};
						this.programs.push(program);
					});
				} else {
					this.showErrorDialog(response.message);
				}
			}, (error: any) => {
				this.isLoadingPrograms = false;
				this.showErrorDialog(error.message);
			});
		}
	}

	public saveData(): void {
		if (!this.isLoadingInput) {
			this.isLoadingInput = true;
			if (this.tabs[this.selectedTabIndex].value === 'Group') {
				if (this.group.mgName == null) {
					this.isLoadingInput = false;
					this.showWarningDialog('Please input Group Name');
				} else if (this.group.mgShortname == null) {
					this.isLoadingInput = false;
					this.showWarningDialog('Please input Group Shortname');
				} else if (this.group.mgUserId == null) {
					this.isLoadingInput = false;
					this.showWarningDialog('Please input Group Head');
				} else {
					this.http.sendPostRequest2('ministrygroup/create', this.group).subscribe((response: any) => {
						this.isLoadingInput = false;
						this.router.navigateByUrl('admin/ministry/list');
						this.showDialog(response.message);
					}, (error: any) => {
						this.isLoadingInput = false;
						this.showErrorDialog(error.message);
					});
				}
			}
			if (this.tabs[this.selectedTabIndex].value === 'Subgroup') {
				if (this.subgroup.msgMinistrygroupId == null) {
					this.isLoadingInput = false;
					this.showWarningDialog('Please input Group Name');
				} else if (this.subgroup.msgName == null) {
					this.isLoadingInput = false;
					this.showWarningDialog('Please input Sub-Group Name');
				} else if (this.subgroup.msgShortname == null) {
					this.isLoadingInput = false;
					this.showWarningDialog('Please input Sub-Group Shortname');
				} else if (this.subgroup.msgUserId == null) {
					this.isLoadingInput = false;
					this.showWarningDialog('Please input Sub-Group Head');
				} else {
					this.http.sendPostRequest2('ministrysubgroup/create', this.subgroup).subscribe((response: any) => {
						this.isLoadingInput = false;
						this.router.navigateByUrl('admin/ministry/list');
						this.showDialog(response.message);
					}, (error: any) => {
						this.isLoadingInput = false;
						this.showErrorDialog(error.message);
					});
				}
			}
			// diapus untuk pengecekan ini karena boleh null
			// } else if (this.ministry.mGroupId === null || isNaN(this.ministry.mGroupId)) {
			//   this.isLoadingInput = false;
			//   this.showWarningDialog('Please input Ministry Group Name');
			// } else if (this.ministry.mSubgroupId === null || isNaN(this.ministry.mSubgroupId)) {
			//   this.isLoadingInput = false;
			//   this.showWarningDialog('Please input Ministry Sub Group Name');
			if (this.tabs[this.selectedTabIndex].value === 'Ministry') {
				if (this.ministry.mName === '') {
					this.isLoadingInput = false;
					this.showWarningDialog('Please input Ministry Name');
				} else if (this.ministry.mStatus === null) {
					this.isLoadingInput = false;
					this.showWarningDialog('Please input Ministry Status');
				} else if ((this.ministry.mSubgroupId === null || isNaN(this.ministry.mSubgroupId)) && (this.ministry.mGroupId === null || isNaN(this.ministry.mGroupId))) {
					this.isLoadingInput = false;
					this.showWarningDialog('Please input Ministry Group Name or Sub Group Name');
				} else if (this.ministry.mAgeMin > this.ministry.mAgeMax) {
					this.isLoadingInput = false;
					this.showWarningDialog('Ministry Age Min can\'t be greater than Ministry Age Max');
				} else if (this.ministryId === null || isNaN(this.ministry.mhUserId) && this.ministry.mhUserId === null) {
					this.isLoadingInput = false;
					this.showWarningDialog('Please input Ministry Head');
				} else if ((this.ministry.sgMinLevel === null && this.ministry.mStatus == 'Open') || isNaN(this.ministry.sgMinLevel)) {
					this.isLoadingInput = false;
					this.showWarningDialog(`Please input ${this.tabs[this.selectedTabIndex].label} Min Level`);
				} else if (this.ministry.mAgeMin === null && this.ministry.mStatus == 'Open') {
					this.isLoadingInput = false;
					this.showWarningDialog(`Please input ${this.tabs[this.selectedTabIndex].label} Age Min`);
				} else if (this.ministry.mAgeMax === null && this.ministry.mStatus == 'Open') {
					this.isLoadingInput = false;
					this.showWarningDialog(`Please input ${this.tabs[this.selectedTabIndex].label} Age Max`);
				} else if (this.ministry.mGender === null && this.ministry.mStatus == 'Open') {
					this.isLoadingInput = false;
					this.showWarningDialog(`Please input ${this.tabs[this.selectedTabIndex].label} Gender`);
				} else if (this.ministry.mhUserId === null) {
					this.isLoadingInput = false;
					this.showWarningDialog(`Please input ${this.tabs[this.selectedTabIndex].label} Head`);
				} else if (this.ministry.kvUserId === null) {
					this.isLoadingInput = false;
					this.showWarningDialog('Please input Key Volunteer');
				} else {
					let tempProgramCodeId = '';
					let tempMhUserId = '';
					let tempKvUserId = '';
					if (this.ministry.programcodeId != null) tempProgramCodeId = this.ministry.programcodeId.join(',');
					if (this.ministry.mhUserId != null) tempMhUserId = this.ministry.mhUserId.join(',');
					if (this.ministry.kvUserId != null) tempKvUserId = this.ministry.kvUserId.join(',');
					this.ministry.mImage = this.banner;

					const formData = new FormData();
					// formData.append('mSubgroupId', this.ministry.mSubgroupId);
					// formData.append('mGroupId', this.ministry.mGroupId);
					if (this.ministry.mSubgroupId != null) formData.append('mSubgroupId', this.ministry.mSubgroupId);
					if (this.ministry.mGroupId != null) formData.append('mGroupId', this.ministry.mGroupId);
					if (this.ministry.mName != null) formData.append('mName', this.ministry.mName);
					if (this.ministry.mStatus != null) formData.append('mStatus', this.ministry.mStatus);
					if (this.ministry.mhUserId != null) formData.append('mhUserId', tempMhUserId);
					if (this.ministry.mDescription != null) formData.append('mDescription', this.ministry.mDescription);
					if (this.ministry.sgMinLevel != null && this.ministry.mStatus == 'Open') formData.append('sgMemberRoleMinLevel', this.ministry.sgMinLevel);
					if (this.ministry.mAgeMin != null && this.ministry.mStatus == 'Open') formData.append('mAgeMin', this.ministry.mAgeMin);
					if (this.ministry.mAgeMax != null && this.ministry.mStatus == 'Open') formData.append('mAgeMax', this.ministry.mAgeMax);
					if (this.ministry.mImage != null && this.ministry.mStatus == 'Open') formData.append('mImage', this.ministry.mImage);
					if (this.ministry.mGender != null && this.ministry.mStatus == 'Open') formData.append('mGender', this.ministry.mGender !== 'allGender' ? this.ministry.mGender : '');
					if (this.ministry.programcodeId != null) formData.append('programcodeId', tempProgramCodeId);
					if (this.ministry.kvUserId != null) formData.append('kvUserId', tempKvUserId);

					let url;
					if (this.ministryId != null && !isNaN(this.ministryId)) {
						formData.append('mId', this.ministryId);
						url = 'ministry/update';
					} else {
						url = 'ministry/create';
					}

					this.http.sendPostUpload(url, formData).subscribe((response: any) => {
						this.isLoadingInput = false;
						this.showDialog(response.message);
						this.router.navigateByUrl('admin/ministry/list');
					}, (error: any) => {
						this.isLoadingInput = false;
						this.showErrorDialog(error.message);
					});
				}
				//  else if (!this.ministry.programcodeId.length && this.ministry.mStatus != 'Open') {
				// 	this.isLoadingInput = false;
				// 	this.showWarningDialog('Please input Ministry Prerequisite Program');
				// }
			}
		}
	}

	public onFileChange(event): void {
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

	public showDialog(message: string): void {
		swal.fire({
			title: 'Success',
			text: message,
			icon: 'success',
			confirmButtonText: 'OK',
		}).then(() => {
			// Nothing
		});
	}

	public showWarningDialog(message: string): void {
		swal.fire({
			title: 'Warning',
			text: message,
			icon: 'warning',
			confirmButtonText: 'OK',
		}).then(() => {
			// Nothing
		});
	}

	public showErrorDialog(message: string): void {
		swal.fire({
			title: 'Error',
			text: message,
			icon: 'error',
			confirmButtonText: 'OK',
		}).then(() => {
			// Nothing
		});
	}
}

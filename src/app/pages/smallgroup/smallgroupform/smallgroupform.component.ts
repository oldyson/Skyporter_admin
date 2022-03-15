import { Component, OnInit } from '@angular/core';
import { HttpService } from './../../../http.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HelperService } from './../../../helper.service';
import { faSpinner as fadSpinner } from '@fortawesome/pro-duotone-svg-icons';
import swal from 'sweetalert2';

@Component({
	selector: 'comp-smallgroupform',
	templateUrl: './smallgroupform.component.html',
	styleUrls: ['./smallgroupform.component.scss']
})
export class SmallgroupformComponent implements OnInit {

	public fadSpinner = fadSpinner;
	public maskSgNameByChurch;
	public smallGroupId: number;
	public currentViewIndex: number;
	public isEdit;
	public isLoading;
	public loadingSave;
	public isLoadingSelectedSgCampus;
	public isLoadingSelectedSgLevel;
	public isLoadingSelectedParentCampus;
	public isLoadingSelectedParentSg;
	public isLoadingSelectedSgCategory;
	public isLoadingSelectedSgLeader;
	public isLoadingSelectedSgLeader2;
	public isLoadingSelectedUpperLevelSglName;
	public isLoadingSelectedSgRegion;
	public isLoadingSelectedScheduleDay;
	public isLoadingSelectedSgStatus;
	public isLoadingSgMemberList;
	public formErrorCount;
	public churchId;
	public smallGroup;
	public smallGroupType;
	public selectedParentCampus;
	public campusList;
	public levelList;
	public sgParentCampusList;
	public sgParentList;
	public sgCategoryList;
	public sgLeaderList;
	public sgLeaderList2;
	public upperLevelSglNameList;
	public sgRegionList;
	public sgScheduleDayList;
	public sgStatusList;
	public sgMemberList;
	public replacementLeaderList;

	constructor(
		public activatedRoute: ActivatedRoute,
		private http: HttpService,
		public router: Router,
		private helper: HelperService
	) {
		this.maskSgNameByChurch = JSON.parse(localStorage.getItem('applicationfeatures')).filter(item => item.name === 'small-group')[0]?.applicationfeaturechurches[0]?.showname || 'small group';
		this.activatedRoute.queryParams.subscribe(params => {
			this.smallGroupId = parseInt(params.id, 10);
		});
		this.isLoading = false;
		this.loadingSave = false;
		this.churchId = JSON.parse(localStorage.getItem('church')).id;
		this.currentViewIndex = 0;
		this.smallGroupType = [{
			name: 'Multiplication',
			value: 'Multiplication'
		}];
		this.selectedParentCampus = null;
		this.replacementLeaderList = [];
		this.smallGroup = {
			sgCampus: {
				value: null,
				title: `${this.maskSgNameByChurch} Campus`
			},
			sgLevel: {
				value: null,
				title: `${this.maskSgNameByChurch} Level`
			},
			sgParent: {
				value: null,
				title: `Parent ${this.maskSgNameByChurch}`
			},
			sgName: {
				value: null,
				title: `${this.maskSgNameByChurch} Name`
			},
			sgCategory: {
				value: null,
				title: `${this.maskSgNameByChurch} Category`
			},
			sgLeader: {
				value: null,
				title: `${this.maskSgNameByChurch} Leader`
			},
			sgLeader2: {
				value: null,
				title: `${this.maskSgNameByChurch} Leader Substitution`
			},
			sgMembers: {
				value: null,
				title: `${this.maskSgNameByChurch} Members to Transfer`
			},
			sgUpperLeader: {
				value: null,
				title: `Upper Level ${this.maskSgNameByChurch} Leader Name`
			},
			sgFullAddress: {
				value: '',
				title: 'Full Address'
			},
			sgShortAddress: {
				value: null,
				title: 'Short Address'
			},
			sgRegion: {
				value: null,
				title: 'Region'
			},
			sgPostalCode: {
				value: null,
				title: 'Postal Code'
			},
			sgDay: {
				value: null,
				title: 'Schedule: Day'
			},
			sgTime: {
				value: null,
				title: 'Schedule: Time'
			},
			sgStatus: {
				value: null,
				title: `${this.maskSgNameByChurch} Status`
			},
			sgEstablishedDate: {
				value: null,
				title: 'Established Date'
			},
			sgAgeFrom: {
				value: null,
				title: 'Age From'
			},
			sgAgeTo: {
				value: null,
				title: 'Age To'
			},
			sgDescription: {
				value: '',
				title: `${this.maskSgNameByChurch} Description`,
				withEmoji: true,
				config: {
					toolbar: []
				}
			},
		};
	}

	ngOnInit(): void {
		this.getCampusList();
		this.getLevelList();
		this.getSgParentList();
		this.getSgCategoryList();
		this.getSgLeaderList();
		this.getUpperLevelSglNameList();
		this.getSgRegionList();
		this.getSgScheduleDay();
		this.getSgStatus();
		this.getFormById();
	}

	public changeViewIndex(index: any): void {
		this.currentViewIndex = index;
		this.getSgLeaderList();
		this.getUpperLevelSglNameList();
		this.getSgParentList();
		this.smallGroup.sgLevel.value = null;
		this.selectedParentCampus = null;
		this.smallGroup.sgParent.value = null;
		this.smallGroup.sgLeader.value = null;
		this.smallGroup.sgLeader2.value = null;
		this.smallGroup.sgUpperLeader.value = null;
	}

	public saveSmallGroup(): void {
		let paramCheck = {};
		this.formErrorCount = 0;
		for (const item in this.smallGroup) {
			if (this.smallGroupType[this.currentViewIndex].value === 'Multiplication') {
				if(!this.isEdit){
					if ((this.smallGroup[item].value === null || this.smallGroup[item].value === '' || (typeof this.smallGroup[item].value == 'undefined')) && item !== 'sgLeader2' && item !== 'sgMembers' && item !== 'sgUpperLeader') {
						swal.fire({
							title: 'Error',
							text: this.helper.toTitleCase(this.smallGroup[item].title) + ' must be filled',
							icon: 'warning',
							confirmButtonText: 'OK'
						});
						this.formErrorCount++;
					}

					if((this.smallGroup[item].value === null || this.smallGroup[item].value === '' || (typeof this.smallGroup[item].value == 'undefined')) && item === 'sgUpperLeader' && this.upperLevelSglNameList != null && this.upperLevelSglNameList.length > 0){
						swal.fire({
							title: 'Error',
							text: this.helper.toTitleCase(this.smallGroup[item].title) + ' must be filled',
							icon: 'warning',
							confirmButtonText: 'OK'
						});
						this.formErrorCount++;
					}
				}
			} else {
				if ((this.smallGroup[item].value === null || this.smallGroup[item].value === '' || (typeof this.smallGroup[item].value == 'undefined')) && item !== 'sgParent' && item !== 'sgLeader2') {
					swal.fire({
						title: 'Error',
						text: this.helper.toTitleCase(this.smallGroup[item].title) + ' must be filled',
						icon: 'warning',
						confirmButtonText: 'OK'
					});
					this.formErrorCount++;
				}
			}
		}

		this.replacementLeaderList.forEach(($ii)=>{
			if($ii.smallgroup_id != null && $ii.smallgroupmember_id == null){
				swal.fire({
						title: 'Error',
						text: this.helper.toTitleCase($ii.title) + ' must be filled',
						icon: 'warning',
						confirmButtonText: 'OK'
					});
				this.formErrorCount++;
			}
		});
		if (!this.formErrorCount) {
			const params = {
				sgCampus: this.smallGroup.sgCampus.value !== 'noCampus' ? this.smallGroup.sgCampus.value : '',
				sgLevel: this.smallGroup.sgLevel.value,
				sgName: this.smallGroup.sgName.value,
				sgCategory: this.smallGroup.sgCategory.value,
				sgLeader: this.smallGroup.sgLeader.value,
				sgLeader2: this.smallGroup.sgLeader2.value,
				sgUpperLeader: this.smallGroup.sgUpperLeader.value,
				sgFullAddress: this.smallGroup.sgFullAddress.value,
				sgShortAddress: this.smallGroup.sgShortAddress.value,
				sgRegion: this.smallGroup.sgRegion.value?.toString(),
				sgPostalCode: this.smallGroup.sgPostalCode.value?.toString(),
				sgDay: this.smallGroup.sgDay.value,
				sgTime: this.smallGroup.sgTime.value?.toString(),
				sgStatus: this.smallGroup.sgStatus.value,
				sgEstablishedDate: this.smallGroup.sgEstablishedDate.value,
				sgAgeFrom: this.smallGroup.sgAgeFrom.value,
				sgAgeTo: this.smallGroup.sgAgeTo.value,
				sgDescription: this.smallGroup.sgDescription.value,
				sgMemberIds: this.smallGroup.sgMembers.value != null ? this.smallGroup.sgMembers.value.join(',') : null,
				type: this.smallGroupType[this.currentViewIndex].value,
				newLeaders: this.replacementLeaderList.filter(item => {
					return item.smallgroup_id != null && item.smallgroupmember_id != null;
				}).length > 0 ? JSON.stringify(this.replacementLeaderList.filter(item => {
					return item.smallgroup_id != null && item.smallgroupmember_id != null;
				})) : null,
			};
			
			paramCheck = this.smallGroupType[this.currentViewIndex].value === 'Multiplication' ? {
				...params,
				sgParent: this.smallGroup.sgParent.value, //sent sgParent if in Multipication tab
			} : {
				...params
			};

			if (this.smallGroupId) {
				paramCheck = {
					...paramCheck,
					sgId: this.smallGroupId
				};
			}

			swal.fire({
				title: 'Are you sure?',
				text: 'Make sure the data is correct',
				icon: 'question',
				allowOutsideClick: false,
				showCancelButton: true,
				confirmButtonText: 'Save'
			}).then((result) => {
				if (result.isConfirmed) {
					this.loadingSave = true;
					this.http.sendPostRequest2(`smallgroup/${this.smallGroupId ? 'update' : 'create'}`, paramCheck).subscribe((response: any) => {
						if (response.api_status === true) {
							this.loadingSave = false;
							swal.fire({
								title: 'Success',
								text: `Success ${this.smallGroupId ? 'update' : 'create'} ${this.smallGroupType[this.currentViewIndex].name}`,
								icon: 'success',
								confirmButtonText: 'OK'
							}).then(() => {
								this.router.navigateByUrl('admin/smallgroup/list');
							});
						} else {
							swal.fire({
								title: 'Error',
								text: response.message,
								icon: 'warning',
								confirmButtonText: 'OK'
							});
						}
						this.loadingSave = false;
					}, (error: any) => {
						swal.fire({
							title: 'Error ' + error.status,
							text: error.message,
							icon: 'warning',
							confirmButtonText: 'OK'
						});
						this.loadingSave = false;
					});
				}
			});
		}
	}

	public getFormById(): void {
		if (this.smallGroupId) {
			this.isLoading = true;
			this.isEdit = true;
			this.http.sendGetRequest2(`smallgroup/detail?id=${this.smallGroupId}`).subscribe((response: any) => {
				// on success
				if (response.api_status === true) {
					const result = response.data?.smallgroup;
					const established_at = this.helper.makeDate(result.established_at, 'yyyy-MM-dd');
					//this.currentViewIndex = result.smallgroupleader?.smallgroupmultiplicator_id ? 0 : 1; // 0 for Multiplication and 1 for New Group
					this.currentViewIndex = 0;
					this.smallGroup.sgCampus.value = result.campus_id || 'noCampus';
					this.smallGroup.sgLevel.value = result.smallgroupleader?.smallgroupmemberrole_id;
					this.selectedParentCampus = result.smallgroupleader?.smallgroupmultiplicatefrom?.campus_id || 'noCampus';
					this.smallGroup.sgParent.value = result.smallgroupleader?.smallgroupmultiplicator_id;
					this.smallGroup.sgName.value = result.name;
					this.smallGroup.sgCategory.value = result.smallgroupcategory_id;
					this.smallGroup.sgLeader.value = result.smallgroupleader.id;
					this.smallGroup.sgLeader2.value = result.smallgroupleader2!=null ? result.smallgroupleader2.id : null;
					this.smallGroup.sgUpperLeader.value = result.smallgroupleader?.smallgroup?.smallgroupmember_id;
					this.smallGroup.sgFullAddress.value = result.addressfull;
					this.smallGroup.sgShortAddress.value = result.address;
					this.smallGroup.sgRegion.value = result.regency_id;
					this.smallGroup.sgPostalCode.value = result.addresspostalcode;
					this.smallGroup.sgDay.value = result.appointmentdefaultday;
					this.smallGroup.sgTime.value = result.appointmentdefaulttime;
					this.smallGroup.sgStatus.value = result.status;
					this.smallGroup.sgEstablishedDate.value = established_at;
					this.smallGroup.sgAgeFrom.value = result.agemin;
					this.smallGroup.sgAgeTo.value = result.agemax;
					this.smallGroup.sgDescription.value = result.description || '';
					this.sgLeaderList = [{
						id: result.smallgroupleader?.id,
						name: result.smallgroupleader?.user2 ? result.smallgroupleader?.user?.fullname + " & " + result.smallgroupleader?.user2?.fullname : result.smallgroupleader?.user?.fullname
					}];
					this.smallGroupType.forEach(($ii)=>{
						$ii.name = result.name;
					});
					if (this.smallGroupId != null) {
						this.getSgUpperLeader(this.smallGroupId);
					}

					this.getUpperLevelSglNameList();
					this.isLoading = false;
				} else {
					swal.fire({
						title: 'Error',
						text: response.message,
						icon: 'warning',
						showCancelButton: false,
						confirmButtonText: 'OK'
					});
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
	}

	public onChangeSgAgeFrom(value: number): void {
		this.smallGroup.sgAgeFrom.value = value;
	}

	public onChangeSgAgeTo(value: number): void {
		this.smallGroup.sgAgeTo.value = value;
	}

	public onChangeSgFullAddress(value: string): void {
		this.smallGroup.sgFullAddress.value = value;
	}

	public onChangeSgLevel(value: string): void {
		// reset data
		this.smallGroup.sgParent.value = null;
		this.sgParentList = null;
		this.smallGroup.sgLeader.value = null;
		this.smallGroup.sgLeader2.value = null;
		this.sgLeaderList = null;
		this.smallGroup.sgUpperLeader.value = null;
		this.upperLevelSglNameList = null;
		this.sgMemberList = null;
		this.replacementLeaderList = [];
		// change data
		this.smallGroup.sgLevel.value = value;
		this.smallGroup.sgMembers.value = null;
		// fetch new data
		if (this.smallGroup.sgLevel.value) {
			this.getSgParentList();
			this.getSgLeaderList();
			this.fetchSgLeaderList2();
			this.getUpperLevelSglNameList();
		}
	}

	public onChangeParentCampusSmallGroup(value: string): void {
		// reset data
		this.smallGroup.sgParent.value = null;
		this.sgParentList = null;
		this.sgMemberList = null;
		// change data
		this.selectedParentCampus = value;
		this.smallGroup.sgMembers.value = null;
		this.replacementLeaderList = [];
		// fetch new data
		this.getSgParentList();
	}

	public onChangeSgParentSmallGroup(value: number): void {
		// reset data
		this.smallGroup.sgLeader.value = null;
		this.smallGroup.sgLeader2.value = null;
		this.smallGroup.sgUpperLeader.value = null;
		this.sgLeaderList = null;
		this.sgMemberList = null;
		// change data
		this.smallGroup.sgParent.value = value;
		this.smallGroup.sgMembers.value = null;
		this.replacementLeaderList = [];
		// fetch new data
		this.getSgLeaderList();
		if (this.smallGroup.sgParent.value) {
			this.getSgUpperLeader(value);
		}
	}

	public getSgUpperLeader(value: number): void {
		const param = {
			smallgroupId: value
		};
		this.isLoadingSelectedUpperLevelSglName = true;

		this.http.sendGetRequest2('smallgroupmember/upperleader', param).subscribe((response: any) => {
			if (response.api_status) {
				if(response.data.smallgroupmember != null){
					this.smallGroup.sgUpperLeader.value = response.data.smallgroupmember.id;
				}
				this.isLoadingSelectedUpperLevelSglName = false;
			}
			this.isLoadingSelectedUpperLevelSglName = false;
			this.isLoadingSelectedSgLevel = false;
			this.isLoadingSelectedParentSg = false;
		}, (error: any) => {
			swal.fire({
				title: 'Error',
				text: error.message,
				icon: 'warning',
				confirmButtonText: 'OK',
			});
		});
	}

	public getCampusList(): void {
		this.isLoadingSelectedSgCampus = true;
		this.isLoadingSelectedParentCampus = true;
		const noCampus = {
			id: 'noCampus',
			name: 'NO CAMPUS'
		};

		this.http.sendGetRequest2('church/all-campus').subscribe((response: any) => {
			if (response.api_status) {
				if(response.data.campus_list != null){
					const setCampusId = response.data.campus_list.map(item => {
						return {
							id: item.id,
							name: item.name
						};
					});
					this.campusList = [...setCampusId, noCampus];
					this.sgParentCampusList = [...setCampusId, noCampus];
				}
			}

			this.isLoadingSelectedParentCampus = false;
			this.isLoadingSelectedSgCampus = false;
		}, (error: any) => {
			swal.fire({
				title: 'Error',
				text: error.message,
				icon: 'warning',
				confirmButtonText: 'OK',
			});
		});
		
	}

	public getLevelList(): void {
		this.isLoadingSelectedSgLevel = true;
		this.http.sendGetRequest2('smallgroup/all-level').subscribe((response: any) => {
			if (response.api_status) {
				this.levelList = response.data.smallgroup_level;
			}
			this.isLoadingSelectedSgLevel = false;
			this.isLoadingSelectedParentSg = true;
		}, (error: any) => {
			swal.fire({
				title: 'Error',
				text: error.message,
				icon: 'warning',
				confirmButtonText: 'OK',
			});
		});
	}

	public getSgParentList(): void {
		this.isLoadingSelectedParentSg = true;
		const param = {
			campus: this.selectedParentCampus && this.selectedParentCampus !== 'noCampus' ? this.selectedParentCampus : '',
			level: this.smallGroup.sgLevel.value ? this.smallGroup.sgLevel.value : ''
		};
		this.http.sendGetRequest2('smallgroup/all/raw', param).subscribe((response: any) => {
			if (response.api_status) {
				this.sgParentList = response.data.smallgroup;
			}
			this.isLoadingSelectedParentSg = false;
		}, (error: any) => {
			swal.fire({
				title: 'Error',
				text: error.message,
				icon: 'warning',
				confirmButtonText: 'OK',
			});
		});
	}

	public getSgCategoryList(): void {
		this.isLoadingSelectedSgCategory = true;
		const param = {
			churchId: this.churchId
		};

		this.http.sendGetRequest2('smallgroup/category/by-church-id', param).subscribe((response: any) => {
			if (response.api_status) {
				this.sgCategoryList = response.data.categories;
			}
			this.isLoadingSelectedSgCategory = false;
		}, (error: any) => {
			swal.fire({
				title: 'Error',
				text: error.message,
				icon: 'warning',
				confirmButtonText: 'OK',
			});
		});
	}

	public getSgLeaderList(): void {
		const params = {
			level: parseInt(this.smallGroup.sgLevel.value) - 1,
			coreTeam: 1,
		};
		const paramCheck = this.smallGroupType[this.currentViewIndex].value === 'Multiplication' ? {
			...params,
			smallgroupId: this.smallGroup.sgParent.value, //sent sgParent if in Multipication tab
		} : {
			...params
		};

		if (this.smallGroupType[this.currentViewIndex].value === 'Multiplication' && this.smallGroup.sgParent.value && this.smallGroup.sgLevel.value) {
			this.fetchSgLeaderList(paramCheck);
		} else if (this.smallGroupType[this.currentViewIndex].value === 'New Group' && this.smallGroup.sgLevel.value) {
			this.fetchSgLeaderList(paramCheck);
		}
	}

	public fetchSgLeaderList(param: any): void {
		this.isLoadingSelectedSgLeader = true;
		this.http.sendGetRequest2('smallgroupmember/all', param).subscribe((response: any) => {
			if (response.api_status) {
				this.sgLeaderList = response.data.smallgroupmembers.map(item => {
					return {
						name: item.user2 ? item.user.fullname + " & " + item.user2.fullname : item.user.fullname,
						id: item.id
					};
				});
				this.isLoadingSelectedSgLeader = false;
			}
		}, (error: any) => {
			swal.fire({
				title: 'Error',
				text: error.message,
				icon: 'warning',
				confirmButtonText: 'OK',
			});
		});
	}

	public fetchSgLeaderList2(): void {
		const param = {
			level: parseInt(this.smallGroup.sgLevel.value),
		};
		this.isLoadingSelectedSgLeader2 = true;
		this.http.sendGetRequest2('smallgroupmember/all', param).subscribe((response: any) => {
			if (response.api_status) {
				this.sgLeaderList2 = response.data.smallgroupmembers.map(item => {
					return {
						name: item.user2 ? item.user.fullname + " & " + item.user2.fullname : item.user.fullname,
						id: item.id
					};
				});
				this.isLoadingSelectedSgLeader2 = false;
			}
		}, (error: any) => {
			swal.fire({
				title: 'Error',
				text: error.message,
				icon: 'warning',
				confirmButtonText: 'OK',
			});
		});
	}

	public getUpperLevelSglNameList(): void {
		if (this.smallGroup.sgLevel.value) {
			this.isLoadingSelectedUpperLevelSglName = true;
			const param = {
				level: parseInt(this.smallGroup.sgLevel.value) + 1
			};

			this.http.sendGetRequest2('smallgroupmember/all', param).subscribe((response: any) => {
				if (response.api_status) {
					this.upperLevelSglNameList = response.data.smallgroupmembers.map(item => {
						return {
							name: item.user2 ? `${item.user.fullname} & ${item.user2.fullname}` : item.user.fullname,
							id: item.id
						};
					});

					if (!this.smallGroup.sgParent.value) {
						this.isLoadingSelectedUpperLevelSglName = false;
					}
				}
			}, (error: any) => {
				swal.fire({
					title: 'Error',
					text: error.message,
					icon: 'warning',
					confirmButtonText: 'OK',
				});
			});
		}
	}

	public getSgRegionList(): void {
		this.isLoadingSelectedSgRegion = true;
		const param = {
			churchId: this.churchId
		};

		this.http.sendGetRequest2('regency/all/filtered-raw', param).subscribe((response: any) => {
			if (response.api_status) {
				this.sgRegionList = response.data.regencies;
				this.isLoadingSelectedSgRegion = false;
			}
		}, (error: any) => {
			swal.fire({
				title: 'Error',
				text: error.message,
				icon: 'warning',
				confirmButtonText: 'OK',
			});
		});
	}

	public getSgScheduleDay(): void {
		this.isLoadingSelectedScheduleDay = true;
		this.sgScheduleDayList = this.helper.days.map(item => {
			return {
				name: item.title,
				id: item.id
			};
		});
		this.isLoadingSelectedScheduleDay = false;
	}

	public getSgStatus(): void {
		this.isLoadingSelectedSgStatus = true;
		this.sgStatusList = this.helper.statuses.map(item => {
			return {
				name: item.name,
				id: item.value
			};
		});
		this.isLoadingSelectedSgStatus = false;
	}

	public onChangeSgLeader(value: string): void {
		// reset data
		this.sgMemberList = null;
		this.smallGroup.sgMembers.value = null;
		this.replacementLeaderList = [];
		// fetch new data
		if (this.smallGroup.sgLeader.value && this.smallGroupType[this.currentViewIndex].value === 'Multiplication') {
			this.getSgMemberList();
			this.getSgCoreteams(value, 0);
		}
	}

	public getSgMemberList(){
		let self = this;
		this.isLoadingSgMemberList = true;
		const param = {
			smallgroupId: this.smallGroup.sgParent.value
		};

		this.http.sendGetRequest2('smallgroupmember/all', param).subscribe((response: any) => {
			if (response.api_status) {
				self.sgMemberList = response.data.smallgroupmembers.filter(function(item){
					return item.id != self.smallGroup.sgLeader.value && item.id != self.smallGroup.sgLeader2.value;
				}).map(item => {
					return {
						name: item.user2 ? item.user.fullname + " & " + item.user2.fullname : item.user.fullname,
						id: item.id
					};
				});
			}
			this.isLoadingSgMemberList = false;
		}, (error: any) => {
			swal.fire({
				title: 'Error',
				text: error.message,
				icon: 'warning',
				confirmButtonText: 'OK',
			});
		});
	}

	public getSgCoreteams(value: string, idx: number){
		let self = this;
		if(value != null){
			let temp = {
				isLoading: true,
				options: [],
				title: '',
				smallgroupmember_id: null,
				smallgroup_id: null,
				isBottom: false,
			}
			this.replacementLeaderList = this.replacementLeaderList.slice(0, idx);
			this.replacementLeaderList.push(temp);
			const param = {
				sgLeaderId: value,
			};
			this.http.sendGetRequest2('smallgroupmember/get/by-leader', param).subscribe((response: any) => {
				if (response.api_status) {
					self.replacementLeaderList[idx].options = response.data.smallgroupmembers.filter(item => { 
						return item.iscoreteam == 1;
					}).map(item => {
						return {
							name: item.user2 ? item.user.fullname + " & " + item.user2.fullname : item.user.fullname,
							id: item.id
						};
					});
				}
				if(response.data.smallgroup != null){
					this.replacementLeaderList[idx].smallgroup_id = response.data.smallgroup.id;
					this.replacementLeaderList[idx].title = 'New Leader for ' + response.data.smallgroup.name;
				}else{
					this.replacementLeaderList[idx].isBottom = true;
				}
				this.replacementLeaderList[idx].isLoading = false;

			}, (error: any) => {
				swal.fire({
					title: 'Error',
					text: error.message,
					icon: 'warning',
					confirmButtonText: 'OK',
				});
			});
		}else{
			this.replacementLeaderList[idx].isLoading = false;
		}	
	}

}

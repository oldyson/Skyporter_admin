import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from './../../../http.service';
import { GlobalService } from './../../../global.service';
import { HelperService } from './../../../helper.service';
import { PopupModalComponent } from './../../../components/popup-modal/popup-modal.component';
import swal from 'sweetalert2';

@Component({
	selector: 'app-smallgroupotherexport',
	templateUrl: './smallgroupotherexport.component.html',
	styleUrls: ['./smallgroupotherexport.component.scss']
})
export class SmallgroupotherexportComponent implements OnInit {

	public dataLoading: boolean;
	public smallgroupMemberRoles: any;
	public requestbody: any;
	public requestedData: any;
	public postData: any;
	public exportLoading: boolean;
	public coreTeam: boolean;
	public member: boolean;
	public fileformat: any;

	constructor(
		private activatedRoute: ActivatedRoute,
		public http: HttpService,
		public global: GlobalService,
		public helper: HelperService,
		public router: Router,
	) {
		this.dataLoading = false;
		this.member = true;
		this.coreTeam = true;
		this.smallgroupMemberRoles = [];
		this.requestedData = {
			rolelevel: {},
			fileformat: null,
			iscoreteam: null
		};
		this.exportLoading = false;
		this.postData = null;

		this.fileformat = [
			{
				id: 'xls',
				name: 'xls'
			},
			{
				id: 'csv',
				name: 'csv'
			}
		]
	}

	ngOnInit(): void {
		this.getAllProgramCode();
	}

	public getAllProgramCode(): void {
		const self = this;
		this.dataLoading = true;
		this.http.sendGetRequest2('smallgroupmemberrole/get').subscribe((response: any) => {
			if (response.api_status) {
				console.log(response.data.smallgroupmemberroles);
				response.data.smallgroupmemberroles.forEach(function (role, index) {
					self.smallgroupMemberRoles.push({id:role.level ,name:role.name})
				});

				this.dataLoading = false;
				console.log(self.smallgroupMemberRoles.data);
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

	public print(){
		console.log(this.requestedData.data);
	}

	public exportSmallgroupMember(): void{
		const self = this;
		if(this.exportLoading != true){
			this.exportLoading = true;
			const params = {
				smallgroupMemberRoleLevel : self.requestedData.rolelevel,
				isCoreTeam: self.requestedData.iscoreteam == null ? "" : self.requestedData.iscoreteam == true ? 1:0,
				formatFile: self.requestedData.fileformat
			};
			this.http.sendGetRequest2('smallgroupmember/export/all-with-class', params).subscribe((response: any) => {
				if (response.api_status) {
						const link = document.createElement('a');
						link.href = response.data.path;
						link.download = response.data.path;
						document.body.appendChild(link);
						link.click();
						document.body.removeChild(link);
				}else{
					swal.fire({
						title: 'Error',
						text: response.message,
						icon: 'warning',
						confirmButtonText: 'OK'
					});
				}
				self.exportLoading = false;
			}, (error: any) => {
				console.log(error);
				self.exportLoading = false;
			});
		}
	}

	public coreTeamToggle(): void{
		if(this.coreTeam == true && this.member == true){
			this.requestedData.iscoreteam = null;
		}
		else if(this.coreTeam == true && this.member == false){
			this.requestedData.iscoreteam = true;
		}
		else if(this.coreTeam == false && this.member == true){
			this.requestedData.iscoreteam = false;
		}else{
			this.requestedData.iscoreteam = null;
		}
	}

}

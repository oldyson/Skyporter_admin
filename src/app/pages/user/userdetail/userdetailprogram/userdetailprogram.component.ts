import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { environment } from '../../../../../environments/environment'
import {
	faChevronDown as falChevronDown,
	faInfoCircle as falInfoCircle,
} from '@fortawesome/pro-light-svg-icons';
import { ProgramdiagrampopupComponent } from './../../../../components/programdiagrampopup/programdiagrampopup.component';
import { HelperService } from './../../../../helper.service';
import { HttpService } from './../../../../http.service';
import { AddprogramhistoryComponent } from './addprogramhistory/addprogramhistory.component';
import swal from 'sweetalert2';

@Component({
	selector: 'userdetail-userdetailprogram',
	templateUrl: './userdetailprogram.component.html',
	styleUrls: ['./userdetailprogram.component.scss']
})
export class UserdetailprogramComponent implements OnInit {

	@ViewChild('programdiagram', { static: false }) public programdiagram: ProgramdiagrampopupComponent;
	@ViewChild('addprogramhistorymodal', { static: false }) private addprogramhistorymodal: AddprogramhistoryComponent;
	@Input() user: any;
	public falChevronDown = falChevronDown;
	public falInfoCircle = falInfoCircle;
	public classes: any;
	public events: any;
	public userprogramcodes: any;
	public isUpcLoading: boolean;
	public isRefreshLoading: boolean;
	public userId: number;
	public classesCount: number;
	public eventsCount: number;
	public isloading: boolean;
	public showSubtitle: boolean;

	constructor(
		public helper: HelperService,
		public http: HttpService,
	) {
		this.classesCount = 0;
		this.eventsCount = 0;
		this.isloading = false;
		this.showSubtitle = false;
		this.isUpcLoading = false;
		this.isRefreshLoading = false;
	}

	ngOnInit(): void {
	}

	public subtitleToggle(): void {
		this.showSubtitle = true;
	}

	public getProgramHistory(userId: number): void{
		this.userId = userId;
		this.getUserProgramCode();
		if(this.isloading == false){
			const params = {
				userId: userId, // ambil dari parent, takut belom ke load
			};
			this.isloading = true;
			this.http.sendGetRequest2('program/list-byuser', params).subscribe((response: any) => {
				if(response.api_status){
					this.classes = response.data.classes;
					this.classes.forEach(($ii) => {
						$ii.programend_at = this.helper.getDatetime($ii.programend_at);
						$ii.isshowed = false;
					});
					this.events = response.data.events;
					this.events.forEach(($ii) => {
						$ii.programend_at = this.helper.getDatetime($ii.programend_at);
						$ii.programstart_at = this.helper.getDatetime($ii.programstart_at);
						$ii.created_at = this.helper.getDatetime($ii.created_at);
						$ii.updated_at = this.helper.getDatetime($ii.updated_at);
						$ii.isshowed = false;
					});
					this.classesCount = response.data.classes_count;
					this.eventsCount = response.data.events_count;
				}
				this.isloading = false;
			}, (error: any) => {
				console.log(error);
				this.isloading = false;
			});
		}
	}

	public showAddProgramHistory(type: string): void {
		this.addprogramhistorymodal.showPage(type, this.userId);
	}

	public refreshProgramCode(): void{
		const params = {
			user_id: this.userId
		};
		const self = this;
		if(!this.isRefreshLoading){
			this.isRefreshLoading = true;
			this.http.sendPostRequest2('userprogramcode/refresh', params).subscribe((response: any) => {
				if(response.api_status){
					this.getUserProgramCode();
				}
				self.isRefreshLoading = false
			}, (error: any) => {
			});
		}
	}

	public getUserProgramCode(): void{
		const params = {
			user_id: this.userId,
			adminPass: environment.adminPass,
		};
		const self = this;

		if(!this.isUpcLoading){
			this.isUpcLoading = true;
			console.log("upc loading");
			this.http.sendGetRequest2('userprogramcode/get/by-user', params).subscribe((response: any) => {
				if(response.api_status){``
					self.userprogramcodes = response.data.userprogramcodes
					this.isUpcLoading = false;
				}
			}
			, (error: any) => {
				// this.isUpcLoading = false;
			});
		}
	}
}

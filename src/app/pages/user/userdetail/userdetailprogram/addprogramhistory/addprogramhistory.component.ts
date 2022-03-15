import { Component, OnInit, Input, ViewChild, TemplateRef, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { environment } from '../../../../../../environments/environment'
import { HelperService } from './../../../../../helper.service';
import { HttpService } from './../../../../../http.service';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ListattendancetableComponent } from '../../../../../components/listattendancetable/listattendancetable.component';
import {
	faSquare as farSquare,
} from '@fortawesome/pro-regular-svg-icons';
import {
	faCheckSquare as fadCheckSquare,
	faSpinner as fadSpinner,
} from '@fortawesome/pro-duotone-svg-icons';

@Component({
	selector: 'comp-addprogramhistory',
	templateUrl: './addprogramhistory.component.html',
	styleUrls: ['./addprogramhistory.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class AddprogramhistoryComponent implements OnInit {
	@ViewChild('filelistmodal', { static: false }) private modal: TemplateRef<any>;
	@ViewChild('listtableattendance', { static: false }) public attendanceTable: ListattendancetableComponent;
	@Input() isShowed: boolean;
	@Input() dialogName: string;
	@Output() refreshData = new EventEmitter<string>();;
	public keys;
	public fileDatas;
	public userId;
	public statusData;
	public loadingTable;
	public isNextDisable;
	public programCodes: any;
	public attendanceOption: any;
	public programs: any;
	public isProgramCodeLoading: boolean;
	public isProgramCodeDisabled: boolean;
	public isProgramLoading: boolean;
	public isSubmitLoading: boolean;
	public programType: string;
	public programCodeId: string;
	public breakoutDateLength: number;
	public pageType: string;
	public data: any;
	public attendanceData: any;
	public programDetail: any;
	public programDisabled: boolean;
	public isLoading: boolean;

	public fadCheckSquare = fadCheckSquare;
	public farSquare = farSquare;
	public fadSpinner = fadSpinner;

	constructor(
		private http: HttpService,
		private modalService: NgbModal,
		public helper: HelperService,
		public router: Router,
	) {
		this.programDisabled = true;
		this.isLoading = false;
		this.isSubmitLoading = false;
		this.breakoutDateLength = 0;
		this.isProgramCodeLoading = false;
		this.isProgramLoading = false;
		this.attendanceOption = {
			isFilter: false,
			isExport: false,
		}
		this.programs = [];
		this.data = [];
		this.attendanceData = [
			{
				id: 1,
				name: 'breakout 1'
			},
			{
				id: 2,
				name: 'breakout 2'
			},
			{
				id: 3,
				name: 'breakout 3'
			},
		]
		this.keys = [
			'Breakout Name', '1', '2'
		];
		this.pageType = "search";
		this.programDetail = [];
		this.programType = '';
		this.loadingTable = true;
		this.isNextDisable = true;
		this.programCodeId = '';
		this.isProgramCodeDisabled = true;
		this.statusData = {
			error: false,
			message: ''
		};
		this.programCodes = [];
		this.fileDatas = [];
	}

	ngOnInit(): void {

	}

	public getProgramCodeData(codeType: string): void {
		this.loadingTable = true;
		this.statusData.error = false;
		this.statusData.message = '';
		const self = this;
		const param = {
			type: codeType
		};

		if(!this.isProgramCodeLoading){
			this.isProgramCodeLoading = true;
			this.isProgramCodeDisabled = true;
			this.programDisabled = true;
			this.http.sendGetRequest2('programcode/all-list', param).subscribe((response: any) => {
				if (response.api_status) {
					self.programCodes = response.data.programcodes;
				} else {
					this.statusData.error = true;
					this.statusData.message = response.message;
					this.loadingTable = false;
				}
				this.isProgramCodeLoading = false;
				this.isProgramCodeDisabled = false;
			}, (error: any) => {
				this.statusData.error = true;
				this.statusData.message = error.message;
				this.loadingTable = false;
				this.isProgramCodeLoading = false;
				this.isProgramCodeDisabled = false;
			});
		}
	}

	// public actionButton(data: any): void {
	// 	if (data.dataAction.name === 'Download') {
	// 		const link = document.createElement('a');
	// 		link.setAttribute('target', '_blank');
	// 		link.href = data.dataAction.value;
	// 		link.download = data.dataAction.value;
	// 		document.body.appendChild(link);
	// 		link.click();
	// 		document.body.removeChild(link);
	// 	} else {
	// 		data.dataAction.loading = true;
	// 		this.fileDatas[data.indexValue].status.filter(item => item.name != data.dataAction.name).map(value => {
	// 			value.disabled = true;
	// 		});
	// 		const params = {
	// 			id: data.dataValue.id,
	// 			status: data.dataAction.value
	// 		};
	// 		this.http.sendPostRequest2('programticketdocument/update-status', params).subscribe((response: any) => {
	// 			if (response.api_status === true) {
	// 				this.fileDatas[data.indexValue].status = [{
	// 					name: response.data.updatedData.programticketdocument.status,
	// 					loading: false,
	// 					disabled: false,
	// 					value: response.data.updatedData.programticketdocument.status
	// 				}];
	// 			}
	// 		}, (error: any) => {
	// 			this.statusData = {
	// 				error: true,
	// 				message: error.message
	// 			};
	// 		});
	// 	}
	// }

	public showPage(type: string, userId): void {
		this.programType = type;
		this.userId = userId;
		this.getProgramCodeData(type);
		this.open(this.modal);
		this.pageType = "search";
		this.data = [];
		this.programDetail = [];
		this.programDisabled = true;
	}

	public closeDialog(): void {
		this.modalService.dismissAll();
	}

	public open(content): void {
		if (!this.isShowed) {
			this.modalService.open(content, {
				size: 'lg',
				backdrop: 'static',
				ariaLabelledBy: 'modal-basic-title',
			}).result.then(() => {
				this.isShowed = false;
				// this.closeResult = `Closed with: ${result}`;
			}, () => {
				this.isShowed = false;
				// this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			});
		}
	}

	public getAllProgram(): void{
		const param = {
			type: this.programType,
			programCodeId: this.data.programcode_id
		}
		const self = this;
		if(!this.isProgramLoading){
			this.isProgramLoading = true
			this.data.program_id = null;
			this.programDisabled = true;
			this.isProgramCodeDisabled = true;
			this.statusData.error = false;
			this.http.sendGetRequest2('program/all/filtered', param).subscribe((response: any) => {
				if (response.api_status) {
					self.programs = response.data.programs;
					self.programDisabled = false;
				} else {
					this.statusData.error = true;
					this.statusData.message = response.message;
				}
				self.isProgramLoading = false;
				self.isProgramCodeDisabled = false;
			}, (error: any) => {
				this.statusData.error = true;
				this.statusData.message = error.message;
				self.isProgramLoading = false;
				self.isProgramCodeDisabled = false;
			});
		}
	}

	public getProgramDetail(): void{
		if(this.data.program_id == null){
			this.statusData.error = true;
			this.statusData.message = "Please select "+this.programType.toLowerCase()+" first";
		}
		const self = this;
		const param = {
			adminPass: environment.adminPass,
			id: this.data.program_id
		}
		if(!this.isLoading){
			this.isLoading = true;
			this.statusData.error = false;
			this.http.sendGetRequest2('program/detail', param).subscribe((response: any) => {
				if (response.api_status) {
					self.programDetail = response.data.program;
					if(self.programDetail.isreqfamily == 1 || self.programDetail.reqchildren == 1 || self.programDetail.iscouple == 1){
						// this.statusData.error = true;
						// this.statusData.message = "Cannot add class in this page , please go to class list page \n";
						this.pageType = "wrong program";
					}else{
						this.pageType = "attendance detail";
						this.breakoutDateLength = 0;
						this.attendanceData = response.data.program.programbreakouts.map((data) => {
							let temp = {
								id: data.id,
								name: data.name,
							};
							if(this.breakoutDateLength < data.programbreakoutdates.length)
								this.breakoutDateLength = data.programbreakoutdates.length;
							for (let index = 0; index < data.programbreakoutdates.length; index++) {
								temp = {
									...temp,
									[`checkbox-${index + 1}`]: {
										id: data.programbreakoutdates[index].id,
										status: 0,
										loading: false,
									}
								};
							}
							return temp;
						});
						this.keys = [];
						this.keys = [
							{
								label: '#',
								value: 'id',
								showtype: 'number',
								minwidth: false,
								priority: 0,
								opensort: false,
								sortcolumn: 'id',
								sortorder: 'DESC'
							},
							{
								label: 'Breakout Name',
								value: 'name',
								showtype: 'text',
								minwidth: false,
								priority: 1,
								opensort: false,
								sortcolumn: '',
								sortorder: ''
							},
						];
						for(let i = 0; i<this.breakoutDateLength; i++){
							this.keys.splice(this.keys.length, 0,
								{
									label: i+1,
									value: `checkbox-${i + 1}`,
									showtype: 'attendance',
									minwidth: false,
									priority: 1,
									opensort: false,
									sortcolumn: '',
									sortorder: ''
								}
								);
						}
					}
				} else {
					this.statusData.error = true;
					this.statusData.message = response.message;
				}
				this.isLoading = false;
			}, (error: any) => {
				this.statusData.error = true;
				this.statusData.message = error.message;
				this.isLoading = false;
			});
		}
	}

	public triggerNextButton(): void{
		if(this.data.program_id != null){
			this.isNextDisable = false;
		}else{
			this.isNextDisable = true;
		}
	}

	public attendanceToggle(data: any): void{
		if(this.attendanceTable != null)
			this.attendanceTable.doneToggle(data.id);
		else
			console.log('List attendance not created');
	}

	public defineAttendance(listtableattendance): string{
		this.attendanceTable  = listtableattendance;
		return "";
	}

	public submitProgramTicket(): void{
		let attendanceSubmitData = [];
		let countCheckbox = 1;
		let checkboxName = "";
		let programbreakoutdates = [];
		this.attendanceData.forEach(($attendance, $index) => {
			checkboxName = "checkbox-"+countCheckbox;
			while(checkboxName in $attendance){
				programbreakoutdates.splice(programbreakoutdates.length, 0, {id: $attendance[checkboxName].id, ispresent: $attendance[checkboxName].status == true ? 1 : 0});
				countCheckbox++;
				checkboxName = "checkbox-"+countCheckbox;
			}
			attendanceSubmitData[$index] = {
				id: $attendance.id,
				programbreakoutdates: programbreakoutdates
			}
		});
		const params = {
			program_id: this.data.program_id,
			user_id: this.userId,
			attendanceList: JSON.stringify(attendanceSubmitData)
		};

		if(!this.isSubmitLoading){
			this.isSubmitLoading = true;
			this.statusData.error = false;
			this.http.sendPostRequest2('programticket/create/manual', params).subscribe((response: any) => {
				if (response.api_status) {
					this.pageType = "success submit";
					this.isSubmitLoading = false;
					this.refreshData.emit(this.userId);

				} else {
					this.statusData.error = true;
					this.statusData.message = response.message;
				}
			}, (error: any) => {
				this.statusData.error = true;
				this.statusData.message = error.message;
			});
		}
	}

	public cancelCreateTicket(): void{
		this.pageType = 'search';
	}

	public redirectToProgram(): void{
		this.modalService.dismissAll();
		this.router.navigateByUrl('/admin/program/'+this.programType.toLowerCase()+'/detail?id='+this.programDetail.id);
	}

}

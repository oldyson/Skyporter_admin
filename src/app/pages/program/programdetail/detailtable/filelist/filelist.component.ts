import { Component, OnInit, Input, Output, ViewChild, TemplateRef, EventEmitter } from '@angular/core';
import { HelperService } from './../../../../../helper.service';
import { HttpService } from './../../../../../http.service';
import { NgbModal, NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { ListtableComponent } from './../../../../../components/listtable/listtable.component';
import swal from 'sweetalert2';

@Component({
	selector: 'programdetail-tablefilelist',
	templateUrl: './filelist.component.html',
	styleUrls: ['./filelist.component.scss']
})
export class TablefilelistComponent implements OnInit {

	@ViewChild('filelistmodal', { static: false }) private modal: TemplateRef<any>;
	@ViewChild('listtable', { static: false }) private listtable: ListtableComponent;
	@Input() isShowed: boolean;
	@Input() dialogName: string;
	public keys;
	public fileDatas;
	public statusData;
	public loadingTable;

	constructor(
		private http: HttpService,
		private modalService: NgbModal,
		public helper: HelperService,
	) {
		this.loadingTable = true;
		this.statusData = {
			error: false,
			message: ''
		};
		this.keys = [
			{
				label: '#',
				value: 'id',
				showtype: 'number',
				minwidth: false,
				priority: 0,
				opensort: false,
				sortcolumn: 'id',
				sortorder: 'ASC'
			},
			{
				label: 'File Name',
				value: 'name',
				value2: 'typeSize',
				showtype: 'text',
				minwidth: false,
				priority: 0,
				opensort: false,
				sortcolumn: '',
				sortorder: ''
			},
			{
				label: 'Status',
				showtype: 'button',
				value: 'status',
				minwidth: true,
				priority: 0,
				opensort: false
			},
			{
				label: 'File Action',
				value: 'fileAction',
				showtype: 'button',
				minwidth: false,
				priority: 0,
				opensort: false,
			},
		];
		this.fileDatas = [];
	}

	ngOnInit(): void {
	}

	public getData(data: any): void {
		this.loadingTable = true;
		this.statusData.error = false;
		this.statusData.message = '';
		const param = {
			programticket_id: data.dataValue.id
		};

		this.http.sendGetRequest2('document/by-programticket', param).subscribe((response: any) => {
			if (response.api_status) {
				this.fileDatas = response.data?.documents?.map(item => {
					return {
						id: item.id,
						name: item.name,
						programticketdocument: item.programticketdocument,
						typeSize: '',
						status: item.programticketdocument?.status === 'Pending' ?
							[{
								name: 'Accept',
								type: 'success',
								loading: false,
								disabled: false,
								value: 'Approved'
							}, {
								name: 'Reject',
								type: 'danger',
								loading: false,
								disabled: false,
								value: 'Rejected'
							}] : [{
								name: item.programticketdocument?.status,
								value: item.programticketdocument?.status
							}],
						fileAction: [{
							name: 'Download',
							type: 'success-outline',
							value: item.url
						}]
					};
				});
				this.loadingTable = false;
			} else {
				this.statusData.error = true;
				this.statusData.message = response.message;
				this.loadingTable = false;
			}
		}, (error: any) => {
			this.statusData.error = true;
			this.statusData.message = error.message;
			this.loadingTable = false;
		});
	}

	public actionButton(data: any): void {
		if (data.dataAction.name === 'Download') {
			const link = document.createElement('a');
			link.setAttribute('target', '_blank');
			link.href = data.dataAction.value;
			link.download = data.dataAction.value;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} else {
			console.log(this.fileDatas[data.indexValue]);

			data.dataAction.loading = true;
			this.fileDatas[data.indexValue].status.filter(item => item.name != data.dataAction.name).map(value => {
				value.disabled = true;
			});
			const params = {
				id: this.fileDatas[data.indexValue].programticketdocument?.id,
				status: data.dataAction.value
			};
			this.http.sendPostRequest2('programticketdocument/update-status', params).subscribe((response: any) => {
				if (response.api_status === true) {
					this.fileDatas[data.indexValue].status = [{
						name: response.data.updatedData.programticketdocument.status,
						loading: false,
						disabled: false,
						value: response.data.updatedData.programticketdocument.status
					}];
				} else {
					this.statusData = {
						error: true,
						message: response.message,
					};
				}
			}, (error: any) => {
				this.statusData = {
					error: true,
					message: "Error " + error.status + ": " + error.error.message,
				};
			});
		}
	}

	public showDialog(data: any): void {
		this.getData(data);
		this.open(this.modal);
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
}

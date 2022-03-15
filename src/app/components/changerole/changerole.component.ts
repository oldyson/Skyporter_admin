import { Component, OnInit, Input, Output, ViewChild, TemplateRef, EventEmitter } from '@angular/core';
import { HttpService } from './../../http.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import swal from 'sweetalert2';
import {
	faSpinner as fadSpinner,
} from '@fortawesome/pro-duotone-svg-icons';

@Component({
	selector: 'comp-changerole',
	templateUrl: './changerole.component.html',
	styleUrls: ['./changerole.component.scss']
})
export class ChangeroleComponent implements OnInit {
	@ViewChild('changerolemodal', { static: false }) private modal: TemplateRef<any>;
	@Output() saveChangeRole = new EventEmitter<any>();
	@Input() isShowed: boolean;

	public fadSpinner = fadSpinner;

	public isLoadingChangeRole: boolean;
	public isLoadingRoles: boolean;

	public dataUser: any
	public roleList: any;
	public selectedRole: any;

	constructor(
		private modalService: NgbModal,
		private http: HttpService,
	) {
		this.isLoadingRoles = false;
	}

	ngOnInit(): void {
		this.getRoles();
	}

	public saveRole(): void {
		this.isLoadingChangeRole = true;
		const params = {
			id: this.dataUser.apiparams.id,
			ministryMemberRoleId: this.selectedRole
		};

		this.http.sendPostRequest2('ministrymember/update', params).subscribe((response: any) => {
			if (response.api_status) {
				this.modalService.dismissAll();
				this.saveChangeRole.emit(this.dataUser.apiparams.ministryId);
			}
			this.isLoadingChangeRole = false;
		}, (error: any) => {
			swal.fire({
				title: 'Error',
				text: error.message,
				icon: 'warning',
				confirmButtonText: 'OK',
			});
			this.modalService.dismissAll();
			this.isLoadingChangeRole = false;
		});
	}

	public getRoles(): void {
		this.isLoadingRoles = true;
		this.http.sendGetRequest2('ministrymemberrole/get').subscribe((response: any) => {
			if (response.api_status) {
				this.roleList = response.data.ministrymemberroles;
			}
			this.isLoadingRoles = false;
		}, (error: any) => {
			swal.fire({
				title: 'Error',
				text: error.message,
				icon: 'warning',
				confirmButtonText: 'OK',
			});
			this.isLoadingRoles = false;
		});
	}

	public showDialog(data: any): void {
		this.selectedRole = data.apiparams.memberRole;
		this.dataUser = data;
		this.open(this.modal);
	}

	public open(modalContent: any): void {
		if (!this.isShowed) {
			this.modalService.open(modalContent, {
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

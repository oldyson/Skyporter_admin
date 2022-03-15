import { Component, OnInit, Input, Output, ViewChild, TemplateRef, EventEmitter } from '@angular/core';
import { NgbModal, NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import {
	faSpinner as fadSpinner,
} from '@fortawesome/pro-duotone-svg-icons';

@Component({
	selector: 'comp-invitevolunteer',
	templateUrl: './invitevolunteer.component.html',
	styleUrls: ['./invitevolunteer.component.scss']
})
export class InvitevolunteerComponent implements OnInit {
	@ViewChild('invitevolunteermodal', { static: false }) private modal: TemplateRef<any>;
	@Output() inviteVolunteers = new EventEmitter<any>();
	@Input() isShowed: boolean;
	@Input() users;
	@Input() isLoadingUsers;
	@Input() isLoadingInvite;
	public fadSpinner = fadSpinner;
	public userIds: any;

	constructor(
		private modalService: NgbModal
	) {
		this.userIds = [];
	}

	ngOnInit(): void {

	}

	public showDialog(): void {
		this.open(this.modal);
	}

	public invite(): void {
		if(this.userIds.length !== 0){
			this.inviteVolunteers.emit(this.userIds);
		}
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

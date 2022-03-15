import { Component, OnInit, ViewChild, TemplateRef, Input } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from './../../http.service';

@Component({
  selector: 'comp-listattendanceaddbyemail',
  templateUrl: './listattendanceaddbyemail.component.html',
  styleUrls: ['./listattendanceaddbyemail.component.scss']
})
export class ListattendanceaddbyemailComponent implements OnInit {

	@ViewChild('mymodal', {static: false}) private modal: TemplateRef<any>;
	@Input() programId: number;
	public closeResult: string;
	public isShowed: boolean;
	public emails: string;
	public errorMessage: string;
	public successSave: boolean;
	public doneItems: any;
	public failedItems: any;
	public registeredItems: any;
	public next: boolean;
	public isloading: boolean;

	constructor(
		private modalService: NgbModal,
		private http: HttpService,
	) { 
		this.resetData();
		this.isloading = false;
	}

	public resetData(): void {
		this.errorMessage = "";
		this.emails = "";
		this.doneItems = [];
		this.failedItems = [];
		this.registeredItems = [];
		this.successSave = false;
		this.next = false;
	}

	ngOnInit(): void {
		this.closeResult = '';
		this.isShowed = false;
	}

	public show(): void {
		setTimeout(() => {
			this.resetData();
			this.open(this.modal);
		}, 10);
	}

	public open(content): void {
		const self = this;
		if (!this.isShowed) {
			this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
				self.isShowed = false;
				this.closeResult = `Closed with: ${result}`;
			}, (reason) => {
				self.isShowed = false;
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			});
			// $('#btn-ok').focus();
			this.isShowed = true;
		}
	}

	private getDismissReason(reason: any): string {
		if (reason === ModalDismissReasons.ESC) {
			return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
			return 'by clicking on a backdrop';
		} else {
			return  `with: ${reason}`;
		}
	}

	private filterEmails(emails: any): any {
		let arr = [];
		for(let i = 0; i < emails.length; i++) {
			arr[emails[i].toLowerCase().trim()] = emails[i].toLowerCase().trim();
		}

		return arr;
	}

	public generateMailsToAttendances(): void {
		let newmails = this.emails.trim().split('\n');
		newmails = this.filterEmails(newmails);

		let temp = "";
		let emails = [];
		for (var key in newmails) {
			temp += newmails[key] + '\n';
			emails.push(newmails[key].trim().toLowerCase());
		}
		this.emails = temp.trim();


		const params = {
			'program_id': this.programId,
			'emails': emails,
		};

		this.sendToAPI(params);
	}

	public sendToAPI(params): void {
		if(!this.isloading) {
			this.isloading = true;
			this.http.sendPostRequest2('programticket/add-multiple', params).subscribe((response: any) => {
				if(response.api_status) {
					this.doneItems = response.data.not_registered_yet_has_user;
					this.failedItems = response.data.not_registered_yet;
					console.log(this.failedItems);
					this.registeredItems = response.data.already_registered;
					console.log(this.registeredItems);
					if(this.doneItems.length == 0) {
						this.successSave = false;
						this.errorMessage = "No email registered.";
					} else {
						this.successSave = true;
						this.errorMessage = this.doneItems.length + " emails registered.";
					}
				} else {
					this.successSave = false;
					this.errorMessage = "failedItems to save.";
				}
				this.isloading = false;
			}, (error: any) => {
				this.successSave = false;
				this.errorMessage = error.error.message;
				this.isloading = false;
			});
		}
	}
}

import { Component, OnInit, ViewChild, TemplateRef, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {
	faTimes as fasTimes,
	faCircle as fasCircle,
	faCheck as fasCheck
} from '@fortawesome/pro-solid-svg-icons';
import { HttpService } from './../../../../http.service';
import * as $ from 'jquery';

@Component({
	selector: 'userlistrole-listroleaddmodal',
	templateUrl: './listroleaddmodal.component.html',
	styleUrls: ['./listroleaddmodal.component.scss']
})
export class ListroleaddmodalComponent implements OnInit {

	@ViewChild('mymodal', {static: false}) private modal: TemplateRef<any>;
	@Output() addNewUser = new EventEmitter<{id: number, name: string}>();
	@Input() message: string;
	@Input() title: string;
	@Input() status: string;
	public fasTimes = fasTimes;
	public fasCircle = fasCircle;
	public fasCheck = fasCheck;
	public closeResult: string;
	public isShowed: boolean;

	public searchKeyword: string;
	public notinUsers: any; // array user yang sudah muncul
	public users: any; // array users yang ke searched

	constructor(
		private modalService: NgbModal,
		private http: HttpService,
	) { 
		this.searchKeyword = "";
	}

	ngOnInit(): void {
		this.closeResult = '';
		this.title = '';
		this.message = '';
		this.status = '';
		this.isShowed = false;
	}

	public show(users: any): void {
		this.title = "";
		this.message = "";
		this.status = "";
		this.searchKeyword = "";
		const self = this;
		this.notinUsers = users;
		this.getUserList("");
		setTimeout(() => {
			self.open(self.modal);
		}, 10);
	}

	public getUserList(keyword: string): void{
		if (keyword !== "") {
			let notinIds = "";
			if(this.notinUsers != null){
				if(this.notinUsers.length > 0){
					this.notinUsers.forEach((user) => {
						if(user.id != null){
							if(notinIds.length > 0)
								notinIds += ",";

							notinIds += user.id;
						}
					});
				}
			}

			if(notinIds === "")
				notinIds = null;

			const params = {
				'notinIds': notinIds,
				'paginate': 1000,
				'page': 1,
				'type': 'ListOnly',
				'name': keyword
			};
			this.http.sendGetRequest2('user/all/filtered', params).subscribe((response: any) => {
				if(response.api_status){
					this.users = response.data.users.data;
				}
			});
		} else {
			this.users = [];
		}
	}

	public open(content): void {
		const self = this;
		if (!this.isShowed) {
			this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl' }).result.then((result) => {
				self.isShowed = false;
				this.closeResult = `Closed with: ${result}`;
			}, (reason) => {
				self.isShowed = false;
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			});
			$('#btn-ok').focus();
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

	public addUserrolelist(id, name): void{
		this.addNewUser.emit({id, name});
		this.modalService.dismissAll();
	}

}

import { Component, OnInit, ViewChild, TemplateRef, Input } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {
	faTimes as fasTimes,
	faCircle as fasCircle,
	faCheck as fasCheck
} from '@fortawesome/pro-solid-svg-icons';
import * as $ from 'jquery';
import { ListtableComponent } from '../listtable/listtable.component';

@Component({
	selector: 'comp-popup-modal',
	templateUrl: './popup-modal.component.html',
	styleUrls: ['./popup-modal.component.scss']
})
export class PopupModalComponent implements OnInit {

	@ViewChild('mymodal', {static: false}) private modal: TemplateRef<any>;
	@ViewChild('listtable', {static: false}) private test: ListtableComponent;
	@Input() message: string;
	@Input() title: string;
	@Input() status: string;
	public fasTimes = fasTimes;
	public fasCircle = fasCircle;
	public fasCheck = fasCheck;
	public closeResult: string;
	public isShowed: boolean;

	constructor(
		private modalService: NgbModal,
	) { }

	ngOnInit(): void {
		this.closeResult = '';
		this.title = '';
		this.message = '';
		this.status = '';
		this.isShowed = false;
	}

	public show(title: string, message: string, status = ''): void {
		this.title = title;
		this.message = message;
		this.status = status;
		const self = this;
		setTimeout(() => {
			self.open(self.modal);
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

}

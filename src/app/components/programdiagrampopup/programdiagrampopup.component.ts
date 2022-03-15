import { Component, OnInit, ViewChild, TemplateRef, Input } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {
	faTimes as fasTimes,
	faCircle as fasCircle,
	faCheck as fasCheck
} from '@fortawesome/pro-solid-svg-icons';
import * as $ from 'jquery';

@Component({
 selector: 'comp-programdiagrampopup',
 templateUrl: './programdiagrampopup.component.html',
 styleUrls: ['./programdiagrampopup.component.scss']
})
export class ProgramdiagrampopupComponent implements OnInit {

	@ViewChild('mymodal', {static: false}) private modal: TemplateRef<any>;
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
		this.isShowed = false;
	}

	public show(): void {
		const self = this;
		setTimeout(() => {
			self.open(self.modal);
		}, 10);
	}

	public open(content): void {
		const self = this;
		if (!this.isShowed) {
			this.modalService.open(content, {size: 'xl'}).result.then((result) => {
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

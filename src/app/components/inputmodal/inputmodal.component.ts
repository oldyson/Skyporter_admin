import { Component, OnInit, Input, Output, ViewChild, TemplateRef, EventEmitter } from '@angular/core';
import { HelperService } from './../../helper.service';
import { NgbModal, NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import {
	faSpinner as fadSpinner,
} from '@fortawesome/pro-duotone-svg-icons';

@Component({
	selector: 'comp-inputmodal',
	templateUrl: './inputmodal.component.html',
	styleUrls: ['./../exportfilter/exportfilter.component.scss']
})
export class InputmodalComponent implements OnInit {

	@ViewChild('inputmodal', { static: false }) private modal: TemplateRef<any>;
	@Input() inputOptions;
	@Input() isShowed: boolean;
	@Output() submitData = new EventEmitter<any>();
	public submitObject: any;
	public fadSpinner = fadSpinner;
	public selectedModalIndex: number;
	public isLoadingModal: boolean;

	constructor(
		private modalService: NgbModal,
		public helper: HelperService,
		private calendar: NgbCalendar,
	) {
		this.selectedModalIndex = 0;
		this.isShowed = false;
		this.isLoadingModal = false;
		this.submitObject = [];
		
	}

	ngOnInit(): void {
		let self = this;
		if(this.inputOptions?.modalContents){
			this.inputOptions.modalContents.forEach(($ii, idx)=>{
				let temp = {
					modalIndex: idx
				};
				$ii.inputs.forEach(($jj)=>{
					temp[$jj.value] = '';
				})
				self.submitObject.push(temp);
			});
		}
		
	}

	public checkNaN(value: any): any {
		return !isNaN(value) ? value : true;
	}

	public showDialog(index): void {
		this.showModalContents(index);
		this.open(this.modal);
	}

	public closeDialog(): void {
		this.isLoadingModal = false;
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

	public showModalContents(index: number): void {
		this.selectedModalIndex = index;
		this.selectedModal(this.selectedModalIndex);
	}

	public selectedModal(index: number): void {
		this.inputOptions.modalContents.map((val, idx) => {
			if (idx == index) {
				val.selected = true;
			} else {
				val.selected = false;
			}
		});
	}

	public submit($data): void {
		this.isLoadingModal = true;
		this.submitData.emit(this.submitObject[$data]);
	}
}


import { Component, OnInit, Input, Output, ViewChild, TemplateRef, EventEmitter } from '@angular/core';
import { HelperService } from './../../helper.service';
import { NgbModal, NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import {
	faSpinner as fadSpinner,
} from '@fortawesome/pro-duotone-svg-icons';

@Component({
	selector: 'comp-exportfilter',
	templateUrl: './exportfilter.component.html',
	styleUrls: ['./exportfilter.component.scss'],
})
export class ExportfilterComponent implements OnInit {

	@ViewChild('exportfiltermodal', { static: false }) private modal: TemplateRef<any>;
	@Input() filterOptions;
	@Input() dialogName;
	@Input() isShowed: boolean;
	@Input() defaultStartDate: any;
	@Input() defaultEndDate: any;
	@Output() applyData = new EventEmitter<any>();
	public fadSpinner = fadSpinner;
	public selectedDataIndex: number;
	public selectedDataids;
	public selectedDataValue;

	public filters;
	public selectedFilterIndex: number;
	public selectedfilterids;
	public hoveredDate: NgbDate | null = null;
	public fromDate: NgbDate | null;
	public toDate: NgbDate | null;
	public previewData: any;
	public previewFromDate: string;
	public previewToDate: string;
	public isLoadingModal: boolean;
	public isHaveDate: boolean;
	public isFirstOpen: boolean;

	constructor(
		private modalService: NgbModal,
		public helper: HelperService,
		private calendar: NgbCalendar,
	) {
		this.selectedDataIndex = 0;
		this.selectedDataids = [];
		this.isHaveDate = false;
		this.isShowed = false;
		this.fromDate = this.defaultStartDate ? new NgbDate(this.defaultStartDate.year, this.defaultStartDate.month, this.defaultStartDate.day) : calendar.getToday();
		this.toDate = this.defaultEndDate ? new NgbDate(this.defaultEndDate.year, this.defaultEndDate.month, this.defaultEndDate.day) : calendar.getNext(this.calendar.getToday(), 'd', 10);
		this.previewFromDate = this.fromDate ? `${this.fromDate.year}/${this.fromDate.month}/${this.fromDate.day}` : null;
		this.previewToDate = this.toDate ? `${this.toDate.year}/${this.toDate.month}/${this.toDate.day}` : null;
		this.isLoadingModal = false;
		this.isFirstOpen = true;
	}

	ngOnInit(): void {
	}

	public checkNaN(value: any): any {
		return !isNaN(value) ? value : true;
	}

	public showDialog(): void {
		this.selectedGroup(this.selectedDataIndex);
		if(this.isFirstOpen){
			this.fromDate = this.defaultStartDate ? new NgbDate(this.defaultStartDate.year, this.defaultStartDate.month, this.defaultStartDate.day) : this.calendar.getToday();
			this.toDate = this.defaultEndDate ? new NgbDate(this.defaultEndDate.year, this.defaultEndDate.month, this.defaultEndDate.day) : this.calendar.getNext(this.calendar.getToday(), 'd', 10);
			this.isFirstOpen = false;
		}
		
		this.previewFromDate = this.fromDate ? `${this.fromDate.year}/${this.fromDate.month}/${this.fromDate.day}` : null;
		this.previewToDate = this.toDate ? `${this.toDate.year}/${this.toDate.month}/${this.toDate.day}` : null;

		this.filterOptions.datas = this.filterOptions.datas.map(item => {
			if (item.type == 'date' && this.checkNaN(item.visible)) {
				this.isHaveDate = true;
			}

			return {
				...item,
				datas: item.datas.filter(item => item.value == 'selectAll').length === 0 && item.type !== 'date' ? [
					{
						filterName: 'Select All',
						selected: false,
						value: 'selectAll',
					},
					...item.datas
				] : item.datas
			};
		});
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

	public showDatas(index: number): void {
		this.selectedDataIndex = index;
		this.selectedGroup(index);
	}

	public selectedGroup(index: number): void {
		this.filterOptions.datas.map((val, idx) => {
			if (idx == index) {
				val.selected = true;
			} else {
				val.selected = false;
			}
		});
	}

	public selectData(selectedData: any, selectedDataItems: any): void {
		const tempTitle = selectedDataItems.filterSubName ? `${selectedDataItems.filterName} | ${selectedDataItems.filterSubName}` : selectedDataItems.filterName; // set title if have subName
		const idxGroupName = this.selectedDataids.map(item => { // search idx of group name
			return item.type;
		}).indexOf(selectedData.groupName);
		const idxFilterList = this.filterOptions.datas.map(item => { // search idx of selected filter
			return item.groupName;
		}).indexOf(selectedData.groupName);

		if (idxGroupName < 0) { // if idx group name not in array
			if (selectedDataItems.value == 'selectAll') {
				this.selectedDataids.push({
					type: selectedData.groupName,
					value: selectedData.datas.filter(item => item.value != 'selectAll').map(item => { // set value for API and all selected fiter except selecAll
						item.selected = !item.selected;
						return !isNaN(item.value) || item.value ? item.value : item.filterName;
					}),
					title: selectedData.datas.filter(item => item.value != 'selectAll').map(item => {// set title for preview
						return item.filterSubName ? `${item.filterName} | ${item.filterSubName}` : item.filterName;
					})
				});
			} else {
				this.selectedDataids.push({
					type: selectedData.groupName,
					value: [!isNaN(selectedDataItems.value) ? selectedDataItems.value : selectedDataItems.filterName],
					title: [tempTitle]
				});
			}
		} else { // if idx group name is exist
			const idxFilterName = this.selectedDataids[idxGroupName].value.map(item => { // search idx of filter name
				return item;
			}).indexOf(!isNaN(selectedDataItems.value) ? selectedDataItems.value : selectedDataItems.filterName);

			if (idxFilterName < 0) { // if idxFilterName not exist
				if (selectedDataItems.value == 'selectAll') {
					if (selectedDataItems.selected) {
						this.selectedDataids[idxGroupName].value.splice(0, this.selectedDataids[idxGroupName].value.length); // remove data based on idxFilterName
						this.selectedDataids[idxGroupName].title.splice(0, this.selectedDataids[idxGroupName].title.length); // remove data based on idxFilterName
						this.filterOptions.datas[idxFilterList].datas.map(item => {
							if (item.value !== 'selectAll') {
								item.selected = false;
							}
						});
					} else {
						this.selectedDataids[idxGroupName].value = selectedData.datas.filter(item => item.value != 'selectAll').map(item => {
							item.selected = true;
							return !isNaN(item.value) || item.value ? item.value : item.filterName;
						}),
						this.selectedDataids[idxGroupName].title = selectedData.datas.filter(item => item.value != 'selectAll').map(item => {
							item.selected = true;
							return item.filterName;
						});
					}
				} else {
					this.selectedDataids[idxGroupName].value.push(!isNaN(selectedDataItems.value) || selectedDataItems.value ? selectedDataItems.value : selectedDataItems.filterName);
					this.selectedDataids[idxGroupName].title.push(tempTitle);
					if (this.selectedDataids[idxGroupName].value.length == this.filterOptions.datas[idxFilterList].datas.length - 1) { // -1 delete length select all
						this.filterOptions.datas[idxFilterList].datas.map(item => {
							if (item.value == 'selectAll') {
								item.selected = true;
							}
						});
					}
				}
			} else {
				if (selectedDataItems.value == 'selectAll') {
					this.selectedDataids.splice(idxFilterName, 1);
				} else {
					if (this.selectedDataids[idxGroupName].value.length < this.filterOptions.datas[idxFilterList].datas.length) {
						this.filterOptions.datas[idxFilterList].datas.map(item => {
							if (item.value == 'selectAll') {
								item.selected = false;
							}
						});
					}
					this.selectedDataids[idxGroupName].value.splice(idxFilterName, 1);
					this.selectedDataids[idxGroupName].title.splice(idxFilterName, 1);
				}
			}

		}
		selectedDataItems.selected = !selectedDataItems.selected;
	}

	public fromDateChange(data:any):void {
		this.fromDate = data;
		this.previewFromDate = `${data?.year}/${data?.month}/${data?.day}`;
	}

	public toDateChange(data: any): void {
		this.toDate = data;
		this.previewToDate = `${data?.year}/${data?.month}/${data?.day}`;
	}

	public applySelect():void {
		this.isLoadingModal = true;
		this.applyData.emit({
			startDate: this.fromDate,
			endDate: this.toDate,
			filter: this.selectedDataids
		});
	}

	public clearSelect(): void {
		this.fromDate = null;
		this.toDate = null;
		this.filterOptions.datas.map(item => {
			if (item.type !== 'date') {
				item.datas.map(value => {
					value.selected = false;
					this.selectedDataids = [];
				});
			}
		});
	}
}

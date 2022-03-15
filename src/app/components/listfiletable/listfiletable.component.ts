import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { GlobalService } from './../../global.service';
import { HelperService } from './../../helper.service';
import { InputmodalComponent } from './../inputmodal/inputmodal.component';
import swal from 'sweetalert2';
import {
	faEllipsisV as falEllipsisV,
	faClock as falClock,
	faSquare as fasSquare,
	faCheckSquare as fasCheck,
	faPen as fasPen
} from '@fortawesome/pro-light-svg-icons';
import {
	faSearch as fasSearch,
	faMale as fasMale,
	faFemale as fasFemale,
	faCloudDownload as fasCloudDownload,
	faExclamationCircle as fasExclamationCircle
} from '@fortawesome/pro-solid-svg-icons';
import {
	faSortUp as fadSortUp,
	faSortDown as fadSortDown,
	faSpinner as fadSpinner,
	faSort as fadSort
} from '@fortawesome/pro-duotone-svg-icons';
import * as $ from 'jquery';

@Component({
	selector: 'comp-listfiletable',
	templateUrl: './listfiletable.component.html',
	styleUrls: ['./../listtable/listtable.component.scss']
})
export class ListfiletableComponent implements OnInit {
	@ViewChild('filter') filter: InputmodalComponent;
	@ViewChild('input') input: InputmodalComponent;
	@ViewChild('multipleupdate') multipleupdate: InputmodalComponent;
	@Input() datas;
	@Input() keys;
	@Input() simpleError: boolean;
	@Input() navigations;
	@Input() isloading: boolean;
	@Input() inputOptions;
	@Input() filterOptions;
	@Input() multipleSelectOptions;
	@Input() smallgroupmemberroles: any;
	@Input() ministrymemberroles: any;
	@Input() documentgroups: any;
	@Input() multipleSelectEnabled: any;
	@Input() hasDetails: boolean;
	@Output() showModal = new EventEmitter<boolean>();
	@Output() refreshData = new EventEmitter<string>();
	@Output() searchData = new EventEmitter<string>();
	@Output() sortDataBy = new EventEmitter<string>();
	@Output() doAPI = new EventEmitter<any>();
	@Output() doFunction = new EventEmitter<any>();
	@Output() submitFilter = new EventEmitter<any>();
	@Output() submitInputModalData = new EventEmitter<any>();
	@Output() listAction = new EventEmitter<any>();
	@Output() rowOpened = new EventEmitter<any>();
	@Output() saveEditableInput = new EventEmitter<any>();
	@Output() updateRoles = new EventEmitter<any>();
	@Output() moveFolder = new EventEmitter<any>();
	@Output() deleteSelectedItems = new EventEmitter<any>();
	@Output() submitMultipleSelection = new EventEmitter<any>();
	public fadSpinner = fadSpinner;
	public falEllipsisV = falEllipsisV;
	public fasSearch = fasSearch;
	public fasMale = fasMale;
	public fasFemale = fasFemale;
	public fasCheck = fasCheck;
	public fasSquare = fasSquare;
	public falClock = falClock;
	public fadSort = fadSort;
	public fadSortUp = fadSortUp;
	public fadSortDown = fadSortDown;
	public fasPen = fasPen;
	public fasCloudDownload = fasCloudDownload;
	public fasExclamationCircle = fasExclamationCircle;
	public navigationLists: any;
	public ispageone = false;
	public ispageoneafter = false;
	public islastpage = false;
	public islastpagebefore = false;
	public keyword: string;
	public currentPageIdx;
	public maskSgNameByChurch;
	public selectAll: boolean;
	public hasSelected: boolean;
	public hasSelectedFile: boolean;
	constructor(
		public global: GlobalService,
		public helper: HelperService,
	) {
		this.multipleSelectEnabled = true;
		this.currentPageIdx = 0;
		this.keys = null;
		this.datas = null;
		this.inputOptions = {};
		this.filterOptions = {};
		this.isloading = false;
		this.navigationLists = [];
		this.maskSgNameByChurch = JSON.parse(localStorage.getItem('applicationfeatures')).filter(item => item.name === 'small-group')[0]?.applicationfeaturechurches[0]?.showname || 'small group';
		this.selectAll = false;
		this.hasSelected = false;
		this.hasSelectedFile = false;
	}

	ngOnInit(): void {
		//
	}

	public getClassButton(type: string): object {
		if (type === 'danger') {
			return { 'danger': true };
		} else if (type === 'success') {
			return { 'success': true };
		} else if (type === 'success-outline') {
			return { 'success-outline': true };
		}
	}


	public showInputModal(index: any): void {
		this.input.showDialog(index);
	}

	public showMultipleUpdateModal(index: any): void {
		this.multipleupdate.showDialog(index);
	}

	public showFilterModal(index: any): void {
		this.filter.showDialog(index);
	}

	public gotoPage(pageNumber: number): void {
		if (pageNumber !== null) {
			if (this.isloading === false) {
				this.refreshData.emit(pageNumber + '');
			}
		}
	}

	public nextPage():void {
		if (this.navigations.last_page > this.navigations.current_page) {
			if (this.isloading === false) {
				this.refreshData.emit(this.currentPageIdx + 2 + '');
			}
		}
	}

	public prevPage(): void {
		if (this.currentPageIdx > 0) {
			if (this.isloading === false) {
				this.refreshData.emit(((this.currentPageIdx + 1) - 1) + '');
			}
		}
	}

	public searchKeyword(): void {
		if (this.keyword !== null) {
			if ((this.keyword.length >= 3
				|| this.keyword.length === 0)
				&& this.isloading === false) {
				this.searchData.emit(this.keyword);
			}
		}
	}

	public sortColumn(column: string): void {
		if (column !== null) {
			if (this.isloading === false) {
				this.sortDataBy.emit(column);
			}
		}
	}

	public generateListAction(dataAction: any, dataValue: any, indexValue: number): void {
		if (this.isloading === false) {
			const temp = {
				dataAction: dataAction,
				dataValue: dataValue,
				indexValue: indexValue
			};
			this.listAction.emit(temp);
		}
	}

	public submitData(data:any): void {
		this.submitInputModalData.emit(data);
	}

	public doActionFunction(dataAction: any, dataValue: any): void {
		if (this.isloading === false) {
			const temp = {
				dataAction: dataAction,
				dataValue: dataValue
			};
			this.doFunction.emit(temp);
		}
	}

	public doActionAPI(apiurl: string, apimethod: string, apiparams: any, type: string, message: string, messageInput: string, messageInputValidation: string, confirmButtonText: string, confirmButtonColor: string): void {
		if (this.isloading === false) {
			switch (type) {
				case 'danger':
					swal.fire({
						title: 'Are you sure?',
						text: message ? message : 'You won\'t be able to revert this!',
						icon: 'warning',
						showCancelButton: true,
						confirmButtonColor: confirmButtonColor ? confirmButtonColor : '#d33',
						confirmButtonText: confirmButtonText ? confirmButtonText : 'Delete'
					}).then((result) => {
						if (result.isConfirmed) {
							this.doAPI.emit({ apiurl, apimethod, apiparams });
						}
					});
					break;
				case 'questionActionSgRequest':
					swal.fire({
						title: 'Are you sure?',
						input: 'text',
						inputPlaceholder: messageInput ? messageInput : 'Type your message here...',
						inputValidator: (value) => {
							if (!value) {
								return messageInputValidation ? messageInputValidation : 'You need to write message!';
							}
						},
						text: message ? message : 'You won\'t be able to revert this!',
						icon: 'question',
						showCancelButton: true,
						confirmButtonColor: '#d33',
						confirmButtonText: confirmButtonText ? confirmButtonText : 'Delete'
					}).then((result) => {
						if (result.isConfirmed) {
							this.doAPI.emit({
								apiurl, apimethod, apiparams: {
									...apiparams,
									reason: result.value
								}});
						}
					});
					break;
				case 'question':
					swal.fire({
						title: 'Are you sure?',
						text: message ? message : 'You won\'t be able to revert this!',
						icon: type,
						showCancelButton: true,
						confirmButtonColor: confirmButtonColor ? confirmButtonColor : '',
						confirmButtonText: confirmButtonText ? confirmButtonText : 'Ok'
					}).then((result) => {
						if (result.isConfirmed) {
							this.doAPI.emit({ apiurl, apimethod, apiparams });
						}
					});
					break;
				case 'warning':
					swal.fire({
						title: 'Are you sure?',
						text: message,
						icon: type,
						showCancelButton: true,
						confirmButtonText: 'OK'
					}).then((result) => {
						if (result.isConfirmed) {
							this.doAPI.emit({ apiurl, apimethod, apiparams });
						}
					});
					break;
				default:
					this.doAPI.emit({ apiurl, apimethod, apiparams });
					break;
			}
		}
	}

	public generateNavigationList(totalPage: number, currentPage: number): void {
		this.currentPageIdx = currentPage - 1;
		const lastPageIdx = totalPage - 1;
		this.navigationLists = [];
		for (let i = 0; i < totalPage; i++) {
			this.navigationLists.push({
				label: i + 1,
				isshow: false,
				iscurrent: this.currentPageIdx === i ? true : false
			});
		}

		this.ispageone = false;
		this.islastpage = false;
		this.ispageoneafter = false;
		this.islastpagebefore = false;

		if (this.currentPageIdx - 2 >= 0
			&& this.currentPageIdx - 2 <= totalPage) {
			if (this.navigationLists[this.currentPageIdx - 2] != null) {
				this.navigationLists[this.currentPageIdx - 2].isshow = true;
			}
			if (this.currentPageIdx - 2 === 0) {
				this.ispageone = true;
			}
			if (this.currentPageIdx - 2 === 1) {
				this.ispageoneafter = true;
			}
			if (this.currentPageIdx - 2 === lastPageIdx - 1) {
				this.islastpagebefore = true;
			}
			if (this.currentPageIdx - 2 === lastPageIdx) {
				this.islastpage = true;
			}
		}
		if (this.currentPageIdx - 1 >= 0
			&& this.currentPageIdx - 1 <= totalPage) {
			if (this.navigationLists[this.currentPageIdx - 1] != null) {
				this.navigationLists[this.currentPageIdx - 1].isshow = true;
			}
			if (this.currentPageIdx - 1 === 0) {
				this.ispageone = true;
			}
			if (this.currentPageIdx - 1 === 1) {
				this.ispageoneafter = true;
			}
			if (this.currentPageIdx - 1 === lastPageIdx - 1) {
				this.islastpagebefore = true;
			}
			if (this.currentPageIdx - 1 === lastPageIdx) {
				this.islastpage = true;
			}
		}
		if (this.currentPageIdx >= 0
			&& this.currentPageIdx <= totalPage) {
			if (this.navigationLists[this.currentPageIdx] != null) {
				this.navigationLists[this.currentPageIdx].isshow = true;
			}
			if (this.currentPageIdx === 0) {
				this.ispageone = true;
			}
			if (this.currentPageIdx === 1) {
				this.ispageoneafter = true;
			}
			if (this.currentPageIdx === lastPageIdx - 1) {
				this.islastpagebefore = true;
			}
			if (this.currentPageIdx === lastPageIdx) {
				this.islastpage = true;
			}
		}
		if (this.currentPageIdx + 1 >= 0
			&& this.currentPageIdx + 1 <= totalPage) {
			if (this.navigationLists[this.currentPageIdx + 1] != null) {
				this.navigationLists[this.currentPageIdx + 1].isshow = true;
			}
			if (this.currentPageIdx + 1 === 0) {
				this.ispageone = true;
			}
			if (this.currentPageIdx + 1 === 1) {
				this.ispageoneafter = true;
			}
			if (this.currentPageIdx + 1 === lastPageIdx - 1) {
				this.islastpagebefore = true;
			}
			if (this.currentPageIdx + 1 === lastPageIdx) {
				this.islastpage = true;
			}
		}
		if (this.currentPageIdx + 2 >= 0
			&& this.currentPageIdx + 2 <= totalPage) {
			if (this.navigationLists[this.currentPageIdx + 2] != null) {
				this.navigationLists[this.currentPageIdx + 2].isshow = true;
			}
			if (this.currentPageIdx + 2 === 0) {
				this.ispageone = true;
			}
			if (this.currentPageIdx + 2 === 1) {
				this.ispageoneafter = true;
			}
			if (this.currentPageIdx + 2 === lastPageIdx - 1) {
				this.islastpagebefore = true;
			}
			if (this.currentPageIdx + 2 === lastPageIdx) {
				this.islastpage = true;
			}
		}
	}

	public onSearchKeydown(event): void {
		if (event.key === 'Enter') {
			event.preventDefault();
			if (this.keyword.length >= 2) {
				this.searchKeyword();
			} else {
				$('#list-search').focus();
			}
		}
	}

	public closeModals(): void {
		this.filter.closeDialog();
		this.input.closeDialog();
		this.multipleupdate.closeDialog();
		this.hasSelected = false;
		this.selectAll = false;
		this.hasSelectedFile = false;
	}

	public toggleDetails($data): void {
		this.rowOpened.emit($data);
	}

	public toggleEditing($data, $key ,status): void {
		$data.isEditing = !$data.isEditing;
		if($data.isEditing){
			$data[$key.value+'_prev'] = $data[$key.value];
		}
		else{
			if(status != 'save')
				$data[$key.value] = $data[$key.value+'_prev'];
		}
		console.log($data);
	}

	public saveEditableData($data): void {
		this.saveEditableInput.emit($data);
	}

	public move($data): void {
		this.moveFolder.emit($data);
	}

	public changeRoles($data): void {
		this.updateRoles.emit($data);
	}

	public updateSelectAll($event): void {
		let self = this;
		this.hasSelected = this.selectAll;
		this.hasSelectedFile = false;
		this.datas.forEach(($ii)=> {
			$ii.selected = self.selectAll;
			if($ii.type == 'file' && $ii.selected)
				self.hasSelectedFile = true;
		});
	}

	public checkSelected($event): void {
		let self = this;
		if($event.selected){
			this.hasSelected = true;
			if($event.type == 'file')
				this.hasSelectedFile = true;
		}else{
			this.hasSelected = false;
			this.hasSelectedFile = false;
			this.datas.forEach(($ii)=> {
				if($ii.selected){
					self.hasSelected = true;
					if($ii.type == 'file')
						self.hasSelectedFile = true;
				}
			});
		}
	}

	public deleteSelected(): void {
		this.deleteSelectedItems.emit();
	}

	public submitMultipleUpdate($event): void {
		this.submitMultipleSelection.emit($event);
	}

	public generateFilter($event): void {
		this.submitFilter.emit($event);
	}
}

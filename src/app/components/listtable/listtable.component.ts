import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { GlobalService } from './../../global.service';
import { HelperService } from './../../helper.service';
import { ExportfilterComponent } from './../exportfilter/exportfilter.component';
import swal from 'sweetalert2';
import {
	faEllipsisV as falEllipsisV,
	faClock as falClock,
	faSquare as fasSquare,
	faCheckSquare as fasCheck
} from '@fortawesome/pro-light-svg-icons';
import {
	faSearch as fasSearch,
	faMale as fasMale,
	faFemale as fasFemale
} from '@fortawesome/pro-solid-svg-icons';
import {
	faSortUp as fadSortUp,
	faSortDown as fadSortDown,
	faSpinner as fadSpinner,
	faSort as fadSort
} from '@fortawesome/pro-duotone-svg-icons';
import * as $ from 'jquery';

@Component({
	selector: 'comp-listtable',
	templateUrl: './listtable.component.html',
	styleUrls: ['./listtable.component.scss']
})
export class ListtableComponent implements OnInit {
	@ViewChild('filter') filter: ExportfilterComponent;
	@ViewChild('export') export: ExportfilterComponent;

	@Input() datas;
	@Input() keys;
	@Input() simpleError: boolean;
	@Input() navigations;
	@Input() isloading: boolean;
	@Input() filterOptions;
	@Input() exportDatas;
	@Input() defaultStartDate: any;
	@Input() defaultEndDate: any;
	@Output() showModal = new EventEmitter<boolean>();
	@Output() refreshData = new EventEmitter<string>();
	@Output() searchData = new EventEmitter<string>();
	@Output() sortDataBy = new EventEmitter<string>();
	@Output() doAPI = new EventEmitter<any>();
	@Output() doFunction = new EventEmitter<any>();
	@Output() listExport = new EventEmitter<any>();
	@Output() listFilter = new EventEmitter<any>();
	@Output() handleDropdownExport = new EventEmitter<any>();
	@Output() handleClickFilterExportButton = new EventEmitter<any>();
	@Output() listAction = new EventEmitter<any>();
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
	public navigationLists: any;
	public ispageone = false;
	public ispageoneafter = false;
	public islastpage = false;
	public islastpagebefore = false;
	public keyword: string;
	public currentPageIdx;
	constructor(
		public global: GlobalService,
		public helper: HelperService,
	) {
		this.currentPageIdx = 0;
		this.keys = null;
		this.datas = null;
		this.filterOptions= {};
		this.isloading = false;
		this.navigationLists = [];
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

	public showPopup(type: string, selectedDropdown: any): void {
		this.handleDropdownExport.emit(selectedDropdown);
		this.handleClickFilterExportButton.emit(type);
		type === 'export' ? (
			this.export.showDialog()
		) : (
			this.filter.showDialog()
		);
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

	public generateExport(data:any): void {
		this.listExport.emit(data);
	}

	public generateFilter(data:any): void {
		this.listFilter.emit(data);
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

	public closeExportfilter(): void {
		this.filter.closeDialog();
		this.export.closeDialog();
	}

}

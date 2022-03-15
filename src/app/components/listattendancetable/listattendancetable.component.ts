import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { GlobalService } from './../../global.service';
import { HelperService } from './../../helper.service';
import { HttpService } from './../../http.service';
import { ExportfilterComponent } from './../exportfilter/exportfilter.component';
import swal from 'sweetalert2';
import {
	faSearch as fasSearch,
} from '@fortawesome/pro-solid-svg-icons';
import {
	faEllipsisV as falEllipsisV,
} from '@fortawesome/pro-light-svg-icons';
import {
	faSquare as farSquare,
} from '@fortawesome/pro-regular-svg-icons';
import {
	faCheckSquare as fadCheckSquare,
	faSpinner as fadSpinner,
} from '@fortawesome/pro-duotone-svg-icons';
import {
	faSortUp as fadSortUp,
	faSortDown as fadSortDown,
	faSort as fadSort
} from '@fortawesome/pro-duotone-svg-icons';

import * as $ from 'jquery';

@Component({
	selector: 'comp-listattendancetable',
	templateUrl: './listattendancetable.component.html',
	styleUrls: ['./../listtable/listtable.component.scss']
})
export class ListattendancetableComponent implements OnInit {
	@ViewChild('export') filter: ExportfilterComponent;

	@Input() datas;
	@Input() keys;
	@Input() navigations;
	@Input() tabs;
	@Input() currentTab;
	@Input() isloading: boolean;
	@Input() filterOptions;
	@Input() programId: number;
	@Output() refreshData = new EventEmitter<string>();
	@Output() searchData = new EventEmitter<string>();
	@Output() sortDataBy = new EventEmitter<string>();
	@Output() doAPI = new EventEmitter<any>();
	@Output() attendanceChecklist = new EventEmitter<any>();
	@Output() listExport = new EventEmitter<any>();

	public fadSortUp = fadSortUp;
	public fadSortDown = fadSortDown;
	public fadSort = fadSort;

	public falEllipsisV = falEllipsisV;
	public fadCheckSquare = fadCheckSquare;
	public fadSpinner = fadSpinner;
	public farSquare = farSquare;
	public fasSearch = fasSearch;
	public navigationLists: any;
	public ispageone = false;
	public ispageoneafter = false;
	public islastpage = false;
	public islastpagebefore = false;
	public keyword: string;

	constructor(
		public global: GlobalService,
		public helper: HelperService,
		public http: HttpService,
	) {
		this.keys = null;
		this.datas = null;
		this.isloading = false;
		this.navigationLists = [];
	}

	ngOnInit(): void {
		//
	}

	public getFunctionExport(): void {
		if (!this.filterOptions.datas.length) {
			this.listExport.emit();
		}
	}

	public gotoPage(pageNumber: number): void {
		if (pageNumber !== null) {
			if (this.isloading === false) {
				this.refreshData.emit(pageNumber + '');
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

	public generateExport(data:any): void {
		this.listExport.emit(data);
	}

	public doActionAPI(apiurl: string, apimethod: string, apiparams: any, type: string, message: string): void {
		if (this.isloading === false) {
			switch (type) {
				case 'danger':
					swal.fire({
						title: 'Are you sure?',
						text: 'You won\'t be able to revert this!',
						icon: 'warning',
						showCancelButton: true,
						confirmButtonColor: '#d33',
						confirmButtonText: 'Delete'
					}).then((result) => {
						if (result.isConfirmed) {
							this.doAPI.emit({ apiurl, apimethod, apiparams });
						}
					});
					break;
				case 'question':
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
		const currentPageIdx = currentPage - 1;
		const lastPageIdx = totalPage - 1;
		this.navigationLists = [];
		for (let i = 0; i < totalPage; i++) {
			this.navigationLists.push({
				label: i + 1,
				isshow: false,
				iscurrent: currentPageIdx === i ? true : false
			});
		}

		this.ispageone = false;
		this.islastpage = false;
		this.ispageoneafter = false;
		this.islastpagebefore = false;

		if (currentPageIdx - 2 >= 0
			&& currentPageIdx - 2 <= totalPage) {
			if (this.navigationLists[currentPageIdx - 2] != null) {
				this.navigationLists[currentPageIdx - 2].isshow = true;
			}
			if (currentPageIdx - 2 === 0) {
				this.ispageone = true;
			}
			if (currentPageIdx - 2 === 1) {
				this.ispageoneafter = true;
			}
			if (currentPageIdx - 2 === lastPageIdx - 1) {
				this.islastpagebefore = true;
			}
			if (currentPageIdx - 2 === lastPageIdx) {
				this.islastpage = true;
			}
		}
		if (currentPageIdx - 1 >= 0
			&& currentPageIdx - 1 <= totalPage) {
			if (this.navigationLists[currentPageIdx - 1] != null) {
				this.navigationLists[currentPageIdx - 1].isshow = true;
			}
			if (currentPageIdx - 1 === 0) {
				this.ispageone = true;
			}
			if (currentPageIdx - 1 === 1) {
				this.ispageoneafter = true;
			}
			if (currentPageIdx - 1 === lastPageIdx - 1) {
				this.islastpagebefore = true;
			}
			if (currentPageIdx - 1 === lastPageIdx) {
				this.islastpage = true;
			}
		}
		if (currentPageIdx >= 0
			&& currentPageIdx <= totalPage) {
			if (this.navigationLists[currentPageIdx] != null) {
				this.navigationLists[currentPageIdx].isshow = true;
			}
			if (currentPageIdx === 0) {
				this.ispageone = true;
			}
			if (currentPageIdx === 1) {
				this.ispageoneafter = true;
			}
			if (currentPageIdx === lastPageIdx - 1) {
				this.islastpagebefore = true;
			}
			if (currentPageIdx === lastPageIdx) {
				this.islastpage = true;
			}
		}
		if (currentPageIdx + 1 >= 0
			&& currentPageIdx + 1 <= totalPage) {
			if (this.navigationLists[currentPageIdx + 1] != null) {
				this.navigationLists[currentPageIdx + 1].isshow = true;
			}
			if (currentPageIdx + 1 === 0) {
				this.ispageone = true;
			}
			if (currentPageIdx + 1 === 1) {
				this.ispageoneafter = true;
			}
			if (currentPageIdx + 1 === lastPageIdx - 1) {
				this.islastpagebefore = true;
			}
			if (currentPageIdx + 1 === lastPageIdx) {
				this.islastpage = true;
			}
		}
		if (currentPageIdx + 2 >= 0
			&& currentPageIdx + 2 <= totalPage) {
			if (this.navigationLists[currentPageIdx + 2] != null) {
				this.navigationLists[currentPageIdx + 2].isshow = true;
			}
			if (currentPageIdx + 2 === 0) {
				this.ispageone = true;
			}
			if (currentPageIdx + 2 === 1) {
				this.ispageoneafter = true;
			}
			if (currentPageIdx + 2 === lastPageIdx - 1) {
				this.islastpagebefore = true;
			}
			if (currentPageIdx + 2 === lastPageIdx) {
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

	public toggleAttendance(key: any):void {
		if (!key.loading) {
			// supaya ga double request
			key.loading = true;
			this.attendanceChecklist.emit(key);
		}
	}

	public doneToggle(programticketattendanceId: any): void {
		this.keys.forEach(($ii) => {
			this.datas.forEach(($jj) => {
				if ($ii.showtype === 'attendance') {
					if ($jj[$ii.value].id === programticketattendanceId) {
						$jj[$ii.value].status = !$jj[$ii.value].status;
						$jj[$ii.value].loading = false;
					}
				}
			});
		});
	}

	public generateSeat(): void {
		// generate Seat
		console.log('data', this.programId);

		const params = {
			program_id: this.programId,
		}

		this.http.sendGetRequest2('programticketattendance/setSeatnumber', params).subscribe((response: any) => {
			if(response.api_status) {
				for (var i = this.navigationLists.length - 1; i >= 0; i--) {
					if(this.navigationLists[i].iscurrent) {
						this.gotoPage(this.navigationLists[i].label);
					}
				}
			}
		}, (error: any) => {

		});
	}

}

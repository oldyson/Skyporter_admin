import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {
	faSearch as fasSearch,
} from '@fortawesome/pro-solid-svg-icons';

@Component({
	selector: 'comp-searchtable',
	templateUrl: './searchtable.component.html',
	styleUrls: ['./searchtable.component.scss']
})
export class SearchtableComponent implements OnInit {

	@Output() searchData = new EventEmitter<string>();
	public fasSearch = fasSearch;
	public keyword: string;
	public isloading: boolean;
	public placeholder: string;

	constructor() { }

	ngOnInit(): void {
		this.isloading = false;
		this.placeholder = '';
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

}

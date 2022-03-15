import { Component, OnInit } from '@angular/core';
import {
	faAngleRight as fasAngleRight
} from '@fortawesome/pro-solid-svg-icons';

@Component({
	selector: 'comp-navigation',
	templateUrl: './navigation.component.html',
	styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

	public fasAngleRight = fasAngleRight;
	public currentPage: any;
	public currentHeaderPage: any;

	constructor() {
		this.currentPage = JSON.parse(localStorage.getItem('currentpage'));
		this.currentHeaderPage = JSON.parse(localStorage.getItem('currentheaderpage'));
	}

	ngOnInit(): void {
		//
	}

}

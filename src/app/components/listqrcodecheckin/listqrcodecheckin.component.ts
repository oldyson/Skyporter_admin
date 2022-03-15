import { Component, OnInit, Input } from '@angular/core';
import { HelperService } from './../../helper.service';

@Component({
	selector: 'comp-listqrcodecheckin',
	templateUrl: './listqrcodecheckin.component.html',
	styleUrls: ['./listqrcodecheckin.component.scss']
})
export class ListqrcodecheckinComponent implements OnInit {

	@Input() qrList;
	public selectedIndex: number;

	constructor(
		public helper: HelperService
	) {
		this.selectedIndex = 0;
		this.qrList = [];
	}

	ngOnInit(): void {
	}

	showQrcode(index: number): void {
		this.selectedIndex = index;
	}

}

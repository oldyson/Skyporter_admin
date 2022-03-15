import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

@Component({
	selector: 'campaignform-preview',
	templateUrl: './preview.component.html',
	styleUrls: ['./preview.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class PreviewComponent implements OnInit {

	@Input() campaign;
	@Input() recipients;
	@Output() checkTotal = new EventEmitter<string>();

	constructor() {
		//
	}

	ngOnInit(): void {
		//
	}

	doCheckTotal(): void {
		this.checkTotal.emit();
	}

}

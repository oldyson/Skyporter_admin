import {Component, OnInit, EventEmitter, Input, Output} from '@angular/core';
import {
	faTimes as farTimes,
	faPlus as farPlus,
} from '@fortawesome/pro-regular-svg-icons';

@Component({
	selector: 'programform-price',
	templateUrl: './price.component.html',
	styleUrls: ['./price.component.scss'],
})
export class PriceComponent implements OnInit {
	@Input() roles: any;
	@Output() addProgramPrice = new EventEmitter();
	@Output() removeProgramPrice = new EventEmitter<string>();
	@Output() programChange = new EventEmitter<any>();
	@Output() updateIsReqPayment = new EventEmitter<any>();
	@Input() program: any;
	@Input() type: any;
	public farTimes = farTimes;
	public farPlus = farPlus;

	constructor() { }

	ngOnInit(): void {
	}

	public addPrice(): void {
		this.addProgramPrice.emit();
		this.updateIsReqPayment.emit();
	}

	public removePrice(index: number): void {
		this.removeProgramPrice.emit(index + '');
		this.updateIsReqPayment.emit();
	}

	public updateReqPayment(): void {
		this.updateIsReqPayment.emit();
	}
}

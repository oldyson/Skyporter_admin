import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
	faToggleOff as fadToggleOff,
	faToggleOn as fadToggleOn
} from '@fortawesome/pro-duotone-svg-icons';

@Component({
	selector: 'comp-percenttoggle',
	templateUrl: './percenttoggle.component.html',
	styleUrls: ['./percenttoggle.component.scss']
})
export class PercenttoggleComponent implements OnInit {

	@Input() status: boolean;
	@Output() whenToggled = new EventEmitter<boolean>();
	public fadToggleOff = fadToggleOff;
	public fadToggleOn = fadToggleOn;

	constructor() { }

	ngOnInit(): void {
	}

	public toggle(): void {
		this.whenToggled.emit(this.status ? false : true);
	}

}

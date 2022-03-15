import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
	faTimes as farTimes
} from '@fortawesome/pro-regular-svg-icons';
@Component({
	selector: 'programform-breakout-date',
	templateUrl: './date.component.html',
	styleUrls: ['./date.component.scss']
})
export class DateComponent implements OnInit {
	@Output() addBreakoutDate = new EventEmitter<string>();
	@Output() removeBreakoutDate = new EventEmitter<string>();
	@Output() programChange = new EventEmitter<any>();
	@Output() updateStartEnd = new EventEmitter<any>();
	@Input() program: any;
	@Input() currentViewIndex: number;
	@Input()
	public farTimes = farTimes;

	constructor() {

	}

	ngOnInit(): void {
	}

	public addDate(index: number):void {
		if(this.program.isEditable == 1){
			this.addBreakoutDate.emit(index + '');
		}
	}

	public removeDate(index: number): void {
		if(this.program.isEditable == 1){
			this.removeBreakoutDate.emit(index + '');
			this.updateStartEnd.emit();	
		}
	}

	public updateProgramStartEnd(): void {
		this.updateStartEnd.emit();
	}
}

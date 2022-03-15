
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import {
	faTimes as farTimes,
	faPlus as farPlus
} from '@fortawesome/pro-regular-svg-icons';

@Component({
	selector: 'programform-breakout',
	templateUrl: './breakout.component.html',
	styleUrls: ['./breakout.component.scss']
})
export class BreakoutComponent implements OnInit {

	@Output() addProgramBreakout = new EventEmitter();
	@Output() removeProgramBreakout = new EventEmitter<string>();
	@Output() programChange = new EventEmitter<any>();
	@Output() addProgramBreakoutDate = new EventEmitter<string>();
	@Output() removeProgramBreakoutDate = new EventEmitter<string>();
	@Output() updateProgramStartEnd = new EventEmitter<any>();
	@Input() program: any;
	@Input() campusrooms: any;
	public currentViewIndex: number;
	public farTimes = farTimes;
	public farPlus = farPlus;

	constructor() {
		//
	}

	ngOnInit(): void {
		this.changeViewIndex(0);
	}

	public changeViewIndex(index:number): void {
		this.currentViewIndex = index;
	}

	public addBreakout(): void {
		if(this.program.isEditable == 1){
			this.addProgramBreakout.emit();
			this.changeViewIndex(this.program.programbreakouts.length-1);
		}
	}

	public removeBreakout(index: number): void {
		if(this.program.isEditable == 1){
			this.removeProgramBreakout.emit(index + '');
		}
	}

	public addBreakoutDate(index: string): void {
		if(this.program.isEditable == 1){
			this.addProgramBreakoutDate.emit(index);
		}
	}

	public removeBreakoutDate(index: string): void {
		if(this.program.isEditable == 1){
			this.removeProgramBreakoutDate.emit(index);
		}
	}

	public updateStartEnd(): void {
		this.updateProgramStartEnd.emit();
	}
}

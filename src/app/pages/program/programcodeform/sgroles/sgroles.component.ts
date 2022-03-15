import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'programcodeform-sgroles',
	templateUrl: './sgroles.component.html',
	styleUrls: ['./sgroles.component.scss']
})
export class SgrolesComponent implements OnInit {

	@Input() smallgroupRoleAll: any;
	@Input() smallgroupRoleList: any;
	@Output() addProgramCodeReqSGRoleList = new EventEmitter();
	@Output() removeProgramCodeReqSGRoleList = new EventEmitter<string>();
	constructor() { }

	ngOnInit(): void {
	}

	public addProgramCodeReqSGRole():void {
		this.addProgramCodeReqSGRoleList.emit();
	}

	public removeProgramCodeReqSGRole(index: number): void {
		this.removeProgramCodeReqSGRoleList.emit(index + '');
	}
}

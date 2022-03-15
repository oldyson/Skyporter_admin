import { Component, OnInit, Input } from '@angular/core';
import {
	faUser as fasUser,
	faEllipsisV as fasEllipsisV,
	faChevronDown as fasChevronDown,
} from '@fortawesome/pro-solid-svg-icons';
import {
	faChevronDown as falChevronDown,
	faInfoCircle as falInfoCircle,
} from '@fortawesome/pro-light-svg-icons';
import {
	faUser as farUser,
	faSquare as farSquare,
	faCheck as farCheck,
} from '@fortawesome/pro-regular-svg-icons';
import {
	faCheckSquare as fadCheckSquare,
	faSpinner as fadSquare,
} from '@fortawesome/pro-duotone-svg-icons';

@Component({
	selector: 'userdetailprogram-userprogramhistory',
	templateUrl: './userprogramhistory.component.html',
	styleUrls: ['./userprogramhistory.component.scss']
})
export class UserprogramhistoryComponent implements OnInit {

	@Input() programs: any;
	@Input() historyType: string;
	@Input() isloading: boolean;
	public fasUser = fasUser;
	public farUser = farUser;
	public fasEllipsisV = fasEllipsisV;
	public fasChevronDown = fasChevronDown;
	public farSquare = farSquare;
	public fadCheckSquare = fadCheckSquare;
	public fadSquare = fadSquare;
	public falChevronDown = falChevronDown;
	public falInfoCircle = falInfoCircle;
	public farCheck = farCheck;
	public popProgramSelected: any;
	public showSubtitle: boolean;

	constructor() { 
		this.showSubtitle = false;
	}

	ngOnInit(): void {
	}

	public subtitleToggle(): void {
		this.showSubtitle = true;
	}

	public showProgramDetail(index:number) : void{
		const temp = this.programs[index].isshowed;
		this.programs.forEach(($ii) => {
			$ii.isshowed = false;
		});
		this.programs[index].isshowed = !temp;
	}

	public toggleAttendance(data: any): void {
		data.ispresent = !data.ispresent;
	}

}

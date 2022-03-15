import { Component, OnInit, Input } from '@angular/core';
import { HelperService } from './../../../../helper.service';

@Component({
	selector: 'userdetail-userdetailjourney',
	templateUrl: './userdetailjourney.component.html',
	styleUrls: ['./userdetailjourney.component.scss']
})
export class UserdetailjourneyComponent implements OnInit {

	@Input() user: any;
	public dataList: any;

	constructor(
		public helper: HelperService,
	) {
		this.dataList = [
			{
				section: 'smallgroup',
				title: 'Smallgroup',
				withName: true
			},
			{
				section: 'ministry',
				title: 'Ministry',
				withName: true
			},
			{
				section: 'program',
				title: 'Class / Event',
				withName: true
			},
			{
				section: 'userfamily',
				title: 'Family',
				withName: false
			}
		];
	}

	ngOnInit(): void {
	}

}

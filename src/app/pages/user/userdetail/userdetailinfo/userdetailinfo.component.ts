import { Component, OnInit, Input } from '@angular/core';
import { HelperService } from './../../../../helper.service';

@Component({
	selector: 'userdetail-userdetailinfo',
	templateUrl: './userdetailinfo.component.html',
	styleUrls: ['./userdetailinfo.component.scss']
})
export class UserdetailinfoComponent implements OnInit {

	@Input() user: any;
	public sgList: any;

	constructor(
		public helper: HelperService,
	) {
		this.sgList = [];
		this.user = null;
	}

	ngOnInit(): void {
		this.searchGroup();
	}

	public searchGroup(): void {
		// console.log(this.user)
		for (let idx = 0; idx < this.user.smallgroupmembers.length; idx++) {
			this.sgList[idx] = [];
			const loop = 0;
			this.getGroup(this.user.smallgroupmembers[idx], this.user.smallgroupmembers[idx].smallgroupmemberrole, idx, loop);
		}
	}

	public getGroup(data: any, sgRole: any, idx: number, loop: number): void {
		if (loop == 0) {
			this.sgList[idx].push({
				sgId: data.smallgroups?.id,
				sgName: data.smallgroups?.name,
				sgLead1: {
					name: data.user?.fullname || '',
					id: data.user?.id || '',
				},
				sgLead2: {
					name: data.user2?.fullname || '',
					id: data.user2?.id || '',
				},
				role: sgRole.name,
				level: sgRole.level
			});
		} else {
			this.sgList[idx].push({
				sgId: data.smallgroup?.id,
				sgName: data.smallgroup?.name,
				sgLead1: {
					name: data.user?.fullname || '',
					id: data.user?.id || '',
				},
				sgLead2: {
					name: data.user2?.fullname || '',
					id: data.user2?.id || '',
				},
				role: sgRole.name,
				level: sgRole.level
			});
		}
		if (data.smallgroup?.smallgroupleader?.smallgroup) {
			this.getGroup(data.smallgroup?.smallgroupleader, data.smallgroup?.smallgroupleader?.smallgroupmemberrole, idx, loop + 1);
		} else {
			this.sgList[idx].push({
				sgId: data?.smallgroup?.id,
				sgName: data?.smallgroup?.name,
				sgLead1: {
					name: data?.smallgroup?.smallgroupleader?.user?.fullname || '',
					id: data?.smallgroup?.smallgroupleader?.user?.id || ''
				},
				sgLead2: {
					name: data?.smallgroup?.smallgroupleader?.user2?.fullname || '',
					id: data?.smallgroup?.smallgroupleader?.user2?.id || ''
				},
				role: data?.smallgroup?.smallgroupleader?.smallgroupmemberrole?.name,
				level: data?.smallgroup?.smallgroupleader?.smallgroupmemberrole?.level
			});
		}
		console.log(this.sgList)
	}
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { ListtableComponent } from './../../../components/listtable/listtable.component';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from './../../../http.service';
import { GlobalService } from './../../../global.service';
import { HelperService } from './../../../helper.service';
import swal from 'sweetalert2';

@Component({
	selector: 'app-userfamilydetail',
	templateUrl: './userfamilydetail.component.html',
	styleUrls: ['./userfamilydetail.component.scss']
})
export class UserfamilydetailComponent implements OnInit {

	@ViewChild(ListtableComponent) listtable: ListtableComponent;
	public userfamily: any;
	public userfamilyId: number;
	public page;
	public keyword: string;
	public sortkey: number;
	public isloading: boolean;
	public datas: any;
	public keys: any;
	public navigations: any;

	constructor(
		private http: HttpService,
		private global: GlobalService,
		private helper: HelperService,
		private activatedRoute: ActivatedRoute,
	) {
		this.userfamily = null;
		this.activatedRoute.queryParams.subscribe(params => {
			this.userfamilyId = params.id;
		});
		this.keyword = null;
		this.sortkey = 0; // index 0 = 1
		this.isloading = false; // kepake di listtable

		// showtype:
		// number, text, datetime,
		this.keys = [
			{
				label: '#', // NAMA Header Column (muncul)
				value: 'id', // [key] name
				showtype: 'number', // show type
				minwidth: true, // Press width, jadi 1%
				priority: 0, // 0 tidak hilang, dst..
				opensort: false, // bisa di sort
				sortcolumn: 'id', // Sort column [key]
				sortorder: 'DESC' // Sort order pertama
			},
			{
				label: 'Child Name',
				value: 'childname',
				showtype: 'text',
				minwidth: false,
				priority: 0,
				maxlength: 25, // maximum length
			},
			{
				label: 'Gender',
				value: 'gender',
				showtype: 'text',
				minwidth: false,
				priority: 0,
			},
			{
				label: 'Birthdate',
				value: 'birthdate',
				showtype: 'text',
				minwidth: false,
				priority: 1,
				nullvalue: 'No Data',
			},
			{
				label: 'Age',
				value: 'age',
				showtype: 'text',
				minwidth: false,
				priority: 2,
				nullvalue: 'No Data',
			},
			{
				label: 'Age Group',
				value: 'churchage',
				showtype: 'text',
				minwidth: false,
				priority: 2,
				maxlength: null
			},
			{
				label: 'Create',
				value: 'created_at',
				showtype: 'datetime',
				minwidth: false,
				priority: 1,
				maxlength: null
			}
		];
	}

	ngOnInit(): void {
		this.getUserfamilyById();
	}

	public getUserfamilyById(): void {
		const params = {
			id: this.userfamilyId,
		};
		this.isloading = true;
		this.http.sendGetRequest2('userfamily/detail', params).subscribe((response: any) => {
			this.userfamily = response.data.userfamily;

			this.userfamily.created_at = this.helper.getDatetime(this.userfamily.created_at);
			// bikin roleSummary
			// user 1
			let summary = '';
			if (this.userfamily.user != null) {
				this.userfamily.user.smallgroupmembers_user.forEach(($ii) => {
					summary += summary === '' ? '' : '<br>';
					summary += $ii.smallgroupmemberrole.name + ( $ii.smallgroup != null ? ' at ' + $ii.smallgroup.name : '' );
				});
				this.userfamily.user.smallgroupmembers_user2.forEach(($ii) => {
					summary += summary === '' ? '' : '<br>';
					summary += $ii.smallgroupmemberrole.name + ( $ii.smallgroup != null ? ' at ' + $ii.smallgroup.name : '' );
				});
				this.userfamily.user.ministrymembers.forEach(($ii) => {
					if ($ii.ministrymemberrole != null
						&& $ii.ministry != null) {
						summary += summary === '' ? '' : '<br>';
						summary += $ii.ministrymemberrole.name + ' at ' + $ii.ministry.name;
					}
				});
				Object.assign(this.userfamily.user, {
					roleSummary: summary,
				});
			}

			summary = '';
			if (this.userfamily.user2 != null) {
				this.userfamily.user2.smallgroupmembers_user.forEach(($ii) => {
					summary += summary === '' ? '' : '<br>';
					summary += $ii.smallgroupmemberrole.name + ( $ii.smallgroup != null ? ' at ' + $ii.smallgroup.name : '' );
				});
				this.userfamily.user2.smallgroupmembers_user2.forEach(($ii) => {
					summary += summary === '' ? '' : '<br>';
					summary += $ii.smallgroupmemberrole.name + ( $ii.smallgroup != null ? ' at ' + $ii.smallgroup.name : '' );
				});
				this.userfamily.user2.ministrymembers.forEach(($ii) => {
					if ($ii.ministrymemberrole != null
						&& $ii.ministry != null) {
						summary += summary === '' ? '' : '<br>';
						summary += $ii.ministrymemberrole.name + ' at ' + $ii.ministry.name;
					}
				});
				Object.assign(this.userfamily.user2, {
					roleSummary: summary,
				});
			}

			let temp;
			this.datas = [];
			this.userfamily.userfamilychilds.forEach(($ii) => {
				let fullname = '';
				if ($ii.user != null) {
					fullname += $ii.user.fullname;
				} else {
					fullname += $ii.name;
				}
				let gender = '';
				if ($ii.user != null) {
					gender += $ii.user.gender;
				} else {
					gender += $ii.gender;
				}
				let birthdate = '';
				if ($ii.user != null) {
					birthdate = $ii.user.birthdate;
				} else {
					birthdate = $ii.birthday;
				}
				let churchage = '';
				if ($ii.user != null) {
					if ($ii.user.churchagegrade != null)
						churchage = $ii.user.churchagegrade.churchage.name + ' - ' + $ii.user.churchagegrade.name;
				} else {
					if ($ii.churchagegrade != null)
						churchage = $ii.churchagegrade.churchage.name + ' - ' + $ii.churchagegrade.name;
				}
				temp = {
					id: $ii.id,
					childname: fullname,
					gender: gender,
					birthdate: this.helper.makeDate(birthdate),
					age: this.helper.dateDiffInString(new Date(birthdate)),
					churchage: churchage,
					created_at: $ii.created_at,
				};
				this.datas.push(temp);
			});

			this.navigations = {
			};

			this.isloading = false;
		}, (error: any) => {
			console.log(error.message);
			this.isloading = false;
		});
	}

}

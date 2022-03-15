import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from './../../../http.service';
import { HelperService } from './../../../helper.service';
import { UserlistroletableComponent } from './../../../components/userlistroletable/userlistroletable.component';
import { ListroleaddmodalComponent } from './listroleaddmodal/listroleaddmodal.component';
import swal from 'sweetalert2';

@Component({
	selector: 'app-userlistrole',
	templateUrl: './userlistrole.component.html',
	styleUrls: ['./userlistrole.component.scss']
})
export class UserlistroleComponent implements OnInit {

	@ViewChild('userlistrole', { static: false }) private userlistrole: UserlistroletableComponent;
	@ViewChild('addmodal', { static: false }) public addmodal: ListroleaddmodalComponent;

	public keys: any;
	public datas: any;
	public totalroles: number;
	public isloading: boolean;
	public sortkey: number;
	public keyword: string;
	public navigations: any;
	public page: number;

	constructor(
		private http: HttpService,
		private helper: HelperService,
	) { 
		this.keyword = null;
		this.isloading = false;
		this.sortkey = 1; // index 0 = 1
		this.page = 1;
		this.keys = [
			{
				label: '#',
				value: 'id',
				showtype: 'number',
				minwidth: false,
				priority: 0,
				opensort: false,
				sortcolumn: 'id',
				sortorder: 'ASC'
			},
			{
				label: 'Fullname',
				value: 'name',
				showtype: 'text',
				minwidth: false,
				priority: 0,
				opensort: true,
				sortcolumn: 'fullname',
				sortorder: 'ASC'
			}
		];
	}

	ngOnInit(): void {
		this.getRole();
	}

	public getRole(): void{
		const params = {
			applicationId: 1,
		};
		this.isloading = true;
		this.http.sendGetRequest2('role/all', params).subscribe((response: any) => {
			if(response.api_status){
				this.totalroles = response.data.roles.length;
				response.data.roles.forEach((role: any) => {
					this.keys.push({
						label: role.name,
						value: `checkbox-${role.id + 1}`,
						roleid: role.id,
						showtype: 'role',
						align: 'center',
						minwidth: true,
						priority: 0,
					})
				});

				// kalo uda ke isi baru boleh panggil ticketdata
				this.getData(1);
			}
		})
	}

	openAddModal(){
		this.addmodal.show(this.datas);
	}

	public searchData(keyword: string): void {
		this.keyword = keyword;

		this.getData(1);
	}

	public sortDataBy(column: string): void {
		this.keys.forEach(($ii, $i) => {
			if ($ii.sortcolumn != null) {
				if ($ii.sortcolumn === column) {
					// kalo sama baru di cek
					if ($ii.sortorder === ''
						|| $ii.sortorder === 'DESC') {
						$ii.sortorder = 'ASC';
					} else {
						$ii.sortorder = 'DESC';
					}
					this.sortkey = $i; // save indexnya
				}
			}
		});

		// bersihin data sort selain index sortkey
		this.keys.forEach(($ii, $i) => {
			if ($i !== this.sortkey) {
				$ii.sortorder = '';
			}
		});

		this.getData(1);
	}

	public userroleChecklist(data: any): void {
		this.http.sendPostRequest2('userrole/toggle', {
			id: data.id,
			userId: data.userId,
			roleId: data.roleId
		}).subscribe((response: any) => {
			if (response.api_status) {
				let type = '';
				if (data.id == null) type = 'insert';
				else type = 'delete';

				if (response.data.createdData != null) {
					data.id = response.data.createdData.id // userrole_id
					this.userlistrole.doneToggle(data.id, data.userId, data.roleId, type);
				} else if (response.data.deletedData === true) {
					this.userlistrole.doneToggle(data.id, data.userId, data.roleId, type);
				} else {
					swal.fire({
						title: 'Error 200',
						text: "Failed to update",
						icon: 'warning',
						confirmButtonText: 'OK'
					});
				}
			}
		});
	}

	public addNewUser(data: {id: number, name: string}): void{
		let temp = {
			id: data.id,
			name: data.name,
		};

		for (let r = 0; r < this.totalroles; r++){
			temp = {
				...temp,
				[`checkbox-${this.keys[2+r].roleid + 1}`]: {
					id: null,
					status: false,
					loading: false,
					userId: data.id,
					roleId: this.keys[2+r].roleid
				}
			};
		}

		this.datas.push(temp);
	}

	public getData(pageNum: number): void {
		this.page = pageNum;

		const param = {
			applicationId: 1,
			sortBy: this.sortkey && this.keys[this.sortkey].sortcolumn || '',
			sortDirection: this.sortkey && this.keys[this.sortkey].sortorder || '',
			name: this.keyword || ''
		};

		this.isloading = true;
		this.http.sendGetRequest2('user/userrole/all', param).subscribe((response: any) => {
			if (response.api_status) {

				const result = response.data.users;
				this.datas = [];
				this.datas = result.map(data => {
					let temp = {
						id: data.id,
						name: data.fullname,
					};

					// loopingnya bukan sesuai userrole lengthnya, tapi sesuai 
					for (let r = 0; r < this.totalroles; r++){
						let found = null;
						for (let i = 0; i < data.userroles.length; i++) {
							// di carinya mulai index ke 2
							// soalnya index ke 0 dan 1 itu data usernya (id dan name)
							if(data.userroles[i].role_id === this.keys[2+r].roleid){
								found = data.userroles[i];
							}
						}

						// kalo ketemu di masukin status true,
						// kalo ga ketemu statusnya false,
						if(found != null) {
							temp = {
								...temp,
								[`checkbox-${this.keys[2+r].roleid + 1}`]: {
									id: found.id,
									status: true,
									loading: false,
									userId: data.id,
									roleId: this.keys[2+r].roleid
								}
							};
						} else {
							// kalo ga nemu id = null
							temp = {
								...temp,
								[`checkbox-${this.keys[2+r].roleid + 1}`]: {
									id: null,
									status: false,
									loading: false,
									userId: data.id,
									roleId: this.keys[2+r].roleid
								}
							};
						}
					}

					return temp;
				});

				console.log(this.datas);

				this.navigations = {
					/*from: response.data.users.from,
					to: response.data.users.to,
					total: response.data.users.total,
					last_page: response.data.users.last_page,
					per_page: response.data.users.per_page,
					current_page: response.data.users.current_page,*/
					search_by: 'name'
				};

				/*this.listtableticket.generateNavigationList(this.navigationtickets.last_page, this.navigationtickets.current_page);*/
			} else {
				swal.fire({
					title: 'Error',
					text: response.message,
					icon: 'warning',
					confirmButtonText: 'OK'
				});
			}
			this.isloading = false; // kepake di listtable
		}, (error: any) => {
			swal.fire({
				title: 'Error ' + error.status,
				html: this.helper.changeEOLToBr(error.error.message),
				icon: 'warning',
				confirmButtonText: 'OK'
			});
			this.isloading = false; // kepake di listtable
		});
	}

}

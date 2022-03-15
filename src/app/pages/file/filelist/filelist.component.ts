import { Component, OnInit, ViewChild } from '@angular/core';
import swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { ListfiletableComponent } from './../../../components/listfiletable/listfiletable.component';
import { HttpService } from './../../../http.service';
import { GlobalService } from './../../../global.service';
import { HelperService } from './../../../helper.service';

@Component({
	selector: 'app-filelist',
	templateUrl: './filelist.component.html',
	styleUrls: ['./filelist.component.scss']
})
export class FilelistComponent implements OnInit {
	@ViewChild(ListfiletableComponent) listtable: ListfiletableComponent;
	public datas;
	public keys;
	public navigations;
	public page;
	public filterOptions;
	public inputOptions;
	public multipleSelectOptions;
	public startat;
	public endat;
	public keyword: string;
	public sortkey: number;
	public isloading: boolean;
	public filegroup: string;
	public documentGroup;
	public smallgroupmemberroles;
	public ministrymemberroles;
	public documentgroups;
	public smallgroupmemberroleFiltered;
	public ministrymemberroleFiltered;
	constructor(
		private http: HttpService,
		private global: GlobalService,
		private helper: HelperService,
		private activatedRoute: ActivatedRoute,
	) {	
		if(this.activatedRoute.snapshot.paramMap.get('filegroup') != null)
			this.filegroup = this.activatedRoute.snapshot.paramMap.get('filegroup').toLowerCase();
		else{
			this.filegroup = null;
		}
		this.keyword = null;
		this.sortkey = 0; // index 0 = 1
		this.isloading = false; // kepake di listtable
		this.startat = '';
		this.endat = '';
		this.documentGroup = null;
		this.ministrymemberroles = [];
		this.smallgroupmemberroles = [];
		this.documentgroups = [];
		this.smallgroupmemberroleFiltered = [];
		this.ministrymemberroleFiltered = [];
		// showtype:
		// number, text, datetime,
		this.keys = [
			{
				label: '#', // NAMA Header Column (muncul)
				value: 'id', // [key] name
				showtype: 'number', // show type
				minwidth: false, // Press width, jadi 1%
				priority: 0, // 0 tidak hilang, dst..
				opensort: true, // bisa di sort
				sortcolumn: 'id', // Sort column [key]
				sortorder: 'DESC' // Sort order pertama
			},
			{
				label: 'File / Folder Name', // NAMA Header Column (muncul)
				value: 'name', // [key] name
				showtype: 'editable', // show type
				minwidth: false, // Press width, jadi 1%
				priority: 1, // 0 tidak hilang, dst..
				opensort: true, // bisa di sort
				sortcolumn: 'name', // Sort column [key]
				sortorder: '' // Sort order pertama
			},
			{
				label: 'Size (KB)',
				value: 'size',
				showtype: 'number',
				minwidth: false,
				priority: 2,
				opensort: true,
				sortcolumn: 'size',
				sortorder: '',
				align: 'center'

			},
			{
				label: 'Uploaded on',
				value: 'created_at',
				showtype: 'datetime',
				minwidth: false,
				priority: 3,
				opensort: true,
				sortcolumn: 'created_at',
				sortorder: '',
				align: 'center'
			},
			{
				label: 'Last Modified',
				value: 'updated_at',
				showtype: 'datetime',
				minwidth: false,
				priority: 4,
				opensort: true,
				sortcolumn: 'updated_at',
				sortorder: '',
				align: 'center'
			},
			{
				label: 'Download',
				value: 'url',
				showtype: 'downloadbutton',
				minwidth: false,
				priority: 5,
				opensort: false,	
				align: 'center'		
			}

		];
		this.initModal();
	}

	ngOnInit(): void {
		this.getData(1);
	}

	public searchData(keyword: string): void {
		this.keyword = keyword;

		this.page = 1;
		this.getData(this.page);
	}

	public sortDataBy(column: string): void {
		const self = this;
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
					self.sortkey = $i; // save indexnya
				}
			}
		});

		// bersihin data sort selain index sortkey
		this.keys.forEach(($ii, $i) => {
			if ($i !== self.sortkey) {
				$ii.sortorder = '';
			}
		});

		this.getData(this.page);
	}


	public doAPI(data: any): void {
		const self = this;
		const apiurl = data.apiurl;
		const apimethod = data.apimethod;
		const apiparams = data.apiparams;
		self.isloading = true;
		if (apimethod === 'GET') {
			this.http.sendGetRequest2(apiurl, apiparams).subscribe((response: any) => {
				if (response.api_status) {
					if(response.data.path){
						const link = document.createElement('a');
						link.href = response.data.path;
						link.download = response.data.path;
						document.body.appendChild(link);
						link.click();
						document.body.removeChild(link);
					}
				} else {
					swal.fire({
						title: 'Error',
						text: response.message,
						icon: 'warning',
						confirmButtonText: 'OK'
					});
				}
				self.getData(self.page);
				self.isloading = false;
			});
		} else if (apimethod === 'POST') {
			this.http.sendPostRequest2(apiurl, apiparams).subscribe(() => {
				self.getData(self.page);
			});
		}
	}

	public getData(pageNumber): void {
		const self = this;
		this.page = pageNumber;
		if (typeof pageNumber === 'string') {
			this.page = parseInt(pageNumber, 10);
		}
		const param = {
			type: this.filegroup == 'ministry' || this.filegroup == 'smallgroup' ? this.filegroup : '',
			page: this.page,
			paginate: this.global.defaultpaginate,
			sortBy: this.keys[this.sortkey].sortcolumn,
			sortDir: this.keys[this.sortkey].sortorder,
			searchKeyword: this.keyword != null ? ( this.keyword.length < 3 ? '' : this.keyword ) : '',
			documentgroup_id: this.documentGroup != null ? this.documentGroup : '',
			ministrymemberrole_id: this.ministrymemberroleFiltered.length > 0 ? this.ministrymemberroleFiltered.join(',') : '',
			smallgroupmemberrole_id: this.smallgroupmemberroleFiltered.length > 0 ? this.smallgroupmemberroleFiltered.join(',') : '',
			// untuk send null, kirim string kosong
		};

		
		this.isloading = true; // kepake di listtable
		this.http.sendGetRequest2('document/all-list', param).subscribe((response: any) => {
			if (response.api_status) {
				const datas = response.data.document_list.data;
				let temp;
				self.datas = [];
				if(self.documentGroup != null){
					temp = {
						id: null,
						name: '...',
						type: 'folder',
						isEditable: false
					}
					self.datas.push(temp);
				}
				datas.forEach(($ii) => {
					temp = {
						id: $ii.id,
						name: $ii.name,
						size: $ii.size,
						type: $ii.type,
						created_at: $ii.created_at,
						updated_at: $ii.updated_at,
						documentgroup_id: $ii.type == 'file' ? $ii.documentgroup_id : null,
						url: $ii.isavailable == 1 ? $ii.url : null,
						actions: [
							{
								label: 'Delete',
								type: 'danger',
								apimethod: 'POST',
								apiurl: 'document/action',
								confirmButtonText: 'Delete',
								apiparams: {
									id: $ii.type == 'file' ? $ii.id : '',
									groupId: $ii.type == 'folder' ? $ii.id : '',
									type: self.helper.toTitleCase($ii.type),
									action: 'Delete'
								}
							},
						],
						isOpened: false,
						isEditing: false,
						isEditable: true,
						isAvailable: $ii.isavailable,
						tooltipMessage: $ii.isavailable == 0 ? 'File is missing.' : null
					};
					if($ii.type == 'file'){
						$ii.ministryfiles.forEach(($jj) => {
							temp['ministrymemberrole_'+$jj.ministrymemberrole_id] = true;
						});
						$ii.smallgroupfiles.forEach(($kk) => {
							temp['smallgroupmemberrole_'+$kk.smallgroupmemberrole_id] = true;
						});
					}
					self.datas.push(temp);
				});


				self.navigations = {
					from: response.data.document_list.from,
					to: response.data.document_list.to,
					total: response.data.document_list.total,
					last_page: response.data.document_list.last_page,
					per_page: response.data.document_list.per_page,
					current_page: response.data.document_list.current_page,
					search_by: 'Search...'
				};

				self.listtable.generateNavigationList(self.navigations.last_page, self.navigations.current_page);
			} else {
				swal.fire({
					title: 'Error',
					text: response.message,
					icon: 'warning',
					confirmButtonText: 'OK',
				}).then(() => {
					// NOTHING
				});
			}
			self.isloading = false; // kepake di listtable
		}, (error: any) => {
			swal.fire({
				title: 'Error 505',
				text: error.message,
				icon: 'warning',
				confirmButtonText: 'OK',
			}).then(() => {
				// NOTHING
			});
			self.isloading = false; // kepake di listtable
		});
	}

	public rowOpened($data){
		if($data.type == 'file')
			$data.isOpened = !$data.isOpened;
		else{
			this.documentGroup = $data.id;
			this.keyword = null;
			this.listtable.closeModals();
			this.getData(1);
		}
	}

	public rename($data){
		let self = this;
		const param = {
			action: 'Rename',
			type: this.helper.toTitleCase($data.type),
			name: $data.name,
			id: $data.type == 'file' ? $data.id : '',
			groupId: $data.type == 'folder' ? $data.id : '',

			// untuk send null, kirim string kosong
		};
		this.http.sendPostRequest2('document/action', param).subscribe((response: any) => {
			if (response.api_status) {
	
			} else {
				swal.fire({
					title: 'Error',
					text: response.message,
					icon: 'warning',
					confirmButtonText: 'OK',
				}).then(() => {
					// NOTHING
				});
			}
			self.getData(self.page);
		}, (error: any) => {
			swal.fire({
				title: 'Error 505',
				text: error.message,
				icon: 'warning',
				confirmButtonText: 'OK',
			}).then(() => {
				// NOTHING
			});
		});
	}

	public submit($data){
		const self = this;
		let param = {};
		if($data.modalIndex == 0){
			if(($data.file.size/1024)/1024 > 20){
				swal.fire({
					title: 'Error',
					text: 'File cannot exceed 20 MB!',
					icon: 'warning',
					confirmButtonText: 'OK',
				}).then(() => {
					// NOTHING
				});
				this.listtable.input.isLoadingModal = false;
				return;
			}
			const formData = new FormData();
			formData.append('action', 'Upload');
			formData.append('type', 'File');
			formData.append('name', $data.name);
			formData.append('file', $data.file);
			if($data.documentgroup_id != null)
				formData.append('groupId', $data.documentgroup_id);
			let ministrymemberroleIds = [];
			this.ministrymemberroles.forEach(($ii) => {
				if($data['ministrymemberrole_'+$ii.id])
					ministrymemberroleIds.push($ii.id);
			});
			formData.append('ministryMemberRoleId', ministrymemberroleIds.join(','));
			let smallgroupmemberroleIds = [];
			this.smallgroupmemberroles.forEach(($ii) => {
				if($data['smallgroupmemberrole_'+$ii.id])
					smallgroupmemberroleIds.push($ii.id);
			});
			formData.append('smallgroupMemberRoleId', smallgroupmemberroleIds.join(','));
			this.http.sendPostUpload('document/action', formData).subscribe((response: any) => {
				if (response.api_status) {
				} else {
					swal.fire({
						title: 'Error',
						text: response.message,
						icon: 'warning',
						confirmButtonText: 'OK',
					}).then(() => {
						// NOTHING
					});
				}
				this.listtable.closeModals();
				self.getData(self.page);
			}, (error: any) => {
				swal.fire({
					title: 'Error 505',
					text: error.message,
					icon: 'warning',
					confirmButtonText: 'OK',
				}).then(() => {
					// NOTHING
				});
			});
		}
		else if($data.modalIndex == 1){
			param = {
				action: 'Create',
				type: 'Folder',
				name: $data.name

				// untuk send null, kirim string kosong
			};
			this.http.sendPostRequest2('document/action', param).subscribe((response: any) => {
				if (response.api_status) {
				} else {
					swal.fire({
						title: 'Error',
						text: response.message,
						icon: 'warning',
						confirmButtonText: 'OK',
					}).then(() => {
						// NOTHING
					});
				}
				this.listtable.closeModals();
				self.initModal();
				self.getData(self.page);
			}, (error: any) => {
				swal.fire({
					title: 'Error 505',
					text: error.message,
					icon: 'warning',
					confirmButtonText: 'OK',
				}).then(() => {
					// NOTHING
				});
			});
		}
	}

	public getDocumentRoles(){
		const self = this;
		self.isloading = true;
		this.http.sendGetRequest2('document/all-role').subscribe((response: any) => {
			if (response.api_status) {
				let temp = {
					type: 'no-input',
					label: 'Visible To',
				}
				self.inputOptions.modalContents[0].inputs.push(temp);
				if(self.filegroup == 'ministry'){
					self.ministrymemberroles = response.data.ministrymemberroles;
				}
				else if(self.filegroup == 'smallgroup'){
					self.smallgroupmemberroles = response.data.smallgroupmemberroles;
				}
				else {
					self.ministrymemberroles = response.data.ministrymemberroles;
					self.smallgroupmemberroles = response.data.smallgroupmemberroles;
				}
				self.ministrymemberroles.forEach(($ii) => {
					let temp = {
						type: 'checkbox',
						label: $ii.name,
						value: 'ministrymemberrole_'+$ii.id,
						perline: 2
					};
					self.inputOptions.modalContents[0].inputs.push(temp);
					self.multipleSelectOptions.modalContents[0].inputs.push(temp);
					self.filterOptions.modalContents[0].inputs.push(temp);
				});
				self.smallgroupmemberroles.forEach(($ii) => {
					let temp = {
						type: 'checkbox',
						label: $ii.name,
						value: 'smallgroupmemberrole_'+$ii.id,
						perline: 2
					};
					self.inputOptions.modalContents[0].inputs.push(temp);
					self.multipleSelectOptions.modalContents[0].inputs.push(temp);
					self.filterOptions.modalContents[0].inputs.push(temp);
				});
			} else {
				swal.fire({
					title: 'Error',
					text: response.message,
					icon: 'warning',
					confirmButtonText: 'OK'
				});
			}
			self.isloading = false;
		});

	}

	public getDocumentGroups(){
		const self = this;
		self.isloading = true;
		this.http.sendGetRequest2('documentgroup/get').subscribe((response: any) => {
			if (response.api_status) {
				self.documentgroups = response.data.documentgroups;
				let temp = {
					type: 'searchsingle',
					label: 'Folder',
					options: self.documentgroups,
					value: 'documentgroup_id'
				}
				self.inputOptions.modalContents[0].inputs.push(temp);
				self.multipleSelectOptions.modalContents[1].inputs.push(temp);
				self.getDocumentRoles();
			} else {
				swal.fire({
					title: 'Error',
					text: response.message,
					icon: 'warning',
					confirmButtonText: 'OK'
				});
			}
			self.isloading = false;
		});

	}

	public initModal(){
		this.inputOptions = {
			dropdownButtonText: "Add",
			modalContents: [
				{
					name: 'Add File',
					inputs: [
						{
							type: 'text',
							label: 'File Name',
							value: 'name',
						},
						{
							type: 'file',
							label: 'Upload File (Max. 20 MB)',
							value: 'file',
						},
					],
					submitText: 'Submit'
				},
				{
					name: 'Add Folder',
					inputs: [
						{
							type: 'text',
							label: 'Folder Name',
							value: 'name',
						},
					],
					submitText: 'Submit'
				}
			],
		};

		this.multipleSelectOptions = {
			dropdownButtonText: "Selected Files",
			modalContents: [
				{
					name: 'Change Access',
					inputs: [],
					submitText: 'Change Access'
				},
				{
					name: 'Move to Folder',
					inputs: [],
					submitText: 'Move'
				}
			],
		};

		this.filterOptions = {
			dropdownButtonText: "Filter",
			modalContents: [
				{
					name: 'By Access',
					inputs: [],
					submitText: 'Filter'
				},
			],
		};
		this.getDocumentGroups();
	}

	public moveFolder($data): void {
		let self = this;
		const param = {
			action: 'Move',
			type: this.helper.toTitleCase($data.type),
			id: $data.id,
			groupId: $data.documentgroup_id,

			// untuk send null, kirim string kosong
		};
		this.http.sendPostRequest2('document/action', param).subscribe((response: any) => {
			if (response.api_status) {
	
			} else {
				swal.fire({
					title: 'Error',
					text: response.message,
					icon: 'warning',
					confirmButtonText: 'OK',
				}).then(() => {
					// NOTHING
				});
			}
			self.getData(self.page);
		}, (error: any) => {
			swal.fire({
				title: 'Error 505',
				text: error.message,
				icon: 'warning',
				confirmButtonText: 'OK',
			}).then(() => {
				// NOTHING
			});
		});
	}

	public updateRoles($data): void {
		let self = this;
		let param = {
			action: 'Change Role',
			type: this.helper.toTitleCase($data.type),
			id: $data.id,
		};
		let ministrymemberroleIds = [];
		this.ministrymemberroles.forEach(($ii) => {
			if($data['ministrymemberrole_'+$ii.id])
				ministrymemberroleIds.push($ii.id);
		});
		if(this.filegroup != 'smallgroup')
			param['ministryMemberRoleId'] = ministrymemberroleIds.join(',');
		let smallgroupmemberroleIds = [];
		this.smallgroupmemberroles.forEach(($ii) => {
			if($data['smallgroupmemberrole_'+$ii.id])
				smallgroupmemberroleIds.push($ii.id);
		});
		if(this.filegroup != 'ministry')
			param['smallgroupMemberRoleId'] = smallgroupmemberroleIds.join(',');
		this.http.sendPostRequest2('document/action', param).subscribe((response: any) => {
			if (response.api_status) {
	
			} else {
				swal.fire({
					title: 'Error',
					text: response.message,
					icon: 'warning',
					confirmButtonText: 'OK',
				}).then(() => {
					// NOTHING
				});
			}
			self.getData(self.page);
		}, (error: any) => {
			swal.fire({
				title: 'Error 505',
				text: error.message,
				icon: 'warning',
				confirmButtonText: 'OK',
			}).then(() => {
				// NOTHING
			});
		});
	}

	public submitMultipleUpdate($data): void {
		let self = this;
		let ids = [];
		this.datas.forEach(($ii) => {
			if($ii.selected && $ii.type == 'file')
				ids.push($ii.id);
		});
		let param = {
			id: ids.join(","),
			type: 'File'
		}
		if ($data.modalIndex == 0){
			param['action'] = 'Change Role';
			let ministrymemberroleIds = [];
			this.ministrymemberroles.forEach(($ii) => {
				if($data['ministrymemberrole_'+$ii.id])
					ministrymemberroleIds.push($ii.id);
			});
			if(this.filegroup != 'smallgroup')
				param['ministryMemberRoleId'] = ministrymemberroleIds.join(',');
			let smallgroupmemberroleIds = [];
			this.smallgroupmemberroles.forEach(($ii) => {
				if($data['smallgroupmemberrole_'+$ii.id])
					smallgroupmemberroleIds.push($ii.id);
			});
			if(this.filegroup != 'ministry')
				param['smallgroupMemberRoleId'] = smallgroupmemberroleIds.join(',');
		}else if ($data.modalIndex == 1){
			param['action'] = 'Move';
			param['groupId'] = $data.documentgroup_id;
		}
		this.http.sendPostRequest2('document/action', param).subscribe((response: any) => {
			if (response.api_status) {
	
			} else {
				swal.fire({
					title: 'Error',
					text: response.message,
					icon: 'warning',
					confirmButtonText: 'OK',
				}).then(() => {
					// NOTHING
				});
			}
			self.listtable.closeModals();
			self.getData(self.page);
		}, (error: any) => {
			swal.fire({
				title: 'Error 505',
				text: error.message,
				icon: 'warning',
				confirmButtonText: 'OK',
			}).then(() => {
				// NOTHING
			});
		});
	}

	public deleteSelectedItems(): void {
		let self = this;
		swal.fire({
			title: 'Are you sure?',
			text: 'Are you sure you want to delete these files / folders?',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#d33',
			confirmButtonText: 'Delete'
		}).then((result) => {
			if (result.isConfirmed) {
				self.doDeleteItems();
			}
		});
	}

	public doDeleteItems(): void {
		let self = this;
		let fileIds = [];
		let folderIds = [];
		this.datas.forEach(($ii) => {
			if($ii.selected && $ii.type == 'file'){
				fileIds.push($ii.id);
			}
			else if ($ii.selected && $ii.type == 'folder' && $ii.id != null){
				folderIds.push($ii.id);
			}
		});
		if(fileIds.length > 0){
			let param = {
				action: "Delete",
				type: "File",
				id: fileIds.join(",")
			}
			this.http.sendPostRequest2('document/action', param).subscribe((response: any) => {
				if (response.api_status) {
					
				} else {
					swal.fire({
						title: 'Error',
						text: response.message,
						icon: 'warning',
						confirmButtonText: 'OK',
					}).then(() => {
						// NOTHING
					});
				}
				self.getData(self.page);
			}, (error: any) => {
				swal.fire({
					title: 'Error 505',
					text: error.message,
					icon: 'warning',
					confirmButtonText: 'OK',
				}).then(() => {
					// NOTHING
				});
			});
		}
		if(folderIds.length > 0){
			let param = {
				action: "Delete",
				type: "Folder",
				groupId: folderIds.join(",")
			}
			this.http.sendPostRequest2('document/action', param).subscribe((response: any) => {
				if (response.api_status) {
					
				} else {
					swal.fire({
						title: 'Error',
						text: response.message,
						icon: 'warning',
						confirmButtonText: 'OK',
					}).then(() => {
						// NOTHING
					});
				}
				self.getData(self.page);
			}, (error: any) => {
				swal.fire({
					title: 'Error 505',
					text: error.message,
					icon: 'warning',
					confirmButtonText: 'OK',
				}).then(() => {
					// NOTHING
				});
			});
		}
	}

	public submitFilter($data): void {
		let self = this;
		if(this.filegroup != 'smallgroup'){
			this.ministrymemberroleFiltered = [];
			this.ministrymemberroles.forEach(($ii) => {
				if($data['ministrymemberrole_'+$ii.id])
					self.ministrymemberroleFiltered.push($ii.id);
			});
		}
		if(this.filegroup != 'ministry'){
			this.smallgroupmemberroleFiltered = [];
			this.smallgroupmemberroles.forEach(($ii) => {
				if($data['smallgroupmemberrole_'+$ii.id])
					self.smallgroupmemberroleFiltered.push($ii.id);
			});
		}
		this.listtable.closeModals();
		this.getData(1);
	}
}

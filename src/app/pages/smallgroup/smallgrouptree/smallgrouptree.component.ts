import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from './../../../http.service';
import { HelperService } from './../../../helper.service';
import swal from 'sweetalert2';

@Component({
	selector: 'app-smallgrouptree',
	templateUrl: './smallgrouptree.component.html',
	styleUrls: ['./smallgrouptree.component.scss']
})
export class SmallgrouptreeComponent implements OnInit {

	public smallgroupHighestLevel: number;
	public selectedIdx: number;
	public smallgroupmembers: any;
	public selectedItem: any;
	public church_id: any;
	public tempSgMember: any;
	public isLoading: boolean;
	public isLoadingLevel: boolean;

	constructor(
		public activatedRoute: ActivatedRoute,
		public helper: HelperService,
		public router: Router,
		public http: HttpService
	) {}

	ngOnInit(): void {
		this.isLoadingLevel = false;
		this.isLoading = false;
		this.getSmallgroupTree();
	}

	public getSmallgroupTree(): void {
		const self = this;
		this.isLoading = true;
		this.http.sendGetRequest2('smallgroupmember/all/highest').subscribe((response: any) => {
			if (response.api_status) {
				self.smallgroupmembers = response.data;
				self.smallgroupHighestLevel = self.smallgroupmembers[0].smallgroupmemberrole.level;
				self.smallgroupmembers = self.smallgroupmembers.map((item, index) => {
					return {
						...item,
						depth: 1,
						parentIdx: [index],
						isOpen: false,
						everOpen: false
					};
				});
			} else {
				swal.fire({
					title: 'Error',
					text: response.message,
					icon: 'warning',
					confirmButtonText: 'OK'
				});
			}
			self.isLoading = false;
		}, (error: any) => {
			swal.fire({
				title: 'Error ' + error.status,
				html: this.helper.changeEOLToBr(error.error.message),
				icon: 'warning',
				confirmButtonText: 'OK'
			});
			self.isLoading = false;
		});
	}

	public searchSmallgroupmembers(smallgroupmembers, smallgroupmemberId, data): void {
		// search smallgroupmember dengan id = smallgroupmemberId
		for (let i = 0; i < smallgroupmembers.length; i++) {
			if (smallgroupmembers[i].id == smallgroupmemberId) {
				smallgroupmembers[i].smallgroupmembers = data.smallgroupmembers.map((value) => {
					return {
						...value,
						isOpen: false,
						everOpen: false,
					};
				});
			} else {
				if (smallgroupmembers[i].smallgroupmembers != null) {
					// cek dulu dia ada smallgroupmembers ga
					this.searchSmallgroupmembers(smallgroupmembers[i].smallgroupmembers, smallgroupmemberId, data);
				}
			}
		}
	}

	public toggleTree(item, idx): void {
		// item yang di kirim hanya cloningan (passingnya by parameter, tapi sebelom di kirim sudah di clone dulu sama angularnya)
		// karena di clone di dalam ngTemplateOutlet
		// jadi kalo mau change item, harus search dari array this.smallgroupmembers
		this.selectedItem = item;
		this.selectedIdx = idx;
		item.isOpen = !item.isOpen;
		if (!item.everOpen && item.smallgroupmemberrole_id > 1) {
			this.isLoadingLevel = true;
			const param = {
				sgLeaderId: item.id
			};
			this.http.sendGetRequest2('smallgroupmember/get/by-leader', param).subscribe((response: any) => {
				if (response.api_status) {
					// untuk update smallgroupmembers
					// nested search, add untuk child's smallgroupmembers nya juga di dalam function
					// karena objectnya ga bisa di return
					this.searchSmallgroupmembers(this.smallgroupmembers, item.id, response.data);

					item.everOpen = true;
					this.isLoadingLevel = false;
				} else {
					swal.fire({
						title: 'Error',
						text: response.message,
						icon: 'warning',
						confirmButtonText: 'OK'
					});
				}
			}, (error: any) => {
				swal.fire({
					title: 'Error ' + error.status,
					html: this.helper.changeEOLToBr(error.error.message),
					icon: 'warning',
					confirmButtonText: 'OK'
				});
			});
		}
	}

	public promoteMember($smallgroupmember): void {
		const self = this;
		if ($smallgroupmember.user2_id != null) {
			swal.fire({
				title: 'Warning',
				text: 'Are you sure you want to promote ' + $smallgroupmember.user.fullname + ' & ' + $smallgroupmember.user2.fullname + '?',
				icon: 'warning',
				confirmButtonText: 'Yes',
				showCancelButton: true,
			}).then((result) => {
				if (result.isConfirmed)
					self.sendRequestPromoteMember($smallgroupmember);
			});
		} else {
			swal.fire({
				title: 'Warning',
				text: 'Are you sure you want to promote ' + $smallgroupmember.user.fullname + '?',
				icon: 'warning',
				confirmButtonText: 'Yes',
				showCancelButton: true,
			}).then((result) => {
				if (result.isConfirmed)
					self.sendRequestPromoteMember($smallgroupmember);
			});
		}
	}

	public sendRequestPromoteMember($smallgroupmember): void {
		const self = this;
		this.isLoading = true;
		const params = {
			action: 'Promote',
			promotedSmallgroupMemberId: $smallgroupmember.id
		};
		this.http.sendGetRequest2('smallgroupmember/role/action', params).subscribe((response: any) => {
			if (response.api_status) {
				self.ngOnInit();
			} else {
				swal.fire({
					title: 'Error',
					text: response.message,
					icon: 'warning',
					confirmButtonText: 'OK'
				});
				self.isLoading = false;
			}
		}, (error: any) => {
			swal.fire({
				title: 'Error ' + error.status,
				html: this.helper.changeEOLToBr(error.error.message),
				icon: 'warning',
				confirmButtonText: 'OK'
			});
			self.isLoading = false;
		});

	}
}

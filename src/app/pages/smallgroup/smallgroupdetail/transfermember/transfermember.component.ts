import { Component, Input, Output, OnInit, ViewChild, TemplateRef, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from './../../../../http.service';
import { faSpinner as fadSpinner } from '@fortawesome/pro-duotone-svg-icons';
import swal from 'sweetalert2';

@Component({
	selector: 'comp-transfermember',
	templateUrl: './transfermember.component.html',
	styleUrls: ['./transfermember.component.scss']
})
export class TransfermemberComponent implements OnInit {
	@ViewChild('transfermembermodal', { static: false }) private modal: TemplateRef<any>;
	@Input() isShowed: boolean;
	@Input() smallgroupLevel: number;
	@Input() dialogName;
	@Output() refreshData = new EventEmitter<any>();

	public maskSgNameByChurch;
	public fadSpinner = fadSpinner;
	public sgId: number;
	public selectedCampusId;
	public selectedMemberId;
	public selectedSgId;
	public memberList;
	public smallGroupList;
	public campusList;
	public isLoadingModal: boolean;
	public isLoadingSelectedSg: boolean;
	public isLoadingTransfer: boolean;

	constructor(
		private modalService: NgbModal,
		private http: HttpService,
		private router: Router,
		private activatedRoute: ActivatedRoute,
	) {
		this.maskSgNameByChurch = JSON.parse(localStorage.getItem('applicationfeatures')).filter(item => item.name === 'small-group')[0]?.applicationfeaturechurches[0]?.showname || 'small group';
		this.activatedRoute.queryParams.subscribe(params => {
			this.sgId = parseInt(params.id, 10);
		});

		if (this.sgId == null) {
			// redirect back to list
			this.router.navigateByUrl('admin/smallgroup/list');
		}
		this.selectedSgId = null;
		this.isLoadingSelectedSg = false;
		this.isShowed = false;
	}

	ngOnInit(): void {
		this.isLoadingSelectedSg = true;                     //<<<---using ()=> syntax
		this.getMember();
		this.getCampus();
	}

	public onChangeSelectedCampus(value: string): void {
		this.selectedCampusId = value;
		this.selectedSgId = null;
		this.isLoadingSelectedSg = true;
		this.getSmallGroup();
	}

	public transferMember(): void {
		this.isLoadingTransfer = true;
		const param = {
			memberId: this.selectedMemberId,
			smallgroupId: this.selectedSgId ? this.selectedSgId : '',
		};

		this.http.sendPostRequest2('smallgroupmember/transfer', param).subscribe((response: any) => {
			if (response.api_status) {
				this.modalService.dismissAll();
				swal.fire({
					title: 'Success',
					text: 'Success transfer member.',
					icon: 'success',
					confirmButtonText: 'Close',
				}).then(() => {
					this.refreshData.emit();
				});
				this.selectedCampusId = null;
				this.selectedSgId = null;
				this.selectedMemberId = null;
				this.isLoadingTransfer = false;

			} else {
				this.modalService.dismissAll();
				swal.fire({
					title: 'Failed',
					text: response.message,
					icon: 'warning',
					confirmButtonText: 'OK',
				});
				this.isLoadingTransfer = false;
			}
		}, (error: any) => {
			this.modalService.dismissAll();
			swal.fire({
				title: 'Error',
				text: error.message,
				icon: 'warning',
				confirmButtonText: 'OK',
			});
			this.isLoadingTransfer = false;
		});
	}

	public getMember():void {
		this.http.sendGetRequest2('smallgroupmember/all?smallgroupId=' + this.sgId).subscribe((response: any) => {
			if (response.api_status) {
				this.memberList = response.data.smallgroupmembers.map(item => {
					return {
						name: item.user2 != null ? item.user.fullname + " & " + item.user2.fullname : item.user.fullname,
						id: item.id,
					};
				});
			}
		}, (error: any) => {
			swal.fire({
				title: 'Error',
				text: error.message,
				icon: 'warning',
				confirmButtonText: 'OK',
			});
		});
	}

	public getCampus(): void {
		const noCampus = {
			id: 'noCampus',
			name: 'NO CAMPUS'
		};

		this.http.sendGetRequest2('church/all-campus').subscribe((response: any) => {
			if (response.api_status) {
				if(response.data.campus_list != null){
					const setCampusId = response.data.campus_list.map(item => {
						return {
							id: item.id,
							name: item.name
						};
					});
					this.campusList = [...setCampusId, noCampus];
				}
			}

		}, (error: any) => {
			swal.fire({
				title: 'Error',
				text: error.message,
				icon: 'warning',
				confirmButtonText: 'OK',
			});
		});
	}

	public getSmallGroup(smallgroupLevel=null): void {
		if(smallgroupLevel != null)
			this.smallgroupLevel = smallgroupLevel;

		const param: any = {
			level: this.smallgroupLevel,
		}

		if(this.selectedCampusId !== 'noCampus' && this.selectedCampusId != null){
			param.campus = this.selectedCampusId;
		}

		this.http.sendGetRequest2('smallgroup/all/raw', param).subscribe((response: any) => {
			if (response.api_status) {
				this.smallGroupList = [];
				this.smallGroupList = response.data.smallgroup;
			}
			this.isLoadingSelectedSg = false;
		}, (error: any) => {
			swal.fire({
				title: 'Error',
				text: error.message,
				icon: 'warning',
				confirmButtonText: 'OK',
			});
		});
	}

	public showDialog(): void {
		this.open(this.modal);
	}

	public closeDialog(): void {
		this.isLoadingModal = false;
		this.modalService.dismissAll();
	}

	public open(content): void {
		if (!this.isShowed) {
			this.getMember();
			this.getCampus();
			this.modalService.open(content, {
				size: 'md',
				backdrop: 'static',
				ariaLabelledBy: 'modal-basic-title',
			}).result.then(() => {
				this.isShowed = false;
				// this.closeResult = `Closed with: ${result}`;
			}, () => {
				this.isShowed = false;
				// this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			});
		}
	}

}

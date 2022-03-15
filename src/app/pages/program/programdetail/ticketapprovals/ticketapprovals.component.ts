import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from './../../../../global.service'; 
import { HttpService } from './../../../../http.service';
import { HelperService } from './../../../../helper.service';
import swal from 'sweetalert2';
import { 
	faStop as fasStop,
	faPlay as fasPlay,
	faHourglassHalf as fasHourglassHalf,
	faCheckSquare as fasCheckSquare,
	faTimesSquare as fasTimesSquare,
	faTimesCircle as fasTimesCircle,
	faClock as fasClock,
	faExclamationCircle as fasExclamationCircle,
	faCloudDownload as fasCloudDownload,
	faCheckCircle as fasCheckCircle,
	faRedo as fasRedo,
	faMoneyBillWave as fasMoney,
	faQuestionCircle as fasQuestionCircle,
	faSearch as fasSearch
} from '@fortawesome/pro-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as $ from 'jquery';
@Component({
	selector: 'programdetail-ticketapprovals',
	templateUrl: './ticketapprovals.component.html',
	styleUrls: ['./ticketapprovals.component.scss']
})
export class TicketapprovalsComponent implements OnInit {
	@ViewChild('leaderapprovalsmodal', { static: false }) private modal: TemplateRef<any>;
	@ViewChild('helpmodal', {static: false}) private helpmodal: TemplateRef<any>;
	public fasSearch = fasSearch;
	public fasQuestionCircle = fasQuestionCircle;
	public fasClock = fasClock;
	public fasExclamationCircle = fasExclamationCircle;
	public fasCloudDownload = fasCloudDownload;
	public fasCheckCircle = fasCheckCircle;
	public fasTimesCircle = fasTimesCircle;
	public fasRedo = fasRedo;
	public fasMoney = fasMoney;
	public programId: number | null;
	public program: any;
	public programtickets: any;
	public page: number;
	public isLoading: boolean;
	public isFileLoading: boolean;
	public isModalShown: boolean;
	public isTicketsLoading: boolean;
	public programType: string;
	public selectedProgramticket: any;
	public programticketapprovaldocuments: any;
	public isReadyToApproveOnly: boolean;
	public selectedFile: any;
	public users: any;
	public navigations: any;
	public navigationLists: any;
	public ispageone: boolean = false;
	public ispageoneafter: boolean = false;
	public islastpage: boolean = false;
	public islastpagebefore: boolean = false;
	public currentPageIdx: number;
	public keyword: string;

	constructor(
		private activatedRoute: ActivatedRoute,
		private global: GlobalService,
		private http: HttpService,
		private helper: HelperService,
		private modalService: NgbModal,
	) { 
		this.programId = null;
		this.program = null;
		this.programtickets = null;
		this.page = 1;
		this.isLoading = true;
		this.activatedRoute.queryParams.subscribe(params => {
			this.programId = params.id;
		});
		this.programType = null;
		this.selectedProgramticket = null;
		this.programticketapprovaldocuments = null;
		this.users = [];
		this.isTicketsLoading = false;
		this.isModalShown = false;
		this.navigations = null;
		this.navigationLists = [];
		this.isReadyToApproveOnly = false;
		this.keyword = "";
	}

	ngOnInit(): void {
		this.getProgram();
	}

	public getProgram(){
		this.isLoading = true;
		const params = {
			id: this.programId,
		};
		this.http.sendGetRequest2('program/detail', params).subscribe((response: any) => {
			this.program = response.data.program;
			this.programType = this.program.programtype.type.toLowerCase();
			this.getTicketData();
			this.isLoading = false;
		}, (error: any) => {
			// error
			this.isLoading = false;
		});
	}

	public getTicketData(pageNumber:number = null): void {
		this.isTicketsLoading = true;
		this.isFileLoading = true;
		this.users = [];
		this.selectedFile = null;
		this.selectedProgramticket = null;
		this.programtickets = [];
		if(pageNumber == null){
			this.page = 1;
		}
		else if(pageNumber != null){
			this.page = pageNumber;
		}
		const param = {
			page: this.page,
			paginate: this.global.defaultpaginate,
			programId: this.programId,
			withapprovals: 1,
			isLeaderApproved: this.isReadyToApproveOnly ? 1 : 0,
			sortBy: 'id',
			sortDirection: 'ASC',
			name: this.keyword,
		};
		this.http.sendGetRequest2('programticket/all/filtered', param).subscribe((response: any) => {
			if (response.api_status) {
				this.programtickets = response.data.programtickets.data;
				this.programtickets.forEach(($ii)=>{
					$ii.isSelected = false;
					$ii.approvalStatus = 'unknown';
					let countReupload = 0;
					let countPendingLeader = 0;
					let countPendingAdmin = 0;
					$ii.programticketapprovals.forEach(($jj)=>{
						if($jj.status == 'Pending' && $jj.rolereviewer_id != null){
							countPendingAdmin += 1;
						} else if($jj.status == 'Pending' && $jj.smallgroupmemberreviewer_id != null){
							countPendingLeader += 1;
						} else if($jj.status == 'Reupload'){
							countReupload += 1;
						}
					});

					if(countPendingAdmin > 0){
						$ii.approvalStatus = 'pending admin';
					}

					if(countPendingLeader > 0){
						$ii.approvalStatus = 'pending leader';
					}

					if(countReupload > 0){
						$ii.approvalStatus = 'reupload';
					}

					if($ii.status == 'Approved'){
						$ii.approvalStatus = 'approved';
					}else if($ii.status == 'Rejected'){
						$ii.approvalStatus = 'rejected';
					}else if($ii.status == 'Pending' && $ii.statuspayment == 'Pending'){
						$ii.approvalStatus = 'pending payment';			
					}
				});
				this.navigations = {
					from: response.data.programtickets.from,
					to: response.data.programtickets.to,
					total: response.data.programtickets.total,
					last_page: response.data.programtickets.last_page,
					per_page: response.data.programtickets.per_page,
					current_page: response.data.programtickets.current_page,
					search_by: 'Owner name'
				};
				this.generateNavigationList(this.navigations.last_page, this.navigations.current_page);
			} else {
				swal.fire({
					title: 'Error',
					text: response.message,
					icon: 'warning',
					confirmButtonText: 'OK'
				});
			}
			this.isTicketsLoading = false;
			this.isFileLoading = false;
		}, (error: any) => {
			swal.fire({
				title: 'Error ' + error.status,
				html: this.helper.changeEOLToBr(error.error.message),
				icon: 'warning',
				confirmButtonText: 'OK'
			});
			this.isTicketsLoading = false;
			this.isFileLoading = false;
		});
	}

	public onSelectTicket($programticket): void {
		if(this.selectedProgramticket != $programticket){
			this.isFileLoading = true;
			this.users = [];
			this.selectedFile = null;
			this.programtickets.forEach(($ii)=>{
				$ii.isSelected = false;
			});
			$programticket.isSelected = true;
			this.selectedProgramticket = $programticket;
			const params = {
					programticket_id: $programticket.id,
				}
			this.http.sendGetRequest2('programticketapproval/get', params).subscribe((response: any) => {
				if(response.api_status){
					let countReupload = 0;
					let countPendingLeader = 0;
					let countPendingAdmin = 0;
					response.data.programticketapprovals.forEach(($ii, index)=> {
						let isFound = 0;
						if($ii.status == 'Pending' && $ii.rolereviewer_id != null){
							countPendingAdmin += 1;
						} else if($ii.status == 'Pending' && $ii.smallgroupmemberreviewer_id != null){
							countPendingLeader += 1;
						} else if($ii.status == 'Reupload'){
							countReupload += 1;
						}
						this.users.forEach(($jj) => {
							if($ii.user_id == $jj.id){
								isFound = 1;
								if($jj.leaderapproval == null && $ii.smallgroupmemberreviewer_id != null){
									$jj.leaderapproval = $ii;
								}else if($jj.adminapproval == null && $ii.rolereviewer_id != null){
									$jj.adminapproval = $ii;
								}
							}
						});
						if(isFound == 0){
							let temp = {
								id: $ii.user_id,
								label: $ii.user.fullname,
								leaderapproval: $ii.smallgroupmemberreviewer_id != null ? $ii : null,
								adminapproval: $ii.rolereviewer_id != null ? $ii : null,
								isSelected: this.users.length == 0 ? true : false,
								programticketapprovaldocuments: []
							};
							this.users.push(temp);
						}
					});

					if(countPendingAdmin > 0){
						this.selectedProgramticket.approvalStatus = 'pending admin';
					}

					if(countPendingLeader > 0){
						this.selectedProgramticket.approvalStatus = 'pending leader';
					}

					if(countReupload > 0){
						this.selectedProgramticket.approvalStatus = 'reupload';
					}

					if(this.selectedProgramticket.status == 'Approved'){
						this.selectedProgramticket.approvalStatus = 'approved';
					}else if(this.selectedProgramticket.status == 'Rejected'){
						this.selectedProgramticket.approvalStatus = 'rejected';
					}else if(this.selectedProgramticket.status == 'Pending' && this.selectedProgramticket.statuspayment == 'Pending'){
						this.selectedProgramticket.approvalStatus = 'pending payment';			
					}
					if(this.users == null || this.users.length == 0){
						this.isFileLoading = false;
					}
					this.getApprovalDocumentData();
				}else{
					swal.fire({
						title: 'Error',
						html: response.message,
						icon: 'warning',
						confirmButtonText: 'OK'
					});
				}
			});
			
		}
	}

	public getApprovalDocumentData(): void{
		this.users.forEach(($ii) => {
			if($ii.leaderapproval != null){
				const params = {
					programticketapproval_id: $ii.leaderapproval.id,
				}
				this.http.sendGetRequest2('programticketapprovaldocument/get', params).subscribe((response: any) => {
					if(response.api_status){
						$ii.programticketapprovaldocuments = response.data.programticketapprovaldocuments;
						$ii.programticketapprovaldocuments.forEach(($jj)=> {
							$jj.document.url = $jj.document.url.replace('http://', 'https://');
						});
					}else{
						swal.fire({
							title: 'Error',
							html: response.message,
							icon: 'warning',
							confirmButtonText: 'OK'
						});
					}
					this.isFileLoading = false;
				});
			}
		});
	}

	public changeTabIndex($index){
		this.selectedFile = null;
		this.users.forEach(($ii) => {
			$ii.isSelected = false;
		});
		this.users[$index].isSelected = true;
	}

	public showLeaderApprovalDocuments(){
		this.open(this.modal);
	}

	public showStatuses(){
		this.open(this.helpmodal);
	}

	public closeDialog(): void {
		this.modalService.dismissAll();
	}

	public open(content): void {
		if (!this.isModalShown) {
			this.modalService.open(content, {
				size: 'lg',
				backdrop: 'static',
				ariaLabelledBy: 'modal-basic-title',
			}).result.then(() => {
				this.isModalShown = false;
			}, () => {
				this.isModalShown = false;
			});
		}
	}

	public selectFile($document){
		this.selectedFile = $document;
		this.selectedFile.isDownloading = false;
	}

	public approvalReupload(){
		this.users.forEach(($ii)=> {
			if($ii.isSelected){
				swal.fire({
					title: 'Confirmation',
					text:  'Are you sure you want to ask '+ $ii.label + '\'s Leader to reupload?',
					icon: 'question',
					allowOutsideClick: false,
					showCancelButton: true,
					confirmButtonText: 'Yes'
				}).then((result) => {
					if (result.isConfirmed) {
						this.isFileLoading = true;
						const params = {
							programticketapproval_id: $ii.leaderapproval.id
						}
						this.http.sendPostRequest2('programticketapprovaldocument/requestreupload', params).subscribe((response: any) => {
							if(response.api_status){
								$ii.leaderapproval = response.data.updatedData.programticketapproval;
								this.selectedProgramticket.approvalStatus = "reupload";
							}else{
								swal.fire({
									title: 'Error',
									html: response.message,
									icon: 'warning',
									confirmButtonText: 'OK'
								});
							}
							this.isFileLoading = false;
						});
					}
				});
			}
		});
	}

	public gotoPage(pageNumber: number): void {
		if (pageNumber !== null) {
			if (this.isTicketsLoading === false) {
				this.getTicketData(pageNumber);
			}
		}
	}

	public nextPage():void {
		if (this.navigations.last_page > this.navigations.current_page) {
			if (this.isTicketsLoading === false) {
				this.getTicketData(this.currentPageIdx + 2);
			}
		}
	}

	public prevPage(): void {
		if (this.currentPageIdx > 0) {
			if (this.isTicketsLoading === false) {
				this.getTicketData(((this.currentPageIdx + 1) - 1));
			}
		}
	}

	public generateNavigationList(totalPage: number, currentPage: number): void {
		this.currentPageIdx = currentPage - 1;
		const lastPageIdx = totalPage - 1;
		this.navigationLists = [];
		for (let i = 0; i < totalPage; i++) {
			this.navigationLists.push({
				label: i + 1,
				isshow: false,
				iscurrent: this.currentPageIdx === i ? true : false
			});
		}

		this.ispageone = false;
		this.islastpage = false;
		this.ispageoneafter = false;
		this.islastpagebefore = false;

		if (this.currentPageIdx - 2 >= 0
			&& this.currentPageIdx - 2 <= totalPage) {
			if (this.navigationLists[this.currentPageIdx - 2] != null) {
				this.navigationLists[this.currentPageIdx - 2].isshow = true;
			}
			if (this.currentPageIdx - 2 === 0) {
				this.ispageone = true;
			}
			if (this.currentPageIdx - 2 === 1) {
				this.ispageoneafter = true;
			}
			if (this.currentPageIdx - 2 === lastPageIdx - 1) {
				this.islastpagebefore = true;
			}
			if (this.currentPageIdx - 2 === lastPageIdx) {
				this.islastpage = true;
			}
		}
		if (this.currentPageIdx - 1 >= 0
			&& this.currentPageIdx - 1 <= totalPage) {
			if (this.navigationLists[this.currentPageIdx - 1] != null) {
				this.navigationLists[this.currentPageIdx - 1].isshow = true;
			}
			if (this.currentPageIdx - 1 === 0) {
				this.ispageone = true;
			}
			if (this.currentPageIdx - 1 === 1) {
				this.ispageoneafter = true;
			}
			if (this.currentPageIdx - 1 === lastPageIdx - 1) {
				this.islastpagebefore = true;
			}
			if (this.currentPageIdx - 1 === lastPageIdx) {
				this.islastpage = true;
			}
		}
		if (this.currentPageIdx >= 0
			&& this.currentPageIdx <= totalPage) {
			if (this.navigationLists[this.currentPageIdx] != null) {
				this.navigationLists[this.currentPageIdx].isshow = true;
			}
			if (this.currentPageIdx === 0) {
				this.ispageone = true;
			}
			if (this.currentPageIdx === 1) {
				this.ispageoneafter = true;
			}
			if (this.currentPageIdx === lastPageIdx - 1) {
				this.islastpagebefore = true;
			}
			if (this.currentPageIdx === lastPageIdx) {
				this.islastpage = true;
			}
		}
		if (this.currentPageIdx + 1 >= 0
			&& this.currentPageIdx + 1 <= totalPage) {
			if (this.navigationLists[this.currentPageIdx + 1] != null) {
				this.navigationLists[this.currentPageIdx + 1].isshow = true;
			}
			if (this.currentPageIdx + 1 === 0) {
				this.ispageone = true;
			}
			if (this.currentPageIdx + 1 === 1) {
				this.ispageoneafter = true;
			}
			if (this.currentPageIdx + 1 === lastPageIdx - 1) {
				this.islastpagebefore = true;
			}
			if (this.currentPageIdx + 1 === lastPageIdx) {
				this.islastpage = true;
			}
		}
		if (this.currentPageIdx + 2 >= 0
			&& this.currentPageIdx + 2 <= totalPage) {
			if (this.navigationLists[this.currentPageIdx + 2] != null) {
				this.navigationLists[this.currentPageIdx + 2].isshow = true;
			}
			if (this.currentPageIdx + 2 === 0) {
				this.ispageone = true;
			}
			if (this.currentPageIdx + 2 === 1) {
				this.ispageoneafter = true;
			}
			if (this.currentPageIdx + 2 === lastPageIdx - 1) {
				this.islastpagebefore = true;
			}
			if (this.currentPageIdx + 2 === lastPageIdx) {
				this.islastpage = true;
			}
		}
	}

	public getFileExtension(filename: string){
		return filename.substring(filename.lastIndexOf('.')+1, filename.length) || filename;
	}

	public approvalAction($action){
		swal.fire({
			title: 'Confirmation',
			text:  'Are you sure you want to '+ ($action == 'Accept' ? 'approve' : 'reject') + ' this ticket?',
			icon: 'question',
			allowOutsideClick: false,
			showCancelButton: true,
			confirmButtonText: 'Yes'
		}).then((result) => {
			if (result.isConfirmed) {
				this.isFileLoading = true;
				this.users.forEach(($ii, index) =>{
					$ii.isProcessing = true;
					const params = {
						id: $ii.adminapproval.id,
						action: this.helper.toTitleCase($action),
					}
					this.http.sendPostRequest2('programticketapproval/action', params).subscribe((response: any) => {
						if(response.api_status){
							$ii.adminapproval = response.data.updatedData.programticketapproval;
							if(response.data.ticketApprovalSystem?.updatedData?.programticket != null){
								if(response.data.ticketApprovalSystem.updatedData.programticket.status != "Pending"){
									this.selectedProgramticket.status = response.data.ticketApprovalSystem?.updatedData?.programticket.status;
									this.selectedProgramticket.approvalStatus = response.data.ticketApprovalSystem?.updatedData?.programticket.status.toLowerCase();
									
								}else if(response.data.ticketApprovalSystem.updatedData.programticket.status == "Pending" && response.data.ticketApprovalSystem.updatedData.programticket.statuspayment == "Pending"){
									this.selectedProgramticket.status = response.data.ticketApprovalSystem?.updatedData?.programticket.status;
									this.selectedProgramticket.approvalStatus = "pending payment";
								}
							}
						}else{
							swal.fire({
								title: 'Error',
								html: response.message,
								icon: 'warning',
								confirmButtonText: 'OK'
							});
						}
						$ii.isProcessing = false;
						if(index == this.users.length - 1)
							this.isFileLoading = false;
					});
				});
			}
		});
	}

	public onSearchKeydown(event): void {
		if (event.key === 'Enter') {
			event.preventDefault();
			this.getTicketData(1);
		}
	}

	public forceDownload(blob, filename) {
		var a = document.createElement('a');
		a.download = filename;
		a.href = blob;
		document.body.appendChild(a);
		a.click();
		a.remove();
	}

	public downloadResource(file, filename) {
		file.isDownloading = true;
		if (!filename) filename = file.document.url.split('//').pop().split('/').pop();
		this.http.sendGetResourceFile(file.document.url).subscribe((response: any) => {
			let blobUrl = window.URL.createObjectURL(response);
			this.forceDownload(blobUrl, filename);
			file.isDownloading = false;
		}, (error: any) => {
			// error
			swal.fire({
				title: 'Error',
				html: error.message,
				icon: 'warning',
				confirmButtonText: 'OK'
			});
			file.isDownloading = false;
		});
	}
}

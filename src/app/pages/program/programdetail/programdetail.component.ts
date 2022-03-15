import { Component, OnInit, ViewChild } from '@angular/core';
import { DetailtableComponent } from './detailtable/detailtable.component';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from './../../../http.service';
import { GlobalService } from './../../../global.service';
import { HelperService } from './../../../helper.service';
import { PopupModalComponent } from './../../../components/popup-modal/popup-modal.component';
import { 
	faStop as fasStop,
	faPlay as fasPlay,
	faHourglassHalf as fasHourglassHalf,
	faCheckSquare as fasCheckSquare,
	faTimesSquare as fasTimesSquare,
} from '@fortawesome/pro-solid-svg-icons';
import { 
	faSquare as farSquare,
} from '@fortawesome/pro-regular-svg-icons';
import { 
	faCheckSquare as fadCheckSquare,
} from '@fortawesome/pro-duotone-svg-icons';


@Component({
	selector: 'app-programdetail',
	templateUrl: './programdetail.component.html',
	styleUrls: ['./programdetail.component.scss']
})
export class ProgramdetailComponent implements OnInit {
	@ViewChild('mymodal', { static: false }) private modal: PopupModalComponent;
	@ViewChild('detailtable', { static: false }) private detailtable: DetailtableComponent;

	public fasHourglassHalf = fasHourglassHalf;
	public fasCheckSquare = fasCheckSquare;
	public fasTimesSquare = fasTimesSquare;
	public farSquare = farSquare;
	public fadCheckSquare = fadCheckSquare;
	public fasPlay = fasPlay;
	public fasStop = fasStop;
	public isloadingInfo: boolean;
	public programId: number;
	public program;
	public currentTab;
	public programType: string;
	public programStart: string;
	public programEnd: string;
	public attendanceCount: any;
	public qrList: any;
	public isheaderexpand: boolean;

	constructor(
		private http: HttpService,
		public global: GlobalService,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		public helper: HelperService
	) {
		this.isheaderexpand = false;
		this.programId = null;
		this.activatedRoute.queryParams.subscribe(params => {
			this.programId = parseInt(params.id, 10);
		});
		this.programType = this.activatedRoute.snapshot.paramMap.get('type').toLowerCase();
		// untuk programType diambil dari id

		if (this.programId == null) {
			// redirect back to list
			this.router.navigateByUrl('admin/program/' + this.programType + '/list');
		}
	}

	ngOnInit(): void {
		this.getInfo();
	}

	public getInfo(): void {
		const params = {
			id: this.programId
		};
		this.isloadingInfo = true;
		this.http.sendGetRequest2('program/detail', params).subscribe((response: any) => {
			if (response.api_status === true) {
				this.program = response.data.program;
				this.programStart = this.program.registerstart_at;
				this.programEnd = this.program.registerend_at;

				this.qrList = response.data.program.programbreakouts[0].programbreakoutdates;
				// this.detailtable.setQrList(qrList);

				// buat column lengthnya
				this.attendanceCount = response.data.program.programbreakouts[0].programbreakoutdates_count;
				// this.detailtable.initKeyAttendance(attendanceCount);
			} else {
				this.modal.show('Error', response.message, 'danger');
			}
			this.isloadingInfo = false;
		}, (error: any) => {
			this.modal.show('Error 500', error.message, 'danger');
			this.isloadingInfo = false;
		});
	}

	public toggleExpandHeader(){
		this.isheaderexpand = !this.isheaderexpand;
	}
}

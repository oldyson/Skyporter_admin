import { Component, OnInit } from '@angular/core';
import { HttpService } from './../../../../http.service';
import { HelperService } from './../../../../helper.service';
import { 
	faWhatsapp as fabWhatsapp,
	faWhatsappSquare as fabWhatsappSquare,
} from '@fortawesome/free-brands-svg-icons';

@Component({
	selector: 'smallgroupdashboard-sgreqanomalylist',
	templateUrl: './sgreqanomalylist.component.html',
	styleUrls: ['./sgreqanomalylist.component.scss']
})
export class SgreqanomalylistComponent implements OnInit {

	public fabWhatsapp = fabWhatsapp;
	public fabWhatsappSquare = fabWhatsappSquare;
	public description: string;
	public smallgrouprequests: any;
	public showpercent: boolean;
	public totaltransfer: number | null;
	public totalrequest: number | null;

	constructor(
		private http: HttpService,
		public helper: HelperService,
	) { 
		this.description = "";
		this.smallgrouprequests = null;
		this.showpercent = false;
		this.totaltransfer = 0;
		this.totalrequest = 0;
	}

	ngOnInit(): void {
		this.getData();
	}

	public getData() : void{
		const params = {
			'day': '5', // sementara di hardcode
		};
		this.totaltransfer = 0;
		this.totalrequest = 0;
		this.http.sendGetRequest2('smallgrouprequest/pending-morethan-xdays', params).subscribe((response: any) => {
			this.smallgrouprequests = response.data.smallgrouprequests;

			this.smallgrouprequests.forEach(($ii) => {
				$ii.delay = this.helper.dateDiffInString(this.helper.getDatetime($ii.created_at));
				if($ii.smallgroupmember_id != null){
					this.totaltransfer++;
				}else{
					this.totalrequest++;
				}
			});

			this.description = response.data.description;
		}, (error: any) => {

		});
	}

	public percentToggled(status: boolean): void{
		this.showpercent = status;
	}

}

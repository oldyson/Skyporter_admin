import { Component, OnInit } from '@angular/core';
import { HttpService } from './../../../../http.service';
import { HelperService } from './../../../../helper.service';
import swal from 'sweetalert2';
@Component({
	selector: 'smallgroupdashboard-sganomalycount',
	templateUrl: './sganomalycount.component.html',
	styleUrls: ['./sganomalycount.component.scss']
})
export class SganomalycountComponent implements OnInit {

	public description: string;
	public smallgroupreportbymembers: any;
	public showpercent: boolean;
	public years: any;
	public selectedYear: string;
	constructor(
		private http: HttpService,
		public helper: HelperService,
	) { 
		this.description = "";
		this.smallgroupreportbymembers = null;
		this.showpercent = false;
		this.years = [];
	}

	ngOnInit(): void {
		if(this.years.length == 0)
			this.getYears();
	}

	public getYears(): void{
		this.http.sendGetRequest2('smallgroup/get-report-years').subscribe((response: any) => {
			if(response.api_status){
				this.years = response.data.years;
				this.selectedYear = this.years[this.years.length-1];
				this.getData();
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

	public getData() : void{
		const params = {
			year: this.selectedYear, // sementara di hardcode
			sortDir: 'DESC',
		};
		this.http.sendGetRequest2('smallgroup/get-report-withmembercondition', params).subscribe((response: any) => {
			this.smallgroupreportbymembers = response.data.smallgroupreportbymembers;
			this.smallgroupreportbymembers.forEach(($ii) => {
				$ii.generateddate = this.helper.getDatetime($ii.generateddate);
			});
			this.description = response.data.description;
		}, (error: any) => {

		});
	}

	public percentToggled(status: boolean): void{
		this.showpercent = status;
	}

}

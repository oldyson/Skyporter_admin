import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { GlobalService } from './../../../global.service';
import { HttpService } from './../../../http.service';
import { HelperService } from './../../../helper.service';
import { SundaytableComponent } from './sundaytable/sundaytable.component';
import {
	faSpinner as farSpinner,
} from '@fortawesome/pro-regular-svg-icons';

@Component({
	selector: 'app-dashboardinputsunday',
	templateUrl: './dashboardinputsunday.component.html',
	styleUrls: ['./dashboardinputsunday.component.scss']
})
export class DashboardinputsundayComponent implements OnInit {

	@ViewChildren('sundaytable') sundaytables: QueryList<SundaytableComponent>;
	public farSpinner = farSpinner;
	public campuses: any;
	public selectedweek: number;
	public selectedyear: number;
	public isloading: boolean;

	constructor(
		private global: GlobalService,
		private http: HttpService,
		public helper: HelperService,
	) { 
		this.isloading = false;

		const nowtime = new Date();
		this.selectedyear = nowtime.getFullYear();
		this.selectedweek = this.helper.calculateWeek(nowtime);
	}

	ngOnInit(): void {
		this.initDataSundayservice();
	}

	public saveAllTable(){
		console.log(this.sundaytables);
		this.sundaytables.forEach(($ii) => {
			$ii.saveAllRow();
		});
	}

	public initDataSundayservice(){
		if(!this.isloading){
			const params = {
				'weekofyear': this.selectedweek,
				'year': this.selectedyear,
			};
			this.isloading = true;
			this.http.sendGetRequest2('dashboard/init-service-attendance', params).subscribe((response: any) => {
				if(response.api_status){
					this.campuses = response.data.campuses;
					this.campuses.forEach(($ii) => {
						$ii.campusservices.forEach(($jj) => {
							$jj.campusserviceattendance = {
								'id': null,
								'campusservice_id': $jj['id'],
								'weekofyear': this.selectedweek,
								'year': this.selectedyear,
								'totalgeneral': 0,
								'totalgeneralfirst': 0,
								'totalgeneralsalvation': 0,
								'totalyouth': 0,
								'totalyouthfirst': 0,
								'totalyouthsalvation': 0,
								'totalkids': 0,
								'totalkidsfirst': 0,
								'totalkidssalvation': 0,
							};
							// kalo ga null
							if($jj.campusserviceattendances != null){
								if($jj.campusserviceattendances.length > 0){
									$jj.campusserviceattendance = $jj.campusserviceattendances[0];
								}
							}

							$jj['changed'] = false;
							$jj['loading'] = false;
							delete($jj['campusserviceattendances']);
						})
					});
					console.log(this.campuses);
				}
				this.isloading = false;
			}, (error: any) => {
				this.isloading = false;
			});
		}
	}

}

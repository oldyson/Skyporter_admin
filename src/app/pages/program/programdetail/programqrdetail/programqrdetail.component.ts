import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from './../../../../http.service';
import { HelperService } from './../../../../helper.service';
import { 
	faExclamationCircle as fasExclamationCircle,
} from '@fortawesome/pro-solid-svg-icons';

@Component({
	selector: 'programdetail-programqrdetail',
	templateUrl: './programqrdetail.component.html',
	styleUrls: ['./programqrdetail.component.scss']
})
export class ProgramqrdetailComponent implements OnInit {

	public fasExclamationCircle = fasExclamationCircle;
	public programId: number | null;
	public program: any;
	public programbreakouts: any;
	public programbreakout_id: number | null;
	public programbreakout_idx: number | null;
	public programbreakoutdate_id: number | null;
	public programbreakoutdate_idx: number | null;

	constructor(
		private activatedRoute: ActivatedRoute,
		private http: HttpService,
		private helper: HelperService,
	) { 
		this.programbreakout_id = null;
		this.programbreakoutdate_id = null;
		this.programId = null;
		this.programbreakout_idx = null;
		this.program = null;
		this.programbreakouts = null;
		this.activatedRoute.queryParams.subscribe(params => {
			this.programId = params.id;
		});
	}

	ngOnInit(): void {
		this.getProgram();
	}

	public getProgram(){
		const params = {
			id: this.programId,
		};
		this.http.sendGetRequest2('program/detail', params).subscribe((response: any) => {
			this.program = response.data.program
			this.programbreakouts = response.data.program.programbreakouts;
			let firstsession_id = 0;
			this.programbreakouts.forEach(($ii) => {
				$ii.name = "#" + $ii.id + ". " + $ii.name;
				$ii.programbreakoutdates.forEach(($jj) => {
					$jj.name = "#" + $jj.id + ". " + this.helper.makeDate($jj.timestart_at) + " (" + this.helper.makeTime($jj.timestart_at) + " - " + this.helper.makeTime($jj.timeend_at) + ")";
					if(firstsession_id == 0)
						firstsession_id = $jj.id;
				});
			});
			if(this.programbreakouts.length > 0){
				this.programbreakout_id = this.programbreakouts[0].id;
				this.breakoutChange(this.programbreakout_id);
			}
			if(firstsession_id > 0){
				this.programbreakoutdate_id = firstsession_id;
				this.breakoutdateChange(firstsession_id);
			}
		}, (error: any) => {
			// error
		});
	}

	public breakoutChange(programbreakoutId: number){
		// return value berupa id dari breakout
		for(let i = 0; i < this.programbreakouts.length; i++){
			if(this.programbreakouts[i].id == programbreakoutId){
				this.programbreakout_idx = i;
			}
		}
	}

	public breakoutdateChange(programbreakoutdateId: number){
		for(let i = 0; i < this.programbreakouts[this.programbreakout_idx].programbreakoutdates.length; i++){
			if(this.programbreakouts[this.programbreakout_idx].programbreakoutdates[i].id == programbreakoutdateId){
				this.programbreakoutdate_idx = i;
			}
		}
	}

}

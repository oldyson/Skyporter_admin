import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from './../../../http.service';
import { HelperService } from './../../../helper.service';
import { FormComponent } from './form/form.component';
import swal from 'sweetalert2';

@Component({
	selector: 'app-dlapplicationdetail',
	templateUrl: './dlapplicationdetail.component.html',
	styleUrls: ['./dlapplicationdetail.component.scss']
})
export class DlapplicationdetailComponent implements OnInit {

	public formusers:any;
	public formuser: any;
	public formgroup: any;
	public isLoading: boolean;
	public isSaveLoading: boolean;
	public userprogramcodes: any;
	public smallgroup: any;
	public ministrymembers: any;
	public user: any;
	public educationlevel: any;
	public educationfield: any;
	public occupationfield: any;
	public maritalstatus: any;
	public smallgroups: any;
	public userfamilychilds: any;
	public current_user_id: Number;
	constructor(
		public activatedRoute: ActivatedRoute,
		public helper: HelperService,
		public router: Router,
		public http: HttpService
	) {
		this.isLoading = false;
		this.isSaveLoading = false;
		this.user = null;
		this.smallgroup = null;
		this.ministrymembers = null;
		this.userprogramcodes = null;
		this.educationfield = null;
		this.educationlevel = null;
		this.occupationfield = null;
		this.maritalstatus = null;
		this.smallgroups = null;
		this.userfamilychilds = null;
		this.formuser = {
			id: null,
			status: null
		};
		this.formusers = null;
		this.activatedRoute.queryParams.subscribe(params => {
			this.formuser.id = params.id;
		});
		if (this.formuser.id != null) {
			this.getFormusersByID();
		}
	}
	ngOnInit(): void {

	}

	public getFormusersByID(){
		this.isLoading = true;
		const data = {
			id: this.formuser.id,
		};
		const self = this;
		this.http.sendGetRequest2('formuser/detail', data).subscribe(function(response: any){
			if(response.api_status){
				self.formusers = response.data.formusers;
				console.log(response.data);
				self.formuser = response.data.formusers[response.data.formusers.length-1];
				self.user = response.data.user;
				self.ministrymembers = response.data.user.useractions_ministryduration;
				self.userprogramcodes = response.data.user.userprogramcodes;
				self.smallgroup = response.data.smallgroup;
				if(response.data.user.userfamily != null)
					self.userfamilychilds = response.data.user.userfamily.userfamilychilds;
				self.smallgroups = response.data.user.smallgroupmembers[0].smallgroups;
				// SET user answers
				self.formusers.forEach(($aa) => {
					$aa.form.formquestions.forEach(($cc) => {
						if ($cc.formquestiontype.type == 'date' && $cc.value != null){
							const [year, month, day] = $cc.value.split('-');
							const obj = {
								year: parseInt(year),
								month: parseInt(month),
								day: parseInt(day.split(' ')[0].trim())
							};
							$cc.value = obj;
						}else if ($cc.formquestiontype.type == 'time' && $cc.value != null){
							const [hour, minute] = $cc.value.split(':');
							const obj = {
								hour: parseInt(hour),
								minute: parseInt(minute)
							};
							$cc.value = obj;
						}else if ($cc.formquestiontype.type == 'checkbox' && $cc.value != null){
							if($cc.value == 1){
								$cc.value = true;
							}else{
								$cc.value = false;
							}
						}else if ($cc.formquestiontype.name == 'education level' && $cc.value != null){
							self.educationlevel = Number($cc.value);
							$cc.value = Number($cc.value);
						}else if ($cc.formquestiontype.name == 'education type' && $cc.value != null){
							if(Number($cc.value)){
								self.educationfield = Number($cc.value);
								$cc.value = Number($cc.value);
							}else{
								self.educationfield = $cc.value;
								$cc.value = $cc.value;
							}
						}else if ($cc.formquestiontype.name == 'occupation field' && $cc.value != null){
							if(Number($cc.value)){
								self.occupationfield = Number($cc.value);
								$cc.value = Number($cc.value);
							}else{
								self.occupationfield = $cc.value;
							}
						}else if ($cc.formquestiontype.name == 'marital status'){
							if(self.user.maritalstatus_id != null){
								self.maritalstatus = Number(self.user.maritalstatus_id);
								$cc.value = Number(self.user.maritalstatus_id);
							}
						}else if ($cc.question.includes('Marriage Date')){
							if(self.user.maritalstatus_id == 2){
								if(self.user.userfamily != null){
									const [year, month, day] = self.user.userfamily.marriage_at.split('-');
									const obj = {
										year: parseInt(year),
										month: parseInt(month),
										day: parseInt(day.split(' ')[0].trim())
									};
									$cc.value = obj;
								}
							}
						}else if ($cc.question.includes('Spouse')){
							if(self.user.maritalstatus_id == 2){
								if(self.user.userfamily != null){
									if(self.user.userfamily.user2 != null){
										if(self.user.id == self.user.userfamily.user.id){
											$cc.value = self.user.userfamily.user2.fullname;
										}
									}
									if(self.user.userfamily.user != null){
										if(self.user.id == self.user.userfamily.user2.id){
											$cc.value = self.user.userfamily.user.fullname;
										}
									}
								}
							}
						}else if ($cc.formquestiontype.type == 'dayofweek' && $cc.value != null){
							$cc.value = Number($cc.value);
						}else if ($cc.formquestiontype.name != null && $cc.formquestiontype.name == 'DATE name'){
							$cc.value = self.smallgroup.id;
						}else if ($cc.formquestiontype.name != null && $cc.formquestiontype.name == 'DATE Leader of'){
							$cc.value = self.smallgroups.id;
						}else if ($cc.formquestiontype.name != null && $cc.formquestiontype.name == 'DATE Leader name'){
							$cc.value = self.smallgroup.smallgroupleader.user.fullname;
						}else if ($cc.formquestiontype.name != null && $cc.formquestiontype.name == 'jumlah anak'){
							if(self.user.userfamily != null)
								$cc.value = self.userfamilychilds.length;
						}else if (Number($cc.value) && $cc.value != null){
							$cc.value = Number($cc.value);
						}
					});
				});

				// SET Default
				self.formusers.forEach(($ii) => {
					$ii.form.formquestions.forEach(($jj) => {
						if ($jj.formquestiontype != null && $jj.value == null){
							if ($jj.formquestiontype.type == 'dayofweek'){
								$jj.value = 0;
							}else if ($jj.formquestiontype.type == 'date'){
								const date = new Date();
								const obj = {
									year: date.getFullYear(),
									month: date.getMonth()+1,
									day: date.getDate()
								}
								console.log(obj);
								$jj.value = obj;
							}
						}
					});
				});
				
				
				self.isLoading = false;
			}else{
				self.showErrorDialog(response.message);
				self.isLoading = false;
			}

		});
	}

	public saveFormAnswers(): void {
		this.isSaveLoading = true;
		const self = this;
		let formusersSubmit = [];
		this.formusers.forEach(($ii) => {
			if($ii.form_id == 8 || $ii.form_id == 23 || $ii.form_id == 25){
				$ii.formuseranswers = [];
				$ii.form.formquestions.forEach(($jj) => {
					if ($jj.value != null && $jj.formquestiontype != null && $jj.formquestiontype.type != 'table'){
						let tempanswer = null;
						if ($jj.formquestiontype.type == 'file' && $jj.formquestiontype.name == 'image upload'){
							if(self.user.document_id)
								tempanswer = self.user.document_id;
						}else if ($jj.formquestiontype.type == 'date'){
							tempanswer = $jj.value.year + '-' + ('0' + $jj.value.month).slice(-2) + '-' + ('0' + $jj.value.day).slice(-2);
						}else if ($jj.formquestiontype.type == 'time'){
							tempanswer = $jj.value.hour + ':' + ('0'+ $jj.value.minute).slice(-2);
						}else if ($jj.formquestiontype.type == 'checkbox'){
							if ($jj.value){
								tempanswer = 1;
							}else {
								tempanswer = 0;
							}
						}else{
							tempanswer = $jj.value;
						}
						const temp = {
							formuser_id: $ii.id,
							formquestion_id: $jj.id,
							formquestionchoice_id: null,
							answertext: null,
							value: null
						}
						if(tempanswer != null && $jj.formquestiontype.type != "radio"){
							temp.answertext = tempanswer;
						}else{
							temp.formquestionchoice_id = tempanswer;
						}
						$ii.formuseranswers.push(temp);
					}
				});
				formusersSubmit.push($ii);
			}
		});
		console.log(formusersSubmit);
		const data = {
			formusers: JSON.stringify(formusersSubmit)
		};
		console.log(data);
		this.http.sendPostRequest2('formuser/save', data).subscribe(function(response: any){
			if(response.api_status){
				self.showDialog(response.message);
				this.isSaveLoading = false;
			}else{
				self.showErrorDialog(response.message);
				this.isSaveLoading = false;
			}
		});
	}

	public cancel(): void{
		this.router.navigateByUrl('/admin/digitalform/dlapplication/list');
	}

	public showDialog(message: string): void {
		swal.fire({
			title: 'Success',
			text: message,
			icon: 'success',
			confirmButtonText: 'OK',
		}).then(() => {
			this.router.navigateByUrl('/admin/digitalform/dlapplication/list');
		});
	}

	public showWarningDialog(message: string): void {
		swal.fire({
			title: 'Warning',
			text: message,
			icon: 'warning',
			confirmButtonText: 'OK',
		}).then(() => {
			// Nothing
		});
	}

	public showErrorDialog(message: string): void {
		swal.fire({
			title: 'Error',
			text: message,
			icon: 'error',
			confirmButtonText: 'OK',
		}).then(() => {
			// Nothing
		});
	}
}

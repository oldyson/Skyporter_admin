import { Component, OnInit, Input, Output, ViewEncapsulation, EventEmitter } from '@angular/core';

@Component({
	selector: 'dlapplicationdetail-form',
	templateUrl: './form.component.html',
	styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
	@Input() formuser;
	@Input() smallgroup;
	@Input() ministrymembers;
	@Input() userprogramcodes;
	@Input() educationlevel;
	@Input() educationfield;
	@Input() occupationfield;
	@Input() maritalstatus;
	@Input() user;
	@Input() userfamilychilds;
	@Input() smallgroups;
	public dayofweeks = [
		{ value: 0, label: 'Sunday / Minggu' },
		{ value: 1, label: 'Monday / Senin' },
		{ value: 2, label: 'Tuesday / Selasa' },
		{ value: 3, label: 'Wednesday / Rabu' },
		{ value: 4, label: 'Thursday / Kamis' },
		{ value: 5, label: 'Friday / Jum\'at' },
		{ value: 6, label: 'Saturday / Sabtu' }
	];
	public spiritualgifts = [];
	public picture: any;
	public filename: string;
	public imageSrc: string;
	constructor() { }

	ngOnInit(): void {

	}

	public setEducationLevel($level){
		this.educationlevel = $level;
	}

	public setEducationField($field){
		this.educationfield = $field;
	}

	public setOccupationField($field){
		this.occupationfield = $field;
	}

	public setMaritalStatus($field){
		this.maritalstatus = $field;
	}
	
	public onFileChange(event):void {
		const reader = new FileReader();
		if(event.target.files[0] && event.target.files.length) {
			this.picture = event.target.files[0];
			reader.readAsDataURL(this.picture);
			reader.onload = () => {
				this.imageSrc = reader.result as string;
				this.filename = this.picture.name;
			};
		}
	}
}

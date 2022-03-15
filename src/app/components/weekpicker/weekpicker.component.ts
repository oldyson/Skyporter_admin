import { 
	Component,
	ViewChild,
	forwardRef,
	AfterViewInit,
	Input,
	Output,
	EventEmitter,
	ViewEncapsulation
} from '@angular/core';
import {
	FormControl,
	NgControl,
	AbstractControl,
	ValidationErrors,
	NG_VALUE_ACCESSOR,
	NG_VALIDATORS
} from "@angular/forms";
import {
	NgbDate,
	NgbCalendar,
	NgbDatepicker
} from "@ng-bootstrap/ng-bootstrap";
import { takeWhile, debounceTime, startWith } from "rxjs/operators";
import { HelperService } from './../../helper.service';

@Component({
	selector: 'comp-weekpicker',
	templateUrl: './weekpicker.component.html',
	styleUrls: ['./weekpicker.component.scss'],
	encapsulation: ViewEncapsulation.None,
 providers: [
	{
	 provide: NG_VALUE_ACCESSOR,
	 useExisting: forwardRef(() => WeekpickerComponent),
	 multi: true
	}
 ]
})
export class WeekpickerComponent implements AfterViewInit {
	
	public outsideDays: any;
	public maxDate: any;
	public date: any;
	public fromDate: NgbDate;
	public toDate: NgbDate;
	public test: any;
	@Output() weekChange = new EventEmitter<any>();
	@Output() yearChange = new EventEmitter<any>();
	@Output() weekSelect = new EventEmitter<any>();
	@Input() week: number;
	@Input() year: number
	@ViewChild(NgbDatepicker, { static: false }) datePicker;

	public setWeek(): any{
		this.weekChange.emit(this.week);
	}
	public setYear(): any{
		this.yearChange.emit(this.year);
	}

	disabled: boolean = false;
	// onChange: (_: any) => void;
	// onTouched: any;
	constructor(
		private ngbCalendar: NgbCalendar,
		private helper: HelperService,
	) {}

	public onDateSelection(date: NgbDate) : void {
		let fromDate = new Date(date.year + "-" + date.month + "-" + date.day);
		let time = fromDate.getDay() ? fromDate.getDay() - 1 : 6;
		fromDate = new Date(fromDate.getTime() - time * 24 * 60 * 60 * 1000);
		this.fromDate = new NgbDate(
			fromDate.getFullYear(),
			fromDate.getMonth() + 1,
			fromDate.getDate() - 1
		);
		const toDate = new Date(fromDate.getTime() + 6 * 24 * 60 * 60 * 1000);
		this.toDate = new NgbDate(
			toDate.getFullYear(),
			toDate.getMonth() + 1,
			toDate.getDate() - 1
		);
		/*if (this.onTouched) this.onTouched();
		if (this.onChange) this.week = this.calculateWeek(fromDate);*/

		// auto update double bind
		this.week = this.helper.calculateWeek(fromDate);
		this.year = date.year;
		if(this.week == 53){
			this.week = 1;
			// kalo: tanggal 1 jan beda dengan 31 des
			// ikut tahun tanggal 1 jan, dengan week 1
			if(date.year != toDate.getFullYear()){
				// kalo bulan 12 taon lalu
				this.year = toDate.getFullYear();
			}
		}
		this.setWeek();
		this.setYear();
		this.weekSelect.emit();
	}

	public isInside(date: NgbDate) : boolean {
		return date.after(this.fromDate) && date.before(this.toDate);
	}

	public isRange(date: NgbDate) : any {
		return (
			date.equals(this.fromDate) ||
			date.equals(this.toDate) ||
			this.isInside(date)
		);
	}

	public calculateDate(week: number, year: number) : void {
		const firstDay = new Date(year + "-1-4");
		const date = new Date(
			firstDay.getTime() + (week - 1) * 7 * 24 * 60 * 60 * 1000
		);
		const selectDate = new NgbDate(
			date.getFullYear(),
			date.getMonth() + 1,
			date.getDate()
		);
		this.onDateSelection(selectDate);
	}

	public ngAfterViewInit() : void {
		if (this.fromDate) {
			setTimeout(() => {
				this.datePicker.navigateTo(this.fromDate);
			});
		}
	}
/*
	public registerOnChange(fn: (_: any) => void): void {
		this.onChange = fn;
	}

	public registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}*/

	public setDisabledState(isDisabled: boolean): void {
		this.disabled = isDisabled;
	}

}

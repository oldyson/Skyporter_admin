import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import {
	faCalendarDay as fasCalendarDay,
} from '@fortawesome/pro-solid-svg-icons';

@Component({
	selector: 'comp-datepicker',
	templateUrl: './datepicker.component.html',
	styleUrls: ['./datepicker.component.scss'],
	encapsulation: ViewEncapsulation.None,
})
export class DatepickerComponent implements OnInit {

	@Input() fromDate: NgbDate | null;
	@Input() toDate: NgbDate | null;
	@Output() fromDateChange = new EventEmitter<any>();
	@Output() toDateChange = new EventEmitter<any>();
	@Input() dateType: string;
	public fasCalendarDay = fasCalendarDay;
	public hoveredDate: NgbDate | null = null;

	constructor(
		private calendar: NgbCalendar,
		public formatter: NgbDateParserFormatter
	) {
		this.fromDate = calendar.getToday();
		this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
		this.dateType = 'date'; // date | daterange
	}

	ngOnInit(): void {
	}

	public setFromDate(): void {
		this.fromDateChange.emit(this.fromDate);
	}
	public setToDate(): void {
		this.toDateChange.emit(this.toDate);
	}

	public onChanged(): void {
		this.setFromDate();
		this.setToDate();
	}

	onDateSelection(date: NgbDate): void {
		if (!this.fromDate && !this.toDate) {
			this.fromDate = date;
		} else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
			this.toDate = date;
		} else {
			this.toDate = null;
			this.fromDate = date;
		}

		this.onChanged();
	}

	isHovered(date: NgbDate): boolean | null {
		return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
	}

	isInside(date: NgbDate): boolean | null {
		return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
	}

	isRange(date: NgbDate): boolean | null {
		return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
	}

	validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
		const parsed = this.formatter.parse(input);
		return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
	}
}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import {
	faInfo as fasInfo,
} from '@fortawesome/pro-solid-svg-icons';

@Component({
	selector: 'comp-inputform',
	templateUrl: './inputform.component.html',
	styleUrls: ['./inputform.component.scss']
})
export class InputformComponent implements OnInit {

	public fasInfo = fasInfo;
	@Output() valueChange = new EventEmitter<any>();
	@Output() fetchMoreData = new EventEmitter<any>();
	@Output() searchServerData = new EventEmitter<any>();
	@Input() placeholder: any;
	@Input() value: any;
	@Input() type: string;
	@Input() title: string;
	@Input() options: any;
	@Input() optionsMde: any;
	@Input() perline: number;
	@Input() disabled: boolean;
	@Input() dropdownLoading: boolean;
	@Input() withEmoji: boolean;
	@Input() tooltipMessage: string;
	public isShowEmoPicker: boolean;
	public search: string;
	public imageSrc: string;
	public filename: string;
	public searchInput: Subject<string> = new Subject<string>();
	// @Output() panggilbapak = new EventEmitter();

	constructor() {
		this.type = 'text';
		this.disabled = false;
		this.isShowEmoPicker = false;
		this.search = '';
		this.searchInput.pipe(
			debounceTime(1000),
			distinctUntilChanged()
		).subscribe((search) => {
			this.search = search;
			this.searchServerData.emit(this.search);
		});
	}

	ngOnInit(): void {

	}

	public setValue(): any {
		this.valueChange.emit(this.value);
	}

	public fetchMore(): void {
		this.fetchMoreData.emit();
	}

	public onFileChange(event): void {
		const reader = new FileReader();
		if (event.target.files && event.target.files.length) {
			const [file] = event.target.files;
			reader.readAsDataURL(file);
			reader.onload = (): void => {
				this.imageSrc = reader.result as string;
				this.filename = file.name;
			};
		}
	}

	public equals(o1: any, o2: any): boolean {
		return o1 && o2 && o1.id === o2.id && o1.type === o2.type;
	}

	public showEmoji(): void {
		this.isShowEmoPicker = true;
	}

	public handleSelection(event): void {
		if (this.type === 'simplemde') {
			this.value = this.value == null ? event.char : this.value + event.char;
		}
	}

}

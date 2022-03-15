import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'campaignform-recipients',
	templateUrl: './recipients.component.html',
	styleUrls: ['./recipients.component.scss']
})
export class RecipientsComponent implements OnInit {

	@Input() campaign;
	@Input() recipients;

	constructor() {
		//
	}

	ngOnInit(): void {
		//
	}

	public setTab(e): void {
		if (e.key === 'Tab') {
			/*e.preventDefault();
			// will give the current postion of the cursor
			document.getElementById("id").selectionStart;

			// will get the value of the text area
			let x= $('#text1').val();

			// will get the value of the input box
			let text_to_insert=$('#insert').val();

			// setting the updated value in the text area
			$('#text1').val(x.slice(0,curPos)+text_to_insert+x.slice(curPos));*/
		}
	}

}

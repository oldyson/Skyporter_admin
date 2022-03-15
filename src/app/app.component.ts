import { Component, ViewEncapsulation } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { GlobalService } from './global.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class AppComponent {
	public title = 'Skyporter';

	constructor(
		private global: GlobalService,
		private titleService: Title
	) {
		this.title = this.global.appName + ' Skyportal';
		this.titleService.setTitle(this.title.toUpperCase());
	}
}

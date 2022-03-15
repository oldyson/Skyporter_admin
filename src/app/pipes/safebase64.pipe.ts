import { Pipe } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({ name: 'safebase64' })
export class Safebase64Pipe {
	constructor(private sanitizer: DomSanitizer) { }

	transform(text): SafeResourceUrl {
		const url = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/svg+xml;base64,' + text);
		return url;
	}
}

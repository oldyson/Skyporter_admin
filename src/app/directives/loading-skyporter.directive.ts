import { Directive, ElementRef, Renderer2, Inject, OnInit, Input } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Directive({
	selector: '[appLoadingSkyporter]'
})
export class LoadingSkyporterDirective implements OnInit {

	@Input() size: string;

	constructor(
		private elementRef: ElementRef,
		private renderer: Renderer2,
		@Inject(DOCUMENT) private document
	) {
		this.size = '';
	}

	ngOnInit(): void {
		const child = document.createElement('img');
		child.src = 'assets/icon/loading-blue.gif';
		if (this.size === '' || this.size === 'md') {
			child.className = 'loading-skyporter';
		} else if (this.size === 'sm') {
			child.className = 'loading-skyporter small';
		} else if (this.size === 'lg') {
			child.className = 'loading-skyporter large';
		}
		this.renderer.appendChild(this.elementRef.nativeElement, child);
	}

}

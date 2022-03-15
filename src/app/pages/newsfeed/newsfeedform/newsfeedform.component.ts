import { Component, OnInit } from '@angular/core';
import { HttpService } from './../../../http.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HelperService } from './../../../helper.service';
import { 
	faSpinner as fadSpinner,
} from '@fortawesome/pro-duotone-svg-icons';
import { 
	faChevronLeft as falChevronLeft,
} from '@fortawesome/pro-light-svg-icons';
import { markdown } from 'markdown';
import swal from 'sweetalert2';

@Component({
	selector: 'app-newsfeedform',
	templateUrl: './newsfeedform.component.html',
	styleUrls: ['./newsfeedform.component.scss']
})
export class NewsfeedformComponent implements OnInit {

	public fadSpinner = fadSpinner;
	public falChevronLeft = falChevronLeft;
	public newsfeedId: number;
	public isLoading: boolean;
	public loadingSave: boolean;
	public isLoadingCategoryList: boolean;
	public isLoadingSelectedType: boolean;
	public formData: any;
	public formErrorCount: any;
	public ytId: any;
	public typeList: any;
	public informationType: any;
	public categoryList: any;
	public previewDescription: any;
	public informationTypeName: string;
	constructor(
		public activatedRoute: ActivatedRoute,
		private http: HttpService,
		public router: Router,
		public helper: HelperService
	) {
		this.informationTypeName = 'Newsfeed';
		if(this.router.url.includes('devotion')){
			this.informationTypeName = 'Devotion';
		}
		this.activatedRoute.queryParams.subscribe(params => {
			this.newsfeedId = parseInt(params.id, 10);
		});
		this.isLoading = false;
		this.loadingSave = false;
		this.formData = {
			type: {
				value: 1,
				title: 'Type'
			},
			category: {
				value: null,
				title: 'Category'
			},
			media: {
				id: null,
				src: null,
				value: null,
				filename: null,
				title: 'Video'
			},
			title: {
				value: null,
				title: 'Title'
			},
			description: {
				value: '',
				title: 'Description',
				config: {
					toolbar: ['bold', 'italic', 'underline']
				}
			},
			startAt: {
				value: null,
				title: 'Start Sharing On'
			},
			endAt: {
				value: null,
				title: 'End Sharing On'
			},
		};
	}

	ngOnInit(): void {
		this.getInformationType();
		this.getFormById();
		this.getTypeList();
		this.getCategoryList();
	}

	public onChangeDescription(value: any):void {
		this.previewDescription = markdown.toHTML(value);
		this.formData.description.value = markdown.toHTML(value);
	}

	public getInformationType():void {
		const param = {
			name: this.informationTypeName
		};

		this.http.sendGetRequest2('informationtype/get', param).subscribe((response: any) => {
			// on success
			if (response.api_status === true) {
				this.informationType = response.data.informationtype;
			} else {
				swal.fire({
					title: 'Error',
					text: response.message,
					icon: 'warning',
					showCancelButton: false,
					confirmButtonText: 'OK'
				});
			}
		}, (error: any) => {
			// on error
			swal.fire({
				title: 'Error ' + error.status,
				html: this.helper.changeEOLToBr(error.error.message),
				icon: 'warning',
				showCancelButton: false,
				confirmButtonText: 'OK'
			});
		});
	}

	public getFormById(): void {
		if (this.newsfeedId) {
			this.isLoading = true;
			this.http.sendGetRequest2(`information/detail?id=${this.newsfeedId}`).subscribe((response: any) => {
				// on success
				if (response.api_status === true) {
					const result = response.data.information;
					this.formData.type.value = result.document?.documenttype_id ? result.document?.documenttype_id : 3;
					this.formData.category.value = result.informationcategory_id;
					this.formData.media.src = result.document?.url;
					this.formData.media.title = result.document?.documenttype_id == 1 ? 'Video' : 'Image';
					this.formData.media.filename = result.document?.url.substring(result.document?.url.lastIndexOf('/') + 1) || '';
					this.formData.title.value = result.name;
					this.formData.description.value = result.description;
					this.formData.startAt.value = this.helper.dateToDatetimelocal(new Date(result.poststart_at));
					this.formData.endAt.value = this.helper.dateToDatetimelocal(new Date(result.postend_at));
					this.isLoading = false;
				} else {
					swal.fire({
						title: 'Error',
						text: response.message,
						icon: 'warning',
						showCancelButton: false,
						confirmButtonText: 'OK'
					});
				}
			}, (error: any) => {
				// on error
				swal.fire({
					title: 'Error ' + error.status,
					html: this.helper.changeEOLToBr(error.error.message),
					icon: 'warning',
					showCancelButton: false,
					confirmButtonText: 'OK'
				});
			});
		}
	}

	public saveForm(status: any): void {
		this.formErrorCount = 0;
		for (const item in this.formData) {
			if (isNaN(this.newsfeedId) && (this.formData.type.value == 1 || this.formData.type.value == 2)) {
				if (this.formData[item].value === null || this.formData[item].value === '' || this.formData[item].value === undefined	) {
					swal.fire({
						title: 'Error',
						text: this.helper.toTitleCase(this.formData[item].title) + ' must be filled',
						icon: 'warning',
						confirmButtonText: 'OK'
					});
					this.formErrorCount++;
				}
			} else {
				if (item != 'media') {
					if (this.formData[item].value === null || this.formData[item].value === '' || this.formData[item].value === undefined) {
						swal.fire({
							title: 'Error',
							text: this.helper.toTitleCase(this.formData[item].title) + ' must be filled',
							icon: 'warning',
							confirmButtonText: 'OK'
						});
						this.formErrorCount++;
					}
				}
			}
		}

		if (!this.formErrorCount) {
			const data = new FormData();
			data.append('status', status),
			data.append('informationTypeId', this.informationType.id),
			data.append('informationCategoryId', this.formData.category.value),
			data.append('title', this.formData.title.value),
			data.append('description', this.formData.description.value),
			data.append('postStart', this.helper.dateToLaravelformat(new Date(this.formData.startAt.value))),
			data.append('postEnd', this.helper.dateToLaravelformat(new Date(this.formData.endAt.value))),
			data.append('documentTypeId', this.formData.type.value);

			if (isNaN(this.newsfeedId)) {
				if (this.formData.type.value == 1) {
					data.append('documentUrl', this.formData.media.value);
				} else if (this.formData.type.value == 2) {
					data.append('file', this.formData.media.value);
				}
			} else {
				if (this.formData.media.value) {
					if (this.formData.type.value == 1) {
						data.append('documentUrl', this.formData.media.value);
					} else if (this.formData.type.value == 2) {
						data.append('file', this.formData.media.value);
					}
				}
			}

			if (this.newsfeedId) {
				data.append('id', this.newsfeedId.toString());
			}

			swal.fire({
				title: 'Are you sure?',
				text: 'Make sure the data is correct',
				icon: 'question',
				allowOutsideClick: false,
				showCancelButton: true,
				confirmButtonText: 'Save'
			}).then((result) => {
				this.loadingSave = true;
				if (result.isConfirmed) {
					this.http.sendPostUpload(`information/${this.newsfeedId ? 'update' : 'create'}`, data).subscribe((response: any) => {
						if (response.api_status === true) {
							swal.fire({
								title: 'Success',
								text: `Success ${this.newsfeedId ? 'update' : 'create'} News Feed`,
								icon: 'success',
								confirmButtonText: 'OK'
							}).then(() => {
								this.router.navigateByUrl('admin/' + this.informationTypeName.toLowerCase() + '/list');
								this.loadingSave = false;
							});
						} else {
							swal.fire({
								title: 'Error',
								text: response.message,
								icon: 'warning',
								confirmButtonText: 'OK'
							});
						}
					}, (error: any) => {
						swal.fire({
							title: 'Error ' + error.status,
							text: error.message,
							icon: 'warning',
							confirmButtonText: 'OK'
						}).then(() => {
							this.loadingSave = false;
						});
					});
				} else {
					this.loadingSave = false;
				}
			});
		}
	}

	public onFileChange(event): void {
		const reader = new FileReader();
		if (event.target.files[0] && event.target.files.length) {
			this.formData.media.value = event.target.files[0];
			reader.readAsDataURL(this.formData.media.value);
			reader.onload = (): void => {
				this.formData.media.src = reader.result as string;
				this.formData.media.filename = this.formData.media.value.name;
			};
		}
	}

	public onChangeType(value: any):void {
		this.formData.media.value = null;
		this.formData.media.title = null;
		this.formData.media.src = null;
		this.formData.media.src = null;

		this.formData.media.title = value == 1 ? 'Video' : 'Image';
		this.formData.type.value = value;
	}

	public getTypeList(): void {
		this.isLoadingSelectedType = true;
		this.http.sendGetRequest2('documenttype/get').subscribe((response: any) => {
			if (response.api_status) {
				this.typeList = response.data.documenttype;
			}
			this.isLoadingSelectedType = false;
		}, (error: any) => {
			swal.fire({
				title: 'Error',
				text: error.message,
				icon: 'warning',
				confirmButtonText: 'OK',
			});
		});
	}

	public getCategoryList(): void {
		this.isLoadingCategoryList = true;
		this.http.sendGetRequest2('informationcategory/get').subscribe((response: any) => {
			if (response.api_status) {
				this.categoryList = response.data.informationcategories;
			}
			this.isLoadingCategoryList = false;
		}, (error: any) => {
			swal.fire({
				title: 'Error',
				text: error.message,
				icon: 'warning',
				confirmButtonText: 'OK',
			});
		});
	}

	public findCategoryById(id: number) : any{
		let catTemp = null;
		if(this.categoryList != null)
			this.categoryList.forEach((category) => {
				if(category.id == id){
					catTemp = category;
				}
			});

		return catTemp;
	}

	public onChangeVideo(value: any): void {
		this.formData.media.id = this.helper.getYoutubeId(value);
		this.formData.media.src = `http://img.youtube.com/vi/${this.helper.getYoutubeId(value)}/0.jpg`;
	}
}

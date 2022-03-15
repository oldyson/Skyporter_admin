import { Injectable } from '@angular/core';
import * as moment from 'moment';
import 'moment-precise-range-plugin';

@Injectable({
	providedIn: 'root'
})
export class HelperService {

	public months: Array<string>;
	public days: any;
	public statuses: any;
	public statusRequest: any;

	constructor() {
		this.months = [
			'Januari',
			'Februari',
			'Maret',
			'April',
			'Mei',
			'Juni',
			'Juli',
			'Agustus',
			'September',
			'Oktober',
			'November',
			'Desember'
		];
		this.days = [
			{ id: 0, title: 'Sunday' },
			{ id: 1, title: 'Monday' },
			{ id: 2, title: 'Tuesday' },
			{ id: 3, title: 'Wednesday' },
			{ id: 4, title: 'Thursday' },
			{ id: 5, title: 'Friday' },
			{ id: 6, title: 'Saturday' },
		];
		this.statuses = [
			{
				value: 'Full',
				name: 'Full',
			},
			{
				value: 'Priority',
				name: 'Priority',
			},
			{
				value: 'Open',
				name: 'Open',
			},
			{
				value: 'Closed',
				name: 'Closed',
			},
		];
		this.statusRequest = [
			{
				value: 'Approved',
				name: 'Approved',
			},
			{
				value: 'Rejected',
				name: 'Rejected',
			},
			{
				value: 'Pending',
				name: 'Pending',
			},
			{
				value: 'Probation',
				name: 'Probation',
			},
			{
				value: 'Cancelled',
				name: 'Cancelled'
			}
		];
	}

	public cutSebelomSimbol(text: any): string {
		if (text == null) {
			return '';
		} else {
			const indexof = text.indexOf('(');
			const simpletext = indexof >= 0 ? text.substring(0, indexof - 1) : text;
			return simpletext;
		}
	}

	public cut100char(text): string {
		return text.substring(0, 100) + (text.length > 99 ? ' ...' : '');
	}

	public toOrdinal(n: number) : string {
		var s = ["th", "st", "nd", "rd"];
		var v = n%100;
		return n + (s[(v-20)%10] || s[v] || s[0]);
	}

	public calculateWeek(date: any) : number {
		const time = date.getTime() + 4 * 24 * 60 * 60 * 1000;
		const firstDay = new Date(date.getFullYear() + "-1-1");
		return (
			Math.floor(Math.round((time - firstDay.getTime()) / 86400000) / 7) + 1
		);
	}

	public dateToDatetimelocal(now: Date): string {
		const year = now.getFullYear();
		const month = (now.getMonth() +1).toString().length === 1 ? '0' + (now.getMonth() + 1).toString() : now.getMonth() + 1;
		const date = now.getDate().toString().length === 1 ? '0' + (now.getDate()).toString() : now.getDate();
		const hours = now.getHours().toString().length === 1 ? '0' + now.getHours().toString() : now.getHours();
		const minutes = now.getMinutes().toString().length === 1 ? '0' + now.getMinutes().toString() : now.getMinutes();
		const seconds = now.getSeconds().toString().length === 1 ? '0' + now.getSeconds().toString() : now.getSeconds();

		const formattedDateTime = year + '-' + month + '-' + date + 'T' + hours + ':' + minutes + ':' + seconds;

		return formattedDateTime;
	}

	public dateToLaravelformat(now: Date): string {
		const year = now.getFullYear();
		const month = (now.getMonth() + 1).toString().length === 1 ? '0' + (now.getMonth() + 1).toString() : now.getMonth() + 1;
		const date = now.getDate().toString().length === 1 ? '0' + (now.getDate()).toString() : now.getDate();
		const hours = now.getHours().toString().length === 1 ? '0' + now.getHours().toString() : now.getHours();
		const minutes = now.getMinutes().toString().length === 1 ? '0' + now.getMinutes().toString() : now.getMinutes();
		const seconds = now.getSeconds().toString().length === 1 ? '0' + now.getSeconds().toString() : now.getSeconds();

		const formattedDateTime = year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds;

		return formattedDateTime;
	}

	public formatDate (dateString: string, isShort = false):string {
		const date = new Date(Date.parse(dateString));
		let temp;
		const options = {
			year: 'numeric',
			month: isShort ? 'short' : 'long',
		};

		try {
			temp = date.toLocaleDateString('eng-US', options);
		} catch {
			// fallback for unsupported browsers
			temp = date.toLocaleDateString();
		}

		return temp;
	}

	public toTitleCase(text: string): string {
		if(text == null) return "";
		text = text.trim();
		const sentence: string[] = text.toLowerCase().split(' ');
		for (let i = 0; i < sentence.length; i++) {
			sentence[i] = ( sentence[i][0] ? sentence[i][0].toUpperCase() : "" ) + sentence[i].slice(1);
		}
		return sentence.join(' ');
	}


	public toAcronym(text): string {
		if(text == null) return "";
		text = text.trim();
		return text.split(/\s/)
			.reduce((accumulator, word) => accumulator + word.charAt(0), '');
	}

	public htmlspecialchars_decode(str: string, quoteStyle= null): string {
		let optTemp = 0;
		let i = 0;
		let noquotes = false;
		if (typeof quoteStyle === 'undefined') {
			quoteStyle = 2;
		}
		str = str.toString()
			.replace(/&lt;/g, '<')
			.replace(/&gt;/g, '>');
		const OPTS = {
			ENT_NOQUOTES: 0,
			ENT_HTML_QUOTE_SINGLE: 1,
			ENT_HTML_QUOTE_DOUBLE: 2,
			ENT_COMPAT: 2,
			ENT_QUOTES: 3,
			ENT_IGNORE: 4
		};
		if (quoteStyle === 0) {
			noquotes = true;
		}
		if (typeof quoteStyle !== 'number') {
			// Allow for a single string or an array of string flags
			quoteStyle = [].concat(quoteStyle);
			for (i = 0; i < quoteStyle.length; i++) {
				// Resolve string input to bitwise e.g. 'PATHINFO_EXTENSION' becomes 4
				if (OPTS[quoteStyle[i]] === 0) {
					noquotes = true;
				} else if (OPTS[quoteStyle[i]]) {
					optTemp = optTemp || OPTS[quoteStyle[i]]; // dirubah dari bitwise
				}
			}
			quoteStyle = optTemp;
		}
		if (quoteStyle && OPTS.ENT_HTML_QUOTE_SINGLE) {
			// PHP doesn't currently escape if more than one 0, but it should:
			str = str.replace(/&#0*39;/g, '\'');
			// This would also be useful here, but not a part of PHP:
			// string = string.replace(/&apos;|&#x0*27;/g, "'");
		}
		if (!noquotes) {
			str = str.replace(/&quot;/g, '"');
		}
		// Put this in last place to avoid escape being double-decoded
		str = str.replace(/&amp;/g, '&');
		return str;
	}

	public dateDiffInString(d1: Date, d2: Date = null): string {
		const m1 = moment(d1.toISOString().split('T')[0]);
		const m2 = d2 == null ? moment().format('M/D/YYYY') : moment(d2.toISOString().split('T')[0]);
		return (<any>moment).preciseDiff(m1, m2, false);
	}

	public toReadable(obj, isDatetime = true): string {
		// INPUT:
		// {days: -0, hours: -15, minutes: -38, months: -0, seconds: -46.389, years: -0}
		let names;
		if (isDatetime) {
			names = {
				days: 'd', hours: 'h', minutes: 'min', months: 'm', seconds: 's', years: 'y'
			};
		} else {
			names = {
				days: 'd', months: 'm', years: 'y'
			};
		}
		return Object.keys(obj).reduce((acc, v) => {
			if (obj[v] != 0) acc.push(Math.abs(Math.ceil(obj[v])) + ' ' + names[v]);
			return acc;
		}, []).join(', ');
	}

	public getAcronym(str: string): string {
		const matches = str.match(/\b(\w)/g);
		const acronym = matches.join('');

		return acronym;
	}

	public truncateString(text: string, length: number): string {
		let result = '';

		if (text != null) {
			if (text.length <= length) {
				result = text;
			} else {
				result = text.substring(0, length);
				result += '...';
			}
		}

		return result;
	}

	public makeDate(dt: string, format: string = 'dd MMM yyyy'): string {
		if (dt) {
			const dt2 = new Date(dt);
			const date: string = dt2.getDate().toString();
			const month: string = (dt2.getMonth()+1).toString();
			const year: string = dt2.getFullYear().toString();

			if(format === 'dd MMM yyyy')
				// ini di -1 lagi karena disesuaikan dengan array (dimulai dr 0)
				return date + ' ' + this.months[dt2.getMonth()] + ' ' + year;
			else if(format === 'yyyy/MM/dd')
				return year.padStart(2, "0")+'/'+month.padStart(2, "0")+'-'+date.padStart(2, "0");
			else
				return year.padStart(2, "0")+'-'+month.padStart(2, "0")+'-'+date.padStart(2, "0");
		} else {
			return '';
		}
	}

	public makeTime(dt: string): string {
		const dt2 = new Date(dt.replace(/\second/, 'T'));
		const hour = dt2.getHours();
		const minute = dt2.getMinutes();

		return hour.toString().padStart(2, "0") + ':' + minute.toString().padStart(2, "0");
	}

	public getDatetime(dt: string): Date {
		if (dt == null) {
			return null;
		}
		if (dt === '') {
			return null;
		}
		let dt2 = null;
		try {
			dt2 = new Date(dt.replace(/\second/, 'T'));
			if (dt2 === 'Invalid Date') {
				return null;
			}

			return dt2;
		} catch ($e) {
			return null;
		}
	}

	public floor(i: number): number {
		return Math.floor(i) as number;
	}

	public round(i: number): number {
		return Math.round(i) as number;
	}

	public ceil(i: number): number {
		return Math.ceil(i) as number;
	}

	public dhm(t): [number, number, number, number] {
		const countDate = 24 * 60 * 60 * 1000;
		const countHour = 60 * 60 * 1000;
		const countMinute = 60 * 1000;
		const countSecond = 1000;
		let	date = Math.floor(t / countDate);
		let	hour = Math.floor( (t - date * countDate) / countHour);
		let	minute = Math.floor( (t - date * countDate - hour * countHour) / countMinute);
		const	second = Math.floor( (t - date * countDate - hour * countHour - minute * countMinute) / countSecond);
		/*const	pad = ((n) => {
			return n < 10 ? '0' + n : n;
		});*/
		if ( minute === 60 ) {
			hour++;
			minute = 0;
		}
		if ( hour === 24 ) {
			date++;
			hour = 0;
		}
		return [date % 7, hour, minute, second];
	}

	public twoDigitDate(value: any): string {
		return value.toString().length > 1 ? value.toString() : `0${value}`;
	}

	public getYoutubeId (youtubeUrl: any): any {
		let ID = '';
		youtubeUrl = youtubeUrl.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
		if (youtubeUrl[2] !== undefined) {
			ID = youtubeUrl[2].split(/[^0-9a-z_-]/i);
			ID = ID[0];
		} else {
			ID = youtubeUrl;
		}
		return ID;
	}

	public phoneToWAStyle(phone: string): string{
		phone = phone.trim();
		if(phone.length < 3)
			return phone;

		if(phone.startsWith('08')){
			phone = '628' + phone.substring(2);
		}
		if(!phone.startsWith('+')){
			phone = '+' + phone;
		}
		if(phone.length == 14) {
			phone = phone.substring(0, 3) + " " + phone.substring(3, 6) + "-" + phone.substring(6,10) + "-" + phone.substring(10);
		} else if(phone.length == 13) {
			phone = phone.substring(0, 3) + " " + phone.substring(3, 6) + "-" + phone.substring(6,10) + "-" + phone.substring(10);
		} else if(phone.length == 12) {
			phone = phone.substring(0, 3) + " " + phone.substring(3, 6) + "-" + phone.substring(6,9) + "-" + phone.substring(9);
		}

		return phone;
	}

	public capitalizeFirstWord (word: any): any {
		if (typeof word !== 'string') return '';
		return word.charAt(0).toUpperCase() + word.slice(1);
	}

	public toAlpha(val: number): string{
		const alnum = ['', 'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
		const len: number = alnum.length;

		let result = [];
		for(var i = 0; i < Math.floor(Math.log(val) / Math.log(len)); i++){
			result.push(0);
		}

		for(var i = val; i > 0; ) {
			for(var j = 9; j >= 0; j--){
				if(i / Math.pow(len, j) >= 1) {
					result[j] = Math.floor(i / Math.pow(len, j));
					i -= result[j] * Math.pow(len, j);
				}
			}
		}
		let result2 = "";
		for(var i = result.length - 1; i >= 0; i--){
			result2 += alnum[result[i]]+"";
		}

		return result2;
	}

	public changeEOLToBr(value: string): string{
		return value.replace(/\n/g, '<br />');
	}
}

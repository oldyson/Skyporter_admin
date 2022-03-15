export class Chat {

	constructor(
		public user: object,
		public body: string,
		public createdAt: Date
	) {
		this.user = user;
		this.body = body;
		this.createdAt = createdAt;
	}
}

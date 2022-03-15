import { Safebase64Pipe } from './safebase64.pipe';

describe('Safebase64Pipe', () => {
	it('create an instance', () => {
		const pipe = new Safebase64Pipe(null);
		expect(pipe).toBeTruthy();
	});
});

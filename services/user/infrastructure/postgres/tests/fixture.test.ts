import "reflect-metadata"
import { DbFixture } from "./test-utils/dbfixture";

describe('DbFixture', () => {
	test('Should initialize succesfully', async () => {
		const fixture = await DbFixture.getInstance();

		await fixture.destroy();
	});
});
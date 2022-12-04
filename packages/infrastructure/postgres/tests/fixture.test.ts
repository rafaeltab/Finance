import "reflect-metadata"
import { getFixture } from "./test-utils/dbfixture";

describe('DbFixture', () => {
	test('Should initialize succesfully', async () => {
		await getFixture();
	});
});
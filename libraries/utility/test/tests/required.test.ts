import { assertContains } from "#src/required";

describe("assetContains", () => { 
	it("Should throw if a field is missing on an object", () => { 
		const given: Partial<{cool: boolean, notcool: boolean}> = {
			cool: true
		}

		expect(() => {
			assertContains(given, ["cool", "notcool"])
		}).toThrow();
	})

	it("Should not throw if a field is missing on an object", () => {
		const given: Partial<{ cool: boolean, notcool: boolean }> = {
			cool: true,
			notcool: true
		}

		expect(() => {
			assertContains(given, ["cool", "notcool"])
		}).not.toThrow();
	})
})
/* eslint-disable @typescript-eslint/no-unused-expressions, max-classes-per-file */
import type {
	Constructor,
	AnyConstructor
} from "#src/constructor";


describe("Constructor", () => {
	it("Should match a constructor with specific arguments", () => {
		class CoolA {
			constructor(banana: string) {
				banana;
			}
		}

		const c: Constructor<CoolA, [banana: string]> = CoolA;

		c;
	});

	it("Should not match a constructor with wrongly typed argument", () => {
		class CoolA {
			constructor(banana: string) {
				banana;
			}
		}

		// @ts-expect-error should not allow string where we expect number
		const c: Constructor<CoolA, [banana: number]> = CoolA;

		c;
	});

	it("Should not match a constructor with too many arguments", () => {
		class CoolA {
			constructor(banana: string, cool: string) {
				banana;
				cool;
			}
		}

		// @ts-expect-error Too many arguments
		const c: Constructor<CoolA, [banana: string]> = CoolA;

		c;
	});
});

describe("AnyConstructor", () => {
	it("Should match any constructor with a specific return type", () => {
		class CoolA {
			constructor(public banana: string) {
				banana;
			}
		}

		class CoolB {
			constructor(public banana: string) {
				banana;
			}
		}

		const c: AnyConstructor<CoolA> = CoolA;
		const b: AnyConstructor<CoolA> = CoolB;

		c;
		b;
	});
	it("Should not match a constructor with wrong return type", () => {
		class CoolA {
			constructor(public banana: string) {
				banana;
			}
		}

		class CoolB {
			constructor(public zap: string) {
				zap;
			}
		}


		const c: AnyConstructor<CoolA> = CoolA;
		// @ts-expect-error should not match since CoolB has zap instead of banana
		const b: AnyConstructor<CoolA> = CoolB;

		c;
		b;
	});

	it("Should match a constructor with the same functions but different parameters", () => {
		class CoolA {
			constructor(banana: string) {
				banana;
			}

			public coolA() { 
				this;
			}
		}

		class CoolB {
			constructor(zap: string, cool: string) {
				zap;
				cool;
			}

			public coolA() {
				this;
			}
		}


		const c: AnyConstructor<CoolA> = CoolA;
		const b: AnyConstructor<CoolA> = CoolB;

		c;
		b;
	});
});
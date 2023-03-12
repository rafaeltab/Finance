import "reflect-metadata";
import { JobRepository } from "#src/repositories/jobRepository";
import { v4 } from "uuid";
import { arrayIdentityEquals, identityEquals } from "../test-utils/arrayUtils";
import { DbFixture, TestDataType } from "../test-utils/dbfixture";
import type { IJobRepository } from "@finance/svc-user-domain";

let fixture: DbFixture;
let testData: TestDataType;

let jobRepository: IJobRepository;

beforeAll(async () => {
	fixture = await DbFixture.getInstance();
	testData = fixture.getTestData();
}, 20000);

beforeEach(async () => {
	await fixture.resetUnitOfWork();
	jobRepository = fixture.getInstance(JobRepository);
});

afterAll(async () => {
	await fixture.destroy();
});

describe("getAllJobsForUser", () => {
	test('getAllJobsForUser should return all jobs for a user by its identity, with at least their uniqueIds and identities', async () => {
		const jobs = await jobRepository.getAllJobsForUser({
			identity: testData.user.identity
		}, testData.user.jobs!.length + 1, 0);

		expect(arrayIdentityEquals(jobs.data, testData.user.jobs!)).toBe(true);
	});

	test('getAllJobsForUser should return all jobs for a user by its uniqueId, with at least their uniqueIds and identities', async () => {
		const jobs = await jobRepository.getAllJobsForUser({
			uniqueId: testData.user.uniqueId
		}, testData.user.jobs!.length + 1, 0);

		expect(arrayIdentityEquals(jobs.data, testData.user.jobs!)).toBe(true);
	});
});

describe("get", () => {
	test('get should return the job identified by a uniqueId, with at the very least all identities set', async () => {
		const job = await jobRepository.get({
			uniqueId: testData.job.uniqueId
		});

		expect(identityEquals(job, testData.job)).toBe(true);
	});

	test('get should return the job identified by a identity, with at the very least all identities set', async () => {
		const job = await jobRepository.get({
			identity: testData.job.identity
		});

		expect(identityEquals(job, testData.job)).toBe(true);
	});

	test('get should throw when no job can be found for a given id', async () => {
		const uniqueId = v4();

		expect(async () => {
			await jobRepository.get({
				uniqueId
			});
		}).rejects.toThrow();
	});
});

describe("delete", () => {
	test('Should throw if no user with the given id is found', async () => {
		const uniqueId = v4();

		expect(async () => {
			await jobRepository.delete({
				uniqueId
			});
		}).rejects.toThrow();
	});

	test('Should delete a user if it\'s id is provided', async () => {
		const uniqueId = testData.job.uniqueId;

		await jobRepository.delete({
			uniqueId
		});

		expect(async () => {
			await jobRepository.get({
				uniqueId
			});
		}).rejects.toThrow();
	});
});

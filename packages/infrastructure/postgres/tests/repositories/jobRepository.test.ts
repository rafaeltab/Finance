import "reflect-metadata";
import { JobRepository } from "#src/repositories/jobRepository";
import { UnitOfWork } from "#src/unitOfWork/unitOfWork";
import { arrayIdentityEquals, identityEquals } from "../test-utils/arrayUtils";
import { getFixture } from "../test-utils/dbfixture";
import { v4 } from "uuid";

let jobRepository: JobRepository;
let testData: typeof import("d:/ShitsNGiggles/SoftwareEngineering/Typescript/finance/packages/infrastructure/postgres/tests/test-utils/fixture/testData");

beforeEach(async () => {
	const fixture = await getFixture()

	jobRepository = new JobRepository(new UnitOfWork(fixture[0]));
	testData = fixture[1];
});

describe("getAllJobsForUser", () => {
	test('getAllJobsForUser should return all jobs for a user by its identity, with at least their uniqueIds and identities', async () => {
		const jobs = await jobRepository.getAllJobsForUser({
			identity: testData.user.identity
		},testData.user.jobs.length + 1, 0);

		expect(arrayIdentityEquals(jobs.data, testData.user.jobs)).toBe(true);
	});

	test('getAllJobsForUser should return all jobs for a user by its uniqueId, with at least their uniqueIds and identities', async () => {
		const jobs = await jobRepository.getAllJobsForUser({
			uniqueId: testData.user.uniqueId
		}, testData.user.jobs.length + 1, 0);

		expect(arrayIdentityEquals(jobs.data, testData.user.jobs)).toBe(true);
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

	test('get should return null when no job can be found for a given id', async () => {
		const uniqueId = v4();

		const job = await jobRepository.get({
			uniqueId
		});

		expect(job).toBeNull();
	});
});

describe("delete", () => {
	test('Should do nothing if no user with the given id is found', async () => {
		const uniqueId = v4();

		await jobRepository.delete({
			uniqueId
		});

		const job = await jobRepository.get({
			uniqueId: testData.job.uniqueId
		});

		expect(job).not.toBeNull();
	});

	test('Should delete a user if it\'s id is provided', async () => {
		const uniqueId = testData.job.uniqueId;

		await jobRepository.delete({
			uniqueId
		});

		const job = await jobRepository.get({
			uniqueId
		});

		expect(job).toBeNull();
	});
});

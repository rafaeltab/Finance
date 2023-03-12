import "reflect-metadata";
import { JobFactory } from "#src/factories/jobFactory";
import { JobRepository } from "#src/repositories/jobRepository";
import { UserRepository } from "#src/repositories/userRepository";
import { DbFixture, TestDataType } from "../test-utils/dbfixture";
import type { IJobFactory, IJobRepository, IUserRepository } from "@finance/svc-user-domain";
import { expectNotNullOrUndefined, expectRequiredProps } from "#tests/test-utils/expectUtils";

let fixture: DbFixture;
let testData: TestDataType;

let jobFactory: IJobFactory;
let jobRepository: IJobRepository;
let userRepository: IUserRepository;

beforeAll(async () => {
	fixture = await DbFixture.getInstance();
	testData = fixture.getTestData();
}, 20000);

beforeEach(async () => {
	await fixture.resetUnitOfWork();
	jobFactory = fixture.getInstance(JobFactory);
	jobRepository = fixture.getInstance(JobRepository);
	userRepository = fixture.getInstance(UserRepository);
});

afterAll(async () => {
	await fixture.destroy();
});

describe("addJobToUser", () => {
	test('addJobToUser should create an entity with the given parameters and link it to a user', async () => {
		const data = {
			title: "Software Engineer",
			monthlySalary: 2000
		}

		const job = await jobFactory.addJobToUser({
			identity: testData.user.identity
		}, data.title, data.monthlySalary);

		expectNotNullOrUndefined(job);
		expectRequiredProps(job, ["uniqueId", "title", "activeIncome"]);

		expect(job.title).toBe(data.title);
		expect(job.activeIncome.monthlySalary).toBe(data.monthlySalary);

		const res = await jobRepository.get({
			identity: job.identity
		});

		expectNotNullOrUndefined(res);
		expectRequiredProps(res, ["uniqueId", "identity", "title", "activeIncome"]);

		expect(res.identity).toBe(job.identity);
		expect(res.title).toBe(data.title);
		expect(res.activeIncome.monthlySalary).toBe(data.monthlySalary);

		const user = await userRepository.get({
			uniqueId: testData.user.uniqueId
		}, ["jobs"])

		expectNotNullOrUndefined(user);
		expectRequiredProps(user, ["uniqueId", "identity", "jobs"]);

		const userJob = user.jobs.find(x => x.identity === job.identity);

		expectNotNullOrUndefined(userJob);
		expect(userJob.uniqueId).toBe(res.uniqueId);
	});
});

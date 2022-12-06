import "reflect-metadata";
import { JobFactory } from "#src/factories/jobFactory";
import { JobRepository } from "#src/repositories/jobRepository";
import { UnitOfWork } from "#src/unitOfWork/unitOfWork";
import { getFixture } from "../test-utils/dbfixture";
import { UserRepository } from "#src/repositories/userRepository";
JobFactory
let jobFactory: JobFactory;
let jobRepository: JobRepository;
let userRepository: UserRepository;
let unitOfWork: UnitOfWork;

let testData: typeof import("d:/ShitsNGiggles/SoftwareEngineering/Typescript/finance/packages/infrastructure/postgres/tests/test-utils/fixture/testData");

beforeEach(async () => {
	const fixture = await getFixture()

	unitOfWork = new UnitOfWork(fixture[0]);

	jobFactory = new JobFactory(unitOfWork);
	jobRepository = new JobRepository(unitOfWork);
	userRepository = new UserRepository(unitOfWork);
	
	testData = fixture[1];
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

		expect(job).not.toBeNull();
		expect(job).not.toBeUndefined();

		expect(job.uniqueId).not.toBeUndefined();
		expect(job.uniqueId).not.toBeNull();

		expect(job.title).toBe(data.title);
		expect(job.activeIncome.monthlySalary).toBe(data.monthlySalary);

		const res = await jobRepository.get({
			identity: job.identity
		});

		expect(res).not.toBeNull();
		expect(res).not.toBeUndefined();

		expect(res.uniqueId).not.toBeUndefined();
		expect(res.uniqueId).not.toBeNull();

		expect(res.identity).toBe(job.identity);
		expect(res.title).toBe(data.title);
		expect(res.activeIncome.monthlySalary).toBe(data.monthlySalary);

		const user = await userRepository.get({
			uniqueId: testData.user.uniqueId
		}, ["jobs"])

		const userJob = user.jobs.find(x => x.identity === job.identity);

		expect(userJob).not.toBeUndefined();
		expect(userJob).not.toBeNull();
		expect(userJob.uniqueId).toBe(res.uniqueId);
	});
});

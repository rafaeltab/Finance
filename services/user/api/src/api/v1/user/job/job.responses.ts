import type { ResponseType as JobsViewQueryResponse } from "@finance/svc-user-application/build/queries/jobViewQuery";
import type { ResponseType as CreateJobCommandResponse } from "@finance/svc-user-application/build/commands/createJobCommand";

import { ApiProperty } from "@nestjs/swagger";
import { JobResponse } from "../../responses/jobs.response";
import { PaginatedResponse, type PaginatedResponseData } from "../../responses/paginated.response";
import { SuccessResponse, type SuccessResponseData } from "../../responses/success.response";

class PaginatedJobResponse extends PaginatedResponse implements PaginatedResponseData<JobResponse> {
	@ApiProperty({
	    type: [JobResponse],
	})
	    data!: JobResponse[];
}
export class JobsViewResponse extends SuccessResponse implements SuccessResponseData<PaginatedJobResponse> {
	@ApiProperty({
	    type: PaginatedJobResponse
	})
	    data!: PaginatedJobResponse;

	static map(jobs: JobsViewQueryResponse): JobsViewResponse {
	    return {
	        success: true,
	        data: {
	            page: {
	                count: jobs.data.page.count,
	                offset: jobs.data.page.offset,
	                total: jobs.data.page.total
	            },
	            data: jobs.data.data.map(JobResponse.map)
	        }
	    }
	}
}

// Create a response for the createJobCommand
export class CreateJobResponse extends SuccessResponse implements SuccessResponseData<JobResponse> {
	@ApiProperty({
	    type: JobResponse
	})
	    data!: JobResponse;

	static map(job: CreateJobCommandResponse): CreateJobResponse {
	    return {
	        success: true,
	        data: JobResponse.map(job.data)
	    }
	}
}
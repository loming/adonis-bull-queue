/**
 * @loming/bull-queue
 *
 * @license MIT
 * @copyright Romain Lanz <romain.lanz@pm.me>
 */

declare module '@ioc:Loming/Queue' {
	import type { ConnectionOptions, WorkerOptions, QueueOptions, JobsOptions, Job, Queue as BullQueue } from 'bullmq';

	export type DataForJob<K extends string> = K extends keyof JobsList
		? JobsList[K]
		: Record<string, unknown>;

	export type DispatchOptions = JobsOptions & {
		queueName?: 'default' | string;
	};

	export type QueueConfig = {
		connection: ConnectionOptions;
		queue: QueueOptions;
		worker: WorkerOptions;
		jobs: JobsOptions;
	};

	interface QueueContract {
		dispatch<K extends keyof JobsList>(
			job: K,
			payload: DataForJob<K>,
			options?: DispatchOptions
		): Promise<Job>;
		dispatch<K extends string>(
			job: K,
			payload: DataForJob<K>,
			options?: DispatchOptions
		): Promise<Job>;
		process(): Promise<void>;
		waitUntilFinished({
			job,
			queueName,
			timeOut = 1000 * 60 * 10,
		}: {
			job: Job;
			queueName?: string;
			timeOut?: number;
		}): Promise<any>;
		clear(queueName?: string): Promise<void>;
		list(): Promise<Map<string, BullQueue>>;
		get(queueName?: string): BullQueue;
	}

	export interface JobHandlerContract {
		handle(payload: any): Promise<any>;
		failed(): Promise<void>;
	}

	/**
	 * An interface to define typed queues/jobs
	 */
	export interface JobsList {}

	export const Queue: QueueContract;

	export { Job };
}

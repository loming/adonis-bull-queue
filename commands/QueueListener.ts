/**
 * @loming/bull-queue
 *
 * @license MIT
 * @copyright Romain Lanz <romain.lanz@pm.me>
 */

import { BaseCommand, flags } from '@adonisjs/core/build/standalone';

export default class QueueListener extends BaseCommand {
	public static commandName = 'queue:listen';
	public static description = 'Listen to one or multiple queues';

	@flags.array({ alias: 'q', description: 'The queue(s) to listen on' })
	public queue: string[] = [];

	public static settings = {
		loadApp: true,
		stayAlive: true,
	};

	public async run() {
		const { Queue } = this.application.container.resolveBinding('Loming/Queue');
		const Config = this.application.container.resolveBinding('Adonis/Core/Config');
		const Router = this.application.container.use('Adonis/Core/Route');
		Router.commit();

		if (this.queue.length === 0) this.queue = Config.get('queue').queueNames;

		await Promise.all(
			this.queue.map((queue) =>
				Queue.process({
					queueName: queue,
				})
			)
		);
	}
}

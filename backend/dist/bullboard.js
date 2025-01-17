import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter.js';
import { ExpressAdapter } from '@bull-board/express';
import sessionCleanUpQueue from './queues/sessionCleanUpQueue.js';
import fileDeleteQueue from './queues/fileDeleteQueue.js';
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');
createBullBoard({
    queues: [
        new BullAdapter(sessionCleanUpQueue),
        new BullAdapter(fileDeleteQueue),
    ],
    serverAdapter,
});
export default serverAdapter;
//# sourceMappingURL=bullboard.js.map
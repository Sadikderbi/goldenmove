import { initDB } from '../lib/db';

async function init() {
    try {
        await initDB();
        console.log('Database initialized successfully');
        process.exit(0);
    } catch (error) {
        console.error('Database initialization failed:', error);
        process.exit(1);
    }
}

init();
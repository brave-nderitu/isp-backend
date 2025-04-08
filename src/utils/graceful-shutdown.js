const gracefulShutdown = (server, mongooseConnection) => {
    process.on('SIGINT', async () => {
        console.log('Received SIGINT. Gracefully shutting down...');
        
        try {
            await server.close();
            console.log('Server connections closed.');

            await mongooseConnection.close();
            console.log('Database connection closed.');

            process.exit(0);
        } catch (error) {
            console.error('Error during shutdown:', error);
            process.exit(1);
        }
    });

    process.on('SIGTERM', async () => {
        console.log('Received SIGTERM. Gracefully shutting down...');
        
        try {
            await server.close();
            console.log('Server connections closed.');

            await mongooseConnection.close();
            console.log('Database connection closed.');

            process.exit(0);
        } catch (error) {
            console.error('Error during shutdown:', error);
            process.exit(1);
        }
    });
};

module.exports = gracefulShutdown;
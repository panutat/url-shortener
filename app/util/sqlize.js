import Sequelize from 'sequelize';
import config from 'config';
import path from 'path';

// Utility for simplify database transactions over Sequelize
const sqlize = (() => {
    // Create new mysql connection
    const { host, database, user, password } = config.db;
    const sequelize = new Sequelize(database, user, password, {
        host,
        dialect: 'mysql',
        logging: false,
        pool: {
            maxConnections: 10,
            minConnections: 0,
            maxIdleTime: 10000,
        },
    });

    // Authenticate database connection
    sequelize.authenticate().then(() => {
        console.log('Sequelize connected to database successfully.');
    }).catch((err) => {
        console.log('Sequelize unable to connect to the database: ', err);
    });

    // Sync database tables
    sequelize.sync({
        force: config.db.cleanupAfterRestart,
    }).then(() => {
        console.log('Sync performed on all tables successfully.');
    }).catch((err) => {
        console.log('Sync on all tables failed: ', err);
    });

    // Import model definition
    const Link = sequelize.import(path.join(__dirname, '..', 'model', 'link'));

    return {
        Link: {
            findAll(callback) {
                Link.findAll().then((links) => {
                    callback(links);
                });
            },
            findById(id, callback) {
                Link.findById(id).then((link) => {
                    callback(link);
                });
            },
            create(data, callback) {
                const { desktopUrl, mobileUrl, tabletUrl } = data;
                const fields = { desktopUrl, mobileUrl, tabletUrl };
                Link.create(fields).then((link) => {
                    callback(link);
                });
            },
            updateUrlsById(id, data, callback) {
                const { desktopUrl, mobileUrl, tabletUrl } = data;
                const fields = { desktopUrl, mobileUrl, tabletUrl };
                const conditions = {
                    where: { id },
                };
                Link.update(fields, conditions).then((link) => {
                    callback(link);
                });
            },
            updateHitsById(id, data, callback) {
                const { desktopHits, mobileHits, tabletHits } = data;
                const fields = { desktopHits, mobileHits, tabletHits };
                const conditions = {
                    where: { id },
                };
                Link.update(fields, conditions).then((link) => {
                    callback(link);
                });
            },
            updateNewPostById(id, data, callback) {
                const { shortUrl, sinceCreated } = data;
                const fields = { shortUrl, sinceCreated };
                const conditions = {
                    where: { id },
                };
                Link.update(fields, conditions).then((link) => {
                    callback(link);
                });
            },
            destroyById(id, callback) {
                const conditions = {
                    where: { id },
                };
                Link.destroy(conditions).then((link) => {
                    callback(link);
                });
            },
        },
    };
})();

export default sqlize;

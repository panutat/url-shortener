import Sequelize from 'sequelize';
import config from 'config';

// Link model definition for Sequelize
function Link(sequelize) {
    return sequelize.define('links', {
        id: {
            type: Sequelize.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        shortUrl: {
            type: Sequelize.TEXT,
            field: 'short_url',
            validate: {
                isUrl: true,
            },
        },
        desktopUrl: {
            type: Sequelize.TEXT,
            field: 'desktop_url',
            validate: {
                isUrl: true,
            },
        },
        desktopHits: {
            type: Sequelize.INTEGER,
            field: 'desktop_hits',
            defaultValue: 0,
            validate: {
                isInt: true,
            },
        },
        mobileUrl: {
            type: Sequelize.TEXT,
            field: 'mobile_url',
            validate: {
                isUrl: true,
            },
        },
        mobileHits: {
            type: Sequelize.INTEGER,
            field: 'mobile_hits',
            defaultValue: 0,
            validate: {
                isInt: true,
            },
        },
        tabletUrl: {
            type: Sequelize.TEXT,
            field: 'tablet_url',
            validate: {
                isUrl: true,
            },
        },
        tabletHits: {
            type: Sequelize.INTEGER,
            field: 'tablet_hits',
            defaultValue: 0,
            validate: {
                isInt: true,
            },
        },
        sinceCreated: {
            type: Sequelize.TEXT,
            field: 'since_created',
        },
    }, {
        comment: 'Links table stores links submitted by users through the API',
        freezeTableName: true,
        initialAutoIncrement: config.db.initialAutoIncrement,
    });
}

export default Link;

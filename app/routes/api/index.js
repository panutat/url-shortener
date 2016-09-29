import express from 'express';
import config from 'config';
import shrtr from '../../util/shrtr';
import sqlize from '../../util/sqlize';
import time from '../../util/time';

// Function to get all links
const getLinks = (req, res) => {
    sqlize.Link.findAll((links) => {
        res.json({
            success: links != null,
            data: links,
        });
    });
};

// Function to get link by ID
const getLinkById = (req, res) => {
    sqlize.Link.findById(req.params.id, (link) => {
        res.json({
            success: link != null,
            data: link,
        });
    });
};

// Function to generate short code and created timestamp
const generateShortUrl = (link) => {
    const id = link.get('id');
    const createdAt = link.get('createdAt');
    return {
        shortUrl: `${config.server.host}:${config.server.port}/u/${shrtr.encode(id)}`,
        sinceCreated: time.ago(createdAt.toISOString().substring(0, 19).replace('T', ' ')),
    };
};

// Function to add new link
const postLink = (req, res) => {
    const { desktopUrl } = req.body;
    let { mobileUrl, tabletUrl } = req.body;

    // Validate params
    if (!desktopUrl) {
        res.json({
            success: false,
            error: 'Param desktopUrl must be provided.',
        });
        return;
    }
    if (!mobileUrl) {
        mobileUrl = desktopUrl;
    }
    if (!tabletUrl) {
        tabletUrl = mobileUrl;
    }

    const data = { desktopUrl, mobileUrl, tabletUrl };

    sqlize.Link.create(data, (link) => {
        if (link == null) {
            res.json({
                success: false,
                error: 'Link insert failed.',
            });
        } else {
            // Generator short url code and time since created
            const id = link.get('id');
            const update = generateShortUrl(link);

            sqlize.Link.updateNewPostById(id, update, (link2) => {
                if (link2[0] === 0) {
                    res.json({
                        success: false,
                        error: 'Link post update failed.',
                    });
                } else {
                    sqlize.Link.findById(id, (link3) => {
                        res.json({
                            success: true,
                            data: link3,
                        });
                    });
                }
            });
        }
    });
};

// Function to update link by ID
const putLinkById = (req, res) => {
    const id = req.params.id;
    const { desktopUrl } = req.body;
    let { mobileUrl, tabletUrl } = req.body;

    // Validate params
    if (!desktopUrl) {
        res.json({
            success: false,
            error: 'Param desktopUrl must be provided.',
        });
        return;
    }
    if (!mobileUrl) {
        mobileUrl = desktopUrl;
    }
    if (!tabletUrl) {
        tabletUrl = mobileUrl;
    }

    const data = { desktopUrl, mobileUrl, tabletUrl };

    sqlize.Link.updateUrlsById(id, data, (link) => {
        if (link[0] === 0) {
            res.json({
                success: false,
                error: 'Link update failed.',
            });
        } else {
            sqlize.Link.findById(id, (link2) => {
                res.json({
                    success: true,
                    data: link2,
                });
            });
        }
    });
};

// Function to delete link by ID
const deleteLinkById = (req, res) => {
    const id = req.params.id;
    sqlize.Link.destroyById(id, (link) => {
        if (link === 0) {
            res.json({
                success: false,
                error: 'Link delete failed.',
            });
        } else {
            res.json({
                success: true,
                data: link,
            });
        }
    });
};

// Setup express router
const router = express.Router();

// Configure route for retrieving all links
router.get('/links', getLinks);

// Configure route for retrieving links by id
router.get('/links/:id', getLinkById);

// Configure route for adding a new links
router.post('/links', postLink);

// Configure route for updating links
router.put('/links/:id', putLinkById);

// Configure route for deleting links by id
router.delete('/links/:id', deleteLinkById);

export default router;

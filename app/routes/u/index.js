import express from 'express';
import MobileDetect from 'mobile-detect';
import sqlize from '../../util/sqlize';
import shrtr from '../../util/shrtr';

// Function to update link hits count
const updateHit = (id, update, callback) => {
    sqlize.Link.updateHitsById(id, update, (link) => {
        if (!link) {
            const error = {
                success: false,
                error: 'Link could not be updated.',
            };
            callback(error);
        } else {
            callback(null);
        }
    });
};

// Function to get capabilities
const getCapabilities = (req) => {
    // Detect client device
    const md = new MobileDetect(req.headers['user-agent']);
    const isMobile = md.phone();
    const isTablet = md.tablet();
    return {
        isMobile,
        isTablet,
    };
};

// Function to decode short code to db id
const decode = id => shrtr.decode(id);

// Function to get link and redirect
const get = (req, res) => {
    // Get capabilities
    const { isMobile, isTablet } = getCapabilities(req);

    // Decode shortened URL string into database URL id
    const id = decode(req.params.id);

    // Find link to update hits
    sqlize.Link.findById(id, (link) => {
        if (!link) {
            res.json({
                success: false,
                error: 'Link could not be found.',
            });
        } else {
            const update = link;

            // Increment hit count
            if (isMobile) {
                update.mobileHits += 1;
            } else if (isTablet) {
                update.tabletHits += 1;
            } else {
                update.desktopHits += 1;
            }

            // Update database
            updateHit(id, update, (err) => {
                if (err) {
                    res.json(err);
                } else if (isMobile) {
                    res.redirect(update.mobileUrl);
                } else if (isTablet) {
                    res.redirect(update.tabletUrl);
                } else {
                    res.redirect(update.desktopUrl);
                }
            });
        }
    });
};

// Setup express router
const router = express.Router();

// Configure route for getting URL by id
router.get('/:id', get);

export default router;

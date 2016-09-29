import supertest from 'supertest';
import should from 'should';
import config from 'config';

const input = {
    desktopUrl: config.test.urls.desktop,
    mobileUrl: config.test.urls.mobile,
    tabletUrl: config.test.urls.tablet,
};

const request = supertest.agent(`${config.server.host}:${config.server.port}`);

// Helper functions
const create = (data, callback) => {
    request
        .post('/api/links')
        .send(data)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
            callback(err, res);
        });
};

const find = (id, callback) => {
    request
        .get(`/api/links/${id}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
            callback(err, res);
        });
};

const findAll = (callback) => {
    request
        .get('/api/links')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
            callback(err, res);
        });
};

const update = (id, data, callback) => {
    request
        .put(`/api/links/${id}`)
        .send(data)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
            callback(err, res);
        });
};

const cleanup = (id, callback, override = false) => {
    if (config.test.cleanup || override) {
        request
            .delete(`/api/links/${id}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                callback(err, res);
            });
    } else {
        callback(null, {});
    }
};

const goto = (url, callback) => {
    const request2 = supertest.agent('');
    request2
        .get(url)
        .expect(302)
        .end((err, res) => {
            callback(err, res);
        });
};

describe('POST /api/links', () => {
    it('Should create new link', (done) => {
        // Add new link to test delete
        create(input, (err, res) => {
            // Check that API returns success
            should(err).equal(null);
            should(res.body).have.property('success').which.equal(true);
            should(res.body).have.property('data').be.instanceof(Object);

            // Cleanup by deleting
            cleanup(res.body.data.id, () => {
                done();
            });
        });
    });
});

describe('PUT /api/links/:id', () => {
    it('Should update link by id', (done) => {
        // Add new link to test update
        create(input, (err, res) => {
            // Update urls
            const changes = res.body.data;
            changes.desktopUrl += '&update=true';
            changes.mobileUrl += '&update=true';
            changes.tabletUrl += '&update=true';

            // Update database
            update(res.body.data.id, changes, (err2, res2) => {
                // Check that API returns success
                should(err2).equal(null);
                should(res2.body).have.property('success').which.equal(true);
                should(res2.body).have.property('data').be.instanceof(Object);

                // Cleanup by deleting
                cleanup(res.body.data.id, () => {
                    done();
                });
            });
        });
    });
});

describe('DELETE /api/links/:id', () => {
    it('Should delete link by id', (done) => {
        // Add new link to test delete
        create(input, (err, res) => {
            // Cleanup by deleting
            cleanup(res.body.data.id, (err2, res2) => {
                // Check that API returns success
                should(err2).equal(null);
                should(res2.body).have.property('success').which.equal(true);
                should(res2.body).have.property('data').which.equal(1);

                done();
            }, true);
        });
    });
});

describe('GET /api/links', () => {
    it('Should get array of all links', (done) => {
        // Add 2 new links and save IDs for cleanup
        const ids = [];
        create(input, (err, res) => {
            ids.push(res.body.data.id);
            create(input, (err2, res2) => {
                ids.push(res2.body.data.id);
                findAll((err3, res3) => {
                    // Check that API returns success
                    should(err3).equal(null);
                    should(res3.body).have.property('success').which.equal(true);
                    should(res3.body).have.property('data').be.instanceof(Array);

                    // Check that there are at least 2 links we created for test
                    should(res3.body.data.length).be.above(1);

                    // Loop through array and inspect each link
                    res3.body.data.forEach((link) => {
                        should(link).be.an.instanceOf(Object);
                        should(link).and.have.property('id').which.is.a.Number();
                    });

                    // Cleanup each created link
                    ids.forEach((id) => {
                        cleanup(id, () => {});
                    });

                    done();
                });
            });
        });
    });
});

describe('GET /api/links/:id', () => {
    it('Should get link by id', (done) => {
        // Add new link to test find by id
        create(input, (err, res) => {
            find(res.body.data.id, (err2, res2) => {
                // Check that API returns success
                should(err2).equal(null);
                should(res2.body).have.property('success').which.equal(true);
                should(res2.body).have.property('data').be.instanceof(Object);
                should(res2.body.data).and.have.property('id').which.is.a.Number();

                // Cleanup by deleting
                cleanup(res.body.data.id, () => {
                    done();
                });
            });
        });
    });
});

describe('GET /u/:short', () => {
    it('Should redirect link to target', (done) => {
        // Add new link to test short redirect
        create(input, (err, res) => {
            goto(res.body.data.shortUrl, (err2, res2) => {
                // Check that API redirected successfully
                should(err2).equal(null);
                should(res2.redirect).equal(true);
                should(res2.header.location).equal(res.body.data.desktopUrl);

                // Cleanup by deleting
                cleanup(res.body.data.id, () => {
                    done();
                });
            });
        });
    });
});

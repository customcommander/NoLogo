var helpers   = require('./helpers');
var webdriver = require('selenium-webdriver');
var expect    = require('chai').expect;

describe('The extension', function () {

    var driver;

    beforeEach(function () {
        driver = helpers.getChromeDriver();
    });

    afterEach(function () {
        driver.quit();
    });

    it('should install without error',function (done) {

        // Assumes we're on the page that lists all installed extensions
        function assertNoLogoIsInstalled() {
            return driver
                // Finds all extensions titles elements on the page
                // Returns an array of WebElement instances
                .findElements( webdriver.By.className('extension-title') )
                // Then extracts elements texts.
                // Returns an array of strings.
                .then(function (elements) {
                    var titles = elements.map(function (elt) {
                        return elt.getText();
                    });
                    return webdriver.promise.all(titles);
                })
                // Then asserts that 'NoLogo' is present in that array.
                .then(function (titles) {
                    var present = titles.some(function (title) {
                        return title === 'NoLogo';
                    });
                    expect(present).to.be.true;
                });
        }

        driver
            .get('chrome://extensions-frame')
            .then(assertNoLogoIsInstalled)
            .then(done);
    });
});

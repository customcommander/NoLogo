var webdriver = require('selenium-webdriver');
var chrome = require('selenium-webdriver/chrome');
var path = require('path');

function getChromeDriver() {
    var builder = new webdriver.Builder();
    var options = new chrome.Options();
    var caps    = webdriver.Capabilities.chrome();

    // If there is a major error in the extension (e.g. corrupt manifest file)
    // Chrome will display a modal window which will block the entire tests suite.
    // That window doesn't seem to be something that WebdriverJS can capture before it occurs.
    options.addArguments('noerrdialogs');

    options.addExtensions( path.resolve(__dirname, '../NoLogo.crx') );

    // If tests are run on Travis
    if (process.env.TRAVIS) {
        builder.usingServer(
            'http://'+process.env.SAUCE_USERNAME+':'+process.env.SAUCE_ACCESS_KEY+
                '@ondemand.saucelabs.com:80/wd/hub');

        caps.set('tunnel-identifier', process.env.TRAVIS_JOB_NUMBER);
        caps.set('build'            , process.env.TRAVIS_BUILD_NUMBER);
        caps.set('username'         , process.env.SAUCE_USERNAME);
        caps.set('accessKey'        , process.env.SAUCE_ACCESS_KEY);
        caps.set('platform'         , 'OS X 10.10');
        caps.set('version'          , '44.0');
    }

    builder.setChromeOptions(options);
    builder.withCapabilities(caps);

    return builder.build();
}

module.exports = {
    getChromeDriver: getChromeDriver
};

var program = require('commander').program;
var execSync = require('child_process').execSync;
var promisify = require('util').promisify;
var dependencies = [["conda", "curl -O https://repo.anaconda.com/archive/Anaconda3-2023.03-1-MacOSX-x86_64.sh"], ["python3", "brew install"], ["ffmpeg", "conda install ffmpeg -c conda-forge"], ["demucs", "python3 -m pip install --user -U demucs"]];
program
    .name('ArtiAudio')
    .description('An audio CLI powered by AI.')
    .version('0.0.1');
program.command('dependencies')
    .description('List the dependencies of the project')
    .action(function () {
    console.log(dependencies);
});
program.command('setup')
    .description('Setup the project')
    .action(function () {
    console.log('Setting up the project...');
    var dependenciesToInstall = [];
    dependencies.forEach(function (dependency) {
        console.log("Checking for ".concat(dependency, "..."));
        try {
            execSync("".concat(dependency[0], " --version"));
        }
        catch (error) {
            dependenciesToInstall.push(dependency);
        }
    });
    if (dependenciesToInstall.length > 0) {
        console.log("Installing ".concat(dependenciesToInstall.join(', '), "..."));
        dependenciesToInstall.forEach(function (dependency) {
            execSync(dependency[1]);
        });
    }
});
program.command('split')
    .description('Split a string into substrings and display as an array')
    .argument('<string>', 'string to split')
    .option('--first', 'display just the first substring')
    .option('-s, --separator <char>', 'separator character', ',')
    .action(function (str, options) {
    var limit = options.first ? 1 : undefined;
    console.log(str.split(options.separator, limit));
});
program.parse();

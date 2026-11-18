<?php
namespace Deployer;

require 'recipe/laravel.php';
require 'contrib/php-fpm.php';
require 'contrib/npm.php';
// Config

set('repository', 'git@github.com:JohnyD2042/analyst-olympics-landing.git');
set('php_fpm_version', '8.1');
set('http_user', 'nginx');
set('http_group', 'nginx');
set('user', 'root');
set('writable_mode', 'chown');
set('writable_recursive', true);
set('git_tty', true);
set('keep_releases', 2);
set('default_timeout', 6000);

// add('shared_files', []);
//add('shared_dirs', ['public/storage']);
//add('writable_dirs', ['public/storage']);

// Prod
host('84.38.177.115')
    ->setPort(52211)
    // ->set('target', '5a539ed7efa7b366063293bad3abfbfb2a4b3ce9')
    ->set('stage', 'prod')
    ->set('remote_user', 'root')
    ->set('deploy_path', '/srv/konkurs_srochka_landing')
    ->set('branch', 'main')
    ->set('keep_releases', 1);

task('deploy:owner', function () {
    run('chown -R nginx:nginx /srv/konkurs_srochka_landing/current/');
});


task('deploy', [
    'deploy:prepare',
    'bun:install',
    'deploy:publish',
    'npm:restart',
    'deploy:owner'
]);

task('bun:install', function () {
    cd('{{release_path}}');
    run('bun install');
    run('bun run build');
});

task('npm:restart', function () {
    cd('/srv/konkurs_srochka_landing/current');
    run('cp .output/server/index.mjs .output/server/server.mjs');
    run('pm2 delete konkurs_srochka_landing');
    run('pm2 start npm --name "konkurs_srochka_landing" -- run preview');
});
// Hooks

after('deploy:failed', 'deploy:unlock');
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
    ->set('stage', 'prod')
    ->set('remote_user', 'root')
    ->set('deploy_path', '/srv/konkurs_landing')
    ->set('branch', 'main')
    ->set('keep_releases', 1);

task('deploy:owner', function () {
    run('chown -R nginx:nginx /srv/konkurs_landing/current/');
});

// Stage

/*
host('84.38.177.115')
    ->setPort(52210)
    ->set('stage', 'stage')
    ->set('remote_user', 'root')
    ->set('deploy_path', '/srv/stage_admin')
    ->set('branch', 'master')
    ->set('http_user', 'www-data')
    ->set('http_group', 'www-data')
    ->set('keep_releases', 1);

task('deploy:owner', function () {
    run('chown -R www-data:www-data /srv/stage_admin/current/');
});*/


task('deploy', [
    'deploy:prepare',
    //'deploy:vendors',
    //'artisan:storage:link',
    //'artisan:config:cache',
    //'artisan:route:cache',
    //'artisan:view:cache',
    //'artisan:migrate',
    // 'npm:install',
    'bun:install',
    'deploy:publish',
    //'npm:restart',
    'deploy:owner'
]);

task('bun:install', function () {
    cd('{{release_path}}');
    run('bun install');
    run('bun run build');
});

task('npm:restart', function () {
    cd('/srv/konkurs_landing/current');
    // run('pm2 delete 1');
    //run('pm2 start npm --name "konkurs_landing" -- run preview');
});
// Hooks

after('deploy:failed', 'deploy:unlock');

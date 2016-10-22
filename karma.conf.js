//jshint strict: false
module.exports = function(config) {
  config.set({

    browserDisconnectTimeout : 5000,

    browserNoActivityTimeout : 30000,

    basePath: './public',

    files: [
      'yamap/yamaps.js',
      'bower_components/underscore/underscore.js',
      'bower_components/jquery/dist/jquery.js',
      'bower_components/angular/angular.js',
      'bower_components/ng-sortable/dist/ng-sortable.js',
      'bower_components/angular-mocks/angular-mocks.js',
      '**/*.module.js',
      '*!(.module|.spec).js',
      '!(bower_components)/**/*!(.module|.spec).js',
      '**/*.spec.js'
    ],

    autoWatch: true,

    frameworks: ['jasmine'],

    browsers: ['Chrome', 'Firefox'],

    plugins: [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-jasmine'
    ]

  });
};

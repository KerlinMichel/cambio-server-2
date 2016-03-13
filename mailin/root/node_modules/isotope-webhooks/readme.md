Webhooks-Isotope
=================================================================
a simple nodejs / npm package for easily making a webhooks server



##examples (fake)
````
var webhooks = require('isotope-webhooks');
webhooks.listen('tmathmeyer/webhooks', function(repository) {
    console.log(repository.full_name);
});

webhooks.listen('tmathmeyer/rwpcd', function(repository) {
    console.log(repository.owner.email);
});

webhooks.listen('all', function(repository) {
    // this gets called on EVERY webhook update
    console.log(repository.name);
});
````

define(["jquery", "base/util", "modernizr", "fastclick", "svg4everybody"], function ($, Util, Modernizr) {
    var signupform;
    signupform = $('.newsletter-signup');
    if (signupform.length) {
        return require(["modules/form"], function (Form) {
            return new Form({
                $element: signupform
            });
        });
    }
});

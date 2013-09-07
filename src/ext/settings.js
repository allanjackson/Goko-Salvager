/*jslint browser: true, devel: true, indent: 4, vars: true, nomen: true, regexp: true, forin: true */
/*global $, _, */

/*
 * GokoSalvager Configuration module
 *
 * Goko dependencies: none
 * Internal dependencies: none
 */
(function () {
    "use strict";

    // All extension globals should be defined here
    window.GokoSalvager = window.GokoSalvager || {};
    var gs = window.GokoSalvager;

    var default_options = {
        autokick_by_rating: true,
        autokick_by_forname: true,
        alert_popups: false,
        alert_sounds: true,
        generator: true,
        proranks: true,
        sortrating: true,
        adventurevp: true,
        logviewer: true,
        vp_request: true,
        vp_disallow: false,
        always_stack: false,
        blacklist: [],
        automatch_blacklist: [],
        automatch_on_seek: true,
        automatch_min_players: 2,
        automatch_max_players: 2,
        automatch_min_sets: 1,
        automatch_max_sets: 15,
        automatch_rSystem: 'pro',
        automatch_rdiff: 1500
    };

    gs.get_options = function () {
        var opts;
        try {
            opts = JSON.parse(localStorage.salvagerOptions);
        } catch (e) {
            gs.set_options(default_options);
            opts = JSON.parse(localStorage.salvagerOptions);
        }

        var optname;
        for (optname in default_options) {
            if (!opts.hasOwnProperty(optname)) {
                opts[optname] = default_options[optname];
            }
        }
        return opts;
    };

    gs.set_options = function (options) {
        localStorage.salvagerOptions = JSON.stringify(options);
    };

    gs.get_option = function (optName) {
        return gs.get_options().hasOwnProperty(optName)
            ? gs.get_options()[optName]
            : default_options[optName];
    };

    gs.set_option = function (optionName, optionValue) {
        var opts = gs.get_options();
        opts[optionName] = optionValue;
        gs.set_options(opts);
    };
}());

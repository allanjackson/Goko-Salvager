/*jslint browser: true, devel: true, indent: 4, maxlen: 90, es5: true */
/*global jQuery, $, angular */

(function () {
    "use strict"; // JSList mode

    var gs = window.GokoSalvager;
    gs.AM = gs.AM || {};

    gs.AM.appendSeekPopup = function (viewport) {
        viewport.append([
            '<div id="seekAAPop" title="Looking for Match">',
            '<p>Automatch is looking for players whose ',
            '   search criteria match your table.</p>',
            '<button id="seekAAStop">Stop Looking</button>',
            '<button id="seekAAOkay">Keep Looking</button>',
            '</div>'
        ].join(''));

        $('#seekAAPop').dialog({
            modal: false,
            width: 500,
            draggable: true,
            resizeable: false,
            autoOpen: false
        });

        $('#seekAAStop').click(function () {
            gs.AM.showSeekPop(false);
            gs.AM.cancelSeek();
        });

        $('#seekAAOkay').click(function () {
            gs.AM.showSeekPop(false);
        });

        viewport.append([
            '<div id="seekPop" title="Request Automatch" ng:app ',
            '     ng:controller="gokoSalvagerUserSettingsController">',
            '  <table>',
            '    <tr>',
            '      <td colspan="2">',
            '        <label>Min Players:</label>',
            '        <select id="minPlayers" ng:model="us.automatch_min_players">',
            '          <option value="2">2</option>',
            '          <option value="3">3</option>',
            '          <option value="4">4</option>',
            '          <option value="5">5</option>',
            '          <option value="6">6</option>',
            '        </select>',
            '      </td>',
            '      <td colspan="2">',
            '        <label>Min Sets:</label>',
            '        <select id="minSets" ng:model="us.automatch_min_sets">',
            '          <option selected value="1">Base Only</option>',
            '          <option value="2">2</option>',
            '          <option value="3">3</option>',
            '          <option value="4">4</option>',
            '          <option value="5">5</option>',
            '          <option value="6">6</option>',
            '          <option value="7">7</option>',
            '          <option value="8">8</option>',
            '          <option value="9">9</option>',
            '          <option value="10">10</option>',
            '          <option value="12">12</option>',
            '          <option value="13">13</option>',
            '          <option value="14">14</option>',
            '          <option value="15">All Cards</option>',
            '        </select>',
            '      </td>',
            '    </tr>',
            '    <tr>',
            '      <td colspan="2">',
            '        <label>Max Players:</label>',
            '        <select id="maxPlayers" ng:model="us.automatch_max_players">',
            '          <option value="2">2</option>',
            '          <option value="3">3</option>',
            '          <option value="4">4</option>',
            '          <option value="5">5</option>',
            '          <option value="6">6</option>',
            '        </select>',
            '      </td>',
            '      <td colspan="2">',
            '        <label>Max Sets:</label>',
            '        <select id="maxSets" ng:model="us.automatch_max_sets">',
            '          <option value="1">Base Only</option>',
            '          <option value="2">2</option>',
            '          <option value="3">3</option>',
            '          <option value="4">4</option>',
            '          <option value="5">5</option>',
            '          <option value="6">6</option>',
            '          <option value="7">7</option>',
            '          <option value="8">8</option>',
            '          <option value="9">9</option>',
            '          <option value="10">10</option>',
            '          <option value="12">12</option>',
            '          <option value="13">13</option>',
            '          <option value="14">14</option>',
            '          <option selected value="15">All Cards</option>',
            '        </select>',
            '      </td>',
            '    </tr>',
            '  </table>',
            '  <table>',
            '    <tr>',
            '      <td colspan="1">',
            '        <label>Rating +/-</label>',
            '      </td>',
            '      <td colspan="1">',
            '        <input type="number" id="rdiff" value="2000" size="4"',
            '               ng:model="us.automatch_rdiff"/>',
            '      </td>',
            '    </tr>',
            '    <tr>',
            '      <td colspan="1">',
            '        <label>System</label>',
            '      </td>',
            '      <td colspan="1">',
            '        <select id="ratingSystem" ng:model="us.automatch_rSystem">',
            '          <option value="pro">Pro</option>',
            '          <option value="casual">Casual</option>',
            '          <option value="unrated">Unrated</option>',
            '        </select>',
            '      </td>',
            '    </tr>',
            '    <tr>',
            '      <td colspan="1">',
            '        <input type="submit" id="seekreq" value="Submit"',
            '               ng:click="save(us)" />',
            '      </td>',
            '      <td colspan="1">',
            '        <input type="submit" id="seekcan" value="Cancel" />',
            '      </td>',
            '      <td colspan="1">',
            '        <input type="submit" id="seekhide" value="Hide" />',
            '      </td>',
            '    </tr>',
            '    <tr>',
            '      <td colspan="4">',
            '        <div id="seekstatus"></div>',
            '      </td>',
            '    </tr>',
            '  </table>',
            '</div>'
        ].join(''));

        // Override Goko's "hide select elements by default" css
        $('#seekPop select').css('visibility', 'inherit');
        $('#seekPop select').css('top', 'auto');

        $('#seekPop').dialog({
            modal: false,
            width: 550,
            draggable: true,
            resizeable: false,
            autoOpen: false
        });

        // Submit request
        $('#seekreq').click(function () {
            var np, ns, rr, rs;
            console.log('requested seek');

            np = {rclass: 'NumPlayers', props: {}};
            np.props.min_players = parseInt($('#minPlayers').val(), 10);
            np.props.max_players = parseInt($('#maxPlayers').val(), 10);

            ns = {rclass: 'NumSets', props: {}};
            ns.props.min_sets = parseInt($('#minSets').val(), 10);
            ns.props.max_sets = parseInt($('#maxSets').val(), 10);

            rr = {rclass: 'RelativeRating', props: {}};
            rr.props.pts_lower = parseInt($('#rdiff').val(), 10);
            rr.props.pts_higher = parseInt($('#rdiff').val(), 10);
            rr.props.rating_system = $('#ratingSystem').val();

            rs = {rclass: 'RatingSystem', props: {}};
            rs.props.rating_system = $('#ratingSystem').val();

            // Clear any cached table information from an automatch request
            // that was generated through a table create.
            gs.AM.tableSettings = null;

            // Send seek request
            gs.AM.submitSeek({
                player: gs.AM.player,
                requirements: [np, ns, rr, rs]
            });

            // Hide the dialog
            gs.AM.showSeekPop(false);
        });

        // Cancel outstanding request, if any, and close dialog
        $('#seekcan').click(function () {
            gs.AM.cancelSeek();
            gs.AM.showSeekPop(false);
        });

        $('#seekhide').click(function () {
            gs.AM.showSeekPop(false);
        });


        /*
         * Input validation
         */

        $('#minPlayers').change(function () {
            if (parseInt($('#minPlayers').val(), 10)
                    > parseInt($('#maxPlayers').val(), 10)) {
                $('#maxPlayers').val($('#minPlayers').val());
            }
        });

        $('#maxPlayers').change(function () {
            if (parseInt($('#maxPlayers').val(), 10)
                    < parseInt($('#minPlayers').val(), 10)) {
                $('#minPlayers').val($('#maxPlayers').val());
            }
        });

        $('#minSets').change(function () {
            if (parseInt($('#minSets').val(), 10)
                    > parseInt($('#maxSets').val(), 10)) {
                $('#maxSets').val($('#minSets').val());
            }
        });

        $('#maxSets').change(function () {
            if (parseInt($('#maxSets').val(), 10)
                    < parseInt($('#minSets').val(), 10)) {
                $('#minSets').val($('#maxSets').val());
            }
        });

        angular.bootstrap(window.document.getElementById('seekPop'));
    };

    // Update and show/hide the dialog
    gs.AM.showSeekPop = function (visible) {
        var seeking, canceling;

        seeking = (gs.AM.state.seek !== null);
        canceling = seeking && gs.AM.state.seek.hasOwnProperty('canceling');

        $('#seekPop select').prop('disabled', seeking || canceling);
        $('#seekPop input').prop('disabled', seeking || canceling);
        $('#seekreq').prop('disabled', seeking || canceling);
        $('#seekcan').prop('disabled', canceling);
        $('#seekhide').prop('disabled', false);
        $('#seekstatus').html(seeking ? 'Looking for a match...' : '');

        if (typeof visible === "undefined") {
            visible = true;
        }

        if (gs.AM.state.seek !== null && gs.AM.tableSettings !== null) {
            $('#seekAAPop').dialog(visible ? 'open' : 'close');
            $('#seekAAOkay').focus();
        } else {
            $('#seekPop').dialog(visible ? 'open' : 'close');
            $('#seekhide').focus();
        }
    };
}());

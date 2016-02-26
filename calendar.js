// Your Client ID can be retrieved from your project in the Google
// Developer Console, https://console.developers.google.com
var CLIENT_ID = '704141438850-22e6f1ueki7eu1t02m1ca9hk9fhojlmf.apps.googleusercontent.com';
var SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];
var CalendarAuth = false;
/**
 * Check if current user has authorized this application.
 */
function checkAuth() {
    gapi.auth.authorize(
        {
            'client_id': CLIENT_ID,
            'scope': SCOPES.join(' '),
            'immediate': true
        }, handleAuthResult);
}

/**
 * Handle response from authorization server.
 *
 * @param {Object} authResult Authorization result.
 */
function handleAuthResult(authResult) {
    if (authResult && !authResult.error) {
        loadCalendarApi();
    }
}
/**
 * Initiate auth flow in response to user clicking authorize button.
 *
 * @param {Event} event Button click event.
 */
function handleAuthClick() {
    gapi.auth.authorize(
        {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
        handleAuthResult);
    return false;
}

/**
 * Load Google Calendar client library. List upcoming events
 * once client library is loaded.
 */
function loadCalendarApi() {
    gapi.client.load('calendar', 'v3', function () {
        CalendarAuth = true;
    });
}

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

function getBirthdays() {
    var request = gapi.client.calendar.events.list({
        'calendarId': '#contacts@group.v.calendar.google.com',
        'timeMin': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 10,
        'orderBy': 'startTime'
    });
    request.execute(function (resp) {
        var events = resp.items;
        if (events.length > 0) {
            var i = 0;
            Objects.ListContainer.html('');
            for (; i < events.length; i++) {
                var event = events[i],
                    summary = event.summary,
                    date = event.start.date;
                Objects.ListContainer.append('<div class="ListItem"><b>' + toTitleCase(summary) + '</b><br/><span>' + date + '</span></div>');
            }
            t.fromTo(Objects.ListContainer, 1, {
                opacity: 0,
                display: 'block'
            }, {
                opacity: 1,
                ease: Power4.easeOut
            });
            t.staggerFromTo(Objects.ListContainer.children(), 1, {
                y: 50,
                opacity: 0
            }, {
                y: 0,
                opacity: 1,
                ease: Power4.easeOut
            }, 0.1);
        } else alert('No Birthdays!');
    });
}

function getEvents(onlyUpcoming, phoneNumber) {
    var request = gapi.client.calendar.events.list({
        'calendarId': 'primary',
        'timeMin': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 10,
        'orderBy': 'startTime'
    });
    request.execute(function (resp) {
        var events = resp.items;
        if (events.length > 0) {
            if (onlyUpcoming) {
                var event = events[0],
                    summary = event.summary,
                    timeFrom = event.start.dateTime.substring(11, 16),
                    dateFrom = event.start.dateTime.substring(0, 10),
                    dateTo = event.end.dateTime.substring(0, 10),
                    timeTo = event.end.dateTime.substring(11, 16),
                    location = event.location;
                var Body = 'Socius here, ' + summary + ' is coming up at ' + timeFrom + ' - ' + timeTo + ' on ' +
                    dateFrom + ' - ' + dateTo + ' at ' + location;
                $.get('http://localhost/Socius/exotelSendSMS.php?To=' + phoneNumber + '&Body=' + Body.replace(' ', '%20'), function (data) {
                    if ((JSON.parse(data).status == 200)) {
                        alert('Message sent for the upcoming event.');
                    } else alert('Message couldn\'t be send.');
                });
            } else {
                var i = 0;
                Objects.ListContainer.html('');
                for (; i < events.length; i++) {
                    var event = events[i],
                        summary = event.summary,
                        timeFrom = event.start.dateTime.substring(11, 16),
                        dateFrom = event.start.dateTime.substring(0, 10),
                        dateTo = event.end.dateTime.substring(0, 10),
                        timeTo = event.end.dateTime.substring(11, 16),
                        location = event.location;
                    Objects.ListContainer.append('<div class="ListItem"><b>' + summary + '</b><br/><span>' +
                        timeFrom + ' - ' + timeTo + ' | ' + dateFrom + ' - ' + dateTo + ' | ' + (location !== undefined ? location : 'No Location Given') + '</span></div>');
                }
                t.fromTo(Objects.ListContainer, 1, {
                    opacity: 0,
                    display: 'block'
                }, {
                    opacity: 1,
                    ease: Power4.easeOut
                });
                t.staggerFromTo(Objects.ListContainer.children(), 1, {
                    y: 50,
                    opacity: 0
                }, {
                    y: 0,
                    opacity: 1,
                    ease: Power4.easeOut
                }, 0.1);
            }
        } else alert('No Events!');
    });
}
function DataRetriever() {
    this.GoogleName;
    this.GoogleEmailId;
    this.GoogleImageURL;
    this.GoogleID;
    this.FaceBookName;
}

var DataObject = new DataRetriever();

function onSignIn(googleUser) {
    // Useful data for your client-side scripts:
    var profile = googleUser.getBasicProfile();

    // The ID token you need to pass to your backend:
    //var id_token = googleUser.getAuthResponse().id_token;

    function renderButton() {
        gapi.signin2.render('my-signin2', {
            'scope': 'profile email',
            'width': 240,
            'height': 50,
            'longtitle': true,
            'theme': 'dark'
        });
    }

    DataObject.GoogleName = profile.getName();
    DataObject.GoogleEmailId = profile.getEmail();
    DataObject.GoogleImageURL = profile.getImageUrl();
    DataObject.GoogleID = profile.getId();
    w['OnLoggedIn']();
    handleAuthClick();
}

function signOut() {
    gapi.auth.signOut();
}

window.fbAsyncInit = function () {
    FB.init({
        appId: 1522350584732707
        , xfbml: true
        , version: 'v2.5'
    });
};

(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// This is called with the results from from FB.getLoginStatus().
function statusChangeCallback(response) {
/*    console.log('statusChangeCallback');
    console.log(response);*/

    if (response.status === 'connected') {
        // Logged into your app and Facebook.
        testAPI();
    } else if (response.status === 'not_authorized') {
        //logged in but not your app
        //document.getElementById('status').innerHTML = 'Please log ' +
        //  'into this app.';
    }
}

function checkLoginState() {
    FB.getLoginStatus(function (response) {
        statusChangeCallback(response);
    });
}

window.fbAsyncInit = function () {
    FB.init({
        appId: 1522350584732707
        , cookie: true, // enable cookies to allow the server to access
        // the session
        xfbml: true, // parse social plugins on this page
        version: 'v2.5' // use graph api version 2.5
    });

    FB.getLoginStatus(function (response) {
        statusChangeCallback(response);
    });

};

// Load the SDK asynchronously
(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// Here we run a very simple test of the Graph API after login is
// successful.  See statusChangeCallback() for when this call is made.
function testAPI() {
    FB.api('/me', function (response) {
        DataObject.FaceBookName = response.name;
    });
}

(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v2.5";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
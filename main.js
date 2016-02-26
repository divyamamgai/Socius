var t = TweenMax,
    w = window,
    wO = $(w),
    d = document,
    dO = $(d),
    Objects = {},
    Variables = {
        ListeningDone: false,
        Listening: false,
        ListenFinalTranscript: '',
        ListenIntermediateTranscript: '',
        ListenPerformKeyWord: 'perform',
        ListenStopKeyWord: 'stop',
        ListenClearKeyWord: 'clear',
        CurrentLocation: {X: 29.9482389, Y: 76.8156628},
        GoogleMapsDistanceMatrixService: new google.maps.DistanceMatrixService()
    },
    SpeechRecognitionObject,
    ElasticEaseOut = Elastic.easeOut.config(2, 1),
    Functions = {
        ListeningAnimation: function () {
            if (Variables.Listening) {
                t.to(Objects.MicButtonBase, 1, {
                    scale: 0.35,
                    ease: Power4.easeOut,
                    onComplete: function () {
                        t.to(Objects.MicButtonBase, 1, {
                            scale: 0.25,
                            ease: Power4.easeOut,
                            onComplete: Functions.ListeningAnimation
                        });
                    }
                });
                t.fromTo(Objects.MicButtonBackCircle, 1, {
                    scale: 0
                }, {
                    scale: 0.5,
                    opacity: 1,
                    ease: Power4.easeOut,
                    onComplete: function () {
                        t.to(Objects.MicButtonBackCircle, 1, {
                            scale: 1,
                            opacity: 0,
                            ease: Power4.easeOut
                        });
                    }
                });
            }
        },
        ListeningStopAnimation: function () {
            t.killTweensOf(Objects.MicButtonBase);
            t.killTweensOf(Objects.MicButtonBackCircle);
            t.to(Objects.MicButtonBase, 1, {
                scale: 0.25,
                ease: Power4.easeOut
            });
            t.to(Objects.MicButtonBackCircle, 1, {
                scale: 1,
                opacity: 0,
                ease: Power4.easeOut
            });
        },
        ListenInitialize: function () {
            SpeechRecognitionObject = new w.webkitSpeechRecognition();
            SpeechRecognitionObject.language = 'en-IN';
            SpeechRecognitionObject.continuous = true;
            SpeechRecognitionObject.interimResults = true;
            SpeechRecognitionObject.onstart = Functions.ListenOnStart;
            SpeechRecognitionObject.onresult = Functions.ListenOnResult;
            SpeechRecognitionObject.onerror = Functions.ListenOnError;
            SpeechRecognitionObject.onend = Functions.ListenOnEnd;
            Variables.ListenFinalTranscript = '';
            Variables.ListenIntermediateTranscript = '';
        },
        ListenStart: function () {
            if (!Variables.Listening) {
                Variables.ListenFinalTranscript = '';
                SpeechRecognitionObject.start();
                Variables.Listening = true;
                t.fromTo(Objects.ClickMeText, 0.5, {
                    y: 0,
                    opacity: 1
                }, {
                    opacity: 0,
                    ease: Power4.easeOut,
                    onComplete: function () {
                        Objects.ClickMeText.html('');
                        t.to(Objects.ClickMeText, 0.5, {
                            opacity: 1,
                            ease: Power4.easeOut
                        });
                    }
                });
                t.fromTo(Objects.ListenText, 1, {
                    opacity: 1
                }, {
                    opacity: 0,
                    ease: Power4.easeOut,
                    onComplete: function () {
                        Objects.ListenText.html('<span class="Emphasis">Socius</span> Is Listening...');
                        t.to(Objects.ListenText, 1, {
                            opacity: 1,
                            ease: Power4.easeOut
                        });
                    }
                });
            }
        },
        ListenStop: function () {
            if (Variables.Listening) {
                SpeechRecognitionObject.stop();
                Variables.Listening = false;
                Functions.ListeningStopAnimation();
                t.fromTo(Objects.ClickMeText, 1, {
                    opacity: 1
                }, {
                    y: 0,
                    opacity: 0,
                    ease: Power4.easeOut,
                    onComplete: function () {
                        Objects.ClickMeText.html('Click <span class="Emphasis">Mic Icon</span> And Start The Magic!');
                        t.to(Objects.ClickMeText, 1, {
                            opacity: 1,
                            ease: Power4.easeOut
                        });
                    }
                });
                t.fromTo(Objects.ListenText, 1, {
                    opacity: 1
                }, {
                    opacity: 0,
                    ease: Power4.easeOut,
                    onComplete: function () {
                        Objects.ListenText.html('Hi, I\'m <span class="Emphasis">Socius</span>!');
                        t.to(Objects.ListenText, 1, {
                            opacity: 1,
                            ease: Power4.easeOut
                        });
                    }
                });
            }
        },
        ListenOnStart: function () {
            Functions.ListeningAnimation();
        },
        ListenOnResult: function (e) {
            if (Variables.Listening === true) {
                Variables.ListenIntermediateTranscript = '';
                var resultTranscript;
                for (var i = e.resultIndex; i < e.results.length; ++i) {
                    resultTranscript = e.results[i][0].transcript;
                    if (resultTranscript.indexOf(Variables.ListenStopKeyWord) != -1) {
                        Functions.ListenStop();
                        return;
                    } else if (resultTranscript.indexOf(Variables.ListenPerformKeyWord) != -1) {
                        Functions.PerformCommand(Variables.ListenIntermediateTranscript);
                        Functions.ListenStop();
                    }
                    if (e.results[i].isFinal) Variables.ListenFinalTranscript += resultTranscript;
                    else Variables.ListenIntermediateTranscript += resultTranscript;
                }
                Objects.ClickMeText.html(Variables.ListenIntermediateTranscript);
            }
        },
        ListenOnError: function () {
            alert("Error occurred while listening!");
            Functions.ListenStop();
        },
        ListenOnEnd: function () {
        },
        /**
         * @return {boolean}
         */
        PerformCommand: function (command) {
            if (command && command.length > 0) {
                command = $.trim(command.replace('/\s+/g', ' '));
                console.log(command);
                var Tokens = command.split(' '), i;
                switch (Tokens[0].toLowerCase()) {
                    case 'calendar':
                        if (CalendarAuth) {
                            if (Tokens[1].toLowerCase() === 'view' && Tokens[2].toLowerCase() === 'events') {
                                getEvents(false);
                            } else if (Tokens[1].toLowerCase() === 'notify' && Tokens[2].toLowerCase() === 'upcoming') {
                                getEvents(true, '8930343246');
                            } else if (Tokens[1].toLowerCase() === 'view' && Tokens[2].toLowerCase() === 'birthdays') {
                                getBirthdays(true, '8930343246');
                            }
                        }
                        break;
                    case 'map':
                        if (Tokens[1]) {
                            var Location = '', From = '', To = '', Via = '';
                            if (Tokens[1].toLowerCase() === 'take' && Tokens[2].toLowerCase() === 'me' && Tokens[3].toLowerCase() === 'to') {
                                From = Variables.CurrentLocation.X + ',' + Variables.CurrentLocation.Y;
                                To = '';
                                i = 4;
                                for (; i < Tokens.length; i++) To += Tokens[i] + '+';
                                if (To.length > 0) {
                                    w.open('https://www.google.co.in/maps/dir/' + From + '/' + To);
                                }
                            } else if (Tokens[1].toLowerCase() === 'show' && Tokens[2].toLowerCase() === 'me') {
                                i = 3;
                                for (; i < Tokens.length; i++) Location += Tokens[i] + '+';
                                if (Location.length > 0) {
                                    w.open('https://www.google.co.in/maps?q=' + Location);
                                }
                            } else if (Tokens[1].toLowerCase() === 'from') {
                                i = 2;
                                while (Tokens[i] !== undefined && Tokens[i].toLowerCase() !== 'to') From += Tokens[i++] + '+';
                                i++;
                                while (Tokens[i] !== undefined && Tokens[i].toLowerCase() !== 'via') To += Tokens[i++] + '+';
                                i++;
                                while (Tokens[i] !== undefined) Via += Tokens[i++] + '+';
                                if (Via.length > 0) {
                                    w.open('https://www.google.co.in/maps/dir/' + From + '/' + Via + '/' + To);
                                } else w.open('https://www.google.co.in/maps/dir/' + From + '/' + To);
                            }
                        } else {
                            Functions.MapCurrentLocation();
                            w.open('https://www.google.com/maps/preview/@' + Variables.CurrentLocation.X + ',' + Variables.CurrentLocation.Y + ',15z');
                        }
                        break;
                    case 'distance':
                        if (Tokens[1] && Tokens[1].toLowerCase() === 'from') {
                            var DistanceFrom = '', DistanceTo = '';
                            i = 2;
                            while (Tokens[i] !== undefined && Tokens[i].toLowerCase() !== 'to') DistanceFrom += Tokens[i++] + '+';
                            i++;
                            while (Tokens[i] !== undefined) DistanceTo += Tokens[i++] + '+';
                            Variables.GoogleMapsDistanceMatrixService.getDistanceMatrix({
                                origins: [DistanceTo],
                                destinations: [DistanceFrom],
                                travelMode: google.maps.TravelMode.WALKING,
                                avoidHighways: false,
                                avoidTolls: false
                            }, function (response, status) {
                                if (status === 'OK') {
                                    if (response.rows[0].elements[0].status !== 'NOT_FOUND') {
                                        alert('From : ' + response.destinationAddresses[0] + '\nTo : ' +
                                            response.originAddresses[0] + '\n Distance : ' +
                                            response.rows[0].elements[0].distance.text);
                                    } else alert('Google Maps Error Occurred!');
                                } else alert('Google Maps Error Occurred! Status : ' + status);
                            });
                        }
                        break;
                }
            }
        },
        MapCurrentLocation: function () {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    Variables.CurrentLocation.X = position.coords.latitude;
                    Variables.CurrentLocation.X = position.coords.latitude;
                }, function () {
                    alert('Your browser doesn\'t support current location identification.');
                });
            } else alert('Your browser doesn\'t support current location identification.');
        },
        OnLoggedIn: function () {
            Objects.UserName.html(DataObject.GoogleName + ',');
            Objects.UserImage.attr('src', DataObject.GoogleImageURL).on('load', function () {
                t.to(Objects.UserImage, 1, {
                    opacity: 1,
                    ease: Power4.easeOut
                });
            });
        }
    };

dO.on('ready', function () {
    Functions.ListenInitialize();
    Objects.ListenText = $('#ListenText', d);
    Objects.ClickMeText = $('#ClickMeText', d);
    Objects.MicButton = $('#MicButton', dO);
    Objects.UserName = $('#UserName', d);
    Objects.UserImage = $('#UserImage', d);
    Objects.ListContainer = $('#ListContainer', d).on('click', function () {
        t.to(Objects.ListContainer, 1, {
            opacity: 0,
            ease: Power4.easeOut,
            onComplete: function () {
                Objects.ListContainer.css('display', 'none');
            }
        });
    });
    Objects.MicButtonBase = Objects.MicButton.find('#Base').on('click', function () {
        t.to(Objects.MicButtonBase, 0.25, {
            fill: '#E91E63',
            ease: Power4.easeOut,
            onComplete: function () {
                t.to(Objects.MicButtonBase, 0.25, {
                    fill: '#C5CAE9',
                    ease: Power4.easeOut,
                    onComplete: Variables.Listening ? Functions.ListenStop : Functions.ListenStart
                });
            }
        });
    }).on('mouseover', function () {
        if (!Variables.Listening)
            t.to(Objects.MicButtonBase, 1, {
                scale: 0.35,
                ease: Power4.easeOut
            });
    }).on('mouseout', function () {
        if (!Variables.Listening)
            t.to(Objects.MicButtonBase, 1, {
                scale: 0.25,
                ease: Power4.easeOut
            });
    });
    Objects.MicButtonBackCircle = Objects.MicButton.find('#BackCircle');
    t.set(Objects.MicButtonBase, {
        scale: 0.25,
        transformOrigin: '50% 50% 0'
    });
    t.set(Objects.MicButtonBackCircle, {
        scale: 0,
        opacity: 0,
        transformOrigin: '50% 50% 0'
    });
});

wO.on('keypress', function (e) {
    if (e.keyCode == 32) if (Variables.Listening) Functions.ListenStop();
    else Functions.ListenStart();
});

w['OnLoggedIn'] = Functions.OnLoggedIn;
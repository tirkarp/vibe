import React, { Component } from 'react';
import Button from './Button';
import $ from 'jquery';

class Auth extends Component {
    constructor(props) {
        super(props);

        // function bindings
        this.handleClick = this.handleClick.bind(this);
    }
    
    login(callback) {
        const CLIENT_ID = '1b9b9b5f839e4c848035966b3c1a2faf';
        var REDIRECT_URI = 'http://localhost:3000/';
        function getLoginURL(scopes) {
            return 'https://accounts.spotify.com/authorize?client_id=' + CLIENT_ID +
              '&redirect_uri=' + encodeURIComponent(REDIRECT_URI) +
              '&scope=' + encodeURIComponent(scopes.join(' ')) +
              '&response_type=token';
        }
        
        var url = getLoginURL([
            'user-read-email'
        ]);
        
        var width = 450,
            height = 730,
            left = 0,
            top = 0;
    
        window.addEventListener("message", function(event) {
            var hash = event.data;
            alert("h");
            if (hash.type === 'access_token') {
                callback(hash.access_token);
            }
        }, false);
        
        window.open(url,
                            'Spotify',
                            'menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left
                           );
        
    }

    getUserData(accessToken) {
        return $.ajax({
            url: 'https://api.spotify.com/v1/me',
            headers: {
               'Authorization': 'Bearer ' + accessToken
            }
        });
    }

    handleClick() {
        this.login(function(accessToken) {
            this.getUserData(accessToken)
                .then(function(response) {
                    console.log(response);
                });
            });

        
    }

    render() {
        return (
            <Button method={this.handleClick} name="Log in"/>
        );
    }
}

export default Auth;
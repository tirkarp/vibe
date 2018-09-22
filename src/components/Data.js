import React, { Component } from 'react';
import $ from 'jquery';

class Data extends Component {
    constructor(props) {
        super(props);
        this.state = {name: '', bars: [], index: 0, last_duration: 0, last_start: 0, visibility: "visible"};

        this.flashData = this.flashData.bind(this);
        this.noFlashData = this.noFlashData.bind(this);
        this.getData = this.getData.bind(this);
    }

    componentDidMount() {
        this.getData();
    }

    flashData(data) {
        var TimeOut = setTimeout(this.noFlashData, this.state.last_duration);

        if (this.state.index + 1 < this.state.bars.length) {
            this.setState({visibility: "visible", index: this.state.index + 1});
        } else {
            clearTimeout(TimeOut);
        }
        console.log("in Flash");
    }

    noFlashData(data) {
        
        setTimeout(this.flashData,
            (this.state.bars[this.state.index].start * 1000 - (this.state.last_start + this.state.last_duration))
        );

        this.setState({visibility: "hidden",
            last_start: this.state.bars[this.state.index].start * 1000,
            last_duration: this.state.bars[this.state.index].duration * 1000
        });
    }

    getData() {
        $.ajax({
            // audio analysis info
            url: "https://api.spotify.com/v1/audio-analysis/11dFghVXANMlKmJXsNCbNl",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer BQBY-ev40aewQhijUzBGcswcnjsWu-b4lVJpZAF7Yf2QDIBjFolAhmkMilBX9Q9XmddOFNDTmX7Hh43rr-DFFMVLQ4umSErduCgUu-zCI68-yB-7JrHfJyK_NWHLtcCdacEHKj4IIaZ4JwbvxQ_13-OMFKXULXPVw1Vf7tJZ_q8QQhvx6nBAARV_DFSZbstmclEEbjQBOv6Za2hwrs6FB3Xf48SCSSGkhNNuHTmeddXZCN534PrORYBgcDhFoDzurEr5tFBhDcFPrg"
            },
            method: "GET",
            success: function(data) {
                this.setState({bars: data.segments});
                this.noFlashData();
            }.bind(this)
        });

        // general audio info
        $.ajax({
            url: "https://api.spotify.com/v1/tracks/11dFghVXANMlKmJXsNCbNl",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer BQBY-ev40aewQhijUzBGcswcnjsWu-b4lVJpZAF7Yf2QDIBjFolAhmkMilBX9Q9XmddOFNDTmX7Hh43rr-DFFMVLQ4umSErduCgUu-zCI68-yB-7JrHfJyK_NWHLtcCdacEHKj4IIaZ4JwbvxQ_13-OMFKXULXPVw1Vf7tJZ_q8QQhvx6nBAARV_DFSZbstmclEEbjQBOv6Za2hwrs6FB3Xf48SCSSGkhNNuHTmeddXZCN534PrORYBgcDhFoDzurEr5tFBhDcFPrg"
            },
            method: "GET",
            success: function(data) {
                this.setState({name: data.name});
                window.navigator.vibrate(500);
            }.bind(this)
        });
    }

    render() {
        return (
            <h1 style={{visibility: this.state.visibility}}>{this.state.name}</h1>
        );
    }
}

export default Data;
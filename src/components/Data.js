import React, { Component } from 'react';
import Button from './Button';
import $ from 'jquery';

class Data extends Component {
    constructor(props) {
        super(props);

        // due to laziness and pure ignorance, beats is the array to store vibration intervals of
        // navigation.vibrate() and bars is the array to store all the data of bars from the song
        this.state = {name: '', beats: [], bars: [], index: 0, last_duration: 0, last_start: 0, visibility: "visible"};

        this.flashData = this.flashData.bind(this);
        this.noFlashData = this.noFlashData.bind(this);
        this.getData = this.getData.bind(this);
        this.vibrate = this.vibrate.bind(this);
    }

    componentDidMount() {
        this.getData();
    }

    flashData() {
        var TimeOut = setTimeout(this.noFlashData, this.state.last_duration);

        if (this.state.index + 1 < this.state.bars.length) {
            this.setState({visibility: "visible", index: this.state.index + 1});
        } else {
            clearTimeout(TimeOut);
        }
    }

    noFlashData() {
        
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
            url: "https://api.spotify.com/v1/audio-analysis/7qiZfU4dY1lWllzX7mPBI3",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer BQAoh0Y5Srg7C-yxdkO3VWN-s2fGAVYfNAr3UxhzHi6zBzgtqVpjlA-X8d1bM6uIApZBiJzSiDMEtUlUpEHyL552-MCOAQXbos9MrbqRZK3qyKxtgs5TfDLaai9kDrYkMJsK0vTDiv-do-Gw7j6K8xmtsNdCYKxAY1HW3FuDBTNAnYe0Xi3z4oo_vWxNnP6j3wH878V4EGkS7d_WqBxp--eWiPKWJ_NJUgaDUPycme3CCXU_jvUYQiVPjCzdG7hV30L0E5hQppgvqg"
            },
            method: "GET",
            success: function(data) {
                let localBeatsArray = []

                // create beats array
                for (let i = 0; i < data.segments.length - 1; i++) {
                    let play = data.segments[i].duration * 1000;
                    let pause = (data.segments[i + 1].start - (data.segments[i].start + data.segments[i].duration)) * 1000;
                    
                    if (pause < 0) {
                        pause = 0;
                    }

                    localBeatsArray.push(play, pause);
                }
                console.log(localBeatsArray)
                this.setState({beats: localBeatsArray, bars: data.bars});
            }.bind(this)
        });

        // general audio info
        $.ajax({
            url: "https://api.spotify.com/v1/tracks/7qiZfU4dY1lWllzX7mPBI3",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer BQAoh0Y5Srg7C-yxdkO3VWN-s2fGAVYfNAr3UxhzHi6zBzgtqVpjlA-X8d1bM6uIApZBiJzSiDMEtUlUpEHyL552-MCOAQXbos9MrbqRZK3qyKxtgs5TfDLaai9kDrYkMJsK0vTDiv-do-Gw7j6K8xmtsNdCYKxAY1HW3FuDBTNAnYe0Xi3z4oo_vWxNnP6j3wH878V4EGkS7d_WqBxp--eWiPKWJ_NJUgaDUPycme3CCXU_jvUYQiVPjCzdG7hV30L0E5hQppgvqg"
            },
            method: "GET",
            success: function(data) {
                this.setState({name: data.name});
                
            }.bind(this)
        });
    }

    vibrate() {
        this.noFlashData();

        // enable vibration support
        navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
        
        if (navigator.vibrate) {
            navigator.vibrate(this.state.beats);
        }
    }

    render() {
        return (
            <div>
                <h1 style={{visibility: this.state.visibility}}>{this.state.name}</h1>
                <Button method={this.vibrate} name="Vibrate"/>
            </div>
        );
    }
}

export default Data;
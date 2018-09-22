import React, { Component } from 'react';
import Button from './Button';
import $ from 'jquery';

class Data extends Component {
    constructor(props) {
        super(props);

        // due to laziness and pure ignorance, beats is the array to store vibration intervals of
        // navigation.vibrate() and bars is the array to store all the data of bars from the song
        this.state = {name: '', 
                    beats: [], 
                    bars: [], 
                    index: 0, 
                    last_duration: 0, 
                    last_start: 0, 
                    visibility: "visible",                  
                    styles: {
                        width: "200px",
                        height: "200px",
                        background: "#f65314"
                    }
        };

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
            this.setState({visibility: "visible", index: this.state.index + 1, styles: {
                width: "" + (100 * Math.sin(this.state.last_duration / 600)) + "vw",
                height: "200px",
                background: "#f65314",
                animation: "width " + (this.state.last_duration / 100) + "s ease-in"
            }});
        } else {
            clearTimeout(TimeOut);
        }
    }

    noFlashData() {
        
        setTimeout(this.flashData,
            (this.state.bars[this.state.index].start * 1000 - (this.state.last_start + this.state.last_duration))
        );

        this.setState({visibility: this.state.index == 0 ? "visible": "hidden",
            last_start: this.state.bars[this.state.index].start * 1000,
            last_duration: this.state.bars[this.state.index].duration * 1000,
            styles: {
                width: "200px",
                height: "200px",
                background: "#f65314",
                animation: "width " + (this.state.last_duration / 100) + "s ease-in"
            }
        });
    }

    getData() {
        $.ajax({
            // audio analysis info
            url: "https://api.spotify.com/v1/audio-analysis/7qiZfU4dY1lWllzX7mPBI3",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer BQBgj52D53QjrveEtgFga9fhSLF0iWVgAbRbl2olg2N_4eKt2ofKPuCA6OT-0OAAQmjFUbQ13_6WoG1hpDifa1v_8C-bHsfkIQW9J2V-2SndsafVRAjLixvEzMz8Ri0y8q-90JcVj40EWlZ-L-2p4lLHIn4BS7yKD99UifVNjzOPDIgIRpdx51IWXGfQiENrX-oL0XorOLosC1tEfThd-JdG3qte_Efmu5KnzT0kKubqwylGQK7vR-NKjAYzR3rwm9Qu7DVDfswuGQ"
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
                this.setState({beats: localBeatsArray, bars: data.segments});
            }.bind(this)
        });

        // general audio info
        $.ajax({
            url: "https://api.spotify.com/v1/tracks/7qiZfU4dY1lWllzX7mPBI3",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer BQBgj52D53QjrveEtgFga9fhSLF0iWVgAbRbl2olg2N_4eKt2ofKPuCA6OT-0OAAQmjFUbQ13_6WoG1hpDifa1v_8C-bHsfkIQW9J2V-2SndsafVRAjLixvEzMz8Ri0y8q-90JcVj40EWlZ-L-2p4lLHIn4BS7yKD99UifVNjzOPDIgIRpdx51IWXGfQiENrX-oL0XorOLosC1tEfThd-JdG3qte_Efmu5KnzT0kKubqwylGQK7vR-NKjAYzR3rwm9Qu7DVDfswuGQ"
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
                <div style={this.state.styles}></div>
                <div style={{height: "30px"}}></div>
                <Button method={this.vibrate} name="Vibrate"/>
            </div>
        );
    }
}

export default Data;
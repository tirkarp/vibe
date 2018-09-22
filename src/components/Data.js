import React, { Component } from 'react';
import $ from 'jquery';

class Data extends Component {
    constructor(props) {
        super(props);

        // due to laziness and pure ignorance, beats is the array to store vibration intervals of
        // navigation.vibrate() and bars is the array to store all the data of segments from the song
        this.state = {name: '', beats: [], bars: [], index: 0, last_duration: 0, last_start: 0, visibility: "visible"};

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
            url: "https://api.spotify.com/v1/audio-analysis/5xTtaWoae3wi06K5WfVUUH",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer BQC0iVWMag3dVXfQ48sqcWFRshbwWIcEz3JGuBxT9G8uDfgPUEE6718LntyLhf0UHPqWwfG7jGsTnGSWQLjk1i3EmTIe4VZtIeCQE3fMk94fRGMzA1v7NVCp5lQvEvAebv-lyBFl7C_KMhB_6Lkw71VkP3IA5dUuF4Si8u2xLR5_GiId5j40V8FO2wStn3ZlGExe3znpas6IXaVASkzmS1QMbaTjryzVrFaryBHTg4qzUG-BCuv3Umk3DuUtS0Pbfbv5jR7kEBbxDg"
            },
            method: "GET",
            success: function(data) {
                let localBeatsArray = []

                // create beats array
                for (let i = 0; i < data.segments.length - 1; i++) {
                    localBeatsArray.push(data.segments[i].duration * 1000,
                        (data.segments[i + 1].start - (data.segments[i].start + data.segments[i].duration)) * 1000
                    );
                }

                this.setState({beats: localBeatsArray, bars: data.segments});
                this.noFlashData();

                // vibrate
                window.navigator.vibrate(localBeatsArray);
            }.bind(this)
        });

        // general audio info
        $.ajax({
            url: "https://api.spotify.com/v1/tracks/5xTtaWoae3wi06K5WfVUUH",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer BQC0iVWMag3dVXfQ48sqcWFRshbwWIcEz3JGuBxT9G8uDfgPUEE6718LntyLhf0UHPqWwfG7jGsTnGSWQLjk1i3EmTIe4VZtIeCQE3fMk94fRGMzA1v7NVCp5lQvEvAebv-lyBFl7C_KMhB_6Lkw71VkP3IA5dUuF4Si8u2xLR5_GiId5j40V8FO2wStn3ZlGExe3znpas6IXaVASkzmS1QMbaTjryzVrFaryBHTg4qzUG-BCuv3Umk3DuUtS0Pbfbv5jR7kEBbxDg"
            },
            method: "GET",
            success: function(data) {
                this.setState({name: data.name});
                
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
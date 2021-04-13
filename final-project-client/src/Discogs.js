import React from 'react';
import styles from './Discogs.module.css'

class Discogs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            findTrack: "",
            trackList: [],
            playlist: [],
            error: null,
            isLoaded: false,
            genre: "1"
        }
    }
    componentDidMount() {
        this.displayTracks();
    }

    onInputChange(event) {
        this.setState({
            [event.target.id]: event.target.value
        })
    }

    displayTracks() {
        try {
            fetch("http://localhost:3001/playlist")
                .then(res => res.json())
                .then(
                    (result) => {
                        this.setState({
                            isLoaded: true,
                            playlist: result && Object.keys(result).length > 0 ? result.playlist : []
                        });
                    },
                    (error) => {
                        this.setState({
                            isLoaded: true,
                            error
                        }, () => {
                            alert(error)
                        });
                    }
                )
        } catch (error) {
            console.error(error);
        }
    }



    findDiscogs() {
        try {

            const { findTrack } = this.state;
            console.log(findTrack);
            const DISCOGS_URL = `https://api.discogs.com/database/search?key=vuEcSiqzqEDMWlUUnXnq&secret=FFqgjJyXnPlcNhyeNvBOjPSpuizPkslF&country=canada&artist=${findTrack}`;
            fetch(DISCOGS_URL)
             .then(res => res.json())
                .then(
                    (result) => {
                        this.setState({
                            isLoaded: true,
                            trackList: result && Object.keys(result).length > 0 ? result.results : []
                        });
                    },
                    // Note: it's important to handle errors here
                    // instead of a catch() block so that we don't swallow
                    // exceptions from actual bugs in components.
                    (error) => {
                        this.setState({
                            isLoaded: true,
                            error
                        });
                    }
                )
        } catch (error) {
            console.error(error);
        }

    }

    addTracks(track11) {
        try {
            let { genre } = this.state;
            let { addInTracks } = this.props;

            let objTrack = {
                id: track11.id,
                playlist_id: genre,
                title: track11.title,
                uri: track11.uri,
                master_id: track11.master_id
            };
            fetch("http://localhost:3001/tracks", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(objTrack),
            })
                .then(response => response.json())
                .then(data => {
                    alert(data.msg);
                    addInTracks(true);
                    this.displayTracks();
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        } catch (error) {
            console.error(error);
        }
    }

    trackSelection() {
        const { playlist } = this.state;
        return playlist.map((item, index) => {
            return (
                <option value={item.id} key={item.id}>{item.title}</option>
            )
        })
    }
    displayAllTracks() {
        try {
            const { trackList } = this.state;
            console.log("ABC");
            if (trackList && trackList.length > 0) {
                return trackList.map((item, index) => {
                    return (
                        <tr key={index}>
                            <td>
                                {item.title}
                            </td>
                            <td>
                                <img src={item.thumb}/>
                            </td>
                            <td>
                               <label >Id:&nbsp;</label>
                                <span>{item.id}</span>
                                {item.style.length > 0 && (<div>
                                        <label>Style:&nbsp;</label>
                                        <span>{item.style.join(", ")}</span>
                                </div>)}
                                {item.format.length > 0 && (<div>
                                    <div>
                                        <label>Format:&nbsp;</label>
                                        <span>{item.format.join(", ")}</span>
                                    </div>
                                </div>)}

                                        <label>Country and Year:&nbsp;</label>
                                        <span>{item.country} - {item.year}</span>

                                {item.genre.length > 0 && (<div>
                                    <div>
                                        <label>Genre:&nbsp;</label>
                                        <span>{item.genre.join(", ")}</span>
                                    </div>
                                </div>)}
                                <div>
                                    <div>
                                        <a href={"https://www.discogs.com" + item.uri}>More information</a>
                                    </div>
                                </div>
                            </td>
                            <td>
                                {item.master_id}
                            </td>
                            <td>
                                <label>Select Genre</label>
                                <select onChange={(e) => {
                                    this.setState({
                                        genre: e.target.value
                                    })
                                }}>
                                {this.trackSelection()}
                                </select>

                                <button type="button" onClick={() => {
                                            this.addTracks(item);
                                        }}>Add tracks
                                </button>

                            </td>
                        </tr>
                    )
                })
            }
            return (
                <tr>
                    <td colSpan="5">Sorry, no such album.</td>
                </tr>
            )
        } catch (error) {
            console.error("Error.. ", error);
        }
    }

    render() {
        const { findTrack } = this.state;
        return (
            <div>
                <form className={styles.Div1}>
                    <input type="text" id="findTrack" placeholder="Enter string.." value={findTrack} onChange={(e) => { this.onInputChange(e); }} required /> &nbsp;
                        <button className={styles.Btn1} type="submit" onClick={(e) => {
                            this.findDiscogs();
                            e.preventDefault();
                            }}>
                            Search
                        </button>
                </form>
                <table className={styles.Table1}>
                    <thead className={styles.Thead1}>
                        <tr>
                            <th>Title</th>
                            <th>Cover Image</th>
                            <th>Info</th>
                            <th>Master ID</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.displayAllTracks()}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default Discogs;
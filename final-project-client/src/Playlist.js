import React from 'react';
import styles from './Playlist.module.css'


class Playlist extends React.Component {
    constructor(props) {
      super(props);

      // set initial state
      // do not use setState in constructor, write state directly
      this.state = {
        playlist_data : [], // will contain Playlist data array from server
        playlist_index : 0, // the index of the playlist currently shown, start at first in array
        playlist_count : 0, // how many Playlist in data array from server
        isLoaded : false,  // will be true after data have been received from server
        error : null,      // no errors yet !
        add_new: false
      };


         
    }

    handleChange = (event) => {
        this.setState({[event.target.name]:event.target.value})
     }

    // REACT component lifecycle for componentDidMount
    // https://www.w3schools.com/react/react_lifecycle.asp
    componentDidMount() {

       // AJAX call using fetch. Make sure the playlist server is running !
       // see https://reactjs.org/docs/faq-ajax.html
      fetch('http://localhost:3001/tracks')
        .then(
            (response)=> {
                // here full fetch response object
                //console.log(response)
                // fetch not like jQuery ! both ok code 200 and error code 404 will execute this .then code
                if (response.ok) {
                    // handle 2xx code success only
                    // get only JSON data returned from server with .json()
                    response.json().then(json_response => {
                        console.log(json_response)
                        this.setState({
                            playlist_data:json_response.tracks, // data received from server
                            playlist_count:json_response.tracks.length, // how many Playlist in array
                            playlist_index:0,  // will first show the first playlist in the array
                            isLoaded : true,  // we got data
                            error : null // no errors
                        })
                    }
                    )

                }else{
                    // handle errors, for example 404
                    response.json().then(json_response => {
                        this.setState({
                            isLoaded: false,
                            // result returned is case of error is like  {message: "playlist not found"}
                            // save the error in state for display below
                            error:json_response,   // something in format  {message: "playlist not found", db_data:{}}
                            playlist_data: {}, // no data received from server
                            playlist_count:0,
                            playlist_index:0,
                        });
                    })
                }
            },

            (error) => {
                // Basically fetch() will only reject a promise if the URL is wrong, the user is offline,
                // or some unlikely networking error occurs, such a DNS lookup failure.
                this.setState({
                    isLoaded: false,
                    error: {message:"AJAX error, URL wrong or unreachable, see console"}, // save the AJAX error in state for display below
                    playlist_data: {}, // no data received from server
                    playlist_count:0,
                    playlist_index:0,
                });
            }
        )
    }



    updateArrayItem = (event) => {
        const i=this.state.playlist_index
        this.setState(state => {
          const list = state.playlist_data.map((tracks, j) => {
            if (j === i) {
              // the new value of the form field beeing modified
              // the input NAME must be the same as in the playlist object (and table colum)
              tracks[event.target.name]=event.target.value
              return tracks;
            } else {
              return tracks;
            }
          });

          return {
            list,
          };
        });
      };
      deleteData =(trackId)=>{

        fetch("http://localhost:3001/tracks/" + `${trackId.id}`,
            {
                method: 'DELETE'
            }
        )

            .then(res => res.json())//here server sends JSON response
            .then(res => {
                this.displayTracks();
                console.log(res)
            },

                (error) => {
                    // only NO RESPONSE URL errors will trigger this code
                    this.setState({error: {message:"AJAX error: URL wrong or unreachable, see console"}})
                }

            )
        }


 displayTracks() {
    fetch("http://localhost:3001/tracks/")
        .then(
            (response) => {
                if (response.ok) {
                    response.json().then(json_response => {
                        this.setState({
                            playlist_data: json_response.tracks
                        })
                    })

                } else {
                    response.json().then(json_response => {
                    })
                }
            },

            (error) => {
                this.setState({error: {message:"AJAX error: URL wrong or unreachable, see console"}})
            }
        )
}




 searchData(obj) {
    return Object.keys(obj).map((item, index) => {
        return <td key={obj[item] + "_" + index}>{obj[item]}</td>
    })
}

 getTracksData() {
    let { playlist_data } = this.state;
    if (playlist_data && playlist_data.length > 0) {
        return playlist_data.map((item, index) => {
            return (
                <tr key={index}>
                    {this.searchData(item)}
                    <td>
                        <button type="button" className="Btn1" onClick={() => {
                            this.deleteData(item);
                        }}>Delete</button>
                    </td>
                </tr>
            )
        }, this)
    }
    return (<tr>
        <td colSpan="6" className="text-center">No data available</td>
    </tr>)
}

    // display the Track table
    render() {

        if(this.state.error){
            return <div><b>{this.state.error.message}</b></div>;
        }else if(this.state.isLoaded){
            if(this.state.playlist_count!==0){
                return (
                    <div>
                    <table id="trackTable" className={styles.Table1}>
                    <thead>
                        <tr>
                            <th className={styles.Label1}>Track ID</th>
                            <th className={styles.Label1}>Playlist Title</th>
                            <th className={styles.Label1}>Track Title</th>
                            <th className={styles.Label1}>URI</th>
                            <th className={styles.Label1}>Master ID</th>
                            <th className={styles.Label1}>Delete Track</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.getTracksData()}
                    </tbody>
                    </table>
                    </div>
                )
            }else{
                return(<div><b>playlist table is empty</b></div>)
            }
        }else{
            return (<div><b>Waiting for server ...</b></div>)
        }
    }
}

export default Playlist;
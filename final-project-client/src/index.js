import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import App from './App';
import reportWebVitals from './reportWebVitals';
import Header from './Header.js';
import Footer from './Footer.js';
import Playlist from './Playlist.js';
import Discogs from './Discogs.js';


class Page extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          addTracks: false
        }
      }
    addInTracks(isAdded, playlist_count) {
        this.setState({
          addTracks: isAdded
        })
        window.location.reload(false);
      }
    render(){
        const { addTracks } = this.state;

              return (
              <div>
                  <Header companyName="Discogs.com"/>

                   <Playlist addTracks={addTracks}/>
                   <Discogs addInTracks={(isAdded) => { this.addInTracks(isAdded) }} />
                   <Footer authorName="Janki Jariwala and Parth Amin"/>

              </div>
          )
      }
  }



  ReactDOM.render(<Page/>,document.getElementById('root'));

reportWebVitals();

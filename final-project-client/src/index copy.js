import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import App from './App';
import reportWebVitals from './reportWebVitals';
import Playlist from './Playlist.js';
import Discogs from './Discogs.js';


class Page extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          addedToFavourites: false
        }
      }
    onAddedToFavourites(isAdded, playListCount) {
        this.setState({
          addedToFavourites: isAdded
        })
      }
    render(){
        const { addedToFavourites } = this.state;

              return (
              <div>
                  <h1>Hello..</h1>

                   <Playlist addedToFavourites={addedToFavourites}/>
                   <Discogs onAddedToFavourites={(isAdded) => { this.onAddedToFavourites(isAdded) }} />

              </div>
          )
      }
  }



  ReactDOM.render(<Page/>,document.getElementById('root'));

reportWebVitals();

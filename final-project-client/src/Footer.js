import React from 'react'
import styles from './Footer.module.css'

class Footer extends React.Component{
    constructor(props) {
        super(props);
        // contructor code here
    }
         render(){
            return (
            <footer className={styles.Footer}>
                 &copy;{this.props.authorName}
            </footer>)
        }
    }

    export default Footer
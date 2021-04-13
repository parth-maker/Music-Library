import React from 'react'
import styles from './Header.module.css'

class Header extends React.Component{
    constructor(props) {
        super(props);
        this.state = {companyName: this.props.companyName}
        // contructor code here
      }

         render(){
            return (
            <header className={styles.Header}>
                Welcome to {this.state.companyName}
                 
            </header>
        )
        }


}

export default Header
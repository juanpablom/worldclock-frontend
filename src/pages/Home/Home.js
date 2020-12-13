import React from 'react';
import { TimezoneAutocomplete } from '../../components/TimezoneAutocomplete';
import styles from './Home.module.scss';

const Home = () => {
    return (
        <div className={styles.container}>
            <TimezoneAutocomplete />
        </div>
    )
}


export default Home;
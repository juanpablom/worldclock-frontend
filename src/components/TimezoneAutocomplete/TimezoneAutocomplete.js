import React, { useEffect, useState } from "react";
import { Autocomplete } from "@material-ui/lab";
import { TextField } from "@material-ui/core";
import moment from 'moment';
import API from "../../API";
import styles from './TimezoneAutocomplete.module.scss';

const TimezoneAutocomplete = () => {
  const [timezonesAutocomplete, setTimezonesAutocomplete] = useState([]);
  const [timezones, setTimezones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const existTimezone = (value) => {
    return timezones.some((x) => x.timezone === value)
  }

  const handleSelectTimezone = async (event, value) => {
    setErrorMsg(null);
    if (value && !existTimezone(value)) {
      setLoading(true);
      try {
        const result = await API.Timezones.getTimezoneByName(value);
        const { datetime, timezone } = await result.data;
        setTimezones((prevState) => [...prevState, { datetime, timezone }]);
        setLoading(false);
      } catch (e) {
        setErrorMsg("Error to get timezone, please try again.");
        setLoading(false);
      }
    }
  };

  const handleRemoveTimezone = (value) => {
    setErrorMsg(null);
    const newTimezones = timezones.filter(x => x.timezone !== value );
    setTimezones(newTimezones)
  }

  useEffect(() => {
    const getTimezones = async () => {
      setErrorMsg(null);
      setLoading(true);
      try {
        const result = await API.Timezones.getTimezones();
        const data = await result.data;
        setTimezonesAutocomplete(data);
        setLoading(false);
      } catch (e) {
        setErrorMsg("Error to get timezones, please refresh the page.");
        setLoading(false);
      }
    };
    getTimezones();
  }, []);


  useEffect(() => {
        //The best way to handle that should be a endpoint who recive a list of timezones and return a new list (but i'm using the enpoints of the challenge).
        const refreshInterval = setInterval(async () => {
          const refreshedTimezones = await Promise.all(
            timezones.map(async (it) => {
              const result = await API.Timezones.getTimezoneByName(it.timezone);
              const { datetime, timezone } = await result.data;
              return { datetime, timezone };
              /*const updatedTimezones = timezones.map(x => x.timezone === timezone ? { datetime, timezone } : x )              
              setTimezones(updatedTimezones);*/
            })
          )          
          setTimezones(refreshedTimezones);
        }, 5000);
    
        return () => clearInterval(refreshInterval);
  }, [timezones])


  return (
    <>
      {errorMsg && <h4>{errorMsg}</h4>}
      {loading && <h4>Loading....</h4>}
      <Autocomplete
        options={timezonesAutocomplete}
        getOptionLabel={(option) => option}
        style={{ width: 300 }}
        onChange={handleSelectTimezone}
        renderInput={(params) => (
          <TextField {...params} label="Timezones" variant="outlined" />
        )}
      />
      <ul className={styles.timezoneList}>
        {timezones.length > 0 &&
          timezones.map((x) => 
          <li key={x.timezone}>
              <span className={styles.closeBtn} onClick={() => handleRemoveTimezone(x.timezone)}>x</span>
              <div className={styles.timezoneListContent}>
                <span>{x.timezone}</span><br/>
                {moment.parseZone(x.datetime).format('MM/DD/YYYY')}<br/>
                {moment.parseZone(x.datetime).format('hh:mm A')}
              </div>
        </li>)}
      </ul>
    </>
  );
};

export default TimezoneAutocomplete;

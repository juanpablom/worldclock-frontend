import axios from 'axios';


const instance = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 5000,
  });

const Timezones = {
    getTimezones: () => {
        return instance.get('api/timezones');
    },
    getTimezoneByName: (name) => {
        return instance.get(`api/timezones/${name}`);
    },    
    editTimezoneByName: (name) => {
        return instance.put(`api/timezones/${name}`);
    },
    removeTimezoneByName: (name) => {
        return instance.remove(`api/timezones/${name}`);
    },            
}


export default {
    Timezones
}
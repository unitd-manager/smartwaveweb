import axios from 'axios'

const api = axios.create({
baseURL: 'https://smartwave.unitdtechnologies.com:2014',
// baseURL:'http://43.228.126.245:3005',
//baseURL: 'http://localhost:2013',
});


// const loginApi = axios.create({
//   baseURL: 'https://art-cause.com:3003'
// });


export default api 
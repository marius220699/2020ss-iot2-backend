const axios = require('axios').default;
axios({
  method: 'GET',
  url: 'https://gist.githubusercontent.com/fg-uulm/666847dd7f11607fc2b6234c6d84d188/raw/2ca994ada633143903b10b2bf7ada3fd039cae35/mensa.json'
  
  responseType: 'json',
})
.then((response)=>{
  const result = response.data;
  console.log(result);
});
const electron = require('electron')
const path = require('path')
const BrowserWindow = electron.remote.BrowserWindow
const Store = require("electron-store")
const store = new Store()
const remote = require('electron').remote
const ipcRenderer = require('electron').ipcRenderer
const jquery = require("jquery")

var token = store.get("token");
var hostname = store.get("hostname");
var intervalTime = 10;
intervalTime = store.get("interval");

//Send ipc to main.js to open settings
$("#settings").click(function() {
  ipcRenderer.send("open-settings", "an-argument");
})



new Vue({
  el: "#output",


  data() {
    return {
      raw: [],
      top: [],
      loading: 1,
      error: 0

    };
  },

  // Fetches posts when the component is created which is needed for initial setup
  created() {

    var config = {
      baseURL: hostname
    };

    var auth = token;
      axios.all([
            axios.get('/admin/api.php?topItems=10&auth=' + auth, config),
             axios.get("/admin/api.php", config)
           ])
       .then(axios.spread((topItems, rawData) => {
         this.top = topItems.data.top_queries;
         this.raw = rawData.data;

        //For setting error and loading screen
         this.loading = 0;
         this.error=0;


       }))
       .catch((error) => {
         // Error
         if (error.response) {
           this.error = 1;
           this.loading = 0;
         } else if (error.request) {
           this.error = 1;
           this.loading = 0;
        //   console.log(error.request);
         } else {
           this.error = 1;
           this.loading = 0;
        //   console.log('Error', error.message);
         }
        // console.log(error.config);
       });

  },

  //Fetch data when div element is mounted
  mounted(){

    var config = {
      baseURL: hostname
    };
    var auth = token;
    var self = this;
      axios.all([

             setInterval(function(){
               axios.get('/admin/api.php?topItems=10&auth=' + auth, config).then(response => {
                 self.top=response.data.top_queries
                 self.loading = 0;
                 self.error = 0;
               });
             axios.get("/admin/api.php", config).then(response => {
               self.raw=response.data
               self.loading = 0;
               self.error = 0;
             })
           },intervalTime*1000)
           ])

       .catch((error) => {
         // Error
         if (error.response) {
           this.error = 1;
           this.loading = 0;
         } else if (error.request) {
           this.error = 1;
           this.loading = 0;
           //console.log(error.request);
         } else {
           this.error = 1;
           this.loading = 0;
           //console.log('Error', error.message);
         }
         //console.log(error.config);
       });

  }
});

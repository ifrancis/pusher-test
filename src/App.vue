<template>
  <div id="app">
    <template v-for="row in 20">
      <template v-for="col in 20">
        <div @click="click(row,col)" :id="'r'+row+'c'+col" class="chip" :key="'r'+row+'-c'+col">&nbsp;</div>
      </template>
    </template>

  </div>
</template>

<script>

import { TweenLite, CSSPlugin } from "gsap";
const plugins = [ CSSPlugin ];
import axios from "axios";

//Function to convert rgb color to hex format
function rgb2hex(rgb) {
  rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  //return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
  return hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

const hexDigits = new Array("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f");

function hex(x) {
  return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
 }

export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      firstOnScene: true,
      flag: false,
    }
  },
  computed: {
  },
  methods: {
    getState: function() {
      let arr = [].slice.call(document.getElementById('app').children)
      return arr.filter(div => div.style.backgroundColor != "").map(div => div.id+"|"+rgb2hex(div.style.backgroundColor)).join(',')
    },
    click: function(row,col){
      console.log('clicked row:'+row+',col:'+col);
     
      axios.get(process.env.VUE_APP_PUSHER_BASE+'colour.php?chip='+encodeURI('r'+row+'c'+col)+'&colour='+this.getRandomColour(),{
        //  headers:{'Content-Type':'application/x-www-form-urlencoded'}
      })
      .then(response => {
          //console.log('RESPONSE',response.data);
      })
      .catch(error => {
          console.log(error);
      });

    },
    colourChip: function(data){
      //console.log('colourchipa ',data);
      var el = document.getElementById(data.chip)
      if (el) TweenLite.to(el,1,{backgroundColor:'#'+data.colour})
    },
    getRandomColour: function(){
      return Math.floor(Math.random()*16777215).toString(16);
    }
  },
  mounted(){
    console.clear();
    console.log('mounted');
    //console.log(process.env.NODE_ENV);

    axios.get(process.env.VUE_APP_PUSHER_BASE+'colour.php?join=1').then(response => {
    //  console.log(response)
      this.firstOnScene = !response.data.occupied

      this.pusher.subscribe('my-channel', channel => {
   
        channel.bind('update', msg => {
          this.colourChip(msg) 
        });

        channel.bind('get-state', msg => {
          if (this.firstOnScene) axios.get(process.env.VUE_APP_PUSHER_BASE+'colour.php?state='+encodeURI(this.getState())).then(response => {}).catch(error => {console.log(error)})
        });

        channel.bind('update-all', msg => {
          if (!this.firstOnScene && this.flag) {
            //console.log('update all',msg)
            let a
            msg.split(',').forEach(item => {
              a = item.split('|')
              this.colourChip({chip:a[0],colour:a[1]})
            })
            this.flag = false
          }
        })

        if (response.data.occupied) {
          this.flag = true
          axios.get(process.env.VUE_APP_PUSHER_BASE+'colour.php?request').then(response => {}).catch(error => {console.log(error)})
        }
      });
      
    }).catch(error => {console.log(error)})
  }
}
</script>

<style>

body {
  margin: 0;
  border: 0;
}
#app {
  /* font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center; 
  color: #2c3e50;*/
  display: grid;
  grid-template-columns: repeat(20,1fr);
  grid-template-rows: repeat(20,1fr);
  grid-gap: 0;
  justify-items: center;
  align-items: center;
  place-content: stretch stretch;

  width: 100%;
  height: 100%;

  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.chip {
  background-color: white;
  /* border: 1px solid white; */
  justify-self: stretch;
  align-self: stretch;
  font-size:1px;
}

/* h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
} */
</style>

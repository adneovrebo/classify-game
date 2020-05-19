<template>
  <div>
    <template v-if="loading">
      <div>
        <v-progress-circular
        :size="100"
        :width="10"
        color="green"
        indeterminate
        class="mb-5"
      />
      </div>
    </template>
    <template v-else>
      <h1>Use your command to move!</h1>
      <h1 class="mb-5">Command: {{latestResult}}</h1>
    </template>
    
    <canvas ref="canvas" width="400px" height="400px"></canvas>
    <video autoplay="true" ref="videoElement" id="videoElement" width="400" height="400" />
  </div>
</template>

<script>
import ml5 from "ml5";
import { mapState } from "vuex";

export default {
  name: "Game",
    computed: {
    ...mapState(["knn"])
  },
   data: () => {
    return {
      stream: null,
      features: null,
      latestResult: null,
      loading: true,
      interval: null,
      canvas: null,
      x: 200,
      y: 200
    };
   },
  async mounted() {
    // Setting the videostream
    if (navigator.mediaDevices.getUserMedia) {
      let stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.stream = stream;
      let video = (this.$refs.videoElement.srcObject = stream);
    }

    this.features = ml5.featureExtractor("MobileNet", this.loadingDone)
    this.canvas = this.$refs.canvas

  },
  methods:{
    loadingDone(){
      this.loading = false
      
      this.interval = setInterval(()=>{
        this.predict()
      },50)
    },
    predict(){
      const logits = this.features.infer(this.$refs.videoElement);
      this.knn.classify(logits, this.predicted)
    },
    predicted(err, result){
      if(err){
        console.log(err)
      }else{
        this.latestResult = result.label

        if(result.label == "up"){
          if(this.y > 10){
            this.y -= 4
          }
        }else if(result.label == "down"){
          if(this.y < 390){
            this.y += 4
          }
        }

        this.draw()
      }
    },
    draw(){
      var ctx = this.canvas.getContext("2d");
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      ctx.beginPath();
      ctx.arc(this.x, this.y, 10, 0, 2 * Math.PI);
      ctx.stroke();
    }
  },
  destroyed(){
    clearInterval(this.interval)
  }
}
</script>

<style scoped>
#videoElement {
  width: 400px;
  height: 400px;
}

canvas{
  background-color: greenyellow;
  margin-right: 20px;
}
</style>
<template>
  <div>
    <template v-if="loading">
      <div>
        <v-progress-circular
        :size="100"
        :width="10"
        color="green"
        indeterminate
      />
      </div>
    </template>
    <template v-else>
      <h1>Start training your model</h1>

      <p>Click the buttons bellow to register imagea for the different commands/classes.</p>

      <div>
        <v-btn
          v-for="(command, index) in commands"
          :key="command.name"
          :color="command.color"
          class="white--text mr-2"
          @click="inferVideo(index)"
        >
          <span>{{command.name}}: {{command.count}}</span>
        </v-btn>
      </div>

      <div class="mt-5" v-if="knn.mapStringToIndex.length > 0">
        <p>Use this button to test your configuration</p>
        <v-btn color="grey" class="white--text" @click="test()">
          Test
        </v-btn>
        <h4 v-if="latestResult">Result: {{latestResult}}</h4>
      </div>

    </template>

    <video autoplay="true" ref="videoElement" id="videoElement" width="400" height="400" />

    <div v-if="isReady">
      <v-btn color="green" class="white--text" to="game">
          Click here to go to game!
      </v-btn>
    </div>
    <div v-else-if="!loading">
      <p>You need at least {{minSampleSize}} samples from each command to start the game.</p>
    </div>


    <div v-if="!loading">
      <v-btn color="red" class="white--text mt-3" @click="resetModel()">
          Clear model
      </v-btn>
    </div>
  </div>
</template>

<script>
import ml5 from "ml5";
import { mapState, mapMutations } from "vuex";

export default {
  name: "Home",
  computed: {
    ...mapState(["knn"]),
    isReady(){
      for (let i = 0; i < this.commands.length; i++) {
        if(this.commands[i].count < this.minSampleSize){
          return false;
        }
      }
      return true;
    }
  },
  data: () => {
    return {
      stream: null,
      features: null,
      latestResult: null,
      minSampleSize: 10,
      commands: [
        {
          name: "Up",
          count: 0,
          color: "green",
          command: "up"
        },
        {
          name: "Down",
          count: 0,
          color: "red",
          command: "down"
        },
        {
          name: "No Action",
          count: 0,
          color: "blue",
          command: "no-action"
        }
      ],
      loading: true
    };
  },
  async mounted() {
    // Setting the videostream
    this.clearKnn();
    if (navigator.mediaDevices.getUserMedia) {
      let stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.stream = stream;
      let video = (this.$refs.videoElement.srcObject = stream);
    }

    this.features = ml5.featureExtractor("MobileNet", this.loadingDone)
  },
  methods: {
    ...mapMutations(['clearKnn']),
    inferVideo(index) {
      const logits = this.features.infer(this.$refs.videoElement);
      this.knn.addExample(logits, this.commands[index].command);
      this.commands[index].count += 1;
    },
    test(){
      const logits = this.features.infer(this.$refs.videoElement);
      this.knn.classify(logits, this.predicted)

    },
    predicted(err, result){
      if(err){
        console.log(err)
      }else{
        this.latestResult = result.label
      }
    },
    loadingDone(){
      this.loading = false
    },
    resetModel(){
      this.clearKnn()
      this.commands.forEach(command=>{
        command.count = 0;
      })
    }
  }
};
</script>

<style scoped>
#videoElement {
  width: 400px;
  height: 400px;
}

ol {
  display: table;
  margin: 0 auto;
  text-align: left;
  font-weight: bold;
}
</style>

import Vue from 'vue';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import VueTextAreaAutosize from 'vue-textarea-autosize';
Vue.use(VueTextAreaAutosize);
import firebase from 'firebase/app';
import 'firebase/firestore';
Vue.config.productionTip = false;
firebase.initializeApp({
  apiKey: 'AIzaSyA3qemCwZAPl9IdvrlGnQdiWAMJEUJIzpU',
  authDomain: 'vuefs-proj-656ff.firebaseapp.com',
  databaseURL: 'https://vuefs-proj-656ff.firebaseio.com',
  projectId: 'vuefs-proj-656ff',
  storageBucket: 'vuefs-proj-656ff.appspot.com',
  messagingSenderId: '609542231983',
  appId: '1:609542231983:web:d0e8badef5b8234907c15a',
  measurementId: 'G-GLEHSC4WDW'
});
export const db = firebase.firestore();
new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app');

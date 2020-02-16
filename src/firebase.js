import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: 'AIzaSyAsL52wVcDWDnaBobO_lxESBo2bOp0uX-c',
  authDomain: 'slack-chat-24e1c.firebaseapp.com',
  databaseURL: 'https://slack-chat-24e1c.firebaseio.com',
  projectId: 'slack-chat-24e1c',
  storageBucket: 'slack-chat-24e1c.appspot.com',
  messagingSenderId: '299477340640',
  appId: '1:299477340640:web:6abe3c8b65cf03a4cadb85',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;

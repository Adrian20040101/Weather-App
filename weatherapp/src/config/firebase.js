import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyACCPayaBsP0Xt_A7PyDlrlZQCPXeeGwgc",
  authDomain: "weatherapp-f5149.firebaseapp.com",
  projectId: "weatherapp-f5149",
  storageBucket: "weatherapp-f5149.appspot.com",
  messagingSenderId: "647747907571",
  appId: "1:647747907571:web:d81559c31e733b7f696c86",
  measurementId: "G-0MPN4L83XX"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
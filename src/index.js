import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  // getDocs,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA4UOWsCWAk0LU-LWr_ksOkYmIO89xGqA8",
  authDomain: "fir-9-dojo-d1bb2.firebaseapp.com",
  projectId: "fir-9-dojo-d1bb2",
  storageBucket: "fir-9-dojo-d1bb2.appspot.com",
  messagingSenderId: "369451082867",
  appId: "1:369451082867:web:3c4bebc9f8f60dd5c23606",
};

//------------- init firebase app -----------
initializeApp(firebaseConfig);

//-------------- init services ------------
const db = getFirestore();
const auth = getAuth();
//------------- collection ref --------------
const colRef = collection(db, "books");

//--------------- queries -------------
const q = query(
  colRef,
  // where("author", "==", "raazi"),
  orderBy("createdAt", "asc")
);

// -------------- get collection data ------------
const unsubCol = onSnapshot(q, (snapshot) => {
  let books = [];
  snapshot.docs.forEach((doc) => {
    books.push({ ...doc.data(), id: doc.id });
  });
  console.log(books);
});

// ------------- adding documents --------------
const addBookForm = document.querySelector(".add");
addBookForm.addEventListener("submit", (e) => {
  e.preventDefault();

  addDoc(colRef, {
    title: addBookForm.title.value,
    author: addBookForm.author.value,
    createdAt: serverTimestamp(),
  }).then(() => {
    addBookForm.reset();
  });
});

// ----------- deleting documents -----------
const deleteBookForm = document.querySelector(".delete");
deleteBookForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const docRef = doc(db, "books", deleteBookForm.id.value);

  deleteDoc(docRef).then(() => {
    deleteBookForm.reset();
  });
});

// -------- get a single document -----------
const docRef = doc(db, "books", "dfQgAv06SAsXD404cN0e");

// getDoc(docRef).then((doc) => {
//   console.log(doc.data(), doc.id);
// });

const unsubDoc = onSnapshot(docRef, (doc) => {
  console.log(doc.data(), doc.id);
});

// ------------ updating a document ----------
const updateForm = document.querySelector(".update");
updateForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const docRef = doc(db, "books", updateForm.id.value);
  updateDoc(docRef, {
    title: "updated title",
  }).then(() => {
    updateForm.reset();
  });
});

// <------------ Signing Users Up -------------->
const signupForm = document.querySelector(".signup");
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = signupForm.email.value;
  const password = signupForm.password.value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      console.log("user created", cred.user);
      signupForm.reset();
    })
    .catch((err) => {
      console.log(err.message);
    });
});

// <------------ logging out -------------->
const logoutForm = document.querySelector(".logout");
logoutForm.addEventListener("click", (e) => {
  signOut(auth)
    .then(() => {
      // console.log('the user signed out');
    })
    .catch((err) => {
      console.log(err.message);
    });
});

// <------------ logging in -------------->

const loginForm = document.querySelector(".login");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = loginForm.email.value;
  const password = loginForm.password.value;
  createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      // console.log('user logged in',  cred.user);
    })
    .catch((err) => {
      console.log(err.message);
    });
});

// -------------- subscribing to the auth changes ---------------
const unsubAuth = onAuthStateChanged(auth, (user) => {
  console.log("user status changed: ", user);
});

//--------------Unsubscribing from changes (auth & db) ------------

const unsubButton = document.querySelector(".unsub");
unsubButton.addEventListener("click", () => {
  console.log("unsubscribing");
  unsubCol();
  unsubDoc();
  unsubAuth();
});

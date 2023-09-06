import { useEffect, useState } from "react";
import "../App.css";
import Router from "./router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../Myfirebase";
function App() {
  const [islogged, setisloged] = useState(false);
  const [userObj, setuserObj] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setuserObj(user);
        setisloged(true);
      } else {
      }
    });
  }, []);

  return (
    <div className="App">
      <Router islogged={islogged} userObj={userObj} />
    </div>
  );
}

export default App;

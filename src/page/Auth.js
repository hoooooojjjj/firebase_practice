import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../Myfirebase";

const Auth = ({ loginToggle }) => {
  // 이메일 비밀번호 입력값 상태
  const [auth1, setauth1] = useState({
    email: "",
    password: "",
  });

  // 로그인 유무
  const [issignup, setissignup] = useState(false);

  // 이메이 비밀번호 값 변경 시
  const handleChange = (e) => {
    setauth1({
      ...auth1,
      [e.target.name]: e.target.value,
    });
  };

  // 회원가입 클릭 시 회원 가입 완료
  const onSignupSubmit = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, auth1.email, auth1.password)
      .then((userCredential) => {
        alert("회원가입이 완료되었습니다. 로그인해주세요");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
    setauth1({
      email: "",
      password: "",
    });
  };

  // 로그인 클릭 시 로그인 완료
  const onSigninSubmit = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, auth1.email, auth1.password)
      .then((userCredential) => {
        alert("로그인되었습니다.");
        loginToggle();
      })
      .catch((error) => {});
    setauth1({
      email: "",
      password: "",
    });
  };

  return (
    <div>
      <form>
        <input
          value={auth1.email}
          name="email"
          type="text"
          onChange={handleChange}
          placeholder="이메일"
          required
        />
        <input
          value={auth1.password}
          name="password"
          type="password"
          onChange={handleChange}
          placeholder="비밀번호"
          required
        />
        {issignup ? (
          <button onClick={onSigninSubmit}>로그인</button>
        ) : (
          <button onClick={onSignupSubmit}>회원가입</button>
        )}
      </form>
      <button
        onClick={() => {
          setissignup(!issignup);
        }}
      >
        {issignup ? "회원가입하기" : "로그인하기"}
      </button>
    </div>
  );
};

export default React.memo(Auth);

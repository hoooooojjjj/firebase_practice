import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../Myfirebase";
import TodoLender from "../component/TodoLender";
import { storage } from "../Myfirebase";
import { v4 as uuidv4 } from "uuid";
import { ref, uploadString } from "firebase/storage";

const TodoList = ({ userObj }) => {
  const [todotext, settodotext] = useState("");
  const [todos, settodos] = useState([]);
  const [fileStingUrl, setfileStingUrl] = useState(""); // 파일 렌더링용 url
  // 데이터 추가하기
  const todoUpload = async (e) => {
    let storageRef = "";
    e.preventDefault();
    // 사용자가 이미지를 업로드 했을 때
    if (fileStingUrl) {
      // 이미지 파일 참조 만들기
      storageRef = ref(storage, `${userObj.uid}/${uuidv4()}`);
      // 파일 업로드
      const upLoad = await uploadString(storageRef, fileStingUrl);
    }
    try {
      const docRef = await addDoc(collection(db, "todos"), {
        todo: todotext,
        createDate: new Date().getTime(),
        authorId: userObj.uid,
        file: fileStingUrl, // 파일 렌더링 URL을 데이터에 추가
        findFile: storageRef?.fullPath ? storageRef.fullPath : "", // 파일 찾기를 위한 경로를 데이터에 추가
      });
    } catch (e) {
      console.log(e);
    }
    settodotext("");
    setfileStingUrl(null);
  };

  //데이터 가져오기
  // const getTodos = async () => {
  //   const getArr = [];
  //   const querySnapshot = await getDocs(collection(db, "todos"));
  //   querySnapshot.forEach((doc) => {
  //     const gettodo = {
  //       id: doc.id,
  //       ...doc.data(),
  //     };
  //     getArr.push(gettodo);
  //   });
  //   settodos(getArr);
  // };

  // 데이터 리얼타임으로 가져오기
  useEffect(() => {
    const q = query(collection(db, "todos"), orderBy("createDate", "desc"));
    const unsub = onSnapshot(q, (doc) => {
      const todosArr = doc.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      settodos(todosArr);
    });
  }, []);

  const handleFileChange = (e) => {
    // 사용자가 업로드한 파일 가져오기
    console.log(e.target.files[0]);
    // 파일을 렌더링할 수 있는 클래스
    const reader = new FileReader();
    // 파일을 URL로 읽어올 수 있음 -> onloadend를 트리거함
    reader.readAsDataURL(e.target.files[0]);
    // 파일 읽어오기가 끝나면 실행됨.
    reader.onloadend = (finishEvent) => {
      // 파일의 sting URL을 반환함 -> img src에 추가해서 렌더링 가능
      setfileStingUrl(finishEvent.currentTarget.result);
    };
  };

  return (
    <div>
      <h1>파이어베이스를 통한 투두리스트</h1>
      <form>
        <input
          type="text"
          value={todotext}
          onChange={(e) => {
            settodotext(e.target.value);
          }}
        />
        <button onClick={todoUpload}>등록</button>
        <input type="file" onChange={handleFileChange} />
      </form>
      {fileStingUrl && <img src={fileStingUrl} alt="사진 미리보기"></img>}
      {todos.map((todo) => (
        <TodoLender key={todo.id} {...todo} />
      ))}
    </div>
  );
};

export default TodoList;

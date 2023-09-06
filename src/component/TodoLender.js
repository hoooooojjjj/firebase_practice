import React, { useEffect, useState } from "react";
import {
  doc,
  deleteDoc,
  setDoc,
  getDocs,
  collection,
} from "firebase/firestore";
import { db } from "../Myfirebase";
import { storage } from "../Myfirebase";
import { ref, deleteObject } from "firebase/storage";

const TodoLender = ({ todo, createDate, authorId, id, file, userObj }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [newtodo, setnewtodo] = useState("");

  const onEdit = async () => {
    await setDoc(doc(db, "todos", id), {
      todo: newtodo,
      createDate,
      authorId,
    });
    setIsEdit(!isEdit);
  };

  const onDelete = async () => {
    await deleteDoc(doc(db, "todos", id));

    // 파일을 찾기 위한 URL을 통해 해당 파일 찾기
    const querySnapshot = await getDocs(collection(db, "todos"));
    // 해당 투두의 findFile 찾기
    querySnapshot.forEach(async (doc) => {
      if (doc.id === id) {
        const getFindFile = doc.findFile;
        const storageRef = ref(storage, getFindFile);
        // 파일 지우기
        await deleteObject(storageRef);
      }
    });
  };

  const toggleEdit = () => {
    setIsEdit(!isEdit);
  };

  return (
    <>
      {isEdit ? (
        <div>
          <input
            type="text"
            value={newtodo}
            onChange={(e) => {
              setnewtodo(e.target.value);
            }}
          />
          <button onClick={toggleEdit}>취소</button>
          <button onClick={onEdit}>수정</button>
        </div>
      ) : (
        <div>
          {todo} | {new Date(createDate).toISOString().slice(0, 10)}
          <button onClick={onDelete}>삭제</button>
          <button onClick={toggleEdit}>수정</button>
        </div>
      )}
      <div>{file && <img src={file}></img>}</div>
    </>
  );
};

export default TodoLender;

import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import TodoList from "../page/TodoList";
import Auth from "../page/Auth";

const Router = ({ islogged, userObj }) => {
  return (
    <BrowserRouter>
      <Routes>
        {islogged ? (
          <Route path="/" element={<TodoList userObj={userObj} />}></Route>
        ) : (
          <Route path="/" element={<Auth />}></Route>
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default Router;

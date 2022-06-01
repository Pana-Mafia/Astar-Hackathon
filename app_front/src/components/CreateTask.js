import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default class CreateTask React.Component {
    const createTask = () {
        return {
            <Modal
          isOpen={"create" === selectedItem}
          style={modalStyle}
          onRequestClose={() => setSelectedItem("")}
        >
          <h2>タスクの作成</h2>

          {currentAccount && (
            <textarea
              name="messageArea"
              className="form"
              placeholder="タスクを記入してください(例：コントラクトアドレスの変更)"
              type="text"
              id="message"
              value={contentValue}
              onChange={(e) => setContentValue(e.target.value)}
            />
          )}
          <br></br>

          {currentAccount && (
            <textarea
              name="messageArea"
              className="form"
              placeholder="期日を記入してください(例：20220507)"
              type="text"
              id="message"
              value={dueValue}
              onChange={(e) => setDueValue(e.target.value)}
            />
          )}
          <br></br>

          {currentAccount && (
            <textarea
              name="messageArea"
              placeholder="タスクの報酬額を記入してください(単位:ASTR)"
              className="form"
              type="text"
              id="message"
              value={bountyValue}
              onChange={(e) => setBountyValue(e.target.value)}
            />
          )}
          <br></br>

          <textarea
            name="messageArea"
            placeholder="タスクの説明を記入してください(例：コントラクトを新たにデプロイし、アドレスを取得してください。提出時には新たなコントラクトアドレスの送付をお願いします)"
            className="form"
            type="text"
            id="expression"
            value={expressionValue}
            onChange={(e) => setExpressionValue(e.target.value)}
          />
          <br></br>
          {currentAccount && (
            <button
              className="submitButton"
              onClick={() => {
                handleTask();
                task();
              }}
            >
              タスクを作成する
            </button>
          )}
        </Modal>
        }
    }
}
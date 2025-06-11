import React, { useState } from "react";

const LoginForm = ({ setAuthToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginData = {
      email: email,
      password: password,
    };

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        const data = await response.json();
        // トークンを取得してローカルストレージに保存
        localStorage.setItem("authToken", data.token);
        setAuthToken(data.token);
        setErrorMessage("");
      } else {
        setErrorMessage("ログインに失敗しました");
      }
    } catch (error) {
      setErrorMessage("エラーが発生しました。もう一度お試しください。");
    }
  };

  return (
    <div>
      <h2>ログイン</h2>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>メールアドレス:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>パスワード:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">ログイン</button>
      </form>
    </div>
  );
};

export default LoginForm;

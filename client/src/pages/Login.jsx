import { useState } from "react";
import API from "../services/api";

const Login = ({ setIsLoggedIn }) => {

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const res = await API.post(
        "/auth/login",
        formData
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      setIsLoggedIn(true);

    } catch (error) {

      alert("Invalid credentials");

    }
  };

  return (
    <div className="bg-slate-900 min-h-screen flex items-center justify-center">

      <form
        onSubmit={handleSubmit}
        className="bg-slate-800 p-10 rounded-xl w-96"
      >

        <h2 className="text-3xl font-bold text-white mb-6">
          Admin Login
        </h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full bg-slate-700 text-white p-3 rounded-lg mb-4"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full bg-slate-700 text-white p-3 rounded-lg mb-4"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg"
        >
          Login
        </button>

      </form>

    </div>
  );
};

export default Login;
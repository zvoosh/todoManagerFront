import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { CreateMutationOptions } from "../services";
import type { CreateUserData } from "../types";
import { registerHook } from "../services/api/users.api";
import { Link, useNavigate } from "react-router-dom";
import { useNotification } from "../services/hooks/useNotification";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<{ input: string; message: string }>({
    input: "",
    message: "",
  });
  const { showNotification } = useNotification();

  const navigate = useNavigate();

  const { mutateAsync: registerMutation } = useMutation(
    CreateMutationOptions<undefined, CreateUserData>({
      mutationFn: (newUser: CreateUserData) => registerHook(newUser),
      successFn: () => {
        navigate("/login");
        showNotification({ msg: "Registration successful! Please log in." });
      },
    }),
  );
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.username.trim() === "" || formData.username.length < 3) {
      setError({
        input: "username",
        message: "Please enter a valid username.",
      });
      return;
    } else if (!formData.email.includes("@")) {
      setError({
        input: "email",
        message: "Please enter a valid email address.",
      });
      return;
    } else if (formData.password.length < 6) {
      setError({
        input: "password",
        message: "Password must be at least 6 characters long.",
      });
      return;
    } else if (formData.password !== formData.confirmPassword) {
      setError({
        input: "confirmPassword",
        message: "Passwords do not match.",
      });
      return;
    } else {
      setError({ input: "", message: "" });
      registerMutation({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded md:shadow-md w-full max-w-md"
        noValidate
      >
        <h2 className="text-lg font-bold mb-2 text-center">
          Welcome to TodoList Manager
        </h2>
        <h2 className="text-2xl font-semibold mb-6 text-center">Register</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            type="text"
            name="username"
            className={`w-full px-3 py-2 border ${
              error && error.input === "username"
                ? "border-red-500"
                : "border-gray-300"
            } rounded focus:outline-none focus:ring-2 ${
              error && error.input === "username"
                ? "focus:ring-red-500"
                : "focus:ring-blue-500"
            }`}
            value={formData.username}
            onChange={handleChange}
            required
          />
          {error && error.input === "username" && (
            <p className="text-red-600 text-sm mt-1">{error.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            className={`w-full px-3 py-2 border ${
              error && error.input === "email"
                ? "border-red-500"
                : "border-gray-300"
            } rounded focus:outline-none focus:ring-2 ${
              error && error.input === "email"
                ? "focus:ring-red-500"
                : "focus:ring-blue-500"
            }`}
            value={formData.email}
            onChange={handleChange}
            required
          />
          {error && error.input === "email" && (
            <p className="text-red-600 text-sm mt-1">{error.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            name="password"
            className={`w-full px-3 py-2 border ${
              error && error.input === "password"
                ? "border-red-500"
                : "border-gray-300"
            } rounded focus:outline-none focus:ring-2 ${
              error && error.input === "password"
                ? "focus:ring-red-500"
                : "focus:ring-blue-500"
            }`}
            value={formData.password}
            onChange={handleChange}
            required
          />
          {error && error.input === "password" && (
            <p className="text-red-600 text-sm mt-1">{error.message}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            className={`w-full px-3 py-2 border ${
              error && error.input === "confirmPassword"
                ? "border-red-500"
                : "border-gray-300"
            } rounded focus:outline-none focus:ring-2 ${
              error && error.input === "confirmPassword"
                ? "focus:ring-red-500"
                : "focus:ring-blue-500"
            }`}
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          {error && error.input === "confirmPassword" && (
            <p className="text-red-600 text-sm mt-1">{error.message}</p>
          )}
        </div>

        <div className="flex flex-col items-center gap-3">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
          <Link to="/login" className="underline underline-offset-2">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;

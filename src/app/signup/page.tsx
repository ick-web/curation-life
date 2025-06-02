"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabase";
import { SignupInput, signupSchema } from "@/lib/validations/auth";

const SignupPage = () => {
  const router = useRouter();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
    },
  });

  const onSubmit = async (data: SignupInput) => {
    setError("");

    try {
      // 1. 이메일 중복 확인
      const { data: existingUser, error: getUserError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", data.email)
        .single();

      if (getUserError && getUserError.code !== "PGRST116") {
        throw getUserError;
      }

      if (existingUser) {
        setError("이미 사용 중인 이메일입니다.");
        return;
      }

      // 2. 회원가입
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        // Supabase 에러 메시지를 한글로 변환
        if (authError.message.includes("User already registered")) {
          setError("이미 가입된 이메일입니다.");
          return;
        }
        throw authError;
      }

      if (authData.user) {
        // 3. profiles 테이블에 사용자 정보 저장
        const { error: profileError } = await supabase.from("profiles").insert([
          {
            id: authData.user.id,
            name: data.name,
            email: data.email,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);

        if (profileError) throw profileError;
      }

      alert("회원가입이 완료되었습니다. 이메일 인증을 진행해주세요.");
      router.push("/login");
    } catch (error: any) {
      console.error("회원가입 실패:", error);
      // 에러 메시지를 사용자 친화적으로 변환
      if (error.message.includes("duplicate key")) {
        setError("이미 사용 중인 이메일입니다.");
      } else {
        setError(error.message || "회원가입에 실패했습니다.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-3xl font-bold text-center text-gray-900">
          회원가입
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                이메일
              </label>
              <input
                id="email"
                type="email"
                className="mt-1 block w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-md font-medium"
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                className="mt-1 block w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-md font-medium"
                {...register("password")}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                비밀번호 확인
              </label>
              <input
                id="confirmPassword"
                type="password"
                className="mt-1 block w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-md font-medium"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                이름
              </label>
              <input
                id="name"
                type="text"
                className="mt-1 block w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-md font-medium"
                {...register("name")}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "처리중..." : "가입하기"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;

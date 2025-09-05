'use server';

import { createClient } from '@/lib/supabase/server';
import { LoginFormData, RegisterFormData } from '../types';

export async function login(data: LoginFormData) {
  // Basic email format validation
  const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  if (!emailRegex.test(data.email)) {
    return { error: "Invalid email format." };
  }
  // Password length and strength check
  if (!data.password || data.password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });
  if (error) {
    // Do not leak detailed error messages
    return { error: "Login failed. Please check your credentials." };
  }
  // Success: no error
  return { error: null };
}

export async function register(data: RegisterFormData) {
  // Basic email format validation
  const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  if (!emailRegex.test(data.email)) {
    return { error: "Invalid email format." };
  }
  // Password length and strength check
  if (!data.password || data.password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }
  // Optionally, check for password complexity (uppercase, lowercase, number, special char)
  const complexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[_!@#$%^&*]).{8,}$/;
  if (!complexityRegex.test(data.password)) {
    return { error: "Password must include uppercase, lowercase, number, and special character." };
  }
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        name: data.name,
        role: "user", // default role
      },
    },
  });
  if (error) {
    // Do not leak detailed error messages
    return { error: "Registration failed. Please try again." };
  }
  // Success: no error
  return { error: null };
}

export async function logout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    return { error: error.message };
  }
  return { error: null };
}

export async function getCurrentUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function getSession() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getSession();
  return data.session;
}

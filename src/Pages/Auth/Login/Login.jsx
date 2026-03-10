import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input, Spinner } from "@heroui/react";
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from 'zod';
import axios from 'axios';


const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 !text-gray-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 !text-gray-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
);

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><path fill="#4285F4" d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82Z" /><path fill="#34A853" d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.565 24 12.255 24Z" /><path fill="#FBBC05" d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 0 0 0 10.76l3.98-3.09Z" /><path fill="#EA4335" d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0 7.565 0 3.515 2.7 1.545 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96Z" /></svg>
);

const FacebookIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      fill="#1877F2"
      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
    />
  </svg>
);

export default function Login() {
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const schema = zod.object({
    login: zod.string().email('*Email must be a valid email'),
    password: zod.string().min(1, '*Password is required')
  });

  const { register, handleSubmit, formState } = useForm({
    defaultValues: {
      login: '',
      password: ''
    },
    resolver: zodResolver(schema)
  });

  const { errors } = formState;

  function handleLogin(values) {
    setIsLoading(true);
    setErrorMsg(null);

    axios.post('https://route-posts.routemisr.com/users/signin', values)
      .then((response) => {
        if (response.data.success === true) {
          localStorage.setItem('token', response.data.data.token);
          navigate('/', { replace: true });
        }
      })
      .catch((err) => {
        setErrorMsg(err.response?.data?.message || 'Invalid email or password');
        setTimeout(() => {
          setErrorMsg(null);
        }, 3000);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    
    <div className="min-h-screen bg-[#15111e] flex items-center justify-center p-4 relative overflow-hidden">

      
      <div className="relative w-full max-w-md rounded-[24px] p-[2px] bg-gradient-to-br from-[#8a2be2] via-[#00b4d8] to-[#ff007f] shadow-[0_0_50px_rgba(138,43,226,0.2)]">

        
        <div className="bg-[#1e192c] rounded-[22px] p-8 h-full w-full flex flex-col">

          
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold !text-white tracking-wide">Welcome Back</h1>
            <p className="!text-gray-300 mt-2 text-sm">Find your tribe. Join the conversation.</p>
          </div>

          
          <div className="flex bg-[#272138] rounded-xl p-1 mb-6">
            <button className="flex-1 bg-[#8b31ff] !text-white py-2.5 rounded-lg font-semibold text-sm shadow-md transition-all">
              Log In
            </button>
            <Link to="/register" className="flex-1 !text-gray-300 py-2.5 text-center rounded-lg font-medium text-sm hover:!text-white transition-all">
              Sign Up
            </Link>
          </div>

          
          <form className="space-y-5" onSubmit={handleSubmit(handleLogin)}>

            
            <div>
              <Input
                type="email"
                label="Email Address"
                placeholder="name@example.com"
                labelPlacement="outside"
                startContent={<MailIcon />}
                size="lg"
                classNames={{
                  label: "!text-gray-300 text-xs font-semibold mb-1",
                  input: "!text-white placeholder:!text-gray-500 text-sm",
                  inputWrapper: "bg-[#272138] border-none rounded-xl h-14 data-[hover=true]:bg-[#2f2845] group-data-[focus=true]:bg-[#2f2845] transition-colors"
                }}
                {...register('login')}
                isInvalid={Boolean(errors.login?.message)}
                errorMessage={errors.login?.message}
              />
            </div>

            
            <div>
              <Input
                type="password"
                label="Password"
                placeholder="••••••••"
                labelPlacement="outside"
                startContent={<LockIcon />}
                size="lg"
                classNames={{
                  label: "!text-gray-300 text-xs font-semibold mb-1",
                  input: "!text-white placeholder:!text-gray-500 text-sm tracking-widest",
                  inputWrapper: "bg-[#272138] border-none rounded-xl h-14 data-[hover=true]:bg-[#2f2845] group-data-[focus=true]:bg-[#2f2845] transition-colors"
                }}
                {...register('password')}
                isInvalid={Boolean(errors.password?.message)}
                errorMessage={errors.password?.message}
              />

              
              <div className="flex justify-end mt-2">
                <Link to="/forgot-password" className="text-[#9d4edd] hover:text-[#b874ed] text-xs font-medium transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>

            
            {errorMsg && (
              <div className="text-red-400 text-sm text-center bg-red-400/10 py-2 rounded-lg">
                {errorMsg}
              </div>
            )}

            
            <Button
              isDisabled={isLoading}
              type="submit"
              className="w-full bg-[#8b31ff] hover:bg-[#7a20ec] !text-white h-12 rounded-xl text-base font-semibold shadow-lg shadow-[#8b31ff]/30 transition-all mt-4"
            >
              {isLoading ? <Spinner size="sm" color="white" /> : 'Sign In'}
            </Button>
          </form>

          
          <div className="flex items-center gap-4 mt-8 mb-6">
            <div className="h-[1px] bg-[#3a3250] flex-1"></div>
            <span className="!text-[#645c7a] text-xs font-medium uppercase tracking-wider">Or continue with</span>
            <div className="h-[1px] bg-[#3a3250] flex-1"></div>
          </div>

          
          <div className="flex gap-4">
            <Button
              variant="flat"
              className="flex-1 bg-[#272138] hover:bg-[#2f2845] border border-[#3a3250] !text-white h-12 rounded-xl flex items-center justify-center gap-2"
            >
              <GoogleIcon />
              <span className="text-sm font-medium">Google</span>
            </Button>

            <Button
              variant="flat"
              className="flex-1 bg-[#272138] hover:bg-[#2f2845] border border-[#3a3250] !text-white h-12 rounded-xl flex items-center justify-center gap-2"
            >
              <FacebookIcon />
              <span className="text-sm font-medium">Facebook</span>
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
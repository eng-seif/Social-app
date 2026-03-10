import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import { Input, Button, Spinner } from '@heroui/react';
import { Lock, KeyRound, ShieldCheck } from 'lucide-react';

import { LeftSidebar } from '../../Components/LeftSidebar/LeftSidebar';

export default function Settings() {
    const token = localStorage.getItem('token');

    
    
    const schema = zod.object({
        password: zod.string().min(1, '*Current password is required'),
        newPassword: zod.string()
            .min(1, '*New password is required')
            .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, '*Must be at least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char'),
        rePassword: zod.string().min(1, '*Confirm new password is required'),
    }).refine((data) => data.newPassword === data.rePassword, {
        message: '*New passwords do not match',
        path: ['rePassword']
    });

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            password: '',
            newPassword: '',
            rePassword: ''
        },
        resolver: zodResolver(schema)
    });

    
    const changePasswordMutation = useMutation({
        mutationFn: (values) => {
            
            const payload = {
                password: values.password,
                newPassword: values.newPassword
            };

            return axios.patch('https://route-posts.routemisr.com/users/change-password', payload, {
                headers: {
                    token: token
                }
            });
        },
        onSuccess: (res) => {
            
            
            if (res.data?.token) {
                localStorage.setItem('token', res.data.token);
            }

            toast.success("Password changed successfully!");
            reset(); 
        },
        onError: (err) => {
            console.error(err.response);
            const errorMsg = err.response?.data?.message || err.response?.data?.error || "Failed to change password.";
            toast.error(errorMsg);
        }
    });

    const onSubmit = (data) => {
        changePasswordMutation.mutate(data);
    };

    
    const inputClassNames = {
        label: "!text-gray-300 text-xs font-semibold mb-1",
        input: "!text-white placeholder:!text-gray-500 text-sm tracking-widest",
        inputWrapper: "bg-[#1C2732] border-none rounded-xl h-14 data-[hover=true]:bg-[#23303e] group-data-[focus=true]:bg-[#23303e] transition-colors"
    };

    return (
        <div className="min-h-screen bg-[#0B1014] text-white font-sans flex justify-center mx-auto">
            <div className="w-full max-w-7xl flex gap-6 px-4 py-6">

                

                
                
                <main className="flex-1 max-w-2xl w-full mx-auto flex flex-col gap-6">

                    
                    <div className="bg-[#15202B] rounded-2xl p-6 shadow-sm border border-gray-800/50 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#1C2732] flex items-center justify-center shrink-0">
                            <ShieldCheck size={24} className="text-[#1DA1F2]" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white tracking-wide">Security Settings</h1>
                            <p className="text-gray-400 text-sm mt-1">Manage your password and secure your account.</p>
                        </div>
                    </div>

                    
                    <div className="bg-[#15202B] rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-800/50">
                        <h2 className="text-lg font-bold text-white mb-6 border-b border-gray-800/50 pb-4">
                            Change Password
                        </h2>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                            
                            <div>
                                <Input
                                    type="password"
                                    label="Current Password"
                                    placeholder="••••••••"
                                    labelPlacement="outside"
                                    startContent={<Lock size={18} className="text-gray-400" />}
                                    size="lg"
                                    classNames={inputClassNames}
                                    {...register('password')}
                                    isInvalid={Boolean(errors.password?.message)}
                                    errorMessage={errors.password?.message}
                                />
                            </div>

                            
                            <div>
                                <Input
                                    type="password"
                                    label="New Password"
                                    placeholder="••••••••"
                                    labelPlacement="outside"
                                    startContent={<KeyRound size={18} className="text-gray-400" />}
                                    size="lg"
                                    classNames={inputClassNames}
                                    {...register('newPassword')}
                                    isInvalid={Boolean(errors.newPassword?.message)}
                                    errorMessage={errors.newPassword?.message}
                                />
                            </div>

                            
                            <div>
                                <Input
                                    type="password"
                                    label="Confirm New Password"
                                    placeholder="••••••••"
                                    labelPlacement="outside"
                                    startContent={<KeyRound size={18} className="text-gray-400" />}
                                    size="lg"
                                    classNames={inputClassNames}
                                    {...register('rePassword')}
                                    isInvalid={Boolean(errors.rePassword?.message)}
                                    errorMessage={errors.rePassword?.message}
                                />
                            </div>

                            
                            <div className="pt-4 flex justify-end">
                                <Button
                                    type="submit"
                                    isDisabled={changePasswordMutation.isPending}
                                    className="bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white font-bold text-sm px-8 py-2.5 rounded-full transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                                >
                                    {changePasswordMutation.isPending ? (
                                        <Spinner size="sm" color="white" />
                                    ) : (
                                        'Update Password'
                                    )}
                                </Button>
                            </div>

                        </form>
                    </div>

                </main>

            </div>
        </div>
    );
}
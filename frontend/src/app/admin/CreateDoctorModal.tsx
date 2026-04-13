"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { createDoctor } from "../../api/admin";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  specialty: z.string().optional(),
  hospital_id: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateDoctorModal({ onClose, onSuccess }: Props) {
  const [error, setError] = useState("");
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data: FormData) => {
    try {
      setError("");
      await createDoctor({
        name: data.name,
        email: data.email,
        password: data.password,
        specialty: data.specialty || undefined,
        hospital_id: data.hospital_id ? parseInt(data.hospital_id) : undefined,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to create doctor account.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">Create Doctor Profile</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold text-xl">&times;</button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <form id="create-doctor-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">{error}</div>}
            
            <Input
              label="Full Name"
              type="text"
              placeholder="Dr. Sarah Connor"
              {...register("name")}
              error={errors.name?.message}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="doctor@ehcidb.local"
              {...register("email")}
              error={errors.email?.message}
            />
            
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              error={errors.password?.message}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Specialty (Optional)"
                type="text"
                placeholder="Neurology"
                {...register("specialty")}
                error={errors.specialty?.message}
              />
              <Input
                label="Hospital ID (Optional)"
                type="number"
                placeholder="1"
                {...register("hospital_id")}
                error={errors.hospital_id?.message}
              />
            </div>
          </form>
        </div>
        
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} type="button">Cancel</Button>
          <Button form="create-doctor-form" type="submit" isLoading={isSubmitting}>Create Account</Button>
        </div>
      </div>
    </div>
  );
}

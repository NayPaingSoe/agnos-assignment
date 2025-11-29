"use client";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  MotionContainer,
  MotionCard,
  MotionElement,
  MotionForm,
} from "@/components/ui/motion-container";
import Button from "@/components/ui/button";
import Card, { CardHeader, CardContent } from "@/components/ui/card";
import Input from "@/components/ui/input";
import Label from "@/components/ui/label";
import Select from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { toast } from "sonner";
import { config } from "@/lib/config";

const socket = io(config.websocket.url);

export default function PatientPage() {
  const schema = z.object({
    firstName: z.string().min(1, "First name is required"),
    middleName: z.union([z.string(), z.literal("")]).optional(),
    lastName: z.string().min(1, "Last name is required"),
    dob: z.string().min(1, "Date of birth is required"),
    gender: z.string().min(1, "Gender is required"),
    phone: z.string().refine(
      (v) => {
        const digits = v.replace(/\D/g, "");
        return digits.length >= 7 && digits.length <= 15;
      },
      { message: "Enter a valid phone number" }
    ),
    email: z.string().email({ message: "Enter a valid email" }),
    address: z.string().min(1, "Address is required"),
    language: z.string().min(1, "Preferred language is required"),
    nationality: z.string().min(1, "Nationality is required"),
    emergencyContactName: z.union([z.string(), z.literal("")]).optional(),
    emergencyContactRelationship: z
      .union([z.string(), z.literal("")])
      .optional(),
    religion: z.string().min(1, "Religion is required"),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      dob: "",
      gender: "",
      phone: "",
      email: "",
      address: "",
      language: "",
      nationality: "",
      emergencyContactName: "",
      emergencyContactRelationship: "",
      religion: "",
    },
  });

  useEffect(() => {
    socket.emit("join", "patient");
  }, []);

  useEffect(() => {
    const subscription = watch((values) => {
      socket.emit("patient:update", values);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = () => {
    socket.emit("patient:submit");
    toast.success("Patient registration submitted successfully!", {
      position: "top-right",
      duration: 3000,
    });
  };

  return (
    <MotionContainer
      className="min-h-screen flex items-center justify-center bg-zinc-50 py-8"
      initialY={100}
      duration={0.6}
    >
      <MotionCard
        className="max-w-2xl w-full pb-3"
        initialY={50}
        delay={0.2}
        duration={0.8}
      >
        <Card>
          <CardHeader>
            <MotionElement
              as="p"
              initialY={20}
              delay={0.4}
              className="text-2xl text-center py-4"
            >
              Patient Registration
            </MotionElement>
          </CardHeader>
          <CardContent className="pb-8">
            <MotionForm
              initialY={30}
              delay={0.6}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label htmlFor="firstName">
                  First Name <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="firstName"
                  placeholder="First Name"
                  error={errors.firstName?.message}
                  {...register("firstName")}
                />
              </div>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label htmlFor="middleName">Middle Name (optional)</Label>
                <Input
                  id="middleName"
                  placeholder="Middle Name"
                  {...register("middleName")}
                />
              </div>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label htmlFor="lastName">
                  Last Name <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="lastName"
                  placeholder="Last Name"
                  error={errors.lastName?.message}
                  {...register("lastName")}
                />
              </div>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label htmlFor="dob">
                  Date of Birth <span className="text-red-600">*</span>
                </Label>
                <DatePicker
                  id="dob"
                  value={watch("dob")}
                  onChange={(e) =>
                    setValue("dob", e.target.value, { shouldValidate: true })
                  }
                  error={errors.dob?.message}
                />
              </div>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label htmlFor="gender">
                  Gender <span className="text-red-600">*</span>
                </Label>
                <Select
                  id="gender"
                  error={errors.gender?.message}
                  {...register("gender")}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </Select>
              </div>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label htmlFor="phone">
                  Phone Number <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="phone"
                  placeholder="Phone Number"
                  error={errors.phone?.message}
                  {...register("phone")}
                />
              </div>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label htmlFor="email">
                  Email <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="email"
                  placeholder="Email"
                  error={errors.email?.message}
                  {...register("email")}
                />
              </div>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label htmlFor="address">
                  Address <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="address"
                  placeholder="Address"
                  error={errors.address?.message}
                  {...register("address")}
                />
              </div>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label htmlFor="language">
                  Preferred Language <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="language"
                  placeholder="Preferred Language"
                  error={errors.language?.message}
                  {...register("language")}
                />
              </div>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label htmlFor="nationality">
                  Nationality <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="nationality"
                  placeholder="Nationality"
                  error={errors.nationality?.message}
                  {...register("nationality")}
                />
              </div>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label htmlFor="religion">
                  Religion <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="religion"
                  placeholder="Religion"
                  error={errors.religion?.message}
                  {...register("religion")}
                />
              </div>
              <div></div>
              <div className="col-span-2 space-y-2">
                <h3 className="text-lg font-semibold">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactName">
                      Name (optional)
                    </Label>
                    <Input
                      id="emergencyContactName"
                      placeholder="Emergency Contact Name"
                      {...register("emergencyContactName")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactRelationship">
                      Relationship (optional)
                    </Label>
                    <Input
                      id="emergencyContactRelationship"
                      placeholder="Relationship"
                      {...register("emergencyContactRelationship")}
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-2">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-teal-600 text-white hover:bg-teal-700 py-3"
                >
                  Submit
                </Button>
              </div>
            </MotionForm>
          </CardContent>
        </Card>
      </MotionCard>
    </MotionContainer>
  );
}

"use client";

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { io } from "socket.io-client";
import { Trash } from "lucide-react";
import { MotionContainer, MotionCard } from "@/components/ui/motion-container";
import Card, { CardHeader, CardContent } from "@/components/ui/card";
import Input from "@/components/ui/input";
import Label from "@/components/ui/label";
import Select from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import Badge from "@/components/ui/badge";
import { config } from "@/lib/config";
import { cn } from "@/lib/utils";

const socket = io(config.websocket.url);

const PATIENT_STATUS = {
  SUBMITTED: "submitted",
  INACTIVE: "inactive",
  ACTIVE: "active",
};

const GENDER_OPTIONS = [
  { value: "", label: "Select Gender" },
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
  { value: "Prefer not to say", label: "Prefer not to say" },
];

const formatFullName = (patient) => {
  if (!patient) return "";
  const { firstName = "", middleName = "", lastName = "" } = patient;
  return `${firstName} ${middleName} ${lastName}`;
};

const getStatusConfig = (status) => {
  switch (status) {
    case PATIENT_STATUS.SUBMITTED:
      return { variant: "success", text: "Submitted", color: "bg-green-600" };
    case PATIENT_STATUS.INACTIVE:
      return { variant: "warning", text: "Inactive", color: "bg-yellow-400" };
    default:
      return {
        variant: "active",
        text: "Actively Filling",
        color: "bg-teal-600",
      };
  }
};

const STAFF_FORM_SCHEMA = z.object({
  firstName: z.string().optional(),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
  dob: z.string().optional(),
  gender: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  address: z.string().optional(),
  language: z.string().optional(),
  nationality: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactRelationship: z.string().optional(),
  religion: z.string().optional(),
});

const STAFF_DEFAULT_VALUES = {
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
};

const STAFF_FORM_FIELDS = Object.keys(STAFF_DEFAULT_VALUES);

const normalizePatientValues = (patient) => ({
  firstName: patient?.firstName || "",
  middleName: patient?.middleName || "",
  lastName: patient?.lastName || "",
  dob: patient?.dob || "",
  gender: patient?.gender || "",
  phone: patient?.phone || "",
  email: patient?.email || "",
  address: patient?.address || "",
  language: patient?.language || "",
  nationality: patient?.nationality || "",
  emergencyContactName: patient?.emergencyContactName || "",
  emergencyContactRelationship: patient?.emergencyContactRelationship || "",
  religion: patient?.religion || "",
});

const areValuesEqual = (a, b) =>
  STAFF_FORM_FIELDS.every((field) => (a?.[field] ?? "") === (b?.[field] ?? ""));

export default function StaffPage() {
  const [patients, setPatients] = useState({});
  const [selectedId, setSelectedId] = useState(null);
  const {
    register,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(STAFF_FORM_SCHEMA),
    defaultValues: STAFF_DEFAULT_VALUES,
    mode: "onChange",
  });
  const isSyncingRef = useRef(false);
  const previousValuesRef = useRef(STAFF_DEFAULT_VALUES);

  const handleRemovePatient = useCallback(
    (patientId) => {
      setPatients((previousPatients) => {
        const updatedPatients = { ...previousPatients };
        delete updatedPatients[patientId];
        return updatedPatients;
      });

      setSelectedId((currentSelectedId) => {
        if (currentSelectedId === patientId) {
          const remainingIds = Object.keys(patients).filter(
            (id) => id !== patientId
          );
          return remainingIds[0] || null;
        }
        return currentSelectedId;
      });

      console.log("Deleted patient ID:", patientId);
    },
    [patients]
  );

  const handleDeletePatient = useCallback((patientId) => {
    console.log("Attempting to delete patient:", patientId);
    socket.emit("patient:delete", patientId);
  }, []);

  useEffect(() => {
    socket.emit("join", "staff");

    const addTimestamp = (patient) => ({
      ...patient,
      _updatedAt: Date.now(),
    });

    const handleAllPatients = (patientList) => {
      const patientMap = {};
      patientList.forEach((patient) => {
        if (patient.id) {
          patientMap[patient.id] = addTimestamp({
            ...patient,
            middleName: patient.middleName || "",
          });
        }
      });

      setPatients(patientMap);

      const firstPatient = patientList.find((p) => p.id);
      if (firstPatient && !selectedId) {
        setSelectedId(firstPatient.id);
      }
    };

    const handlePatientUpdate = (patient) => {
      const updatedPatient = addTimestamp(patient);
      setPatients((previousPatients) => ({
        ...previousPatients,
        [updatedPatient.id]: updatedPatient,
      }));

      if (!selectedId) {
        setSelectedId(updatedPatient.id);
      }
    };

    socket.on("patient:all", handleAllPatients);
    socket.on("patient:update", handlePatientUpdate);
    socket.on("patient:remove", handleRemovePatient);

    return () => {
      socket.off("patient:all", handleAllPatients);
      socket.off("patient:update", handlePatientUpdate);
      socket.off("patient:remove", handleRemovePatient);
    };
  }, [selectedId, handleRemovePatient]);

  const patientList = useMemo(() => Object.values(patients), [patients]);
  const selectedPatient = useMemo(
    () => (selectedId ? patients[selectedId] : null),
    [patients, selectedId]
  );
  const selectedStatusConfig = useMemo(
    () => getStatusConfig(selectedPatient?.status),
    [selectedPatient?.status]
  );
  const normalizedSelectedValues = useMemo(
    () =>
      selectedPatient
        ? normalizePatientValues(selectedPatient)
        : STAFF_DEFAULT_VALUES,
    [selectedPatient]
  );

  const syncFormWithSelection = useCallback(() => {
    if (areValuesEqual(previousValuesRef.current, normalizedSelectedValues)) {
      return;
    }

    isSyncingRef.current = true;
    reset(normalizedSelectedValues);
    previousValuesRef.current = normalizedSelectedValues;
    requestAnimationFrame(() => {
      isSyncingRef.current = false;
    });
  }, [normalizedSelectedValues, reset]);

  const emitStaffChanges = useCallback(
    (values) => {
      if (isSyncingRef.current || !selectedId) return;

      const changedFields = {};
      STAFF_FORM_FIELDS.forEach((field) => {
        if (values[field] !== previousValuesRef.current[field]) {
          changedFields[field] = values[field];
        }
      });

      if (Object.keys(changedFields).length === 0) return;

      socket.emit("staff:update", {
        id: selectedId,
        data: changedFields,
      });

      setPatients((previousPatients) => {
        const currentPatient = previousPatients[selectedId];
        if (!currentPatient) return previousPatients;

        const updatedPatient = {
          ...currentPatient,
          ...changedFields,
          _updatedAt: Date.now(),
        };

        return {
          ...previousPatients,
          [selectedId]: updatedPatient,
        };
      });

      previousValuesRef.current = { ...values };
    },
    [selectedId, setPatients]
  );

  useEffect(() => {
    syncFormWithSelection();
  }, [syncFormWithSelection]);

  useEffect(() => {
    const subscription = watch(emitStaffChanges);
    return () => subscription.unsubscribe();
  }, [watch, emitStaffChanges]);

  return (
    <MotionContainer
      className="min-h-screen flex justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-black dark:to-zinc-900 p-6"
      initialY={100}
      duration={0.6}
    >
      <MotionCard
        className="w-full max-w-6xl"
        initialY={50}
        delay={0.2}
        duration={0.8}
      >
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="py-3">
                <div className="text-3xl font-semibold tracking-tight">
                  Staff Dashboard
                </div>
                {/* <div className="mt-1 text-sm text-muted-foreground">
                  Manage live patient lists updates
                </div> */}
                <div className="text-sm text-muted-foreground">
                  {patientList.length} Patients Online
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Patient List Sidebar */}
              <div className="w-full md:w-80 flex-shrink-0 md:border-r md:border-gray-300 md:pr-6 pb-4 md:pb-0 border-b md:border-b-0 border-gray-300">
                {/* Status Legend */}
                <div className="flex items-center gap-4 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-600" />
                    <span>Submitted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-teal-600" />
                    <span>Actively Filling</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-yellow-400" />
                    <span>Inactive</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {patientList.length === 0 ? (
                    <div className="text-sm text-muted-foreground">
                      No patients connected.
                    </div>
                  ) : (
                    patientList.map((patient) => {
                      const statusConfig = getStatusConfig(patient.status);
                      const fullName = formatFullName(patient);
                      const isSelected = patient.id === selectedId;

                      const indicatorColor = statusConfig.color;
                      const handleDeleteClick = (event) => {
                        event.stopPropagation();
                        handleDeletePatient(patient.id);
                      };

                      const cardClasses = cn(
                        "w-full text-left rounded-xl border px-4 py-3 border-teal-600 cursor-pointer transition-colors",
                        isSelected
                          ? "bg-teal-600 text-white"
                          : "hover:bg-teal-50"
                      );

                      const buttonClasses = cn(
                        "inline-flex items-center justify-center rounded-md border px-2 py-2 transition-colors",
                        isSelected
                          ? "border-white text-white hover:bg-red-400 hover:border-red-400"
                          : "border-red-600 text-red-600 hover:bg-red-50"
                      );

                      return (
                        <div
                          key={patient.id}
                          onClick={() => setSelectedId(patient.id)}
                          className={cardClasses}
                          role="button"
                          tabIndex={0}
                        >
                          <div className="flex items-center gap-3 justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <div
                                className={cn(
                                  "h-4 w-4 rounded-full border border-white",
                                  indicatorColor
                                )}
                              />
                              <div className="flex-1">
                                <div className="font-medium">{fullName}</div>
                                <div
                                  className={cn(
                                    "text-xs",
                                    isSelected
                                      ? "text-white/90"
                                      : "text-teal-500"
                                  )}
                                >
                                  {statusConfig.text}
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={handleDeleteClick}
                              aria-label="Delete patient"
                              className={buttonClasses}
                            >
                              <Trash className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Patient Details */}
              <div className="flex-1">
                {/* Selected Patient Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-2xl font-semibold">
                      {selectedPatient
                        ? formatFullName(selectedPatient)
                        : "Select a patient"}
                    </div>
                  </div>
                  {selectedPatient && (
                    <Badge variant={selectedStatusConfig.variant}>
                      {selectedStatusConfig.text}
                    </Badge>
                  )}
                </div>

                {selectedPatient ? (
                  /* Patient Details Section */
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstname">
                        First Name <span className="text-red-600">*</span>
                      </Label>
                      <Input
                        id="firstname"
                        disabled={!selectedPatient}
                        error={errors.firstName?.message}
                        {...register("firstName")}
                      />
                    </div>
                    <div>
                      <Label htmlFor="middlename">Middle Name</Label>
                      <Input
                        id="middlename"
                        disabled={!selectedPatient}
                        {...register("middleName")}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastname">
                        Last Name <span className="text-red-600">*</span>
                      </Label>
                      <Input
                        id="lastname"
                        disabled={!selectedPatient}
                        error={errors.lastName?.message}
                        {...register("lastName")}
                      />
                    </div>

                    <div>
                      <Label htmlFor="dob">
                        Date of Birth <span className="text-red-600">*</span>
                      </Label>
                      <DatePicker
                        id="dob"
                        value={selectedPatient ? watch("dob") : ""}
                        onChange={(event) =>
                          setValue("dob", event.target.value, {
                            shouldValidate: true,
                          })
                        }
                        readOnly={!selectedPatient}
                        error={errors.dob?.message}
                      />
                    </div>

                    <div>
                      <Label htmlFor="gender">
                        Gender <span className="text-red-600">*</span>
                      </Label>
                      <Select
                        id="gender"
                        disabled={!selectedPatient}
                        error={errors.gender?.message}
                        {...register("gender")}
                      >
                        {GENDER_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="phonenumber">
                        Phone Number <span className="text-red-600">*</span>
                      </Label>
                      <Input
                        id="phonenumber"
                        disabled={!selectedPatient}
                        error={errors.phone?.message}
                        {...register("phone")}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">
                        Email <span className="text-red-600">*</span>
                      </Label>
                      <Input
                        id="email"
                        disabled={!selectedPatient}
                        error={errors.email?.message}
                        {...register("email")}
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">
                        Address <span className="text-red-600">*</span>
                      </Label>
                      <Input
                        id="address"
                        disabled={!selectedPatient}
                        error={errors.address?.message}
                        {...register("address")}
                      />
                    </div>
                    <div>
                      <Label htmlFor="preferredlanguage">
                        Preferred Language{" "}
                        <span className="text-red-600">*</span>
                      </Label>
                      <Input
                        id="preferredlanguage"
                        disabled={!selectedPatient}
                        error={errors.language?.message}
                        {...register("language")}
                      />
                    </div>
                    <div>
                      <Label htmlFor="nationality">
                        Nationality <span className="text-red-600">*</span>
                      </Label>
                      <Input
                        id="nationality"
                        disabled={!selectedPatient}
                        error={errors.nationality?.message}
                        {...register("nationality")}
                      />
                    </div>
                    <div>
                      <Label htmlFor="religion">Religion</Label>
                      <Input
                        id="religion"
                        disabled={!selectedPatient}
                        error={errors.religion?.message}
                        {...register("religion")}
                      />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <h3 className="text-lg font-semibold">
                        Emergency Contact
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="emergencycontactname">Name</Label>
                          <Input
                            id="emergencycontactname"
                            disabled={!selectedPatient}
                            {...register("emergencyContactName")}
                          />
                        </div>
                        <div>
                          <Label htmlFor="emergencycontactrelationship">
                            Relationship
                          </Label>
                          <Input
                            id="emergencycontactrelationship"
                            disabled={!selectedPatient}
                            {...register("emergencyContactRelationship")}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    Select a patient from the list
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </MotionCard>
    </MotionContainer>
  );
}

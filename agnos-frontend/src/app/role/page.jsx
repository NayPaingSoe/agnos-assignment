"use client";
import { useRouter } from "next/navigation";
import {
  MotionContainer,
  MotionCard,
  MotionElement,
} from "@/components/ui/motion-container";
import Button from "@/components/ui/button";
import Card, { CardHeader, CardContent } from "@/components/ui/card";
import { ClipboardList, Stethoscope } from "lucide-react";

export default function RolePage() {
  const router = useRouter();

  const chooseRole = (role) => {
    if (role === "patient") router.push("/patient");
    else router.push("/staff");
  };

  return (
    <MotionContainer
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-black dark:to-zinc-900 p-6"
      initialY={100}
      duration={0.6}
    >
      <MotionCard
        className="max-w-xl w-full"
        initialY={50}
        delay={0.2}
        duration={0.8}
      >
        <Card>
          <CardHeader>
            <MotionElement
              as="h1"
              initialY={20}
              delay={0.4}
              className="text-3xl font-semibold tracking-tight"
            >
              Welcome to Agnos Health
            </MotionElement>
            <MotionElement
              as="p"
              initialY={20}
              delay={0.5}
              className="mt-2 text-muted-foreground"
            >
              Are you a patient or a staff member?
            </MotionElement>
          </CardHeader>
          <CardContent>
            <MotionElement
              as="div"
              initialY={30}
              delay={0.6}
              className="flex flex-col gap-4"
            >
              <Button
                variant="outline"
                size="lg"
                className="justify-start h-12 text-zinc-800 border-teal-500 hover:bg-teal-50"
                onClick={() => chooseRole("patient")}
              >
                <ClipboardList className="mr-3 h-5 w-5 text-teal-600" />
                I&apos;m a Patient
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="justify-start h-12 bg-teal-600 text-white hover:bg-teal-700"
                onClick={() => chooseRole("staff")}
              >
                <span className="mr-3 flex items-center">
                  <Stethoscope className="h-5 w-5" />
                </span>
                I&apos;m a Staff Member
              </Button>
            </MotionElement>
          </CardContent>
        </Card>
      </MotionCard>
    </MotionContainer>
  );
}

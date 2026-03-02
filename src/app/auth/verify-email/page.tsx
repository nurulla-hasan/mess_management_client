"use client"

import { useState, Suspense } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
  } from "@/components/ui/input-otp"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { verifyEmail, resendVerificationCode } from "@/services/auth"
import { ErrorToast, SuccessToast } from "@/lib/utils"

const verifySchema = z.object({
  code: z.string().length(6, {
    message: "Verification code must be 6 digits.",
  }),
})

type VerifyFormValues = z.infer<typeof verifySchema>

function VerifyEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email")
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<VerifyFormValues>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  })

  async function onSubmit(data: VerifyFormValues) {
    setIsLoading(true)
    try {
      const result = await verifyEmail({ email, code: data.code })
      
      if (result?.success) {
        SuccessToast("Email verified successfully! Please login.")
        setTimeout(() => {
          router.push("/auth/login")
        }, 1500)
      } else {
        ErrorToast(result?.message || "Verification failed. Please try again.")
      }
    } catch (error) {
      console.error("Verification failed:", error)
      ErrorToast("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleResend() {
    if (!email) return
    setIsLoading(true)
    try {
      const result = await resendVerificationCode(email)
      if (result?.success) {
        SuccessToast("Verification code resent successfully!")
      } else {
        ErrorToast(result?.message || "Failed to resend code.")
      }
    } catch (error) {
      ErrorToast("An error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Verify Email</CardTitle>
        <CardDescription className="text-center">
          Enter the 6-digit code sent to your email
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex justify-center">
                        <InputOTP maxLength={6} {...field}>
                            <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                            </InputOTPGroup>
                            <InputOTPSeparator />
                            <InputOTPGroup>
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                            </InputOTPGroup>
                        </InputOTP>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" loading={isLoading} loadingText="Verifying...">
              Verify Email
            </Button>
            <div className="text-center text-sm">
              Didn't receive code?{" "}
              <button type="button" onClick={handleResend} className="underline underline-offset-4 hover:text-primary" disabled={isLoading}>
                Resend
              </button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-100">Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  )
}

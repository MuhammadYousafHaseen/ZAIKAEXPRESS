'use client'
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {Loader2} from "lucide-react"
import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"



const Page = () => {
 
  const [isSubmitting, setIsSubmitting] = useState(false)

 
  const { toast } = useToast()

  const router = useRouter();

  // zod implementation
   const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues:{
      email:'',
      password:'',
    }
   })

   const onSubmit = async (data:z.infer<typeof signInSchema>) => {
     setIsSubmitting(true)
     const result =  await signIn('credentials',{
      redirect:false,
      email: data.email,
      password: data.password,
     })
     if(result?.error){
      toast("Error!", {
        description: result.error ?? "Incorrect email or password" ,
      })} 

      if(result?.url){
        setIsSubmitting(false)
        router.replace('/')
        toast("Success!", {
          description: "Login successful" 
        })
      }
   }
   return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md p-6 space-y-6 bg-white dark:bg-gray-800 shadow-lg rounded-2xl transition-all duration-300">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl text-gray-900 dark:text-white mb-4">
            Join ZAIQA EXPRESS
          </h1>
          <p className="text-gray-600 dark:text-gray-400">SIGN IN TO GET STARTED. ALL YOUR FAVOURITE IS HERE</p>
        </div>
  
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter Your Email"
                      {...field}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
  
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter Your Password"
                      {...field}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
  
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full cursor-pointer flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all duration-200 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Please Wait
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>
  
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Does not have an account?{" "}
            <Link href="/sign-up" className="text-blue-600 hover:underline cursor-pointer dark:text-blue-400">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
  
}

export default Page

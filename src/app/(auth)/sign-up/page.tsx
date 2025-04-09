'use client'
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link"
import { useDebounceCallback } from 'usehooks-ts'
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, {AxiosError} from "axios"
import { ApiResponse } from "@/types/ApiResponse"
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



const Page = () => {
  const [username,setUsername] = useState('')
  const [usernameMessage, setUsernameMessage] = useState('')
  const [isCheckingUsername,setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const debounced = useDebounceCallback(setUsername,500)
  const { toast } = useToast()

  const router = useRouter();

  // zod implementation
   const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues:{
      name:'',
      email:'',
      password:'',
    }
   })

   useEffect(()=>{
     const checkUsernameUnique = async () => {
      if(username){
        setIsCheckingUsername(true)
        setUsernameMessage('')
        try {
          const response = await axios.get(`/api/check-username-unique?name=${username}`)
          const message = response.data.message
          setUsernameMessage(message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(axiosError.response?.data.message ?? "Error checking username uniqueness");
        } finally{
          setIsCheckingUsername(false)
        }
      }
     }
     checkUsernameUnique()
   },[username])

   const onSubmit = async (data:z.infer<typeof signUpSchema>) => {
     setIsSubmitting(true)
     //console.log(data)
     try {
      const response = await axios.post<ApiResponse>('/api/user/sign-up',data)
      
    toast( "Success!", {
       description: response.data.message ??"Your account created Successfully " ,
     });
      router.replace(`/verify/${username}`)
      setIsSubmitting(false)
     } catch (error) {
      console.log("Error in signup of User", error)
      const axiosError = error as AxiosError<ApiResponse>;
     const errorMessage = axiosError.response?.data.message ?? "Error creating account";
     toast("Error!", {
      description: errorMessage ??"Error creating account " ,
    });
     setIsSubmitting(false)
     }
   }
   return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md p-6 space-y-6 bg-white dark:bg-gray-800 shadow-lg rounded-2xl transition-all duration-300">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl text-gray-900 dark:text-white mb-4">
            Join ZAIQA EXPRESS
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Sign up to get started. The world of food. </p>
        </div>
  
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300">Username</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="name"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value);
                      }}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </FormControl>
                  {isCheckingUsername && <Loader2 className="h-4 w-4 animate-spin text-blue-500" />}
                  <p className={`text-sm mt-1 ${usernameMessage === "Name is available" ? "text-green-500" : "text-red-500"}`}>
                    {usernameMessage}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
  
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
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300">Phone</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter Your Phone Number"
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
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300">Address</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter Your Address"
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
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300">City</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter Your City Name"
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
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300">Province</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter Your Province Name"
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
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300">State</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter Your Country Name"
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
              className="w-full flex items-center cursor-pointer justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all duration-200 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Please Wait
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>
  
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Already a member?{" "}
            <Link href="/sign-in" className="text-blue-600 cursor-pointer hover:underline dark:text-blue-400">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
  
}

export default Page

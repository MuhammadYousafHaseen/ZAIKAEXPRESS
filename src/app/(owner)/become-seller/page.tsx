'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { ownerSchema } from "@/schemas/ownerShema"
import { motion } from "framer-motion"
import axios, { AxiosError } from "axios"
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
import { Loader2 } from "lucide-react"
import FileUpload from "@/components/FileUpload"
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props"
import Image from "next/image"

const Page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<z.infer<typeof ownerSchema>>({
    resolver: zodResolver(ownerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
      address: '',
      requestForApproval: '',
      isApprovedOwner: false,
      image: '',
      products: [],
      productsCategory: '',
    }
  })

   useEffect(() => {
      const storedOwnerId = localStorage.getItem('ownerId');
      if (storedOwnerId) {
        setOwnerId(storedOwnerId);
      }
    }, []);
  const handleImageUpload = (res: IKUploadResponse) => {
    setImage(res.url)
    console.log(res.url)
  }

  const onSubmit = async (data: z.infer<typeof ownerSchema>) => {
    setIsSubmitting(true)
    try {
        const payload = {
            ...data,
            image: image, // Add the image URL here
          }

          
      
          const response = await axios.post<ApiResponse>(
            '/api/owner/create-owner',
            payload
          )

          const ownerId = response.data.ownerId;
          // After login or registration
          localStorage.setItem("ownerId", ownerId!);
          
          document.cookie = `ownerId=${ownerId}; path=/; max-age=3600`; // 1 hour


      
      toast("Success!", {
        description: response.data.message ?? "Your Seller account created Successfully",
      })
      router.replace(`/seller-dashboard/${ownerId}`)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      const errorMessage = axiosError.response?.data.message ?? "Error creating Seller account"
      toast("Error!", {
        description: errorMessage,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-3xl p-6 space-y-6 bg-white dark:bg-gray-800 shadow-lg rounded-2xl transition-all duration-300">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl text-gray-900 dark:text-white mb-4">
            Join ZAIQA EXPRESS AS A SELLER
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Register Yourself to get started. Serve the World with delicious Food.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="name"
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
                name="requestForApproval"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">Request For Approval</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Approval message for admin"
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
                name="productsCategory"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-gray-700 dark:text-gray-300">Products Category</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter Your Products Category"
                        {...field}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300">
                Upload Your Store Image
              </label>
              <FileUpload onSuccess={handleImageUpload} fileType="image" />
              {image && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="mt-4"
                >
                  <Image
                    src={image}
                    alt="Image Preview"
                    width={300}
                    height={200}
                    className="rounded-xl shadow-lg object-cover border border-gray-200 dark:border-gray-700"
                  />
                </motion.div>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all duration-200 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Please Wait
                </>
              ) : (
                "Register Here"
              )}
            </Button>
          </form>
        </Form>

        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Already a Seller?{" "}
          <Link href={`/seller-dashboard/${ownerId}`} className="text-blue-600 hover:underline cursor-pointer dark:text-blue-400">
              Seller-Dashboard
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Page

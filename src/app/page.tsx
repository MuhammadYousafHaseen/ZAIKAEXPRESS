'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertTriangle } from 'lucide-react'

type Product = {
  id: number
  name: string
  description: string
  image: string
  price: number
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [visibleCount, setVisibleCount] = useState(20)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const response = await axios.get('/api/get-all-products')
        setProducts(response.data.products)
        setError(null)
      } catch (err) {
        console.error(err)
        setError('Failed to load products. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <main className="flex flex-col items-center justify-center px-4 md:px-12 py-10 space-y-20">

      {/* Hero Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-6xl w-full">
        <Image
          src="/hero-image.jpg" // Replace with your hero image path
          alt="Delicious food from Zaiqa Express"
          width={600}
          height={400}
          className="rounded-2xl shadow-lg object-cover w-full"
        />
        <div className="text-center md:text-left space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Welcome to <span className="font-bold bg-gradient-to-r from-orange-500 via-red-500 to-yellow-400 bg-clip-text text-transparent">ZAIQA EXPRESS</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Craving your favorite food? We have got you covered. Explore the meals you love and get them delivered hot & fresh to your doorstep — fast and hassle-free.
          </p>
          <Button className="mt-4">Explore Menu</Button>
        </div>
      </section>

      {/* Products Section */}
      <section className="w-full max-w-7xl space-y-10">
        <h2 className="text-3xl font-semibold text-center">Our Top Picks</h2>

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-60 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {products.slice(0, visibleCount).map((product) => (
              <Card key={product.id} className="hover:scale-[1.02] transition-transform duration-200 ease-in-out">
                <CardContent className="p-4 space-y-3">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={300}
                    height={200}
                    className="rounded-lg object-cover w-full h-40"
                  />
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <p className="text-muted-foreground text-sm line-clamp-2">{product.description}</p>
                  <p className="font-semibold text-primary">₹{product.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {visibleCount < products.length && (
          <div className="flex justify-center">
            <Button onClick={() => setVisibleCount((prev) => prev + 20)}>Show More</Button>
          </div>
        )}
      </section>
    </main>
  )
}

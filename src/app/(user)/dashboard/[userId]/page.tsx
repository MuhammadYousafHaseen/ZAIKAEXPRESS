'use client'

import { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { toast } from 'sonner'
import { Pencil, ShoppingCart, Truck, PlusCircle } from 'lucide-react'
import Image from 'next/image'

interface Order {
  _id: string
  name: string
  price: number
  isDelivered: boolean
  estimatedDelivery?: string
  description?: string
}

interface User {
  name: string
  email: string
  address: string
}

interface Product {
  _id: string
  name: string
  description: string
  image: string
  price: number
}

const UserDashboard = () => {
  const { data: session } = useSession()
  const userId = session?.user?.id as string
  const [user, setUser] = useState<User | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [cart, setCart] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUser = useCallback(async () => {
    try {
      const res = await axios.post(`/api/user/me`, { userId })
      setUser(res.data)
    } catch (err) {
      console.error("Failed to fetch User", err)
      toast.error('Failed to load user')
    }
  }, [userId])

  const fetchOrders = useCallback(async () => {
    try {
      const res = await axios.get('/api/user/get-my-orders')
      setOrders(res.data.orders)
    } catch (err) {
      console.error("Failed to load orders", err)
      toast.error('Failed to load orders')
    }
  }, [])

  const fetchCart = useCallback(async () => {
    try {
      const res = await axios.get('/api/user/get-my-cart')
      setCart(res.data.cart)
    } catch (err) {
      console.error("Failed to load cart", err)
      toast.error('Failed to load cart')
    }
  }, [])

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const res = await axios.get('/api/get-all-products')
      setProducts(res.data.products)
      setError(null)
    } catch (err) {
      console.error("Failed to load products", err)
      setError('Failed to load products. Please try again later.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (userId) {
      fetchUser()
      fetchOrders()
      fetchCart()
      fetchProducts()
    }
  }, [userId, fetchUser, fetchOrders, fetchCart, fetchProducts])

  const addToCart = async (productId: string) => {
    try {
      const res = await axios.post('/api/user/add-to-cart', { productId })
      setCart(res.data.cart)
      toast.success('Item added to cart')
    } catch (err) {
      console.error("Failed to add to cart", err)
      toast.error('Failed to add to cart')
    }
  }

  const removeItemFromCart = async (productId: string) => {
    try {
      await axios.post(`/api/user/remove-from-cart`, { productId })
      toast.success('Item removed from cart')
      fetchCart()
    } catch (err) {
      console.error("Failed to remove from cart", err)
      toast.error('Failed to remove item')
    }
  }

  const placeOrder = async () => {
    try {
      await axios.post('/api/user/place-order')
      toast.success('Order placed successfully')
      fetchOrders()
      fetchCart()
    } catch (err) {
      console.error("Failed to place order", err)
      toast.error('Failed to place order')
    }
  }

  const delivered = orders.filter((o) => o.isDelivered)
  const pending = orders.filter((o) => !o.isDelivered)

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-10">
      <h1 className="text-4xl font-bold text-center text-primary">Your Dashboard</h1>

      {/* Profile & Cart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4 space-y-2">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Pencil size={20} className="text-muted-foreground" />
              Profile
            </h2>
            {user ? (
              <>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Address:</strong> {user.address}</p>
                <Button variant="outline" className="mt-2">Edit Profile</Button>
              </>
            ) : (
              <p>Loading profile...</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-2">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <ShoppingCart size={20} className="text-muted-foreground" />
              Cart
            </h2>
            {cart.length ? (
              cart.map((item) => (
                <div key={item._id} className="flex justify-between items-center py-2 border-b">
                  <span>{item.name} - ${item.price}</span>
                  <Button variant="destructive" size="sm" onClick={() => removeItemFromCart(item._id)}>
                    Remove
                  </Button>
                </div>
              ))
            ) : (
              <p>Your cart is empty.</p>
            )}
            {cart.length > 0 && (
              <Button className="mt-4 w-full" onClick={placeOrder}>
                Place Order
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Products */}
      <div>
        <h2 className="text-2xl font-bold text-center text-pink-600 mb-4">Explore Products</h2>
        {loading ? (
          <p className="text-center">Loading products...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product._id} className="hover:shadow-lg transition-all">
                <CardContent className="p-4 space-y-2">
                  <Image src={product.image} alt={product.name} width={600} height={400} className="w-full h-40 object-cover rounded-md" />
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-muted-foreground text-sm">{product.description}</p>
                  <p className="text-primary font-bold">${product.price}</p>
                  <Button onClick={() => addToCart(product._id)} className="w-full mt-2 gap-2">
                    <PlusCircle size={16} />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Orders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4 space-y-2">
            <h2 className="text-xl font-semibold text-green-600">Delivered Orders</h2>
            {delivered.length ? (
              delivered.map((order) => (
                <div key={order._id} className="border-b py-2">
                  <p>{order.name} - ${order.price}</p>
                </div>
              ))
            ) : (
              <p>No delivered orders.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-2">
            <h2 className="text-xl font-semibold text-red-600">Pending Orders</h2>
            {pending.length ? (
              pending.map((order) => (
                <div key={order._id} className="border-b py-2">
                  <p>{order.name} - ${order.price}</p>
                  <p className="text-sm text-gray-500">Description: {order.description || 'N/A'}</p>
                </div>
              ))
            ) : (
              <p>No pending orders.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Track Parcel */}
      <div className="text-center mt-6">
        <Link href={`/track-parcel/${userId}`}>
          <Button className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white gap-2">
            <Truck size={20} />
            Track Your Parcel
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default UserDashboard

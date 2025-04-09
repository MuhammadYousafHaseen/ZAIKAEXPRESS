'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import FileUpload from '@/components/FileUpload';
import { IKUploadResponse } from 'imagekitio-next/dist/types/components/IKUpload/props';
import Image from 'next/image';

interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  image: string;
  isDelivered?: boolean;
  purchaser?: {
    name: string;
    email: string;
    address: string;
  };
}
interface User {
  name: string;
  email: string;
  address: string;
  orders?: Product[];
}

const SellerDashboard = () => {
  const { toast } = useToast();

  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
  });
  const [loading, setLoading] = useState(false);

  // Read ownerId from localStorage (client-only)
  useEffect(() => {
    const storedOwnerId = localStorage.getItem('ownerId');
    if (storedOwnerId) {
      setOwnerId(storedOwnerId);
    }
  }, []);

  // Fetch data once ownerId is set
  // useEffect(() => {
  //   if (ownerId) {
  //     fetchProducts();
  //     fetchOrders();
  //   }
  // }, [ownerId]);

  const fetchProducts = async () => {
    try {
      const res = await axios.post(`/api/owner/get-my-products`, { ownerId });
      setProducts(res.data.products || []);
    } catch (err) {
      console.error('Error loading Products', err);
      toast('Error loading products');
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.post(`/api/owner/fetch-my-orders`, { ownerId });
      const users = res.data.users || [];
      // Flatten all orders into one array for easy rendering
      const flattenedOrders = users.flatMap((user: User) =>
        user.orders?.map((order: Product) => ({
          ...order,
          purchaser: {
            name: user.name,
            email: user.email,
            address: user.address,
          },
        }))
      );
      setOrders(flattenedOrders);
    } catch (err) {
      console.log('Error loading Orders', err);
      toast('Error loading orders');
    }
  };
  fetchProducts();
  fetchOrders();
  

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewProduct((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageUpload = (res: IKUploadResponse) => {
    setNewProduct((prev) => ({ ...prev, image: res.url }));
  };

  const handleProductPost = async () => {
    try {
      setLoading(true);
      await axios.post('/api/owner/add-product', {
        ...newProduct,
        price: Number(newProduct.price),
        ownerId,
      });
      toast('Product Posted!');
      setNewProduct({ name: '', description: '', price: '', image: '' });
      fetchProducts();
    } catch (err) {
      console.log('Error Posting Product', err);
      toast('Failed to post product');
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (productId: string) => {
    try {
      await axios.post(`/api/owner/remove-product`, { productId });
      toast('Product Removed');
      fetchProducts();
    } catch (err) {
      console.log('Error Removing Product', err);
      toast('Failed to remove product');
    }
  };

  const markAsDelivered = async (productId: string) => {
    try {
      await axios.patch(`/api/owner/product-delivered`, { productId, ownerId });
      toast('Marked as delivered');
      fetchOrders();
    } catch (err) {
      console.log('Failed to mark Delivered', err);
      toast('Failed to mark delivered');
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-10">
      <h1 className="text-3xl font-bold text-center">Seller Dashboard</h1>

      {/* Post Product Form */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Post New Product</h2>
        <Input placeholder="Product Name" name="name" value={newProduct.name} onChange={handleInput} />
        <Textarea placeholder="Description" name="description" value={newProduct.description} onChange={handleInput} />
        <Input placeholder="Price" name="price" value={newProduct.price} onChange={handleInput} />

        {/* Image Upload */}
        <div className="space-y-2">
          <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300">
            Upload Product Image
          </label>
          <FileUpload onSuccess={handleImageUpload} fileType="image" />
        </div>

        <Button disabled={loading} onClick={handleProductPost} className="w-full mt-4">
          {loading ? 'Posting...' : 'Post Product'}
        </Button>
      </div>

      {/* Products & Orders Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Your Products */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your Products</h2>
          {products.length > 0 ? (
            products.map((prod) => (
              <Card key={prod._id} className="p-4 flex flex-col space-y-2">
                <Image src={prod.image} alt={prod.name} width={600} height={400} className="object-cover w-full h-40 rounded-lg" />
                <CardContent>
                  <h3 className="font-bold text-lg">{prod.name}</h3>
                  <p>{prod.description}</p>
                  <p>${prod.price}</p>
                  <Button variant="destructive" onClick={() => removeProduct(prod._id)} className="cursor-pointer mt-2">
                    Remove Product
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <p>No products posted yet.</p>
          )}
        </div>

        {/* Orders */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Orders</h2>
          {Array.isArray(orders) && orders.length > 0 ? (
            orders.map((order) => (
              <Card key={order._id} className="border-green-500 p-4 space-y-2">
                <h3 className="font-bold">{order.name}</h3>
                <p>${order.price}</p>
                <p>Status: {order.isDelivered ? 'Delivered' : 'Pending'}</p>
                {order.purchaser && (
                  <div className="text-sm text-gray-600">
                    <p>Purchaser: {order.purchaser.name}</p>
                    <p>Email: {order.purchaser.email}</p>
                    <p>Address: {order.purchaser.address}</p>
                  </div>
                )}
                {!order.isDelivered && (
                  <Button onClick={() => markAsDelivered(order._id)} className="cursor-pointer mt-2">
                    Mark as Delivered
                  </Button>
                )}
              </Card>
            ))
          ) : (
            <p>No orders found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;

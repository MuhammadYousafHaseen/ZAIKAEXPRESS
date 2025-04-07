'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  isDelivered: boolean;
  purchaser?: {
    name: string;
    email: string;
    address: string;
  };
}

const SellerDashboard = ({ params }: { params: { ownerId: string } }) => {
  const { toast } = useToast();
  const ownerId = params.ownerId;

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!ownerId) return;
    fetchProducts();
    fetchOrders();
  }, [ownerId]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`/api/products/${ownerId}`);
      setProducts(res.data.products);
    } catch (err) {
        console.error("Error loading Products",err)
      toast('Error loading products');
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`/api/orders/${ownerId}`);
      setOrders(res.data.orders);
    } catch (err) {
        console.log("Error loading Orders",err)
      toast('Error loading orders');
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewProduct(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleProductPost = async () => {
    try {
      setLoading(true);
      await axios.post('/api/products/create', {
        ...newProduct,
        price: Number(newProduct.price),
        ownerId,
      });
      toast('Product Posted!');
      setNewProduct({ name: '', description: '', price: '', image: '' });
      fetchProducts();
    } catch (err) {
        console.log("Error Posting Product", err)
      toast('Failed to post product');
    } finally {
      setLoading(false);
    }
  };

  const markAsDelivered = async (productId: string) => {
    try {
      await axios.put(`/api/orders/mark-delivered`, { productId });
      toast('Marked as delivered');
      fetchOrders();
    } catch (err) {
        console.log("Failed to mark Delivered", err)
      toast('Failed to mark delivered');
    }
  };

  return (
    <div className="p-4 max-w-5xl mx-auto space-y-10">
      <h1 className="text-3xl font-bold text-center">Seller Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Post New Product</h2>
          <Input placeholder="Product Name" name="name" value={newProduct.name} onChange={handleInput} />
          <Textarea placeholder="Description" name="description" value={newProduct.description} onChange={handleInput} />
          <Input placeholder="Price" name="price" value={newProduct.price} onChange={handleInput} />
          <Input placeholder="Image URL" name="image" value={newProduct.image} onChange={handleInput} />
          <Button disabled={loading} onClick={handleProductPost}>
            {loading ? 'Posting...' : 'Post Product'}
          </Button>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your Products</h2>
          {products.map((prod) => (
            <Card key={prod._id}>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg">{prod.name}</h3>
                <p>{prod.description}</p>
                <p>${prod.price}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Orders</h2>
        {orders.map((order) => (
          <Card key={order._id} className="border-green-500">
            <CardContent className="p-4 space-y-2">
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
                <Button onClick={() => markAsDelivered(order._id)} className="mt-2">
                  Mark as Delivered
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SellerDashboard;

import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  discount?: number;
}

interface CartItem extends Product {
  quantity: number;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  items: CartItem[];
}

const products: Product[] = [
  {
    id: 1,
    name: 'iPhone 15 Pro Max',
    price: 119990,
    image: 'https://cdn.poehali.dev/projects/f776f285-da3f-4696-9e2b-0acaf17f714a/files/05a67832-e58b-4957-8898-43e971bb36c6.jpg',
    category: 'Электроника',
    rating: 4.8,
    reviews: 234,
    inStock: true,
    discount: 10
  },
  {
    id: 2,
    name: 'AirPods Pro 2',
    price: 24990,
    image: 'https://cdn.poehali.dev/projects/f776f285-da3f-4696-9e2b-0acaf17f714a/files/33c3faee-4137-4047-a2d0-8dfbb05b24b8.jpg',
    category: 'Электроника',
    rating: 4.9,
    reviews: 567,
    inStock: true
  },
  {
    id: 3,
    name: 'Nike Air Max',
    price: 12990,
    image: 'https://cdn.poehali.dev/projects/f776f285-da3f-4696-9e2b-0acaf17f714a/files/2f2e1b48-bce8-44d8-8711-71c6dd945941.jpg',
    category: 'Одежда',
    rating: 4.7,
    reviews: 189,
    inStock: true,
    discount: 15
  },
  {
    id: 4,
    name: 'MacBook Pro 16"',
    price: 249990,
    image: 'https://cdn.poehali.dev/projects/f776f285-da3f-4696-9e2b-0acaf17f714a/files/05a67832-e58b-4957-8898-43e971bb36c6.jpg',
    category: 'Электроника',
    rating: 4.9,
    reviews: 421,
    inStock: true
  },
  {
    id: 5,
    name: 'Sony WH-1000XM5',
    price: 29990,
    image: 'https://cdn.poehali.dev/projects/f776f285-da3f-4696-9e2b-0acaf17f714a/files/33c3faee-4137-4047-a2d0-8dfbb05b24b8.jpg',
    category: 'Электроника',
    rating: 4.8,
    reviews: 312,
    inStock: false
  },
  {
    id: 6,
    name: 'Adidas Ultraboost',
    price: 15990,
    image: 'https://cdn.poehali.dev/projects/f776f285-da3f-4696-9e2b-0acaf17f714a/files/2f2e1b48-bce8-44d8-8711-71c6dd945941.jpg',
    category: 'Одежда',
    rating: 4.6,
    reviews: 156,
    inStock: true,
    discount: 20
  }
];

const categories = ['Все', 'Электроника', 'Одежда'];

function Index() {
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState('Все');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    email: ''
  });

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'Все' || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    toast({
      title: "Добавлено в корзину",
      description: product.name,
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    setCart(prev =>
      prev.map(item => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const toggleFavorite = (id: number) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  const cartTotal = cart.reduce((sum, item) => {
    const price = item.discount ? item.price * (1 - item.discount / 100) : item.price;
    return sum + price * item.quantity;
  }, 0);

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    if (!formData.name || !formData.phone || !formData.address) {
      toast({
        title: "Ошибка",
        description: "Заполните все обязательные поля",
        variant: "destructive"
      });
      return;
    }

    const newOrder: Order = {
      id: `ORDER-${Date.now()}`,
      date: new Date().toLocaleDateString('ru-RU'),
      total: cartTotal,
      status: 'В обработке',
      items: [...cart]
    };

    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    setCheckoutOpen(false);
    setFormData({ name: '', phone: '', address: '', email: '' });

    toast({
      title: "Заказ оформлен!",
      description: `Номер заказа: ${newOrder.id}`,
    });
  };

  const getDiscountPrice = (product: Product) => {
    return product.discount
      ? product.price * (1 - product.discount / 100)
      : product.price;
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-heading font-bold text-gradient">ShopHub</h1>
          </div>

          <div className="flex-1 max-w-xl mx-8 hidden md:block">
            <div className="relative">
              <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Поиск товаров..."
                className="pl-10 bg-muted/50 border-border"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Icon name="Heart" size={20} />
                  {favorites.length > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary">
                      {favorites.length}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Избранное</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  {favorites.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      Избранное пусто
                    </p>
                  ) : (
                    products
                      .filter(p => favorites.includes(p.id))
                      .map(product => (
                        <Card key={product.id} className="p-3">
                          <div className="flex gap-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{product.name}</h4>
                              <p className="text-primary font-semibold">
                                {getDiscountPrice(product).toLocaleString('ru-RU')} ₽
                              </p>
                            </div>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => toggleFavorite(product.id)}
                            >
                              <Icon name="X" size={18} />
                            </Button>
                          </div>
                        </Card>
                      ))
                  )}
                </div>
              </SheetContent>
            </Sheet>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Icon name="ShoppingCart" size={20} />
                  {cartItemsCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary">
                      {cartItemsCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg">
                <SheetHeader>
                  <SheetTitle>Корзина</SheetTitle>
                </SheetHeader>
                <div className="mt-6 flex flex-col h-full">
                  {cart.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      Корзина пуста
                    </p>
                  ) : (
                    <>
                      <div className="flex-1 overflow-auto space-y-4">
                        {cart.map(item => (
                          <Card key={item.id} className="p-4">
                            <div className="flex gap-4">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-20 h-20 object-cover rounded"
                              />
                              <div className="flex-1">
                                <h4 className="font-medium mb-1">{item.name}</h4>
                                <div className="flex items-center gap-2 mb-2">
                                  {item.discount && (
                                    <span className="text-xs text-muted-foreground line-through">
                                      {item.price.toLocaleString('ru-RU')} ₽
                                    </span>
                                  )}
                                  <span className="text-primary font-semibold">
                                    {getDiscountPrice(item).toLocaleString('ru-RU')} ₽
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-8 w-8"
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  >
                                    <Icon name="Minus" size={14} />
                                  </Button>
                                  <span className="w-8 text-center">{item.quantity}</span>
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-8 w-8"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  >
                                    <Icon name="Plus" size={14} />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 ml-auto"
                                    onClick={() => removeFromCart(item.id)}
                                  >
                                    <Icon name="Trash2" size={14} />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-lg font-semibold">Итого:</span>
                          <span className="text-2xl font-bold text-primary">
                            {cartTotal.toLocaleString('ru-RU')} ₽
                          </span>
                        </div>
                        <Button
                          className="w-full"
                          size="lg"
                          onClick={() => setCheckoutOpen(true)}
                        >
                          Оформить заказ
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOrdersOpen(true)}
            >
              <Icon name="User" size={20} />
            </Button>
          </div>
        </div>
      </nav>

      <div className="md:hidden px-4 py-3 border-b border-border">
        <div className="relative">
          <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск товаров..."
            className="pl-10 bg-muted/50 border-border"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <section className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-heading font-bold mb-6">Каталог товаров</h2>
          <Tabs value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="bg-muted/50">
              {categories.map(cat => (
                <TabsTrigger
                  key={cat}
                  value={cat}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product, index) => (
            <Card
              key={product.id}
              className="group overflow-hidden border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative aspect-square overflow-hidden bg-muted/30">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {product.discount && (
                  <Badge className="absolute top-3 left-3 bg-destructive">
                    -{product.discount}%
                  </Badge>
                )}
                <Button
                  size="icon"
                  variant="ghost"
                  className={`absolute top-3 right-3 backdrop-blur-sm ${
                    favorites.includes(product.id)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background/80'
                  }`}
                  onClick={() => toggleFavorite(product.id)}
                >
                  <Icon name="Heart" size={18} />
                </Button>
              </div>

              <div className="p-4">
                <Badge variant="outline" className="mb-2 text-xs">
                  {product.category}
                </Badge>
                <h3 className="font-heading font-semibold text-lg mb-2 line-clamp-1">
                  {product.name}
                </h3>

                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <Icon name="Star" size={14} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium">{product.rating}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    ({product.reviews} отзывов)
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  {product.discount ? (
                    <>
                      <span className="text-sm text-muted-foreground line-through">
                        {product.price.toLocaleString('ru-RU')} ₽
                      </span>
                      <span className="text-xl font-bold text-primary">
                        {getDiscountPrice(product).toLocaleString('ru-RU')} ₽
                      </span>
                    </>
                  ) : (
                    <span className="text-xl font-bold text-primary">
                      {product.price.toLocaleString('ru-RU')} ₽
                    </span>
                  )}
                </div>

                {product.inStock ? (
                  <Button
                    className="w-full"
                    onClick={() => addToCart(product)}
                  >
                    <Icon name="ShoppingCart" size={18} className="mr-2" />
                    В корзину
                  </Button>
                ) : (
                  <Button className="w-full" disabled>
                    Нет в наличии
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </section>

      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Оформление заказа</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            <div>
              <h3 className="font-semibold mb-3">Ваш заказ</h3>
              <div className="space-y-2">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span className="font-medium">
                      {(getDiscountPrice(item) * item.quantity).toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                ))}
              </div>
              <Separator className="my-3" />
              <div className="flex justify-between text-lg font-bold">
                <span>Итого:</span>
                <span className="text-primary">{cartTotal.toLocaleString('ru-RU')} ₽</span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Данные доставки</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Имя *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Иван Иванов"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Телефон *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+7 (999) 123-45-67"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Адрес доставки *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="г. Москва, ул. Ленина, д. 1, кв. 1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="example@mail.ru"
                  />
                </div>
              </div>
            </div>

            <Button className="w-full" size="lg" onClick={handleCheckout}>
              Подтвердить заказ
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={ordersOpen} onOpenChange={setOrdersOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Личный кабинет</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <h3 className="font-semibold mb-4">История заказов</h3>
            {orders.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                У вас пока нет заказов
              </p>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <Card key={order.id} className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{order.id}</h4>
                        <p className="text-sm text-muted-foreground">{order.date}</p>
                      </div>
                      <Badge>{order.status}</Badge>
                    </div>
                    <Separator className="my-3" />
                    <div className="space-y-2 mb-3">
                      {order.items.map(item => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>
                            {item.name} x {item.quantity}
                          </span>
                          <span>
                            {(getDiscountPrice(item) * item.quantity).toLocaleString('ru-RU')} ₽
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Итого:</span>
                      <span className="text-primary">
                        {order.total.toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Index;

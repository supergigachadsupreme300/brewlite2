CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(32) NOT NULL DEFAULT 'CUSTOMER',
  loyalty_points INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(64) NOT NULL DEFAULT 'COFFEE',
  price NUMERIC(10,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  image_url TEXT,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(64) NOT NULL,
  pickup_type VARCHAR(32) NOT NULL,
  table_number VARCHAR(64),
  payment_method VARCHAR(32) NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id VARCHAR(64) PRIMARY KEY,
  order_id VARCHAR(64) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id VARCHAR(64) NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  product_name VARCHAR(255) NOT NULL,
  quantity INT NOT NULL,
  size VARCHAR(8),
  toppings JSONB,
  unit_price NUMERIC(10,2) NOT NULL,
  line_total NUMERIC(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS payments (
  id VARCHAR(64) PRIMARY KEY,
  order_id VARCHAR(64) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  method VARCHAR(32) NOT NULL,
  status VARCHAR(32) NOT NULL,
  idempotency_key VARCHAR(255) NOT NULL UNIQUE,
  transaction_ref VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS loyalty_transactions (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_id VARCHAR(64) REFERENCES orders(id) ON DELETE SET NULL,
  points INT NOT NULL,
  type VARCHAR(32) NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO products (id, name, description, category, price, stock, image_url, is_available) VALUES
('1','Espresso','Rich and bold single shot espresso.','Coffee',2.50,12,'/images/espresso.png',true),
('2','Americano','Espresso diluted with hot water for a smooth cup.','Coffee',3.00,8,'/images/americano.png',true),
('3','Cappuccino','Espresso with steamed milk and a thick foam layer.','Coffee',3.75,5,'/images/cappuccino.png',true),
('4','Latte','Creamy espresso with steamed milk.','Coffee',4.00,7,'/images/latte.png',true),
('5','Mocha','Chocolate-flavored latte topped with whipped cream.','Coffee',4.50,0,'/images/mocha.png',false),
('6','Croissant','Buttery, flaky French pastry.','Pastry',2.75,10,'/images/croissant.png',true),
('prod-001','Cà phê Phin Sữa Đá','Cà phê Robusta đặc trưng pha phin truyền thống.','Coffee',29000.00,50,'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=500',true),
('prod-002','Bạc Xỉu Sữa Tươi Nóng/Đá','Hương vị tươi trẻ với nhiều sữa.','Coffee',32000.00,40,'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500',true),
('prod-004','Trà Đào Cam Sả Đặc Biệt','Trà đen Ceylon đậm đà.','Tea',39000.00,35,'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500',true)
ON CONFLICT (id) DO NOTHING;
# Manual Test: Cart Functionality

## Test Steps

### 1. Start the Server

```bash
node src/index.js
```

### 2. Login as User

```bash
curl -X POST http://localhost:8000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

Copy the `accessToken` from the response.

### 3. Create Test Products

```bash
# Create Product 1
curl -X POST http://localhost:8000/api/v1/products \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product 1",
    "description": "This is a test product for cart functionality",
    "price": 100,
    "discount": 10,
    "stock": 50,
    "categories": [],
    "sizes": ["S", "M", "L"],
    "colors": ["Red", "Blue"]
  }'

# Create Product 2
curl -X POST http://localhost:8000/api/v1/products \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product 2",
    "description": "Another test product for cart functionality",
    "price": 200,
    "discount": 0,
    "stock": 30,
    "categories": [],
    "sizes": ["M", "L", "XL"],
    "colors": ["Green", "Yellow"]
  }'
```

Copy the product IDs from the responses.

### 4. Get Empty Cart

```bash
curl -X GET http://localhost:8000/api/v1/cart \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Expected Result**: Empty cart with 0 items and 0 total price.

### 5. Add Items to Cart

```bash
# Add Product 1 with size and color (quantity: 2)
curl -X POST http://localhost:8000/api/v1/cart/add \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "PRODUCT_1_ID",
    "quantity": 2,
    "selectedSize": "M",
    "selectedColor": "Red"
  }'

# Add Product 2 without size and color (quantity: 1)
curl -X POST http://localhost:8000/api/v1/cart/add \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "PRODUCT_2_ID",
    "quantity": 1
  }'
```

**Expected Result**: Items added to cart with selected size/color, stock reduced automatically.

### 6. Get Cart with Items

```bash
curl -X GET http://localhost:8000/api/v1/cart \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Expected Result**: Cart with 2 items, total quantity 3, total price calculated.

### 7. Update Cart Item Quantity

```bash
curl -X PUT http://localhost:8000/api/v1/cart/update \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "PRODUCT_1_ID",
    "quantity": 3
  }'
```

**Expected Result**: Product 1 quantity updated to 3, stock adjusted accordingly.

### 7.5. Update Cart Item Size and Color

```bash
curl -X PUT http://localhost:8000/api/v1/cart/update \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "PRODUCT_1_ID",
    "selectedSize": "L",
    "selectedColor": "Blue"
  }'
```

**Expected Result**: Product 1 size and color updated, cart reflects new selections.

### 8. Get Cart Summary

```bash
curl -X GET http://localhost:8000/api/v1/cart/summary \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Expected Result**: Summary with total items, total price, and item count.

### 9. Remove Item from Cart

```bash
curl -X DELETE http://localhost:8000/api/v1/cart/remove/PRODUCT_2_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Expected Result**: Product 2 removed from cart, stock restored.

### 10. Test Stock Management

```bash
# Check Product 1 stock
curl -X GET http://localhost:8000/api/v1/products/PRODUCT_1_ID

# Check Product 2 stock
curl -X GET http://localhost:8000/api/v1/products/PRODUCT_2_ID
```

**Expected Result**: Stock should reflect cart operations (reduced when added, restored when removed).

### 11. Clear Cart

```bash
curl -X DELETE http://localhost:8000/api/v1/cart/clear \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Expected Result**: Cart cleared, all items removed, stock restored.

### 12. Clean Up

```bash
# Delete test products
curl -X DELETE http://localhost:8000/api/v1/products/PRODUCT_1_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

curl -X DELETE http://localhost:8000/api/v1/products/PRODUCT_2_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## API Endpoints

### Cart Endpoints

| Method | Endpoint                         | Description                 | Auth Required |
| ------ | -------------------------------- | --------------------------- | ------------- |
| GET    | `/api/v1/cart`                   | Get user's cart             | Yes           |
| POST   | `/api/v1/cart/add`               | Add item to cart            | Yes           |
| PUT    | `/api/v1/cart/update`            | Update cart item quantity   | Yes           |
| DELETE | `/api/v1/cart/remove/:productId` | Remove item from cart       | Yes           |
| DELETE | `/api/v1/cart/clear`             | Clear entire cart           | Yes           |
| GET    | `/api/v1/cart/summary`           | Get cart summary            | Yes           |
| POST   | `/api/v1/cart/clean-expired`     | Clean expired items (Admin) | Yes + Admin   |

### Request/Response Examples

#### Add to Cart

```json
// Request
{
  "productId": "product_id",
  "quantity": 2,
  "selectedSize": "M",
  "selectedColor": "Red"
}

// Response
{
  "statusCode": 200,
  "data": {
    "user": "user_id",
    "items": [
      {
        "product": {
          "_id": "product_id",
          "name": "Product Name",
          "photos": ["url1", "url2"],
          "price": 100,
          "discount": 10,
          "stock": 48,
          "sizes": ["S", "M", "L"],
          "colors": ["Red", "Blue", "Green"]
        },
        "quantity": 2,
        "price": 90,
        "selectedSize": "M",
        "selectedColor": "Red",
        "addedAt": "2024-01-01T00:00:00.000Z",
        "expiresAt": "2024-01-02T00:00:00.000Z"
      }
    ],
    "totalItems": 2,
    "totalPrice": 180,
    "lastUpdated": "2024-01-01T00:00:00.000Z"
  },
  "message": "Item added to cart successfully",
  "success": true
}
```

#### Get Cart

```json
{
  "statusCode": 200,
  "data": {
    "user": "user_id",
    "items": [...],
    "totalItems": 3,
    "totalPrice": 270,
    "lastUpdated": "2024-01-01T00:00:00.000Z"
  },
  "message": "Cart retrieved successfully",
  "success": true
}
```

## Key Features

### ✅ Automatic Stock Management

- Stock is reduced when items are added to cart
- Stock is restored when items are removed from cart
- Stock is updated when quantities are changed
- Prevents adding more items than available in stock

### ✅ Cart Expiration

- Cart items expire after 1 day
- Expired items are automatically cleaned up
- Stock is restored when items expire

### ✅ Quantity Limits

- Maximum 10 items per product in cart
- Minimum 1 item per product
- Quantity validation on all operations

### ✅ Price Calculation

- Prices are calculated considering discounts
- Total price is calculated automatically
- Price updates when discounts change

### ✅ User Isolation

- Each user has their own cart
- Cart data is isolated by user ID
- Authentication required for all operations

## Error Handling

### Common Errors

- **400**: Invalid quantity, insufficient stock, product not available
- **401**: Unauthorized (missing or invalid token)
- **404**: Product not found, cart not found, item not found in cart
- **500**: Server error

### Error Response Format

```json
{
  "statusCode": 400,
  "data": null,
  "message": "Insufficient stock available",
  "success": false
}
```

## Test Results Checklist

- [ ] Empty cart creation
- [ ] Add single item to cart
- [ ] Add multiple items to cart
- [ ] Update item quantity
- [ ] Remove single item
- [ ] Clear entire cart
- [ ] Stock management (reduction/restoration)
- [ ] Price calculation with discounts
- [ ] Quantity validation
- [ ] Cart expiration handling
- [ ] Error handling for invalid operations

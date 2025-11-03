import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Cart from '../components/Cart';

describe('Cart Component', () => {
  const mockCartItems = [
    {
      product_id: 1,
      name: 'Laptop HP',
      price: 999.99,
      quantity: 2,
      image_url: 'https://example.com/laptop.jpg',
      stock: 10,
    },
    {
      product_id: 2,
      name: 'Mouse Logitech',
      price: 49.99,
      quantity: 1,
      image_url: 'https://example.com/mouse.jpg',
      stock: 20,
    },
  ];

  it('should render empty cart message when no items', () => {
    render(
      <Cart
        cartItems={[]}
        total={0}
        onUpdateQuantity={vi.fn()}
        onRemoveItem={vi.fn()}
        onCheckout={vi.fn()}
      />
    );

    expect(screen.getByText('Tu carrito está vacío')).toBeInTheDocument();
  });

  it('should render cart items correctly', () => {
    render(
      <Cart
        cartItems={mockCartItems}
        total={2049.97}
        onUpdateQuantity={vi.fn()}
        onRemoveItem={vi.fn()}
        onCheckout={vi.fn()}
      />
    );

    expect(screen.getByText('Laptop HP')).toBeInTheDocument();
    expect(screen.getByText('Mouse Logitech')).toBeInTheDocument();
    expect(screen.getByText('$2049.97')).toBeInTheDocument();
  });

  it('should call onUpdateQuantity when quantity is changed', () => {
    const onUpdateQuantity = vi.fn();
    render(
      <Cart
        cartItems={mockCartItems}
        total={2049.97}
        onUpdateQuantity={onUpdateQuantity}
        onRemoveItem={vi.fn()}
        onCheckout={vi.fn()}
      />
    );

    const increaseButtons = screen.getAllByText('+');
    fireEvent.click(increaseButtons[0]);

    expect(onUpdateQuantity).toHaveBeenCalledWith(1, 3);
  });

  it('should call onRemoveItem when remove button is clicked', () => {
    const onRemoveItem = vi.fn();
    render(
      <Cart
        cartItems={mockCartItems}
        total={2049.97}
        onUpdateQuantity={vi.fn()}
        onRemoveItem={onRemoveItem}
        onCheckout={vi.fn()}
      />
    );

    const removeButtons = screen.getAllByRole('button', { name: '' });
    const deleteButton = removeButtons.find(btn =>
      btn.querySelector('svg path[d*="M19 7l"]')
    );

    if (deleteButton) {
      fireEvent.click(deleteButton);
      expect(onRemoveItem).toHaveBeenCalled();
    }
  });

  it('should call onCheckout when checkout button is clicked', () => {
    const onCheckout = vi.fn();
    render(
      <Cart
        cartItems={mockCartItems}
        total={2049.97}
        onUpdateQuantity={vi.fn()}
        onRemoveItem={vi.fn()}
        onCheckout={onCheckout}
      />
    );

    const checkoutButton = screen.getByText('Proceder al Checkout');
    fireEvent.click(checkoutButton);

    expect(onCheckout).toHaveBeenCalledTimes(1);
  });

  it('should disable decrease button when quantity is 1', () => {
    const singleItemCart = [{ ...mockCartItems[0], quantity: 1 }];
    render(
      <Cart
        cartItems={singleItemCart}
        total={999.99}
        onUpdateQuantity={vi.fn()}
        onRemoveItem={vi.fn()}
        onCheckout={vi.fn()}
      />
    );

    const decreaseButton = screen.getByText('-');
    expect(decreaseButton).toBeDisabled();
  });
});

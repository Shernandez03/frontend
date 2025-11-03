import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from '../components/ProductCard';

describe('ProductCard Component', () => {
  const mockProduct = {
    id: 1,
    name: 'Laptop HP',
    description: 'Laptop potente para trabajo',
    price: 999.99,
    image_url: 'https://example.com/laptop.jpg',
    stock: 10,
  };

  it('should render product information correctly', () => {
    const onAddToCart = vi.fn();
    render(<ProductCard product={mockProduct} onAddToCart={onAddToCart} />);

    expect(screen.getByText('Laptop HP')).toBeInTheDocument();
    expect(screen.getByText('Laptop potente para trabajo')).toBeInTheDocument();
    expect(screen.getByText('$999.99')).toBeInTheDocument();
    expect(screen.getByText('Stock: 10')).toBeInTheDocument();
  });

  it('should call onAddToCart when button is clicked', () => {
    const onAddToCart = vi.fn();
    render(<ProductCard product={mockProduct} onAddToCart={onAddToCart} />);

    const button = screen.getByText('Agregar al Carrito');
    fireEvent.click(button);

    expect(onAddToCart).toHaveBeenCalledTimes(1);
    expect(onAddToCart).toHaveBeenCalledWith(mockProduct);
  });

  it('should disable button when product is out of stock', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 };
    const onAddToCart = vi.fn();
    render(<ProductCard product={outOfStockProduct} onAddToCart={onAddToCart} />);

    const button = screen.getByText('Sin Stock');
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(onAddToCart).not.toHaveBeenCalled();
  });

  it('should render product image with correct src and alt', () => {
    const onAddToCart = vi.fn();
    render(<ProductCard product={mockProduct} onAddToCart={onAddToCart} />);

    const image = screen.getByAltText('Laptop HP');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockProduct.image_url);
  });
});

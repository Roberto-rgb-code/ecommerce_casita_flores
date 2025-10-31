import { getProducts, getProductById, getProductsByCategory, searchProducts } from '../products';

// Mock del módulo supabase
const mockFrom = jest.fn();
const mockSelect = jest.fn();
const mockEq = jest.fn();
const mockOrder = jest.fn();
const mockSingle = jest.fn();
const mockOr = jest.fn();

jest.mock('../supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

import { supabase } from '../supabase';

describe('Products API - E-commerce', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset mocks to chainable structure
    mockFrom.mockReturnValue({
      select: mockSelect,
    });
    
    // Setup mock from to return the chainable structure
    (supabase.from as jest.Mock).mockImplementation((table) => {
      expect(table).toBe('products');
      return mockFrom();
    });
    mockSelect.mockReturnValue({
      eq: mockEq,
      or: mockOr,
    });
    mockEq.mockReturnValue({
      order: mockOrder,
      eq: mockEq,
      single: mockSingle,
    });
    mockOr.mockReturnValue({
      eq: mockEq,
    });
  });

  describe('getProducts', () => {
    it('should return an array of products when successful', async () => {
      const mockProducts = [
        {
          id: '1',
          title: 'Rosa Roja',
          price: 25.99,
          image_url: 'https://example.com/rosa.jpg',
          additional_images: ['img1.jpg', 'img2.jpg'],
          rating: 4.5,
          reviews: 10,
          badge: 'Nuevo',
          description: 'Hermosa rosa roja',
          category: 'Rosas',
          stock: 50,
          is_active: true,
        },
      ];

      mockOrder.mockResolvedValue({
        data: mockProducts,
        error: null,
      });

      const products = await getProducts();

      expect(products).toHaveLength(1);
      expect(products[0]).toMatchObject({
        id: '1',
        title: 'Rosa Roja',
        price: 25.99,
        image: 'https://example.com/rosa.jpg',
        additional_images: ['img1.jpg', 'img2.jpg'],
      });
      expect(supabase.from).toHaveBeenCalledWith('products');
    });

    it('should return empty array when there is an error', async () => {
      mockOrder.mockResolvedValue({
        data: null,
        error: { message: 'Database error' },
      });

      const products = await getProducts();

      expect(products).toEqual([]);
    });
  });

  describe('getProductById', () => {
    it('should return a product when found', async () => {
      const mockProduct = {
        id: '1',
        title: 'Rosa Roja',
        price: 25.99,
        image_url: 'https://example.com/rosa.jpg',
        additional_images: JSON.stringify(['img1.jpg', 'img2.jpg']),
        rating: 4.5,
        reviews: 10,
        badge: 'Nuevo',
        description: 'Hermosa rosa roja',
        category: 'Rosas',
        stock: 50,
        is_active: true,
      };

      mockSingle.mockResolvedValue({
        data: mockProduct,
        error: null,
      });

      const product = await getProductById('1');

      expect(product).toBeTruthy();
      expect(product?.id).toBe('1');
      expect(product?.title).toBe('Rosa Roja');
      expect(supabase.from).toHaveBeenCalledWith('products');
    });

    it('should return null when product is not found', async () => {
      mockSingle.mockResolvedValue({
        data: null,
        error: { message: 'Not found' },
      });

      const product = await getProductById('999');

      expect(product).toBeNull();
    });
  });

  describe('getProductsByCategory', () => {
    it('should return products filtered by category', async () => {
      const mockProducts = [
        {
          id: '1',
          title: 'Rosa Roja',
          price: 25.99,
          image_url: 'https://example.com/rosa.jpg',
          category: 'Rosas',
          is_active: true,
        },
      ];

      mockOrder.mockResolvedValue({
        data: mockProducts,
        error: null,
      });

      const products = await getProductsByCategory('Rosas');

      expect(products).toHaveLength(1);
      expect(products[0].category).toBe('Rosas');
      expect(supabase.from).toHaveBeenCalledWith('products');
    });
  });

  describe('searchProducts', () => {
    it('should return products matching search query', async () => {
      const mockProducts = [
        {
          id: '1',
          title: 'Rosa Roja',
          price: 25.99,
          image_url: 'https://example.com/rosa.jpg',
          is_active: true,
        },
      ];

      mockOrder.mockResolvedValue({
        data: mockProducts,
        error: null,
      });

      const products = await searchProducts('rosa');

      expect(products).toHaveLength(1);
      expect(products[0].title.toLowerCase()).toContain('rosa');
      expect(supabase.from).toHaveBeenCalledWith('products');
    });
  });
});


import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { AssetLibrary } from './AssetLibrary';
import React from 'react';

// Mock the store
vi.mock('../store/useStore', () => ({
  useStore: (selector: (state: unknown) => unknown) => selector({
    addActor: vi.fn(),
  }),
}));

afterEach(() => {
  cleanup();
});

describe('AssetLibrary', () => {
  it('renders search input', () => {
    render(<AssetLibrary />);
    expect(screen.getByPlaceholderText('Search assets...')).toBeDefined();
  });

  it('filters assets based on search query', () => {
    render(<AssetLibrary />);
    const searchInput = screen.getByPlaceholderText('Search assets...');

    // Initial state: "Modular Human" and "Robot" should be visible (default tab is characters)
    expect(screen.getByText('Modular Human')).toBeDefined();
    expect(screen.getByText('Robot')).toBeDefined();

    // Type "Robot"
    fireEvent.change(searchInput, { target: { value: 'Robot' } });

    // "Modular Human" should be gone, "Robot" should remain
    expect(screen.queryByText('Modular Human')).toBeNull();
    expect(screen.getByText('Robot')).toBeDefined();
  });

  it('shows empty state when no matches found', () => {
      render(<AssetLibrary />);
      const searchInput = screen.getByPlaceholderText('Search assets...');

      fireEvent.change(searchInput, { target: { value: 'NonExistentAsset' } });

      // Should show empty state message
      // We look for text that includes "No assets found" or similar
      expect(screen.getByText(/no assets found/i)).toBeDefined();
  });
});

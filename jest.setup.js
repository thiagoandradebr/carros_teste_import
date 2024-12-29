require('@testing-library/jest-dom');

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock window.alert
window.alert = jest.fn();

// Opcional: Limpar mocks antes de cada teste
beforeEach(() => {
  localStorageMock.clear();
  jest.clearAllMocks();
});

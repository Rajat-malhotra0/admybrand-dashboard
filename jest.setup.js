import '@testing-library/jest-dom'

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock SVG element methods that D3 uses
const mockSVGElement = {
  getBBox: jest.fn(() => ({ x: 0, y: 0, width: 100, height: 100 })),
  getScreenCTM: jest.fn(() => ({ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 })),
  createSVGPoint: jest.fn(() => ({ x: 0, y: 0 })),
}

Object.defineProperty(global.SVGElement.prototype, 'getBBox', {
  writable: true,
  value: mockSVGElement.getBBox,
})

Object.defineProperty(global.SVGElement.prototype, 'getScreenCTM', {
  writable: true,
  value: mockSVGElement.getScreenCTM,
})

// Mock clientX/clientY for mouse events
global.MouseEvent = class MockMouseEvent extends Event {
  constructor(type, eventInitDict = {}) {
    super(type, eventInitDict)
    this.clientX = eventInitDict.clientX || 0
    this.clientY = eventInitDict.clientY || 0
  }
}

// Suppress console errors during tests unless explicitly needed
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})

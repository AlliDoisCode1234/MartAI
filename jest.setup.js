// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock Convex
jest.mock('@/lib/convexClient', () => ({
  callConvexQuery: jest.fn(),
  callConvexMutation: jest.fn(),
  api: {},
}))

// Mock environment variables
process.env.NEXT_PUBLIC_CONVEX_URL = 'https://test.convex.cloud'
process.env.JWT_SECRET = 'test-secret'
process.env.OPENAI_API_KEY = 'test-key'


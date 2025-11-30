import { POST } from '@/app/api/auth/signup/route';
import { NextRequest } from 'next/server';
import { callConvexMutation } from '@/lib/convexClient';

// jest.mock('@/lib/convexClient'); // Already mocked in jest.setup.js
jest.mock('@/lib/auth', () => ({
  hashPassword: jest.fn(() => Promise.resolve('hashed_password')),
  generateToken: jest.fn(() => 'mock_jwt_token'),
}));

describe('/api/auth/signup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new user with valid credentials', async () => {
    const mockCallConvexMutation = callConvexMutation as jest.MockedFunction<typeof callConvexMutation>;
    
    // Mock user creation
    mockCallConvexMutation.mockResolvedValueOnce({ _id: 'user123' });
    // Mock session creation
    mockCallConvexMutation.mockResolvedValueOnce({ _id: 'session123', token: 'mock_token' });

    const request = new NextRequest('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.token).toBeDefined();
    expect(data.user).toBeDefined();
  });

  it('should reject weak passwords', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'short', // Less than 8 characters
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('password');
  });

  it('should reject invalid email', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        email: 'invalid-email',
        password: 'password123',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBeDefined();
  });
});


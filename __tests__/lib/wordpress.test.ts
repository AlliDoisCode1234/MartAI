
import { WordPressClient } from '@/lib/wordpress';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('WordPressClient', () => {
  const auth = {
    siteUrl: 'https://example.com',
    username: 'admin',
    password: 'password',
  };
  const client = new WordPressClient(auth);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a page', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { id: 123, link: 'https://example.com/new-page' },
    });

    const result = await client.createPage({
      title: 'Test Page',
      content: 'Hello World',
    });

    expect(result).toEqual({ id: 123, link: 'https://example.com/new-page' });
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://example.com/wp-json/wp/v2/pages',
      expect.objectContaining({
        title: 'Test Page',
        content: 'Hello World',
        status: 'publish',
      }),
      expect.any(Object)
    );
  });

  it('should handle errors', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('Network Error'));

    await expect(client.createPage({
      title: 'Test Page',
      content: 'Hello World',
    })).rejects.toThrow('Network Error');
  });
});

'use strict';
import {getCurrentNews} from '../';

describe('news Service', () => {

  describe('getCurrentNews', () => {
    const news = [{id: 'news1'}, {id: 'news2'}];
    let apiCall;

    beforeEach(() => {
      fetch.resetMocks();
      apiCall = fetch.mockResponse(JSON.stringify(news));
    });

    it('should extract response body', async () => {
      const result = await getCurrentNews();
      expect(apiCall).toHaveBeenCalledWith(__API__ + '/news',
        {"credentials": "include", "headers": {"Access-Control-Allow-Credentials": "true", "Access-Control-Allow-Origin": "*"}});
      expect(result).toEqual(news);
    });

    it('should throw an error when fetching news fails', async () => {
      fetch.mockResponse(JSON.stringify({message: 'Some error'}), {status: 404});

      try {
        await getCurrentNews();
      } catch (err) {
        expect(err.message).toEqual('Some error');
      }
    });
  })
});

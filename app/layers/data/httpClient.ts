
export class HttpClient {

  private baseURL = "http://a807d22c5dcaf4392b29c14778d84f37-1961716059.us-east-1.elb.amazonaws.com/v1/api";

  private async handleSuccess(response: Response) {
    return response.json();
  }

  private handleError(error: any) {
    if (error instanceof Response) {
      // Request was made but server responded with something other than 2xx
      console.error('Status:', error.status);
      console.error('Status Text:', error.statusText);
    } else {
      // Something else happened while setting up the request
      console.error('Error Message:', error.message);
    }

    return Promise.reject(error);
  }
  
  public async get(url: string, params: Record<string, any> = {}) {
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = `${this.baseURL}${url}?${queryString}`;

    try {
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*', // Added CORS header
        },
      });
      if (!response.ok) throw response;
      return this.handleSuccess(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  public async post(url: string, data: any) {
    const fullUrl = `${this.baseURL}${url}`;

    try {
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*', // Added CORS header
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw response;
      return this.handleSuccess(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  public async patch(url: string, data: any) {
    const fullUrl = `${this.baseURL}${url}`;

    try {
      const response = await fetch(fullUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*', // Added CORS header
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw response;
      return this.handleSuccess(response);
    } catch (error) {
      return this.handleError(error);
    }
  }
}

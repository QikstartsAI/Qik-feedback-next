
export class HttpClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

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

  public async get(url: string, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = `${this.baseURL}${url}?${queryString}`;

    try {
      const response = await fetch(fullUrl);
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

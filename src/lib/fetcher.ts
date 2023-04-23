import { isProduction } from './utils';

const isPlainObject = (value: BodyInit) => value?.constructor === Object;

export const handleResponseError = (error: unknown) => {
  if (error instanceof ResponseError) {
    // Nice and type-safe!
    switch (error.response.status) {
      case 401:
        throw new Error('You are not authorized to perform this action', {
          cause: error,
        });
      case 403:
        throw new Error('You are not allowed to perform this action', {
          cause: error,
        });
      case 404:
        throw new Error('The requested resource was not found', {
          cause: error,
        });
      case 500:
        throw new Error('An internal server error occurred', {
          cause: error,
        });
      default:
        throw new Error('An unknown error occurred', {
          cause: error,
        });
    }
  } else {
    throw new Error('An unknown error occurred when fetching the user', {
      cause: error,
    });
  }
};

class ResponseError extends Error {
  response: Response;
  constructor(message: string, res: Response) {
    super(message);
    this.response = res;
  }
}

export async function fetcher(
  input: RequestInfo | URL,
  init?: RequestInit | undefined
) {
  let initOptions = init;
  // If we specified a RequestInit for fetch
  if (initOptions?.body) {
    // If we have passed a body property and it is a plain object or array
    if (Array.isArray(initOptions.body) || isPlainObject(initOptions.body)) {
      // Create a new options object serializing the body and ensuring we
      // have a content-type header
      initOptions = {
        ...initOptions,
        body: JSON.stringify(initOptions.body),
        headers: {
          'Content-Type': 'application/json',
          ...initOptions.headers,
        },
      };
    }
  }

  const res = await fetch(input, init);
  if (!res.ok) {
    handleResponseError(new ResponseError(res.statusText, res));
  }
  return res.json();
}

export const postData = async <Data = unknown, ReturnType = unknown>(
  url: string,
  data?: Data,
  options?: RequestInit
): Promise<ReturnType> => {
  if (!isProduction) {
    console.info('POSTING:,', url);
  }

  const res = await fetcher(url, {
    method: 'POST',
    body: JSON.stringify(data),
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  return res;
};

export const putData = async <Data = unknown, ReturnType = unknown>(
  url: string,
  data?: Data,
  options?: RequestInit
): Promise<ReturnType> => {
  if (!isProduction) {
    console.info('PUTTING,', url);
  }

  const res = await fetcher(url, {
    method: 'PUT',
    body: JSON.stringify(data),
    ...options,
  });

  return res;
};

export const deleteData = async <Data = unknown, ReturnType = unknown>(
  url: string,
  options?: RequestInit
): Promise<ReturnType> => {
  if (!isProduction) {
    console.info('DELETING,', url);
  }

  const res = await fetcher(url, {
    method: 'DELETE',
    ...options,
  });

  return res;
};

export const getData = async <
  ReturnType = unknown,
  Data = Record<string, string | number | boolean>
>(
  url: string,
  data?: Data,
  options?: RequestInit
): Promise<ReturnType> => {
  const dataWithoutUndefined = Object.entries(data || {}).reduce(
    (acc, [key, value]) => {
      if (value !== undefined && value !== null) {
        acc[key] = value as string | string[] | boolean;
      }
      return acc;
    },
    {} as Record<string, string | string[] | boolean>
  );
  const urlParams = new URLSearchParams(
    dataWithoutUndefined as Record<string, string>
  ).toString();
  const urlWithParams = urlParams ? `${url}?${urlParams}` : url;

  if (!isProduction) {
    console.info('GETTING,', urlWithParams);
  }
  const res = await fetcher(urlWithParams, options);

  return res;
};

export default fetcher;

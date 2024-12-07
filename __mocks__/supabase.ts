import { jest } from '@jest/globals';

export const createClient = jest.fn(() => ({
    auth: {
      signUp: jest.fn(({ email }: { email: string }) => {
        if (email === "already@exists.com") {
          return { error: { message: "User already exists" } };
        }
        return { error: null };
      }),
    },
  }));
import { Elysia } from 'elysia';
import { jwt } from '@elysiajs/jwt';

export const authMiddleware = (app: Elysia) =>
  app
    .use(jwt({
      name: 'jwt',
      secret: process.env.JWT_SECRET!
    }))
    .derive(async ({ jwt, cookie: { auth }, set }) => {
      // ตรวจสอบ Token จาก Cookie หรือ Header
      const token = auth?.value && typeof auth.value === 'string' ? auth.value : undefined;
      const profile = await jwt.verify(token);

      if (!profile) {
        set.status = 401;
        throw new Error('Unauthorized');
      }

      return {
        user: profile
      };
    });
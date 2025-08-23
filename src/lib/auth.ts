import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// Interfaces para el nuevo estándar de API
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  errors: any;
}

interface LoginData {
  user: {
    id: string;
    email: string;
    photo?: string;
    nickname?: string;
    firstName: string;
    lastName: string;
    role: {
      id: string;
      code: string;
      name: string;
    };
  };
  accessToken: string;
  refreshToken: string;
}

interface RefreshData {
  accessToken: string;
  refreshToken: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const res = await fetch(
            `${process.env.API_BACKENDL_URL}/api/auth/login`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            },
          );

          const response: ApiResponse<LoginData> = await res.json();

          // Verificar si la respuesta es exitosa según el nuevo estándar
          if (res.ok && response.success && response.data?.user) {
            return {
              ...response.data.user,
              accessToken: response.data.accessToken,
              refreshToken: response.data.refreshToken,
            };
          }

          // Si hay errores específicos, los logueamos
          if (response.errors) {
            console.error('Login errors:', response.errors);
          }

          return null;
        } catch (error) {
          console.error('Login error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Si es el primer login
      if (account && user) {
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          user: {
            id: user.id,
            email: user.email,
            photo: user.photo,
            firstName: user.firstName,
            lastName: user.lastName,
            nickname: user.nickname,
            role: user.role,
          },
        };
      }

      // Verificar si el token ha expirado
      try {
        const tokenData = JSON.parse(atob(token.accessToken.split('.')[1]));
        const currentTimestamp = Math.floor(Date.now() / 1000);

        // Si el token está por expirar (con 1 minuto de margen)
        if (tokenData.exp < currentTimestamp + 60) {
          try {
            const response = await fetch(
              `${process.env.API_BACKENDL_URL}/api/auth/refresh`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken: token.refreshToken }),
              },
            );
            console.log('Response status:', response.status);

            const refreshResponse: ApiResponse<RefreshData> =
              await response.json();
            if (
              response.ok &&
              refreshResponse.success &&
              refreshResponse.data
            ) {
              // Actualizar tokens
              token.accessToken = refreshResponse.data.accessToken;
              token.refreshToken = refreshResponse.data.refreshToken;

              // Limpiar cualquier error previo
              delete token.error;
            } else {
              console.error(
                'Refresh token error:',
                refreshResponse.errors || refreshResponse.message,
              );
              return { ...token, error: 'RefreshAccessTokenError' };
            }
          } catch (error) {
            console.error('Error refreshing token:', error);
            return { ...token, error: 'RefreshAccessTokenError' };
          }
        }
      } catch (error) {
        console.error('Error parsing token:', error);
        return { ...token, error: 'InvalidTokenError' };
      }

      return token;
    },
    async session({ session, token }) {
      // Pasar los datos del token a la sesión
      session.user = token.user;
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.error = token.error;

      return session;
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/',
    error: '/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 horas
  },
};

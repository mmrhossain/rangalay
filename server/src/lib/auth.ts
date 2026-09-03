import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { jwt } from "better-auth/plugins"
import { prisma } from "./prisma.ts";
import { env } from "../config/env.ts";
import { Resend } from "resend";
import { logger } from "../common/utils/logger.ts";

const resend = new Resend(env.RESEND_API_KEY);

const sendAuthEmail = async (input: {
  kind: "verification" | "reset";
  to: string;
  subject: string;
  html: string;
}): Promise<void> => {
  const from = env.RESEND_FROM;

  if (!env.RESEND_API_KEY || !from) {
    logger.error({
      message: "Auth email send skipped: RESEND_API_KEY or RESEND_FROM is not configured",
      kind: input.kind,
    });
    return;
  }

  try {
    const { data, error } = await resend.emails.send({
      from,
      to: input.to,
      subject: input.subject,
      html: input.html,
    });

    if (error) {
      logger.error({
        message: "Auth email send failed",
        kind: input.kind,
        status: error.statusCode,
        name: error.name,
      });
      return;
    }

    logger.info({
      message: "Auth email sent",
      kind: input.kind,
      id: data?.id,
    });
  } catch (err) {
    logger.error({
      message: "Auth email send failed",
      kind: input.kind,
      name: err instanceof Error ? err.name : "UnknownError",
    });
  }
};



export const auth = betterAuth({
  appName: "raangalay",
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  basePath: "/api/v1/auth",
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "CUSTOMER",
        input: false,
      },
      isApproved: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      },
    },
  },
  trustedOrigins: [env.FRONTEND_URL],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 8,
    sendResetPassword: async ({ user, url }) => {
      await sendAuthEmail({
        kind: "reset",
        to: user.email,
        subject: "Reset your password",
        html: `Click <a href="${url}">here</a> to reset your password.`,
      });
    },
  },

  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendAuthEmail({
        kind: "verification",
        to: user.email,
        subject: "Verify your email address",
        html: `Click <a href="${url}">here</a> to verify your email.`,
      });
    },
  },

  socialProviders: {
    google:{
      clientId: env.GOOGLE_CLIENT_ID as string,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      mapProfileToUser: (profile) => {
        return {
          firstName: profile.name.split(" ")[0],
          lastName: profile.name.split(" ")[1],
        };
      },
    }
  },
  advanced: {
    cookiePrefix: "rangalay"
  },
  plugins: [jwt()],
});

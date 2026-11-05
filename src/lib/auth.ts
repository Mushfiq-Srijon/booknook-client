import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";
import { db, client } from "./mongodb";

export const auth = betterAuth({
    appName: "BookNook",

    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",

    secret: process.env.BETTER_AUTH_SECRET!,

    database: mongodbAdapter(db, {
        client,
    }),

    emailAndPassword: {
        enabled: true,
    },

    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        },
    },

    plugins: [
        jwt(),
    ],
});

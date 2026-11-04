
import { betterAuth } from "better-auth/minimal";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";
import { db, client } from "./mongodb";

export const auth = betterAuth({
    appName: "BookNook",

    baseURL: process.env.BETTER_AUTH_URL!,

    secret: process.env.BETTER_AUTH_SECRET!,

    database: mongodbAdapter(db, {
        client,
    }),

    emailAndPassword: {
        enabled: true,
    },

    plugins: [
        jwt(),
    ],
});

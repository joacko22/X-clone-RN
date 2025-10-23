import arcjet ,{tokenBucket,shield,detectBot} from "@arcjet/node"
import { ENV } from "./config/env.js";

//initialize Arcjet with security rules
export const aj = arcjet({
    key: ENV.ARCJET_KEY,
    characteristics:["ip.src"],

    rules: [
        tokenBucket({
            maxTokens: 100,
            refillRate: 10,
            refillInterval: 1000,
            capacity: 100,
        }),
        // shield protect your app from common attacks e.g SQL INJECTION , XSS , CSRF ATTACKS
        shield({
            mode:"LIVE"
        }),
        // BOT detection - block all bots except search engine
        detectBot({
            mode:"LIVE",
            allow:["CATEGORY:SEARCH:ENGINE"],
        }),
        // rate limiting with token bucket algorithm
        tokenBucket({
            mode:"LIVE",
            refillRate:10, // tokens added per interval
            interval:10, // interval in seconds
            capacity:15 // maximum tokens in bucket
        })
    ],
})
import { aj } from "../config/arcjet";

//Arcjet middleware for rate limiting , bot protection and security

export const arcjetMiddleware = async (req,res,next) => {
    try {
   
        const decision =  await aj.protect(req,{})
        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return res.status(429).json({ error: "Too many requests",message:"Rate limit exceeded. Please try again later." });
            }else if (decision.reason.isBot()) {
                return res.status(403).json({ error: "Bot detected",message:"Bot detected. Access denied." });
            }else if (decision.reason.isShield()) {
                return res.status(403).json({ message: "Shield detected" });
            }else {
                return res.status(403).json({ error: "Forbidden",message:"Access denied by security policy" });
            }
        }
        if (decision.results.some((results)=> results.reason.isBot() && results.reason.isSpoofed())) {
            return res.status(403).json({ error: "Spoofing detected", message:"Malicious Bot detected." });
        }
        next()
    } catch (error) {
        console.error("Arcjet middleware error:",error);
        next()
    }
}
const sanitizeString = (str) => {
  if (typeof str !== "string") return str;
  // Replace HTML tags, script elements, and javascript urls
  return str
    .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .trim();
};

const sanitizeObject = (obj) => {
  if (obj === null || obj === undefined) return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(item => (typeof item === "object" ? sanitizeObject(item) : sanitizeString(item)));
  }
  
  if (typeof obj === "object") {
    const sanitized = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const val = obj[key];
        
        // Block keys starting with $ to prevent NoSQL query injection
        if (key.startsWith("$")) {
          console.warn(`Blocked field starting with $: ${key}`);
          continue;
        }

        if (typeof val === "object") {
          sanitized[key] = sanitizeObject(val);
        } else {
          sanitized[key] = sanitizeString(val);
        }
      }
    }
    return sanitized;
  }
  
  return sanitizeString(obj);
};

export const sanitizeInput = (req, res, next) => {
  if (req.body) req.body = sanitizeObject(req.body);
  if (req.query) req.query = sanitizeObject(req.query);
  if (req.params) req.params = sanitizeObject(req.params);
  next();
};

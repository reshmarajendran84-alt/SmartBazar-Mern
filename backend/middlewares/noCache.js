// ✅ No React import needed — this is pure Node.js/Express

const noCache = (req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private'); // ✅ all in one string
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');  // ✅ fixed typo 'o' → '0'
  next();
};

export default noCache;  // ✅ fixed 'export' → 'exports'


export default function handler(req, res) {
  try {
    // For now, return hardcoded nicknames to test
    const nicknames = ["Carlos", "Jamie", "Leo", "Omar"];
    res.status(200).json({ nicknames });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

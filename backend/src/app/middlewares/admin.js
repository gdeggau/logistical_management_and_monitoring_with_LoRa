import User from "../models/User";

export default async (req, res, next) => {
  const user = await User.findOne({
    where: {
      id: req.userId,
      role: "ADMIN",
    },
  });

  if (!user) {
    return res
      .status(400)
      .json({ error: "Must be admin to access this route." });
  }

  return next();
};

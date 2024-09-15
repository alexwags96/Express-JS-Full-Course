import { Router } from "express";

const router = Router();

router.get("/api/products", (req, res) => {
  // console.log(req.cookies);
  if (!req.cookies["Hello"]) return res.status(403).send("Cookie expired!");
  res.send([{ id: 123, Name: "Chicken George", price: 1.99 }]);
});

export default router;

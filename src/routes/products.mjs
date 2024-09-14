import { Router } from "express";

const router = Router();

router.get("/api/products", (req, res) => {
  res.send([{ id: 123, Name: "Chicken George", price: 1.99 }]);
});

export default router;

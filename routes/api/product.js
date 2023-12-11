const { body } = require("express-validator");
const productController = require("../../controllers/productController");
const validation = require("../../handlers/validationHandler");
const Product = require("../../models/Product");

const router = require("express").Router();

router.get("/", productController.gets);
router.get("/shop/:id/products", productController.shopProducts);
router.get("/popular", productController.popularProducts);
router.get("/new", productController.newProducts);
router.get("/rated-highest", productController.ratedHighted);
router.get("/biggest-discount", productController.biggestDiscount);
router.get("/products-view", productController.productsView);
router.get("/best-seller", productController.bestSellerProducts);
router.get("/search", productController.search);
router.get("/:id", productController.get);

router.post(
  "/create",
  body("title")
    .isLength({ min: 3, max: 100 })
    .withMessage("Product title must be between 3 and 100 characters long."),
  body("title").custom(async (title) => {
    const product = await Product.findOne({ title });
    if (product) {
      throw new Error("Title already used");
    }
  }),
  body("description")
    .isLength({ min: 50 })
    .withMessage("Product description must be at 100 characters."),
  validation,
  productController.create
);

router.put("/views/:productId", productController.updateView);
router.put(
  "/:id",
  body("title")
    .isLength({ min: 10, max: 100 })
    .withMessage("Product title must be between 10 and 100 characters long."),
  body("description")
    .isLength({ min: 50 })
    .withMessage("Product description must be at 100 characters."),
  validation,
  productController.update
);

router.patch("/:id", productController.delete);

module.exports = router;

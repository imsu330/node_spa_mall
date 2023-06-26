
const express = require("express");
const router = express.Router();
// 라우터 메서드를 실행해 변수에 담는다

// /routes/goods.js
const goods = [
  {
    goodsId: 4,
    name: "상품 4",
    thumbnailUrl:
      "https://cdn.pixabay.com/photo/2016/09/07/02/11/frogs-1650657_1280.jpg",
    category: "drink",
    price: 0.1,
  },
  {
    goodsId: 3,
    name: "상품 3",
    thumbnailUrl:
      "https://cdn.pixabay.com/photo/2016/09/07/02/12/frogs-1650658_1280.jpg",
    category: "drink",
    price: 2.2,
  },
  {
    goodsId: 2,
    name: "상품 2",
    thumbnailUrl:
      "https://cdn.pixabay.com/photo/2014/08/26/19/19/wine-428316_1280.jpg",
    category: "drink",
    price: 0.11,
  },
  {
    goodsId: 1,
    name: "상품 1",
    thumbnailUrl:
      "https://cdn.pixabay.com/photo/2016/09/07/19/54/wines-1652455_1280.jpg",
    category: "drink",
    price: 6.2,
  },
];

// const [result] = goods.filter((good)=> Number(goodsId)=== good.goodsId)

// res.status(200).json({ detail: result });
// });


//상품 목록 조회 API
router.get("/goods", (req, res) => {
  res.status(200).json({ goods: goods });
});

const Cart = require("../schemas/cart.js")
//상품 상세 조회 API
router.get("/goods/:goodsId", (req, res) => {
  const { goodsId } = req.params;
  const [detail] = goods.filter((goods) => goods.goodsId === Number(goodsId));
  res.json({ detail });
});

// 장바구니에 값이 있을 경우 에러
router.post("/goods/:goodsId/cart", async(req, res) => {
    const {goodsId} = req.params;
    const {quantity} = req.body;

    const existsCarts = await Cart.find({goodsId})
    if (existsCarts.length){
        return res.status(400).json({
            success:false,
            errorMessage:"이미 장바구니에 해당하는 상품이 존재합니다.",
    })
    }
    await Cart.create({goodsId, quantity});

    res.json({result: "success"});
})

// 장바구니 업데이트하는 코드 (에러없음)
router.put("/goods/:goodsId/cart", async(req, res) => {
    const {goodsId} = req.params;
    const {quantity} = req.body;

    const existsCarts = await Cart.find({goodsId})
    if(existsCarts.length) {
        await Cart.updateOne(
            {goodsId: goodsId}, //goodsId에 해당하는 값이 있을때, 우리는 수정을 할 거다.
            {$set: {quantity:quantity}}// quantity를 :quantity 변수에 있는 값으로 바꿀거다.
            ) 
    }
    res.status(200).json({success:true})
})

// 장바구니 데이터 지우는 코드
router.delete("/goods/:goodsId/cart", async(req, res) => {
    const {goodsId} = req.params;

    const existsCarts = await Cart.find({goodsId});
    if(existsCarts.length) {
        await Cart.deleteOne({goodsId});
    }

    res.json({result:"success"});
})

const Goods = require("../schemas/goods.js");
router.post("/goods/", async (req, res) => {
  const { goodsId, name, thumbnailUrl, category, price } = req.body;

  const goods = await Goods.find({ goodsId });

  if (goods.length) {
    return res.status(400).json({
      success: false,
      errorMessage: "이미 존재하는 GoodsId입니다.",
    });
  }

  const createdGoods = await Goods.create({
    goodsId,
    name,
    thumbnailUrl,
    category,
    price,
  });

  res.json({ goods: createdGoods });
});

module.exports = router;





// // localhost:3000/api/ GET
// router.get("/", (req, res) => {
//   res.send("default url for goods.js GET Method");
// });

// // localhost:3000/api/about GET
// router.get("/about", (req, res) => {
//   res.send("goods.js about PATH");
// });

// //
// req.params = { goodsId : n } 이걸 구조분해할당

// let result = null;
// for (const good of goods) {
//   if (Number(goodsId) === good.goodsId) {
//     result = good;
//   }
// }
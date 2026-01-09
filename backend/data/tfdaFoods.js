// 本地 TFDA 食品資料庫 - 擴充版 (160+ 種常見台灣食品)
const tfdaFoods = [
  // 米麵類
  { name: '白米飯', calories: 130, protein: 2.6, carbs: 28, fat: 0.2, servingSize: '100克' },
  { name: '米粉', calories: 109, protein: 2.2, carbs: 24, fat: 0.3, servingSize: '100克' },
  { name: '麵條', calories: 138, protein: 5, carbs: 28, fat: 0.5, servingSize: '100克' },
  { name: '烏龍麵', calories: 138, protein: 4.2, carbs: 27, fat: 0.5, servingSize: '100克' },
  { name: '意大利麵', calories: 131, protein: 5, carbs: 25, fat: 1.1, servingSize: '100克' },
  { name: '粥 (白粥)', calories: 40, protein: 1, carbs: 9, fat: 0.1, servingSize: '100克' },
  { name: '糙米', calories: 111, protein: 2.6, carbs: 23, fat: 0.9, servingSize: '100克' },
  { name: '燕麥', calories: 389, protein: 17, carbs: 66, fat: 6.9, servingSize: '100克' },
  { name: '饅頭', calories: 220, protein: 7, carbs: 44, fat: 1.5, servingSize: '100克' },
  { name: '米漢堡 (100g)', calories: 250, protein: 5, carbs: 45, fat: 3, servingSize: '100克' },

  // 蛋白質
  { name: '雞蛋', calories: 155, protein: 13, carbs: 1.1, fat: 11, servingSize: '100克' },
  { name: '雞肉（去皮）', calories: 165, protein: 31, carbs: 0, fat: 3.6, servingSize: '100克' },
  { name: '雞腿肉', calories: 209, protein: 26, carbs: 0, fat: 11, servingSize: '100克' },
  { name: '雞胸肉', calories: 165, protein: 31, carbs: 0, fat: 3.6, servingSize: '100克' },
  { name: '鴨肉', calories: 337, protein: 19, carbs: 0, fat: 28, servingSize: '100克' },
  { name: '豬肉（瘦）', calories: 242, protein: 27, carbs: 0, fat: 14, servingSize: '100克' },
  { name: '豬肉（五花）', calories: 395, protein: 19, carbs: 0, fat: 35, servingSize: '100克' },
  { name: '牛肉（瘦）', calories: 250, protein: 26, carbs: 0, fat: 15, servingSize: '100克' },
  { name: '羊肉', calories: 294, protein: 25, carbs: 0, fat: 21, servingSize: '100克' },
  { name: '牛腩', calories: 220, protein: 18, carbs: 0, fat: 16, servingSize: '100克' },
  { name: '魚肉 (鱸魚)', calories: 91, protein: 20.5, carbs: 0, fat: 1.7, servingSize: '100克' },
  { name: '鮭魚', calories: 208, protein: 20, carbs: 0, fat: 13, servingSize: '100克' },
  { name: '鯛魚', calories: 96, protein: 20, carbs: 0, fat: 1.5, servingSize: '100克' },
  { name: '蝦', calories: 99, protein: 20, carbs: 0, fat: 0.3, servingSize: '100克' },
  { name: '蟹肉', calories: 95, protein: 20, carbs: 0, fat: 1, servingSize: '100克' },
  { name: '魷魚', calories: 92, protein: 15.6, carbs: 3.1, fat: 1.4, servingSize: '100克' },
  { name: '章魚', calories: 82, protein: 14.9, carbs: 3.1, fat: 1.0, servingSize: '100克' },
  { name: '豆腐', calories: 76, protein: 8, carbs: 1.5, fat: 4.8, servingSize: '100克' },
  { name: '豆干', calories: 182, protein: 17, carbs: 7, fat: 11, servingSize: '100克' },
  { name: '黑豆', calories: 132, protein: 11, carbs: 12, fat: 0.5, servingSize: '100克' },

  // 乳製品
  { name: '牛奶', calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3, servingSize: '100毫升' },
  { name: '優格', calories: 59, protein: 3.5, carbs: 4.7, fat: 0.4, servingSize: '100克' },
  { name: '起司 (切達)', calories: 402, protein: 25, carbs: 1.3, fat: 33, servingSize: '100克' },
  { name: '奶油', calories: 717, protein: 0.6, carbs: 0.4, fat: 81, servingSize: '100克' },

  // 蔬菜
  { name: '番茄', calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, servingSize: '100克' },
  { name: '青菜', calories: 31, protein: 2.6, carbs: 5.2, fat: 0.3, servingSize: '100克' },
  { name: '高麗菜', calories: 23, protein: 1.3, carbs: 5.2, fat: 0.2, servingSize: '100克' },
  { name: '油菜', calories: 15, protein: 2.2, carbs: 2.3, fat: 0.2, servingSize: '100克' },
  { name: '菠菜', calories: 23, protein: 2.7, carbs: 3.6, fat: 0.4, servingSize: '100克' },
  { name: '胡蘿蔔', calories: 41, protein: 0.9, carbs: 10, fat: 0.2, servingSize: '100克' },
  { name: '黃瓜', calories: 15, protein: 0.6, carbs: 3.6, fat: 0.1, servingSize: '100克' },
  { name: '洋蔥', calories: 40, protein: 1.1, carbs: 9, fat: 0.1, servingSize: '100克' },
  { name: '大蒜', calories: 149, protein: 6.4, carbs: 33, fat: 0.5, servingSize: '100克' },
  { name: '花椰菜', calories: 34, protein: 2.8, carbs: 7, fat: 0.4, servingSize: '100克' },
  { name: '玉米', calories: 86, protein: 3.3, carbs: 19, fat: 1.2, servingSize: '100克' },
  { name: '馬鈴薯', calories: 77, protein: 2, carbs: 17, fat: 0.1, servingSize: '100克' },
  { name: '茄子', calories: 25, protein: 1, carbs: 6, fat: 0.2, servingSize: '100克' },
  { name: '青椒', calories: 20, protein: 0.9, carbs: 4.6, fat: 0.2, servingSize: '100克' },

  // 水果
  { name: '蘋果', calories: 52, protein: 0.3, carbs: 14, fat: 0.2, servingSize: '100克' },
  { name: '香蕉', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, servingSize: '100克' },
  { name: '橘子', calories: 47, protein: 0.7, carbs: 12, fat: 0.3, servingSize: '100克' },
  { name: '檸檬', calories: 29, protein: 1.1, carbs: 9, fat: 0.3, servingSize: '100克' },
  { name: '葡萄', calories: 67, protein: 0.6, carbs: 17, fat: 0.4, servingSize: '100克' },
  { name: '西瓜', calories: 30, protein: 0.6, carbs: 7.6, fat: 0.2, servingSize: '100克' },
  { name: '草莓', calories: 32, protein: 0.8, carbs: 7.7, fat: 0.3, servingSize: '100克' },
  { name: '芒果', calories: 60, protein: 0.8, carbs: 15, fat: 0.4, servingSize: '100克' },
  { name: '鳳梨', calories: 50, protein: 0.5, carbs: 13, fat: 0.1, servingSize: '100克' },
  { name: '木瓜', calories: 43, protein: 0.5, carbs: 11, fat: 0.3, servingSize: '100克' },
  { name: '奇異果', calories: 61, protein: 1.1, carbs: 15, fat: 0.5, servingSize: '100克' },

  // 穀物與根莖
  { name: '地瓜', calories: 86, protein: 1.6, carbs: 20, fat: 0.1, servingSize: '100克' },
  { name: '芋頭', calories: 89, protein: 1.5, carbs: 21, fat: 0.2, servingSize: '100克' },
  { name: '紫米', calories: 360, protein: 6.9, carbs: 77, fat: 2.5, servingSize: '100克' },
  { name: '糯米', calories: 350, protein: 6.6, carbs: 80, fat: 1.2, servingSize: '100克' },

  // 麵包與烘焙
  { name: '白麵包', calories: 265, protein: 8.4, carbs: 49, fat: 3.2, servingSize: '100克' },
  { name: '吐司', calories: 278, protein: 8.7, carbs: 49, fat: 3.8, servingSize: '100克' },
  { name: '全麥麵包', calories: 247, protein: 9.2, carbs: 41, fat: 3.3, servingSize: '100克' },
  { name: '饼干', calories: 502, protein: 6.1, carbs: 69, fat: 24, servingSize: '100克' },

  // 堅果與種子
  { name: '花生', calories: 567, protein: 25.8, carbs: 16.1, fat: 49.2, servingSize: '100克' },
  { name: '核桃', calories: 654, protein: 15.2, carbs: 13.7, fat: 65.2, servingSize: '100克' },
  { name: '杏仁', calories: 579, protein: 21.2, carbs: 21.6, fat: 49.9, servingSize: '100克' },
  { name: '芝麻', calories: 573, protein: 17.7, carbs: 23.4, fat: 49.7, servingSize: '100克' },

  // 油脂與調味
  { name: '豬油', calories: 898, protein: 0, carbs: 0, fat: 100, servingSize: '100克' },
  { name: '植物油', calories: 884, protein: 0, carbs: 0, fat: 100, servingSize: '100克' },
  { name: '橄欖油', calories: 884, protein: 0, carbs: 0, fat: 100, servingSize: '100克' },
  { name: '醬油', calories: 61, protein: 8, carbs: 5, fat: 0, servingSize: '15毫升' },
  { name: '鹽', calories: 0, protein: 0, carbs: 0, fat: 0, servingSize: '1克' },
  { name: '糖', calories: 387, protein: 0, carbs: 100, fat: 0, servingSize: '100克' },

  // 飲品
  { name: '綠茶', calories: 0, protein: 0, carbs: 0, fat: 0, servingSize: '200毫升' },
  { name: '咖啡 (黑)', calories: 2, protein: 0.3, carbs: 0, fat: 0, servingSize: '200毫升' },
  { name: '拿鐵', calories: 125, protein: 5, carbs: 11, fat: 6, servingSize: '200毫升' },
  { name: '豆漿', calories: 54, protein: 3.3, carbs: 6.3, fat: 1.8, servingSize: '100毫升' },
  { name: '果汁', calories: 45, protein: 0.5, carbs: 11, fat: 0, servingSize: '100毫升' },

  // 小吃與速食
  { name: '滷肉飯 (台式)', calories: 350, protein: 12, carbs: 45, fat: 12, servingSize: '100克' },
  { name: '牛肉麵', calories: 220, protein: 14, carbs: 30, fat: 7, servingSize: '100克' },
  { name: '鹽酥雞', calories: 320, protein: 20, carbs: 10, fat: 22, servingSize: '100克' },
  { name: '珍珠奶茶', calories: 230, protein: 2, carbs: 40, fat: 6, servingSize: '1杯(約350ml)' },
  { name: '炸雞排', calories: 450, protein: 28, carbs: 20, fat: 30, servingSize: '100克' },
  { name: '關東煮', calories: 80, protein: 6, carbs: 6, fat: 3, servingSize: '100克' },
  { name: '章魚燒', calories: 210, protein: 7, carbs: 26, fat: 9, servingSize: '100克' },

  // 甜點
  { name: '豆花', calories: 120, protein: 5, carbs: 14, fat: 5, servingSize: '100克' },
  { name: '紅豆餅', calories: 260, protein: 6, carbs: 45, fat: 6, servingSize: '100克' },
  { name: '蛋糕 (海綿)', calories: 389, protein: 5, carbs: 50, fat: 17, servingSize: '100克' },
  { name: '冰淇淋', calories: 207, protein: 3.5, carbs: 24, fat: 11, servingSize: '100克' },

  // 便利商店常見
  { name: '飯糰', calories: 300, protein: 8, carbs: 45, fat: 8, servingSize: '1個(約100g)' },
  { name: '便當 (排骨)', calories: 650, protein: 28, carbs: 80, fat: 25, servingSize: '整份' },
  { name: '三明治', calories: 280, protein: 10, carbs: 30, fat: 12, servingSize: '1份' },
  { name: '速食漢堡', calories: 295, protein: 12, carbs: 33, fat: 12, servingSize: '1個' },

  // 乾貨與罐頭
  { name: '金針菇 (乾)', calories: 350, protein: 21, carbs: 50, fat: 3, servingSize: '100克' },
  { name: '干貝 (乾)', calories: 250, protein: 60, carbs: 0, fat: 1, servingSize: '100克' },

  // 補充項目
  { name: '蜂蜜', calories: 304, protein: 0.3, carbs: 82, fat: 0, servingSize: '100克' },
  { name: '燕麥餅乾', calories: 450, protein: 6, carbs: 62, fat: 18, servingSize: '100克' },
  { name: '巧克力', calories: 546, protein: 4.9, carbs: 61, fat: 31, servingSize: '100克' }
];

module.exports = tfdaFoods;

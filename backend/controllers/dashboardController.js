const Product = require('../models/Product');
const StockMovement = require('../models/StockMovement');




const getDashboardMetrics = async (req, res, next) => {
  try {
    const totalProducts = await Product.countDocuments();

    const stockValueResult = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalValue: {
            $sum: { $multiply: ['$currentStock', '$costPrice'] }
          },
          totalUnits: {
            $sum: '$currentStock'
          }
        }
      }
    ]);
    const totalStockValue = stockValueResult.length > 0 ? stockValueResult[0].totalValue : 0;
    const totalStockUnits = stockValueResult.length > 0 ? stockValueResult[0].totalUnits : 0;

    const lowStockCount = await Product.countDocuments({
      $expr: { $lte: ['$currentStock', '$reorderLevel'] }
    });

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const todaySalesResult = await StockMovement.aggregate([
      {
        $match: {
          movementType: 'OUT',
          date: { $gte: startOfToday, $lte: endOfToday }
        }
      },
      {
        $group: {
          _id: null,
          totalSalesAmount: {
            $sum: { $multiply: ['$quantity', '$sellingPrice'] }
          },
          totalSalesProfit: {
            $sum: '$profit'
          },
          itemsSold: {
            $sum: '$quantity'
          },
          transactionCount: {
            $sum: 1
          }
        }
      }
    ]);

    const todaySales = todaySalesResult.length > 0 ? todaySalesResult[0].totalSalesAmount : 0;
    const todayProfit = todaySalesResult.length > 0 ? todaySalesResult[0].totalSalesProfit : 0;
    const todayItemsSold = todaySalesResult.length > 0 ? todaySalesResult[0].itemsSold : 0;

    const lowStockAlerts = await Product.find({
      $expr: { $lte: ['$currentStock', '$reorderLevel'] }
    })
      .sort({ currentStock: 1 })
      .limit(5);

    const recentMovements = await StockMovement.find()
      .populate('product', 'name sku unit')
      .populate('recordedBy', 'name role')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      totalProducts,
      totalStockValue,
      totalStockUnits,
      lowStockCount,
      todaySales,
      todayProfit,
      todayItemsSold,
      lowStockAlerts,
      recentMovements,
      serverTime: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardMetrics
};

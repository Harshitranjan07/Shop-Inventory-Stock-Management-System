const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');


dotenv.config();

const User = require('../models/User');
const Product = require('../models/Product');
const Supplier = require('../models/Supplier');
const StockMovement = require('../models/StockMovement');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('MONGO_URI is missing in .env');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('MongoDB connected for seeding...');

    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const staffPassword = await bcrypt.hash('staff123', salt);

    let admin = await User.findOne({ email: 'admin@shop.com' });
    if (!admin) {
      admin = await User.create({
        name: 'Demo Admin',
        email: 'admin@shop.com',
        password: adminPassword,
        role: 'admin'
      });
      console.log('Created Admin user: admin@shop.com / admin123');
    } else {
      admin.password = adminPassword;
      admin.role = 'admin';
      await admin.save();
      console.log('Updated existing Admin user: admin@shop.com');
    }

    let staff = await User.findOne({ email: 'staff@shop.com' });
    if (!staff) {
      staff = await User.create({
        name: 'Demo Staff',
        email: 'staff@shop.com',
        password: staffPassword,
        role: 'staff'
      });
      console.log('Created Staff user: staff@shop.com / staff123');
    } else {
      staff.password = staffPassword;
      staff.role = 'staff';
      await staff.save();
      console.log('Updated existing Staff user: staff@shop.com');
    }

    const sampleSuppliers = [
      { name: 'National Beverage Co.', phone: '+91 98765 43210', city: 'Mumbai' },
      { name: 'Apex Snacks & Packaged Foods', phone: '+91 98111 22334', city: 'Delhi' },
      { name: 'PureDairy Organics Ltd.', phone: '+91 97234 56789', city: 'Bengaluru' },
      { name: 'Sunrise Daily Essentials', phone: '+91 99887 76655', city: 'Kolkata' }
    ];

    const createdSuppliers = [];
    for (const supData of sampleSuppliers) {
      let sup = await Supplier.findOne({ name: supData.name });
      if (!sup) {
        sup = await Supplier.create(supData);
      }
      createdSuppliers.push(sup);
    }
    console.log(`Ensured ${createdSuppliers.length} suppliers in DB.`);

    const sampleProducts = [
      {
        sku: 'BEV-COL-300',
        name: 'Coca Cola Can 300ml',
        category: 'Beverages',
        unit: 'can',
        costPrice: 32,
        sellingPrice: 40,
        openingStock: 60,
        currentStock: 45,
        reorderLevel: 20
      },
      {
        sku: 'BEV-RED-250',
        name: 'Red Bull Energy Drink 250ml',
        category: 'Beverages',
        unit: 'can',
        costPrice: 95,
        sellingPrice: 125,
        openingStock: 30,
        currentStock: 12,
        reorderLevel: 15 
      },
      {
        sku: 'SNK-LAY-CL50',
        name: 'Lays Classic Salted 50g',
        category: 'Snacks',
        unit: 'packet',
        costPrice: 16,
        sellingPrice: 20,
        openingStock: 100,
        currentStock: 80,
        reorderLevel: 25
      },
      {
        sku: 'SNK-DOR-NA60',
        name: 'Doritos Cheese Nachos 60g',
        category: 'Snacks',
        unit: 'packet',
        costPrice: 28,
        sellingPrice: 35,
        openingStock: 50,
        currentStock: 5,
        reorderLevel: 15 
      },
      {
        sku: 'DRY-AMU-T500',
        name: 'Amul Taaza Milk 500ml',
        category: 'Dairy',
        unit: 'pouch',
        costPrice: 25,
        sellingPrice: 28,
        openingStock: 40,
        currentStock: 32,
        reorderLevel: 15
      },
      {
        sku: 'DRY-AMU-B100',
        name: 'Amul Salted Butter 100g',
        category: 'Dairy',
        unit: 'box',
        costPrice: 50,
        sellingPrice: 58,
        openingStock: 25,
        currentStock: 8,
        reorderLevel: 10 
      },
      {
        sku: 'STA-BAS-R05K',
        name: 'India Gate Basmati Rice 5kg',
        category: 'Staples',
        unit: 'bag',
        costPrice: 480,
        sellingPrice: 560,
        openingStock: 20,
        currentStock: 18,
        reorderLevel: 5
      },
      {
        sku: 'STA-ASH-A05K',
        name: 'Aashirvaad Whole Wheat Atta 5kg',
        category: 'Staples',
        unit: 'bag',
        costPrice: 220,
        sellingPrice: 260,
        openingStock: 35,
        currentStock: 22,
        reorderLevel: 8
      },
      {
        sku: 'PC-DOV-S100',
        name: 'Dove Beauty Bathing Bar 100g',
        category: 'Personal Care',
        unit: 'bar',
        costPrice: 42,
        sellingPrice: 55,
        openingStock: 50,
        currentStock: 3,
        reorderLevel: 10 
      },
      {
        sku: 'PC-COL-T150',
        name: 'Colgate Total Toothpaste 150g',
        category: 'Personal Care',
        unit: 'tube',
        costPrice: 90,
        sellingPrice: 115,
        openingStock: 40,
        currentStock: 34,
        reorderLevel: 10
      },
      {
        sku: 'SNK-ORE-B120',
        name: 'Oreo Vanilla Creme Biscuits 120g',
        category: 'Snacks',
        unit: 'packet',
        costPrice: 28,
        sellingPrice: 35,
        openingStock: 45,
        currentStock: 40,
        reorderLevel: 15
      },
      {
        sku: 'BEV-NES-C100',
        name: 'Nescafe Classic Instant Coffee 100g',
        category: 'Beverages',
        unit: 'jar',
        costPrice: 260,
        sellingPrice: 310,
        openingStock: 25,
        currentStock: 19,
        reorderLevel: 6
      }
    ];

    const savedProducts = [];
    for (const prodData of sampleProducts) {
      let prod = await Product.findOne({ sku: prodData.sku });
      if (!prod) {
        prod = await Product.create(prodData);
      } else {
        prod.name = prodData.name;
        prod.category = prodData.category;
        prod.unit = prodData.unit;
        prod.costPrice = prodData.costPrice;
        prod.sellingPrice = prodData.sellingPrice;
        prod.currentStock = prodData.currentStock;
        prod.reorderLevel = prodData.reorderLevel;
        await prod.save();
      }
      savedProducts.push(prod);
    }
    console.log(`Ensured ${savedProducts.length} products in DB.`);

    const movementsExist = await StockMovement.countDocuments();
    if (movementsExist === 0) {
      console.log('Seeding initial stock movements...');
      const today = new Date();

      await StockMovement.create({
        product: savedProducts[0]._id, 
        supplier: createdSuppliers[0]._id,
        movementType: 'IN',
        quantity: 60,
        costPrice: 32,
        recordedBy: admin._id,
        date: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000)
      });

      await StockMovement.create({
        product: savedProducts[2]._id, 
        supplier: createdSuppliers[1]._id,
        movementType: 'IN',
        quantity: 100,
        costPrice: 16,
        recordedBy: admin._id,
        date: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000)
      });

      await StockMovement.create({
        product: savedProducts[0]._id, 
        movementType: 'OUT',
        quantity: 15,
        costPrice: 32,
        sellingPrice: 40,
        profit: (40 - 32) * 15, 
        recordedBy: staff._id,
        date: new Date()
      });

      await StockMovement.create({
        product: savedProducts[2]._id, 
        movementType: 'OUT',
        quantity: 20,
        costPrice: 16,
        sellingPrice: 20,
        profit: (20 - 16) * 20, 
        recordedBy: staff._id,
        date: new Date()
      });

      console.log('Seeded sample stock movements (including today sales for dashboard).');
    } else {
      console.log(`Stock movements already exist (${movementsExist} records). Preserved.`);
    }

    console.log('\n--- SEEDING COMPLETED SUCCESSFULLY ---');
    console.log('Demo Credentials:');
    console.log('Admin: admin@shop.com / admin123');
    console.log('Staff: staff@shop.com / staff123');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedData();

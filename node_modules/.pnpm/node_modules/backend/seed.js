import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Service from './models/Service.js';
import Product from './models/Product.js';
import AcademyClass from './models/AcademyClass.js';

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Clearing database...');

    await User.deleteMany();
    await Service.deleteMany();
    await Product.deleteMany();
    await AcademyClass.deleteMany();

    console.log('Seeding new data...');

    // 1. Create Admin
    await User.create({
      name: 'Mameys Admin',
      email: 'admin@mameys.com',
      phone: '9800000000',
      password: 'adminpassword123',
      role: 'admin'
    });

    // 2. Create Services
    await Service.insertMany([
      { name: 'Precision Haircut', description: 'Includes wash, cut, and custom styling', price: 1200, durationMinutes: 45 },
      { name: 'Beard Grooming & Shapeup', description: 'Hot towel treatment and razor line finish', price: 600, durationMinutes: 30 },
      { name: 'Hair Color & Highlights', description: 'Premium ammonia-free treatment', price: 3500, durationMinutes: 90 }
    ]);

    // 3. Create Products
    await Product.insertMany([
      { name: 'Matte Clay Pomade', description: 'Strong hold, zero shine styling wax', price: 1500, stockQuantity: 20 },
      { name: 'Nourishing Beard Oil', description: 'Organic argan oil for beard moisture', price: 1100, stockQuantity: 15 },
      { name: 'Color Protect Shampoo', description: 'Sulfate-free daily wash', price: 1800, stockQuantity: 10 }
    ]);

    // 4. Create Academy Class
    await AcademyClass.create({
      title: 'Advanced Barbering & Precision Fades Masterclass',
      description: '3-day intensive hands-on workshop led by Sagar Saru.',
      startDate: new Date('2026-09-01'),
      durationDays: 3,
      price: 15000,
      registrationLink: 'https://wa.me/9779800000000'
    });

    console.log('✅ Database successfully seeded!');
    console.log('🔑 Admin Credentials -> Email: admin@mameys.com | Password: adminpassword123');
    process.exit();
  } catch (error) {
    console.error(`Error Seeding DB: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
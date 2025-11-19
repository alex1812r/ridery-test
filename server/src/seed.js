import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import User from './models/User.js';
import Vehicle from './models/Vehicle.js';

dotenv.config();

/**
 * Script para poblar la base de datos con datos de prueba
 */
const seedDatabase = async () => {
  try {
    // Conectar a la base de datos
    await connectDB();
    console.log('📦 Conectado a MongoDB para seed');

    // Limpiar colecciones existentes (opcional - comentar si no se desea)
    await User.deleteMany({});
    await Vehicle.deleteMany({});
    console.log('🧹 Colecciones limpiadas');

    // Crear usuario admin
    const adminUser = await User.create({
      email: 'admin@ridery.com',
      password: 'admin123' // Se hasheará automáticamente
    });
    console.log('✅ Usuario admin creado:', adminUser.email);

    // Crear 25 vehículos de prueba variados
    const marks = ['Toyota', 'Honda', 'Ford', 'Tesla', 'Nissan', 'Chevrolet', 'BMW', 'Audi', 'Kia', 'Hyundai'];
    const models = ['Sedan', 'SUV', 'Hatchback', 'Pickup', 'Crossover', 'Coupe', 'Van', 'Roadster'];
    const statuses = ['available', 'maintenance', 'service'];

    const vehicles = Array.from({ length: 25 }).map((_, index) => {
      const mark = marks[index % marks.length];
      const model = `${mark} ${models[index % models.length]} ${index + 1}`;
      const year = 2015 + (index % 10);
      const status = statuses[index % statuses.length];

      return {
        mark,
        model,
        year,
        status,
        createdBy: adminUser._id,
        updatedBy: adminUser._id
      };
    });

    const createdVehicles = await Vehicle.insertMany(vehicles);
    console.log(`✅ ${createdVehicles.length} vehículos creados`);

    // Mostrar resumen
    console.log('\n📊 Resumen del seed:');
    console.log(`   - Usuarios: ${await User.countDocuments()}`);
    console.log(`   - Vehículos: ${await Vehicle.countDocuments()}`);

    console.log('\n✨ Seed completado exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en el seed:', error);
    process.exit(1);
  }
};

// Ejecutar seed
seedDatabase();

const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
const envPath = path.join(__dirname, '..', '.env');

const target = process.argv[2]; // 'sqlite' or 'postgres'

if (!target || (target !== 'sqlite' && target !== 'postgres')) {
  console.log('Usage: node scripts/switch-db.js <sqlite|postgres>');
  process.exit(1);
}

// 1. Modify schema.prisma
if (fs.existsSync(schemaPath)) {
  let schema = fs.readFileSync(schemaPath, 'utf8');
  if (target === 'sqlite') {
    schema = schema.replace(/provider\s*=\s*"postgresql"/g, 'provider = "sqlite"');
    console.log('Updated schema.prisma to use SQLite provider.');
  } else {
    schema = schema.replace(/provider\s*=\s*"sqlite"/g, 'provider = "postgresql"');
    console.log('Updated schema.prisma to use PostgreSQL provider.');
  }
  fs.writeFileSync(schemaPath, schema, 'utf8');
} else {
  console.error('schema.prisma not found at:', schemaPath);
}

// 2. Modify .env
if (fs.existsSync(envPath)) {
  let envContent = fs.readFileSync(envPath, 'utf8');
  if (target === 'sqlite') {
    // Comment out postgres URL, uncomment/add sqlite URL
    if (!envContent.includes('DATABASE_URL="file:./dev.db"')) {
      envContent = envContent.replace(/^DATABASE_URL=.*$/m, '# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/glow_grace"\nDATABASE_URL="file:./dev.db"');
    } else {
      envContent = envContent.replace(/^#?\s*DATABASE_URL="postgresql:\/\/.*$/m, '# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/glow_grace"');
      envContent = envContent.replace(/^#?\s*DATABASE_URL="file:.*$/m, 'DATABASE_URL="file:./dev.db"');
    }
    console.log('Updated .env to use SQLite database URL.');
  } else {
    // Uncomment postgres URL, comment sqlite URL
    envContent = envContent.replace(/^#?\s*DATABASE_URL="postgresql:\/\/(.*)"$/m, 'DATABASE_URL="postgresql://$1"');
    envContent = envContent.replace(/^DATABASE_URL="file:(.*)"$/m, '# DATABASE_URL="file:$1"');
    console.log('Updated .env to use PostgreSQL database URL.');
  }
  fs.writeFileSync(envPath, envContent, 'utf8');
} else {
  console.log('.env file not found, creating one with default configurations.');
  const defaultEnv = target === 'sqlite' 
    ? 'DATABASE_URL="file:./dev.db"\nNEXTAUTH_SECRET="super-secret-grace-glow-key-2026"\nNEXTAUTH_URL="http://localhost:3000"\n'
    : 'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/glow_grace"\nNEXTAUTH_SECRET="super-secret-grace-glow-key-2026"\nNEXTAUTH_URL="http://localhost:3000"\n';
  fs.writeFileSync(envPath, defaultEnv, 'utf8');
}

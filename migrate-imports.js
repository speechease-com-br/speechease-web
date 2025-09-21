#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Mapeamento de imports antigos para novos
const importMappings = {
  // Entidades
  '@/main/entities/card-read-aloud.type': '@/domain/entities/card-read-aloud.type',
  '@/main/entities/pronunciation-feedback': '@/domain/entities/pronunciation-feedback',
  
  // Infraestrutura
  '../httpClient/httpClient': '@/infrastructure/http/httpClient',
  '../httpClient/types': '@/infrastructure/http/types',
  '../auth-infra/auth-infra': '@/infrastructure/repositories/auth-infra',
  '../cards/cards-infra': '@/infrastructure/repositories/cards-infra',
  '../dashboard-infra/dashboard-infra': '@/infrastructure/repositories/dashboard-infra',
  
  // Utilitários
  '@/lib/utils': '@/shared/utils/utils',
  '@/main/constants/requests': '@/shared/constants/requests',
  
  // Componentes
  '@/components/': '@/src/presentation/components/',
};

function updateImportsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;

    // Aplicar mapeamentos
    for (const [oldImport, newImport] of Object.entries(importMappings)) {
      const regex = new RegExp(oldImport.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      if (content.includes(oldImport)) {
        content = content.replace(regex, newImport);
        hasChanges = true;
      }
    }

    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated imports in: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
  }
}

function processDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Pular node_modules e .next
      if (!['node_modules', '.next', '.git'].includes(item)) {
        processDirectory(fullPath);
      }
    } else if (stat.isFile() && (item.endsWith('.ts') || item.endsWith('.tsx'))) {
      updateImportsInFile(fullPath);
    }
  }
}

console.log('🚀 Starting import migration...');
console.log('📁 Processing directories: app/, components/, infrastructure/, main/');

// Processar diretórios específicos
const directoriesToProcess = ['app', 'components', 'infrastructure', 'main'];
const rootDir = process.cwd();

directoriesToProcess.forEach(dir => {
  const dirPath = path.join(rootDir, dir);
  if (fs.existsSync(dirPath)) {
    console.log(`\n📂 Processing ${dir}/`);
    processDirectory(dirPath);
  }
});

console.log('\n✨ Import migration completed!');
console.log('\n📋 Next steps:');
console.log('1. Review the updated imports');
console.log('2. Test the application');
console.log('3. Remove old files if everything works correctly');
console.log('4. Update any remaining manual imports');

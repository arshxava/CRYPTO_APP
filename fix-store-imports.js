const fs = require('fs');
const path = require('path');

// Files to fix with their relative paths to store
const filesToFix = [
  { file: 'src/screens/ProductsScreen.tsx', storePath: '../store' },
  { file: 'src/screens/ProductDetailScreen.tsx', storePath: '../store' },
  { file: 'src/screens/OrdersScreen.tsx', storePath: '../store' },
  { file: 'src/screens/MoreScreen.tsx', storePath: '../store' },
  { file: 'src/screens/HomeScreen.tsx', storePath: '../store' },
  { file: 'src/screens/CartScreen.tsx', storePath: '../store' },
  { file: 'src/screens/AnalyticsScreen.tsx', storePath: '../store' },
  { file: 'src/screens/auth/LoginScreen.tsx', storePath: '../../store' },
  { file: 'src/navigation/MainTabNavigator.tsx', storePath: '../store' },
  { file: 'src/navigation/AppNavigator.tsx', storePath: '../store' },
  { file: 'src/screens/auth/RegisterScreen.tsx', storePath: '../../store' },
  { file: 'src/components/product/ProductCard.tsx', storePath: '../../store' },
];

filesToFix.forEach(({ file, storePath }) => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace @store/ imports with relative paths
    content = content.replace(/from '@store\/([^']+)'/g, `from '${storePath}/$1'`);
    
    fs.writeFileSync(file, content);
    console.log(`Fixed store imports in ${file}`);
  } else {
    console.log(`File not found: ${file}`);
  }
});

console.log('All store import paths fixed!'); 
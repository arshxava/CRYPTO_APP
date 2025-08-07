const fs = require('fs');
const path = require('path');

// Function to fix imports in a file
function fixImportsInFile(filePath, replacements) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    
    replacements.forEach(({ from, to }) => {
      const regex = new RegExp(`from '${from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'`, 'g');
      if (content.match(regex)) {
        content = content.replace(regex, `from '${to}'`);
        changed = true;
      }
    });
    
    if (changed) {
      fs.writeFileSync(filePath, content);
      console.log(`Fixed imports in ${filePath}`);
    }
  }
}

// Files and their import replacements
const filesToFix = [
  {
    file: 'src/screens/ProductsScreen.tsx',
    replacements: [
      { from: '@components/common/LoadingScreen', to: '../components/common/LoadingScreen' },
      { from: '@components/common/Button', to: '../components/common/Button' },
      { from: '@components/product/ProductCard', to: '../components/product/ProductCard' },
      { from: '@components/product/FilterModal', to: '../components/product/FilterModal' },
      { from: '@/constants/Colors', to: '../constants/Colors' },
      { from: '@/constants/Typography', to: '../constants/Typography' },
      { from: '@/constants/Layout', to: '../constants/Layout' },
    ]
  },
  {
    file: 'src/screens/ProductDetailScreen.tsx',
    replacements: [
      { from: '@components/common/Button', to: '../components/common/Button' },
      { from: '@/constants/Colors', to: '../constants/Colors' },
      { from: '@/constants/Typography', to: '../constants/Typography' },
      { from: '@/constants/Layout', to: '../constants/Layout' },
    ]
  },
  {
    file: 'src/screens/OrdersScreen.tsx',
    replacements: [
      { from: '@components/common/LoadingScreen', to: '../components/common/LoadingScreen' },
      { from: '@components/order/OrderCard', to: '../components/order/OrderCard' },
      { from: '@components/order/OrderSummaryCard', to: '../components/order/OrderSummaryCard' },
      { from: '@/constants/Colors', to: '../constants/Colors' },
      { from: '@/constants/Typography', to: '../constants/Typography' },
      { from: '@/constants/Layout', to: '../constants/Layout' },
    ]
  },
  {
    file: 'src/screens/HomeScreen.tsx',
    replacements: [
      { from: '@components/common/LoadingScreen', to: '../components/common/LoadingScreen' },
      { from: '@components/common/Button', to: '../components/common/Button' },
      { from: '@components/product/ProductCard', to: '../components/product/ProductCard' },
      { from: '@components/home/HeroBanner', to: '../components/home/HeroBanner' },
      { from: '@components/home/CategoryGrid', to: '../components/home/CategoryGrid' },
      { from: '@components/home/TestimonialCard', to: '../components/home/TestimonialCard' },
      { from: '@/constants/Colors', to: '../constants/Colors' },
      { from: '@/constants/Typography', to: '../constants/Typography' },
      { from: '@/constants/Layout', to: '../constants/Layout' },
    ]
  },
  {
    file: 'src/screens/AnalyticsScreen.tsx',
    replacements: [
      { from: '@components/common/LoadingScreen', to: '../components/common/LoadingScreen' },
      { from: '@components/analytics/AnalyticsCard', to: '../components/analytics/AnalyticsCard' },
      { from: '@/constants/Colors', to: '../constants/Colors' },
      { from: '@/constants/Typography', to: '../constants/Typography' },
      { from: '@/constants/Layout', to: '../constants/Layout' },
    ]
  },
  {
    file: 'src/screens/auth/LoginScreen.tsx',
    replacements: [
      { from: '@components/common/Button', to: '../../components/common/Button' },
      { from: '@components/common/Input', to: '../../components/common/Input' },
      { from: '@/constants/Colors', to: '../../constants/Colors' },
      { from: '@/constants/Typography', to: '../../constants/Typography' },
      { from: '@/constants/Layout', to: '../../constants/Layout' },
    ]
  },
  {
    file: 'src/screens/auth/RegisterScreen.tsx',
    replacements: [
      { from: '@components/common/Button', to: '../../components/common/Button' },
      { from: '@components/common/Input', to: '../../components/common/Input' },
      { from: '@/constants/Colors', to: '../../constants/Colors' },
      { from: '@/constants/Typography', to: '../../constants/Typography' },
      { from: '@/constants/Layout', to: '../../constants/Layout' },
    ]
  },
  {
    file: 'src/screens/auth/ForgotPasswordScreen.tsx',
    replacements: [
      { from: '@components/common/Button', to: '../../components/common/Button' },
      { from: '@components/common/Input', to: '../../components/common/Input' },
      { from: '@/constants/Colors', to: '../../constants/Colors' },
      { from: '@/constants/Typography', to: '../../constants/Typography' },
      { from: '@/constants/Layout', to: '../../constants/Layout' },
    ]
  },
  {
    file: 'src/screens/auth/ResetPasswordScreen.tsx',
    replacements: [
      { from: '@components/common/Button', to: '../../components/common/Button' },
      { from: '@components/common/Input', to: '../../components/common/Input' },
      { from: '@/constants/Colors', to: '../../constants/Colors' },
      { from: '@/constants/Typography', to: '../../constants/Typography' },
      { from: '@/constants/Layout', to: '../../constants/Layout' },
    ]
  },
  {
    file: 'src/components/product/FilterModal.tsx',
    replacements: [
      { from: '@components/common/Button', to: '../common/Button' },
      { from: '@/constants/Colors', to: '../../constants/Colors' },
      { from: '@/constants/Typography', to: '../../constants/Typography' },
      { from: '@/constants/Layout', to: '../../constants/Layout' },
    ]
  },
  {
    file: 'src/components/home/HeroBanner.tsx',
    replacements: [
      { from: '@components/common/Button', to: '../common/Button' },
      { from: '@/constants/Colors', to: '../../constants/Colors' },
      { from: '@/constants/Typography', to: '../../constants/Typography' },
      { from: '@/constants/Layout', to: '../../constants/Layout' },
    ]
  },
];

// Fix all files
filesToFix.forEach(({ file, replacements }) => {
  fixImportsInFile(file, replacements);
});

console.log('All import paths fixed!'); 
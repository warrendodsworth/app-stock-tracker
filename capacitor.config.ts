import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.stock.tracker',
  appName: 'app-stock-tracker',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;

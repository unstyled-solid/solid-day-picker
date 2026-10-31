import {defineConfig} from 'vitest/config';
import shared from './vitest.config';
export default defineConfig({...shared,test:{...shared.test,include:['docs/examples/timezone/**/*.test.tsx'],exclude:['**/node_modules/**'],env:{TZ:'Australia/Adelaide'}}});

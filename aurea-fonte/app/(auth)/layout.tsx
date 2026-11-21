import { DeviceFrame } from '@/components/layout/DeviceFrame';
import { PageTransition } from '@/components/layout/PageTransition';
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <DeviceFrame><PageTransition>{children}</PageTransition></DeviceFrame>;
}

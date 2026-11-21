'use client';
import { Bot, ChevronRight, CreditCard, Eye, FileText, Gem, LogOut, Moon, RotateCcw, Shield, Sparkles, Users, Wind } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Avatar, GlassPanel } from '@/components/glass';
import { Screen } from '@/components/layout/Screen';
import { levelOf } from '@/lib/mock/user';
import { useAurea } from '@/lib/store/aurea';
import { cn } from '@/lib/utils/format';

function Toggle({ on, onChange, label, desc, I }: { on: boolean; onChange: (v: boolean) => void; label: string; desc: string; I: typeof Eye }) {
  return (
    <button role="switch" aria-checked={on} onClick={() => onChange(!on)} className="flex min-h-[60px] w-full items-center gap-3 px-4 py-3 text-left">
      <I size={20} strokeWidth={1.5} className="text-gold-200" aria-hidden />
      <span className="flex-1"><span className="block">{label}</span><span className="text-xs text-fg-soft">{desc}</span></span>
      <span className={cn('relative h-7 w-12 rounded-pill transition-colors', on ? 'bg-gold-metal' : 'bg-white/15')}><span className={cn('absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all', on ? 'left-6' : 'left-1')} /></span>
    </button>
  );
}
function Row({ href, I, label, value }: { href: string; I: typeof Eye; label: string; value?: string }) {
  return <Link href={href} className="flex min-h-[56px] items-center gap-3 px-4"><I size={20} strokeWidth={1.5} className="text-gold-200" aria-hidden /><span className="flex-1">{label}</span>{value && <span className="text-sm text-fg-soft">{value}</span>}<ChevronRight size={18} className="text-fg-soft" aria-hidden /></Link>;
}
const PRIV = { publico: 'Público', amigos: 'Amigos', 'so-eu': 'Só eu' } as const;

export default function Perfil() {
  const user = useAurea((s) => s.user); const privacy = useAurea((s) => s.privacy); const rt = useAurea((s) => s.reduceTransparency); const rm = useAurea((s) => s.reduceMotion);
  const setRt = useAurea((s) => s.setReduceTransparency); const setRm = useAurea((s) => s.setReduceMotion); const logout = useAurea((s) => s.logout); const reset = useAurea((s) => s.reset); const toast = useAurea((s) => s.toast);
  const router = useRouter(); const lvl = levelOf(user.points);
  return (
    <Screen title="Perfil" className="space-y-5">
      <GlassPanel variant="strong" refraction specular radius="lg" className="flex items-center gap-4 p-5">
        <Avatar name={user.name} hue={user.hue} level={user.level} size={68} />
        <div className="min-w-0"><p className="font-serif text-2xl">{user.name}</p><p className="text-sm text-fg-soft">{user.handle} · CPF {user.cpf}</p><Link href="/score" className="mt-1 inline-block text-sm text-fg-gold">Nível {lvl.name} →</Link></div>
      </GlassPanel>
      <GlassPanel className="divide-y divide-white/5">
        <Row href="/assessor" I={Bot} label="Assessor e automações" /><Row href="/grupos" I={Users} label="Grupos" /><Row href="/extrato" I={FileText} label="Extrato" /><Row href="/cartao" I={CreditCard} label="Cartão" /><Row href="/ouro" I={Gem} label="Ouro digital" /><Row href="/score" I={Sparkles} label="Score e níveis" /><Row href="/social" I={Users} label="Privacidade do feed" value={PRIV[privacy]} />
      </GlassPanel>
      <section aria-labelledby="ac"><h2 id="ac" className="mb-2 px-1 font-serif text-xl">Aparência e acessibilidade</h2>
        <GlassPanel className="divide-y divide-white/5">
          <Toggle I={Eye} on={rt} onChange={setRt} label="Reduzir transparência" desc="Troca o vidro por superfícies sólidas escuras." />
          <Toggle I={Wind} on={rm} onChange={setRm} label="Reduzir movimento" desc="Desliga ondas, partículas e transições." />
          <div className="flex min-h-[60px] items-center gap-3 px-4"><Moon size={20} strokeWidth={1.5} className="text-gold-200" aria-hidden /><span className="flex-1">Tema</span><span className="text-sm text-fg-soft">Escuro (ouro)</span></div>
        </GlassPanel>
      </section>
      <section aria-labelledby="sg"><h2 id="sg" className="mb-2 px-1 font-serif text-xl">Segurança</h2>
        <GlassPanel className="divide-y divide-white/5">
          <button onClick={() => toast({ title: 'Biometria ativa', body: 'Login por digital habilitado (simulado).', tone: 'gold' })} className="flex min-h-[56px] w-full items-center gap-3 px-4 text-left"><Shield size={20} strokeWidth={1.5} className="text-gold-200" /><span className="flex-1">Biometria e senha</span><ChevronRight size={18} className="text-fg-soft" /></button>
          <button onClick={() => { reset(); toast({ title: 'Dados de demonstração restaurados', tone: 'gold' }); }} className="flex min-h-[56px] w-full items-center gap-3 px-4 text-left"><RotateCcw size={20} strokeWidth={1.5} className="text-gold-200" /><span className="flex-1">Restaurar dados fictícios</span></button>
          <button onClick={() => { logout(); router.replace('/login'); }} className="flex min-h-[56px] w-full items-center gap-3 px-4 text-left text-danger"><LogOut size={20} strokeWidth={1.5} /><span className="flex-1">Sair</span></button>
        </GlassPanel>
      </section>
      <p className="px-1 text-xs leading-relaxed text-fg-soft"><Link href="/design-system" className="text-fg-gold">Ver design system</Link> · Áurea é uma fintech independente. Conta, Pix e ouro digital seriam operados por parceiros autorizados (BaaS); neste protótipo nada é real.</p>
    </Screen>
  );
}

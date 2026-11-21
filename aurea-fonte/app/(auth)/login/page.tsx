'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { Eye, EyeOff, Fingerprint } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { GlassButton, GlassPanel, GoldButton } from '@/components/glass';
import { useAurea } from '@/lib/store/aurea';
import { isValidCPF, maskCPF } from '@/lib/utils/cpf';

function FingerprintScan({ onDone }: { onDone: () => void }) {
  return (
    <motion.div className="absolute inset-0 z-50 grid place-items-center bg-black/70 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="status" aria-label="Lendo biometria">
      <div className="flex flex-col items-center gap-6">
        <div className="relative grid h-36 w-36 place-items-center rounded-full border border-gold-200/30">
          <Fingerprint size={88} strokeWidth={1} className="text-white/15" aria-hidden />
          <motion.div className="absolute inset-0 grid place-items-center" initial={{ clipPath: 'inset(100% 0 0 0)' }} animate={{ clipPath: 'inset(0% 0 0 0)' }} transition={{ duration: 1.4, ease: 'easeInOut' }} onAnimationComplete={() => setTimeout(onDone, 250)}>
            <Fingerprint size={88} strokeWidth={1.2} className="text-gold-200 drop-shadow-[0_0_12px_rgba(245,215,122,.8)]" aria-hidden />
          </motion.div>
          <motion.span className="absolute inset-x-6 h-0.5 bg-gold-200 shadow-[0_0_12px_rgba(245,215,122,1)]" initial={{ top: '85%' }} animate={{ top: '15%' }} transition={{ duration: 1.4, ease: 'easeInOut' }} />
        </div>
        <p className="text-sm text-fg-soft">Reconhecendo digital…</p>
      </div>
    </motion.div>
  );
}

export default function Login() {
  const router = useRouter(); const login = useAurea((s) => s.login);
  const [cpf, setCpf] = useState(''); const [pw, setPw] = useState(''); const [show, setShow] = useState(false);
  const [err, setErr] = useState<{ cpf?: string; pw?: string }>({}); const [loading, setLoading] = useState(false); const [bio, setBio] = useState(false);
  const enter = () => { login(); router.replace('/home'); };
  const submit = (e: React.FormEvent) => {
    e.preventDefault(); const n: typeof err = {};
    if (!isValidCPF(cpf)) n.cpf = 'CPF inválido. Confira os 11 dígitos.';
    if (pw.length < 6) n.pw = 'A senha tem pelo menos 6 caracteres.';
    setErr(n); if (Object.keys(n).length) return;
    setLoading(true); setTimeout(enter, 900);
  };
  return (
    <main className="flex h-full flex-col justify-center px-6">
      <div className="mb-10 text-center">
        <p className="font-serif text-5xl text-gold-metal">Áurea</p>
        <p className="mt-2 text-fg-soft">Entre na sua conta</p>
      </div>
      <GlassPanel variant="strong" refraction specular radius="lg" className="p-5">
        <form onSubmit={submit} noValidate className="space-y-4">
          <div>
            <label htmlFor="cpf" className="mb-1.5 block text-sm text-fg-soft">CPF</label>
            <input id="cpf" inputMode="numeric" autoComplete="username" value={cpf} onChange={(e) => setCpf(maskCPF(e.target.value))} placeholder="000.000.000-00" aria-invalid={!!err.cpf} aria-describedby="cpf-err"
              className="h-12 w-full rounded-sm border border-[var(--glass-border)] bg-black/30 px-4 text-lg tabular outline-none placeholder:text-white/25 focus:border-gold-300" />
            {err.cpf && <p id="cpf-err" className="mt-1 text-xs text-danger">{err.cpf}</p>}
          </div>
          <div>
            <label htmlFor="pw" className="mb-1.5 block text-sm text-fg-soft">Senha</label>
            <div className="relative">
              <input id="pw" type={show ? 'text' : 'password'} autoComplete="current-password" value={pw} onChange={(e) => setPw(e.target.value)} aria-invalid={!!err.pw} aria-describedby="pw-err"
                className="h-12 w-full rounded-sm border border-[var(--glass-border)] bg-black/30 px-4 pr-12 text-lg outline-none focus:border-gold-300" />
              <button type="button" onClick={() => setShow(!show)} aria-label={show ? 'Ocultar senha' : 'Mostrar senha'} className="touch absolute right-0 top-0 grid h-12 place-items-center text-fg-soft">{show ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}</button>
            </div>
            {err.pw && <p id="pw-err" className="mt-1 text-xs text-danger">{err.pw}</p>}
          </div>
          <GoldButton type="submit" block size="lg" loading={loading}>Entrar</GoldButton>
        </form>
      </GlassPanel>
      <GlassButton block className="mt-4" onClick={() => setBio(true)}><Fingerprint size={18} strokeWidth={1.5} /> Entrar com biometria</GlassButton>
      <button onClick={() => { setCpf('123.456.789-09'); setPw('ouro123'); setErr({}); }} className="touch mx-auto mt-4 block text-sm text-fg-gold underline-offset-4 hover:underline">Preencher dados de demonstração</button>
      <p className="mt-8 text-center text-[11px] text-fg-soft/80">Protótipo — dados fictícios</p>
      <AnimatePresence>{bio && <FingerprintScan onDone={enter} />}</AnimatePresence>
    </main>
  );
}

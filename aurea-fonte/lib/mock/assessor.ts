export type AutoScope = 'pessoal' | 'negocio';
export type AutoTrigger = 'salario' | 'venda' | 'semanal' | 'vencimento' | 'gasto-alto' | 'mensal';
export interface Automation {
  id: string; scope: AutoScope; trigger: AutoTrigger; title: string; detail: string; active: boolean;
  /** quantas vezes rodou e quanto movimentou (simulado) */
  runs: number; moved: number; lastRun?: string;
}
export interface Reminder { id: string; title: string; amount?: number; due: string; paid: boolean; scope: AutoScope; recurring?: boolean }
export interface Charge { id: string; client: string; amount: number; due: string; status: 'aberta' | 'paga' | 'atrasada'; remindersSent: number }

const d = (n: number) => { const x = new Date(); x.setDate(x.getDate() + n); x.setHours(9, 0, 0, 0); return x.toISOString(); };

export const AUTOMATIONS: Automation[] = [
  { id: 'a1', scope: 'pessoal', trigger: 'salario', title: 'Salário caiu → guardar 10%', detail: 'Assim que o salário entra, 10% vai para o cofre Viagem Lisboa.', active: true, runs: 6, moved: 4080, lastRun: d(-6) },
  { id: 'a2', scope: 'pessoal', trigger: 'semanal', title: 'Resumo da semana no WhatsApp', detail: 'Todo domingo às 19h: quanto gastou, guardou e como estão as barras.', active: true, runs: 14, moved: 0, lastRun: d(-2) },
  { id: 'a3', scope: 'pessoal', trigger: 'vencimento', title: 'Avisar 2 dias antes de cada conta', detail: 'Lembrete com botão para pagar em 1 toque.', active: true, runs: 9, moved: 0, lastRun: d(-1) },
  { id: 'a4', scope: 'pessoal', trigger: 'gasto-alto', title: 'Alerta de gasto fora do padrão', detail: 'Avisa quando uma categoria passa 30% da sua média.', active: false, runs: 2, moved: 0 },
  { id: 'n1', scope: 'negocio', trigger: 'venda', title: 'Venda recebida → separar imposto', detail: '6% de cada venda vai para o cofre “Impostos (DAS)”.', active: true, runs: 38, moved: 1284.6, lastRun: d(-1) },
  { id: 'n2', scope: 'negocio', trigger: 'mensal', title: 'Pró-labore todo dia 5', detail: 'Transfere R$ 3.000 da conta do negócio para a pessoal.', active: true, runs: 4, moved: 12000, lastRun: d(-16) },
  { id: 'n3', scope: 'negocio', trigger: 'vencimento', title: 'Cobrar cliente atrasado', detail: 'Manda lembrete educado com link Pix 1, 3 e 7 dias após o vencimento.', active: true, runs: 11, moved: 0, lastRun: d(-3) },
  { id: 'n4', scope: 'negocio', trigger: 'semanal', title: 'Fluxo de caixa da semana', detail: 'Toda segunda: entradas, saídas, a receber e saldo projetado do negócio.', active: false, runs: 0, moved: 0 },
];

export const REMINDERS: Reminder[] = [
  { id: 'r1', title: 'Conta de luz', amount: 182.4, due: d(2), paid: false, scope: 'pessoal', recurring: true },
  { id: 'r2', title: 'Internet', amount: 119.9, due: d(5), paid: false, scope: 'pessoal', recurring: true },
  { id: 'r3', title: 'DAS MEI', amount: 75.9, due: d(8), paid: false, scope: 'negocio', recurring: true },
  { id: 'r4', title: 'Fornecedor — embalagens', amount: 640, due: d(11), paid: false, scope: 'negocio' },
  { id: 'r5', title: 'Aniversário da Ana — presente', due: d(4), paid: false, scope: 'pessoal' },
];

export const CHARGES: Charge[] = [
  { id: 'c1', client: 'Padaria Pão Dourado', amount: 850, due: d(-4), status: 'atrasada', remindersSent: 2 },
  { id: 'c2', client: 'Studio Norte', amount: 2400, due: d(3), status: 'aberta', remindersSent: 0 },
  { id: 'c3', client: 'Clínica Vida', amount: 1200, due: d(-10), status: 'paga', remindersSent: 1 },
  { id: 'c4', client: 'Café Aroma', amount: 390, due: d(7), status: 'aberta', remindersSent: 0 },
];

export const BUSINESS = { name: 'Doces da Marina', cnpj: '**.512.330/0001-**', balance: 5320.18, monthIn: 9840, monthOut: 4215.5, taxVault: 1284.6 };

export const AUTOMATION_TEMPLATES: Omit<Automation, 'id' | 'runs' | 'moved' | 'active'>[] = [
  { scope: 'pessoal', trigger: 'semanal', title: 'Guardar R$ 50 toda sexta', detail: 'Arredonda sua semana: R$ 50 vão para o cofre que estiver mais perto da meta.' },
  { scope: 'pessoal', trigger: 'gasto-alto', title: 'Arredondar compras', detail: 'Cada compra no cartão é arredondada e o troco vai para um cofre.' },
  { scope: 'negocio', trigger: 'venda', title: 'Reserva de capital de giro', detail: '5% de cada venda vai para o cofre “Capital de giro”.' },
  { scope: 'negocio', trigger: 'mensal', title: 'Relatório mensal para o contador', detail: 'Dia 1 envia extrato e notas do negócio para o e-mail do contador.' },
];

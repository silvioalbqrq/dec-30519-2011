/**
 * Design: Caderno Fiscal Cearense — editorial institucional contemporâneo.
 * Este arquivo prioriza rastreabilidade visual, azul-petróleo #0E4A69,
 * painéis claros e memória de cálculo explícita para um fluxo de conferência.
 */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BadgeCheck,
  BookOpen,
  Calculator,
  Check,
  ClipboardCheck,
  Copy,
  ExternalLink,
  FileText,
  Info,
  Landmark,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type Perfil = "atacadista" | "varejista";
type Origem = "proprio" | "norte" | "sul";
type Produto = "basica7" | "alcool972" | "basica12" | "geral20" | "alcool25" | "geral28";
type Tela = "comercio" | "industria" | "tabela";

type ValoresDocumento = {
  produtos: string;
  ipi: string;
  frete: string;
  seguro: string;
  outros: string;
};

type Resultado = {
  baseDocumental: number;
  baseAplicavel: number;
  cargaBase: number;
  acrescimoSimples: number;
  cargaFinal: number;
  icmsSt: number;
  fecopRate: number;
  fecop: number;
  total: number;
  hasTransferencia: boolean;
  hasFidelidade: boolean;
} | null;

const ANEXO_III: Record<Perfil, Record<Produto, Record<Origem, number>>> = {
  atacadista: {
    basica7: { proprio: 2.96, norte: 5.5, sul: 7.25 },
    alcool972: { proprio: 2.82, norte: 10.05, sul: 12.83 },
    basica12: { proprio: 5.08, norte: 9.42, sul: 12.42 },
    geral20: { proprio: 8, norte: 19.71, sul: 21 },
    alcool25: { proprio: 7.26, norte: 25.85, sul: 33 },
    geral28: { proprio: 11.2, norte: 30.39, sul: 37.8 },
  },
  varejista: {
    basica7: { proprio: 1.54, norte: 4.2, sul: 5.95 },
    alcool972: { proprio: 2.82, norte: 10.05, sul: 12.83 },
    basica12: { proprio: 2.64, norte: 7.2, sul: 10.2 },
    geral20: { proprio: 8, norte: 19.71, sul: 21 },
    alcool25: { proprio: 7.26, norte: 25.85, sul: 33 },
    geral28: { proprio: 11.2, norte: 30.39, sul: 37.8 },
  },
};

const PRODUTOS: Array<{ chave: Produto; titulo: string; detalhe: string }> = [
  { chave: "basica7", titulo: "7%", detalhe: "Cesta básica" },
  { chave: "alcool972", titulo: "9,72%", detalhe: "Álcool/gel não antisséptico, até 1 L" },
  { chave: "basica12", titulo: "12%", detalhe: "Cesta básica" },
  { chave: "geral20", titulo: "20%", detalhe: "Alíquota geral" },
  { chave: "alcool25", titulo: "25%", detalhe: "Álcool/gel não antisséptico, até 1 L" },
  { chave: "geral28", titulo: "28%", detalhe: "Alíquota específica" },
];

const ORIGENS: Array<{ chave: Origem; titulo: string; fecop: number; simples: number }> = [
  { chave: "proprio", titulo: "Próprio Estado (CE) ou exterior do País", fecop: 2.58, simples: 3 },
  { chave: "norte", titulo: "Norte, Nordeste, Centro-Oeste ou Espírito Santo", fecop: 3, simples: 6 },
  { chave: "sul", titulo: "Sul e Sudeste, exceto Espírito Santo", fecop: 3.2, simples: 4 },
];

const VALORES_INICIAIS: ValoresDocumento = {
  produtos: "",
  ipi: "",
  frete: "",
  seguro: "",
  outros: "",
};

const moeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
});

const percentual = (valor: number) =>
  `${valor.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;

function paraNumero(valor: string) {
  const limpo = valor.trim();
  if (!limpo) return 0;
  const normalizado = limpo.includes(",")
    ? limpo.replace(/\./g, "").replace(",", ".")
    : limpo.replace(/[^\d.-]/g, "");
  const numero = Number(normalizado);
  return Number.isFinite(numero) && numero > 0 ? numero : 0;
}

function linhaDeOrigem(origem: Origem) {
  return ORIGENS.find((item) => item.chave === origem) ?? ORIGENS[0];
}

function CampoMonetario({
  id,
  label,
  descricao,
  value,
  onChange,
  required = false,
}: {
  id: keyof ValoresDocumento;
  label: string;
  descricao?: string;
  value: string;
  onChange: (id: keyof ValoresDocumento, value: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block" htmlFor={id}>
      <span className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-[#15465f]">
        {label}
        {required && <span className="text-[#14629A]">*</span>}
      </span>
      {descricao && <span className="mb-2 block text-xs leading-5 text-slate-500">{descricao}</span>}
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm font-medium text-slate-400">R$</span>
        <Input
          id={id}
          value={value}
          onChange={(event) => onChange(id, event.target.value)}
          inputMode="decimal"
          placeholder="0,00"
          className="h-11 border-slate-200 bg-white pl-10 text-[15px] font-medium text-slate-800 shadow-sm transition focus-visible:border-[#14629A] focus-visible:ring-[#14629A]/20"
        />
      </div>
    </label>
  );
}

function BlocoOpcoes({
  id,
  titulo,
  descricao,
  ativo,
  onChange,
  destaque,
}: {
  id: string;
  titulo: string;
  descricao: string;
  ativo: boolean;
  onChange: (ativo: boolean) => void;
  destaque?: string;
}) {
  return (
    <label
      htmlFor={id}
      className={`group flex cursor-pointer items-start gap-3 rounded-xl border px-3.5 py-3 transition ${
        ativo
          ? "border-[#14629A]/35 bg-[#eff7fb] shadow-[0_6px_18px_rgba(18,98,154,0.07)]"
          : "border-slate-200 bg-white hover:border-[#14629A]/25 hover:bg-[#f9fcfe]"
      }`}
    >
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-slate-300 bg-white transition group-has-[:checked]:border-[#14629A] group-has-[:checked]:bg-[#14629A]">
        <input
          id={id}
          checked={ativo}
          onChange={(event) => onChange(event.target.checked)}
          type="checkbox"
          className="peer sr-only"
        />
        <Check className="h-3.5 w-3.5 text-white opacity-0 transition peer-checked:opacity-100" strokeWidth={3} />
      </span>
      <span className="min-w-0">
        <span className="flex flex-wrap items-center gap-2 text-sm font-semibold text-[#15465f]">
          {titulo}
          {destaque && <span className="rounded-full bg-[#dceef9] px-2 py-0.5 text-[10px] font-bold tracking-[0.08em] text-[#14629A]">{destaque}</span>}
        </span>
        <span className="mt-0.5 block text-xs leading-5 text-slate-500">{descricao}</span>
      </span>
    </label>
  );
}

export default function Home() {
  const [tela, setTela] = useState<Tela>("comercio");
  const [perfil, setPerfil] = useState<Perfil>("atacadista");
  const [origem, setOrigem] = useState<Origem>("proprio");
  const [produto, setProduto] = useState<Produto>("geral20");
  const [valores, setValores] = useState<ValoresDocumento>(VALORES_INICIAIS);
  const [simples, setSimples] = useState(false);
  const [transferencia, setTransferencia] = useState(false);
  const [fidelidade, setFidelidade] = useState(false);
  const [incluirFecop, setIncluirFecop] = useState(true);
  const [cargaIndustria, setCargaIndustria] = useState("8");
  const [resultado, setResultado] = useState<Resultado>(null);

  useEffect(() => {
    const bloquearAtalhosTecnicos = (event: KeyboardEvent) => {
      const tecla = event.key.toLowerCase();
      const comControle = event.ctrlKey || event.metaKey;
      const tentativaDeInspecao =
        event.key === "F12" ||
        (comControle && event.shiftKey && ["i", "j", "c"].includes(tecla)) ||
        (comControle && ["u", "s"].includes(tecla));

      if (tentativaDeInspecao) {
        event.preventDefault();
        toast.info("A calculadora permite copiar o conteúdo visível. Os atalhos de inspeção foram desativados nesta interface.");
      }
    };

    const contexto = (event: MouseEvent) => {
      const selecao = window.getSelection()?.toString().trim();
      if (!selecao) event.preventDefault();
    };

    document.addEventListener("keydown", bloquearAtalhosTecnicos);
    document.addEventListener("contextmenu", contexto);
    return () => {
      document.removeEventListener("keydown", bloquearAtalhosTecnicos);
      document.removeEventListener("contextmenu", contexto);
    };
  }, []);

  const baseRate = useMemo(() => ANEXO_III[perfil][produto][origem], [perfil, produto, origem]);
  const origemSelecionada = linhaDeOrigem(origem);
  const isIndustria = tela === "industria";
  const produtoSelecionado = PRODUTOS.find((item) => item.chave === produto) ?? PRODUTOS[3];

  const atualizarValor = (id: keyof ValoresDocumento, value: string) => {
    setValores((anterior) => ({ ...anterior, [id]: value }));
  };

  const calcular = () => {
    const baseDocumental = Object.values(valores).reduce((soma, valor) => soma + paraNumero(valor), 0);
    if (baseDocumental <= 0) {
      toast.error("Informe ao menos o valor dos produtos para calcular a estimativa.");
      return;
    }

    const cargaSemAjuste = isIndustria ? paraNumero(cargaIndustria) : baseRate;
    const cargaComFidelidade = fidelidade ? cargaSemAjuste * 0.865 : cargaSemAjuste;
    const acrescimoSimples = simples ? origemSelecionada.simples : 0;
    const cargaFinal = cargaComFidelidade + acrescimoSimples;
    const baseAplicavel = transferencia ? baseDocumental * 1.8 : baseDocumental;
    const icmsSt = baseAplicavel * (cargaFinal / 100);
    const fecopRate = incluirFecop ? origemSelecionada.fecop : 0;
    const fecop = baseAplicavel * (fecopRate / 100);

    setResultado({
      baseDocumental,
      baseAplicavel,
      cargaBase: cargaSemAjuste,
      acrescimoSimples,
      cargaFinal,
      icmsSt,
      fecopRate,
      fecop,
      total: icmsSt + fecop,
      hasTransferencia: transferencia,
      hasFidelidade: fidelidade,
    });
    toast.success("Memória de cálculo atualizada.");
  };

  const limpar = () => {
    setValores(VALORES_INICIAIS);
    setSimples(false);
    setTransferencia(false);
    setFidelidade(false);
    setIncluirFecop(true);
    setCargaIndustria("8");
    setResultado(null);
    toast.message("Campos restaurados para a configuração inicial.");
  };

  const copiarMemoria = async () => {
    if (!resultado) return;
    const linhas = [
      "Calculadora ICMS-ST — Decreto nº 30.519/2011 (CE)",
      `Cenário: ${isIndustria ? "Indústria fabricante" : perfil === "atacadista" ? "Atacadista (Anexo I)" : "Varejista (Anexo II)"}`,
      `Origem: ${origemSelecionada.titulo}`,
      `Base documental: ${moeda.format(resultado.baseDocumental)}`,
      `Carga líquida aplicada: ${percentual(resultado.cargaFinal)}`,
      `ICMS-ST estimado: ${moeda.format(resultado.icmsSt)}`,
      `FECOP: ${moeda.format(resultado.fecop)}`,
      `Total estimado: ${moeda.format(resultado.total)}`,
      "Estimativa sujeita à conferência da legislação e do enquadramento fiscal vigentes.",
    ];
    await navigator.clipboard.writeText(linhas.join("\n"));
    toast.success("Memória de cálculo copiada.");
  };

  const textoFormula = isIndustria
    ? "Base documental × carga líquida da indústria"
    : "Base documental × percentual do Anexo III";

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f4f8fb] text-slate-800">
      <header
        className="relative isolate overflow-hidden border-b border-[#0b4564] bg-[#0e4a69] text-white"
        style={{
          backgroundImage:
            "linear-gradient(105deg, rgba(9,62,90,0.93) 0%, rgba(17,95,145,0.9) 100%), url('/manus-storage/icms-st-hero-texture_babc1c48.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(177,222,241,0.16),transparent_26%),radial-gradient(circle_at_86%_20%,rgba(255,255,255,0.12),transparent_24%)]" />
        <div className="relative mx-auto flex min-h-[188px] max-w-6xl flex-col justify-center px-5 py-7 sm:px-8 lg:px-10">
          <div className="mb-3 flex items-center justify-center gap-3">
            <img
              src="/manus-storage/icms-st-mark_813d8852.png"
              alt="Marca gráfica da calculadora"
              className="h-10 w-10 rounded-xl bg-white/10 p-1.5 shadow-lg ring-1 ring-white/25"
            />
            <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.13em] text-sky-100">
              Ceará · ICMS-ST
            </span>
          </div>
          <h1 className="text-center font-display text-[28px] font-extrabold tracking-[-0.035em] sm:text-[34px]">
            Calculadora ICMS-ST <span className="font-medium text-sky-100">| Autopeças</span>
          </h1>
          <p className="mx-auto mt-2 max-w-3xl text-center text-[14px] leading-6 text-sky-50/95 sm:text-[15px]">
            Estimativa com carga líquida para peças, componentes e acessórios para veículos, conforme o Decreto nº 30.519/2011.
          </p>
          <div className="mx-auto mt-4 flex items-center gap-2 text-xs text-sky-100/90">
            <ShieldCheck className="h-4 w-4" />
            <span>Memória de cálculo visível · parâmetros conferíveis</span>
          </div>
        </div>
      </header>

      <main
        className="relative bg-[#f4f8fb] pb-14 pt-7 sm:pt-9"
        style={{
          backgroundImage:
            "linear-gradient(rgba(244,248,251,0.92), rgba(244,248,251,0.96)), url('/manus-storage/icms-st-paper-texture_e82d188c.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <Tabs value={tela} onValueChange={(value) => setTela(value as Tela)} className="w-full">
              <TabsList className="grid h-auto w-full grid-cols-3 gap-1.5 rounded-2xl bg-transparent p-0">
                <TabsTrigger value="comercio" className="tab-fiscal min-h-14 px-2 text-xs sm:text-sm">
                  <Landmark className="hidden h-4 w-4 sm:block" />
                  Atacadista / Varejista
                </TabsTrigger>
                <TabsTrigger value="industria" className="tab-fiscal min-h-14 px-2 text-xs sm:text-sm">
                  <Calculator className="hidden h-4 w-4 sm:block" />
                  Indústria (fabricante)
                </TabsTrigger>
                <TabsTrigger value="tabela" className="tab-fiscal min-h-14 px-2 text-xs sm:text-sm">
                  <BookOpen className="hidden h-4 w-4 sm:block" />
                  Tabela Anexo III
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {tela === "tabela" ? (
            <section className="fiscal-panel mt-6 overflow-hidden sm:mt-7" aria-labelledby="titulo-tabela">
              <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-7">
                <div>
                  <div className="section-kicker">Referência parametrizada</div>
                  <h2 id="titulo-tabela" className="mt-1 font-display text-xl font-bold tracking-[-0.02em] text-[#123e55]">
                    Carga líquida da ST conforme a origem
                  </h2>
                  <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">
                    Percentuais do Anexo III, redação indicada como atualizada pelo Decreto nº 35.807/2023. Aplique apenas após validar o enquadramento da mercadoria.
                  </p>
                </div>
                <div className="rounded-xl border border-[#cfe4f0] bg-[#f2f9fd] px-3 py-2 text-xs font-semibold text-[#14629A]">
                  Origem selecionada: {origemSelecionada.titulo}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[820px] border-collapse text-left text-sm">
                  <thead className="bg-[#f7fafc] text-xs uppercase tracking-[0.06em] text-slate-500">
                    <tr>
                      <th className="px-5 py-4 font-bold">Perfil</th>
                      <th className="px-5 py-4 font-bold">Carga interna</th>
                      <th className="px-5 py-4 font-bold">CE / Exterior</th>
                      <th className="px-5 py-4 font-bold">N, NE, CO ou ES</th>
                      <th className="px-5 py-4 font-bold">S / SE exceto ES</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(["atacadista", "varejista"] as Perfil[]).flatMap((perfilTabela) =>
                      PRODUTOS.map((item) => (
                        <tr key={`${perfilTabela}-${item.chave}`} className="transition hover:bg-[#f8fcfe]">
                          <td className="px-5 py-3.5 font-semibold text-[#164862]">
                            {perfilTabela === "atacadista" ? "Atacadista" : "Varejista"}
                          </td>
                          <td className="px-5 py-3.5 text-slate-600">
                            <span className="font-semibold text-slate-700">{item.titulo}</span> <span className="text-xs">· {item.detalhe}</span>
                          </td>
                          {(["proprio", "norte", "sul"] as Origem[]).map((origemTabela) => {
                            const emUso = perfilTabela === perfil && item.chave === produto && origemTabela === origem;
                            return (
                              <td key={origemTabela} className="px-5 py-3.5">
                                <span className={emUso ? "rounded-md bg-[#dceef9] px-2 py-1 font-bold text-[#14629A]" : "font-medium text-slate-600"}>
                                  {percentual(ANEXO_III[perfilTabela][item.chave][origemTabela])}
                                </span>
                              </td>
                            );
                          })}
                        </tr>
                      )),
                    )}
                  </tbody>
                </table>
              </div>
              <div className="border-t border-slate-200 bg-[#fbfdfe] px-5 py-4 text-xs leading-5 text-slate-500 sm:px-7">
                O Anexo III não substitui a análise de CNAE, produto, origem, regime especial, redução homologada ou alterações posteriores. Consulte a legislação vigente antes de escriturar ou recolher.
              </div>
            </section>
          ) : (
            <section className="fiscal-panel mt-6 sm:mt-7" aria-labelledby="titulo-calculo">
              <div className="border-b border-slate-200 px-5 pb-4 pt-5 sm:px-7 sm:pt-6">
                <div className="section-kicker">{isIndustria ? "Art. 1º, § 2º" : "Art. 2º · Anexo III"}</div>
                <div className="mt-1 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <h2 id="titulo-calculo" className="font-display text-xl font-bold tracking-[-0.02em] text-[#123e55]">
                      {isIndustria ? "Cálculo — Indústria fabricante" : "Cálculo — Atacadista ou Varejista"}
                    </h2>
                    <p className="mt-1.5 max-w-3xl text-sm leading-6 text-slate-500">
                      {isIndustria
                        ? "Operações internas de fabricante localizado no Ceará: a carga líquida padrão é 8%, sem prejuízo das demais verificações aplicáveis."
                        : "O imposto estimado resulta da aplicação da carga líquida do Anexo III sobre o valor do documento fiscal de entrada, incluídos IPI, frete/carreto, seguro e outros encargos."}
                    </p>
                  </div>
                  <div className="flex max-w-full shrink-0 items-center gap-2 rounded-lg bg-[#eff7fb] px-3 py-2 text-xs text-[#14506e]">
                    <Info className="h-4 w-4 shrink-0 text-[#14629A]" />
                    <span>{textoFormula}</span>
                  </div>
                </div>
              </div>

              <div className="border-b border-[#dce8ef] bg-[#fbfdfe] px-5 py-4 sm:px-7">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="section-kicker">Régua de cálculo</span>
                  <span className="text-[11px] font-semibold text-slate-400">Conferência em quatro etapas</span>
                </div>
                <ol className="calculation-rail" aria-label="Etapas da estimativa">
                  <li className="rail-step is-active"><span>01</span><strong>Base documental</strong></li>
                  <li className="rail-step"><span>02</span><strong>Carga líquida</strong></li>
                  <li className="rail-step"><span>03</span><strong>Adicionais / FECOP</strong></li>
                  <li className="rail-step"><span>04</span><strong>Resultado</strong></li>
                </ol>
              </div>

              <div className="grid lg:grid-cols-[minmax(0,1fr)_310px]">
                <form
                  className="ledger-surface p-5 sm:p-7"
                  onSubmit={(event) => {
                    event.preventDefault();
                    calcular();
                  }}
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    {!isIndustria && (
                      <label className="block sm:col-span-2" htmlFor="perfil">
                        <span className="mb-2 block text-sm font-semibold text-[#15465f]">Tipo de contribuinte</span>
                        <select
                          id="perfil"
                          value={perfil}
                          onChange={(event) => setPerfil(event.target.value as Perfil)}
                          className="field-fiscal h-11 w-full"
                        >
                          <option value="atacadista">Atacadista (Anexo I)</option>
                          <option value="varejista">Varejista (Anexo II)</option>
                        </select>
                      </label>
                    )}

                    <label className={`block ${isIndustria ? "sm:col-span-2" : "sm:col-span-2"}`} htmlFor="origem">
                      <span className="mb-2 block text-sm font-semibold text-[#15465f]">Origem da mercadoria</span>
                      <select
                        id="origem"
                        value={origem}
                        onChange={(event) => setOrigem(event.target.value as Origem)}
                        className="field-fiscal h-11 w-full"
                      >
                        {ORIGENS.map((item) => (
                          <option key={item.chave} value={item.chave}>{item.titulo}</option>
                        ))}
                      </select>
                    </label>

                    {!isIndustria ? (
                      <label className="block sm:col-span-2" htmlFor="produto">
                        <span className="mb-2 block text-sm font-semibold text-[#15465f]">Carga tributária efetiva / alíquota interna do produto</span>
                        <select
                          id="produto"
                          value={produto}
                          onChange={(event) => setProduto(event.target.value as Produto)}
                          className="field-fiscal h-11 w-full"
                        >
                          {PRODUTOS.map((item) => (
                            <option key={item.chave} value={item.chave}>{item.titulo} — {item.detalhe}</option>
                          ))}
                        </select>
                        <span className="mt-2 block text-xs leading-5 text-slate-500">
                          Percentual do Anexo III selecionado: <strong className="font-bold text-[#14629A]">{percentual(baseRate)}</strong>.
                        </span>
                      </label>
                    ) : (
                      <label className="block sm:col-span-2" htmlFor="carga-industria">
                        <span className="mb-2 block text-sm font-semibold text-[#15465f]">Carga líquida aplicável à indústria</span>
                        <div className="relative max-w-[260px]">
                          <Input
                            id="carga-industria"
                            value={cargaIndustria}
                            onChange={(event) => setCargaIndustria(event.target.value)}
                            inputMode="decimal"
                            className="h-11 border-slate-200 pr-9 font-semibold text-[#15465f] focus-visible:border-[#14629A] focus-visible:ring-[#14629A]/20"
                          />
                          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center font-semibold text-slate-400">%</span>
                        </div>
                        <span className="mt-2 block text-xs leading-5 text-slate-500">Padrão exibido: 8,00% nas operações internas, conforme art. 1º, § 2º.</span>
                      </label>
                    )}
                  </div>

                  <div className="my-7 border-t border-dashed border-slate-200" />

                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <div className="section-kicker">Valores da entrada</div>
                      <h3 className="mt-1 font-display text-lg font-bold text-[#123e55]">Composição da base documental</h3>
                    </div>
                    <span className="mb-1 text-xs text-slate-500">Use valores da nota fiscal</span>
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <CampoMonetario id="produtos" label="Valor dos produtos" descricao="Mercadorias constantes no documento fiscal." value={valores.produtos} onChange={atualizarValor} required />
                    <CampoMonetario id="ipi" label="IPI" descricao="Quando destacado e transferido ao destinatário." value={valores.ipi} onChange={atualizarValor} />
                    <CampoMonetario id="frete" label="Frete e carreto" descricao="Valores debitados ao estabelecimento." value={valores.frete} onChange={atualizarValor} />
                    <CampoMonetario id="seguro" label="Seguro" descricao="Valor de seguro transferido na operação." value={valores.seguro} onChange={atualizarValor} />
                    <CampoMonetario id="outros" label="Outros encargos" descricao="Demais despesas transferidas ao destinatário." value={valores.outros} onChange={atualizarValor} />
                  </div>

                  <div className="mt-6 grid gap-3">
                    <BlocoOpcoes
                      id="simples"
                      titulo="Remetente optante pelo Simples Nacional"
                      descricao={`Acrescenta ${percentual(origemSelecionada.simples)} à carga líquida conforme a origem, nos termos do art. 2º, § 2º.`}
                      ativo={simples}
                      onChange={setSimples}
                    />
                    <BlocoOpcoes
                      id="transferencia"
                      titulo="Entrada por transferência entre estabelecimentos"
                      descricao="Aplica acréscimo de 80% sobre a base documental, conforme art. 2º, § 4º, quando a hipótese for aplicável."
                      ativo={transferencia}
                      onChange={setTransferencia}
                    />
                    {!isIndustria && (
                      <BlocoOpcoes
                        id="fidelidade"
                        titulo="Contrato de fidelidade homologado"
                        descricao="Aplica redutor de 13,50% sobre a carga do Anexo III. Use somente com autorização da SEFAZ e condições atendidas."
                        ativo={fidelidade}
                        onChange={setFidelidade}
                        destaque="AUTORIZAÇÃO"
                      />
                    )}
                    <BlocoOpcoes
                      id="fecop"
                      titulo="Incluir adicional do FECOP"
                      descricao={`Calcula ${percentual(origemSelecionada.fecop)} em DAE próprio para a origem selecionada. Este adicional é apresentado separadamente na memória.`}
                      ativo={incluirFecop}
                      onChange={setIncluirFecop}
                    />
                  </div>

                  <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <Button type="button" variant="ghost" onClick={limpar} className="h-11 justify-center text-slate-500 hover:bg-slate-100 hover:text-[#15465f]">
                      <RotateCcw className="mr-2 h-4 w-4" /> Limpar campos
                    </Button>
                    <Button type="submit" className="btn-calcular h-11 px-5 text-sm font-bold shadow-[0_10px_20px_rgba(14,74,105,0.2)]">
                      <Calculator className="mr-2 h-4 w-4" /> Calcular estimativa
                    </Button>
                  </div>
                </form>

                <aside className="relative overflow-hidden border-t border-slate-200 bg-[#f6fbfe] p-5 sm:p-7 lg:border-l lg:border-t-0" aria-live="polite">
                  <img
                    src="/manus-storage/icms-st-result-pattern_536cd5cf.jpg"
                    alt=""
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-10 top-6 w-56 opacity-[0.11] mix-blend-multiply"
                  />
                  <div className="relative">
                    <div className="flex items-center justify-between gap-3">
                      <div className="section-kicker">Resultado</div>
                      <BadgeCheck className="h-5 w-5 text-[#14629A]" />
                    </div>
                    {resultado ? (
                      <>
                        <div className="mt-1 flex items-center gap-2">
                          <img src="/manus-storage/icms-st-mark_813d8852.png" alt="" aria-hidden="true" className="h-7 w-7 rounded-md bg-[#e6f2f8] p-1" />
                          <h3 className="font-display text-[21px] font-extrabold tracking-[-0.035em] text-[#123e55]">Memória de cálculo</h3>
                        </div>
                        <p className="mt-1 text-xs leading-5 text-slate-500">Rastro dos parâmetros que formaram a estimativa.</p>
                        <div className="mt-5 space-y-3">
                          <div className="memory-line"><span>Base documental</span><strong>{moeda.format(resultado.baseDocumental)}</strong></div>
                          {resultado.hasTransferencia && <div className="memory-line"><span>Acréscimo por transferência</span><strong>+ 80,00%</strong></div>}
                          <div className="memory-line"><span>Base aplicável</span><strong>{moeda.format(resultado.baseAplicavel)}</strong></div>
                          <div className="memory-line"><span>Carga do cenário</span><strong>{percentual(resultado.cargaBase)}</strong></div>
                          {resultado.hasFidelidade && <div className="memory-line"><span>Redutor de fidelidade</span><strong>− 13,50%</strong></div>}
                          {resultado.acrescimoSimples > 0 && <div className="memory-line"><span>Acréscimo Simples Nacional</span><strong>+ {percentual(resultado.acrescimoSimples)}</strong></div>}
                          <div className="memory-line border-b-0"><span>Carga final aplicada</span><strong className="text-[#14629A]">{percentual(resultado.cargaFinal)}</strong></div>
                        </div>

                        <div className="mt-6 rounded-2xl border border-[#b9d9ea] bg-white px-4 py-4 shadow-[0_10px_24px_rgba(14,74,105,0.08)]">
                          <span className="text-xs font-bold uppercase tracking-[0.1em] text-[#527386]">ICMS-ST estimado</span>
                          <div className="mt-1 font-display text-[30px] font-extrabold tracking-[-0.045em] text-[#0e4a69] [font-variant-numeric:tabular-nums]">
                            {moeda.format(resultado.icmsSt)}
                          </div>
                        </div>

                        <div className="mt-4 space-y-2.5">
                          <div className="memory-line"><span>FECOP {resultado.fecopRate > 0 ? `(${percentual(resultado.fecopRate)})` : "não incluído"}</span><strong>{moeda.format(resultado.fecop)}</strong></div>
                          <div className="flex items-center justify-between border-t border-[#cfe4f0] pt-3 text-sm font-bold text-[#15465f]"><span>Total estimado</span><strong className="text-base text-[#14629A]">{moeda.format(resultado.total)}</strong></div>
                        </div>

                        <Button onClick={copiarMemoria} variant="outline" className="mt-6 h-10 w-full border-[#bdd8e8] bg-white text-[#14629A] hover:bg-[#eaf5fb] hover:text-[#0e4a69]">
                          <Copy className="mr-2 h-4 w-4" /> Copiar memória
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="mt-1 flex items-center gap-2">
                          <img src="/manus-storage/icms-st-mark_813d8852.png" alt="" aria-hidden="true" className="h-7 w-7 rounded-md bg-[#e6f2f8] p-1" />
                          <h3 className="font-display text-[21px] font-extrabold tracking-[-0.035em] text-[#123e55]">Pronto para conferir</h3>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-slate-500">Preencha os valores da entrada e clique em <strong className="font-semibold text-[#15465f]">Calcular estimativa</strong>. Esta coluna já antecipa o rastro que será montado.</p>
                        <ol className="ledger-preview mt-5" aria-label="Estrutura da memória de cálculo">
                          <li><span>01</span><strong>Base documental</strong><em>aguardando valores</em></li>
                          <li><span>02</span><strong>Carga líquida</strong><em>Anexo III / indústria</em></li>
                          <li><span>03</span><strong>FECOP e adicionais</strong><em>conforme seleção</em></li>
                          <li><span>04</span><strong>Total estimado</strong><em>após cálculo</em></li>
                        </ol>
                        <div className="mt-5 border-l-2 border-[#9ec9df] bg-white/70 py-2 pl-3.5 pr-2">
                          <p className="text-xs leading-5 text-slate-500">A estimativa não substitui a conferência de CNAE, produto, regime especial, ato concessivo ou legislação vigente.</p>
                        </div>
                      </>
                    )}
                  </div>
                </aside>
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-200 bg-[#fbfdfe] px-5 py-4 text-xs leading-5 text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                <span className="flex items-center gap-2"><FileText className="h-4 w-4 text-[#14629A]" /> Cálculo orientativo com base nas informações declaradas.</span>
                <a className="inline-flex items-center gap-1.5 font-semibold text-[#14629A] underline-offset-4 hover:underline" href="https://sefazlegis.sefaz.ce.gov.br/api/openFile?id=d5e33d14-7888-4f67-8687-a18f4f657953" target="_blank" rel="noreferrer">
                  Consultar Decreto nº 30.519/2011 <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </section>
          )}

          <section className="mx-auto mt-6 max-w-4xl rounded-2xl border border-[#d8e7ef] bg-white/80 px-4 py-4 text-sm leading-6 text-slate-600 shadow-[0_8px_22px_rgba(29,76,104,0.04)] sm:px-5">
            <div className="flex items-start gap-3">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#14629A]" />
              <p><strong className="font-bold text-[#15465f]">Uso responsável:</strong> esta ferramenta gera uma estimativa e não emite DAE, não valida o enquadramento fiscal e não substitui orientação profissional. A cópia do conteúdo visível é permitida.</p>
            </div>
          </section>
        </section>
      </main>

      <footer className="border-t border-[#dce8ef] bg-white px-5 py-6 text-center text-xs leading-5 text-slate-500">
        <p className="font-semibold text-[#15465f]">Calculadora ICMS-ST · Autopeças · Ceará</p>
        <p className="mt-1">Referência normativa: Decreto nº 30.519/2011 e alterações posteriores. Versão informativa para conferência.</p>
      </footer>
    </div>
  );
}

/**
 * Configurações Oficiais de Produção - Cantinho da Dona Beth
 * Para alterar o telefone quando o chip novo chegar, edite `numeroWhatsAppAtivo` abaixo e faça o deploy.
 */
const numeroWhatsAppAtivo = '5548988044370';
const dataInauguracaoISO = '2026-12-01T08:00:00-03:00'; // 01 de Dezembro de 2026 às 08h
const ENDERECO_OFICIAL = 'R. Adelina Vargas Petzold, 118 Casa 2 - Bairro Nova Palhoça, Palhoça/SC';

let ultimaUrlWhatsAppGerada = '';

// Sanitização de segurança contra XSS
function sanitizarTexto(valor) {
  if (!valor) return '';
  return String(valor)
    .replace(/[<>'"&]/g, '')
    .trim()
    .slice(0, 120);
}

// Formatação amigável de telefone na tela
function formatarExibicaoTelefone(num) {
  const limpo = String(num).replace(/\D/g, '');
  if (limpo.length === 13 && limpo.startsWith('55')) {
    const ddd = limpo.slice(2, 4);
    const p1 = limpo.slice(4, 9);
    const p2 = limpo.slice(9, 13);
    return `+55 (${ddd}) ${p1}-${p2}`;
  }
  return `+${limpo}`;
}

function atualizarTextosTelefone() {
  const formatado = formatarExibicaoTelefone(numeroWhatsAppAtivo);
  const footerPhone = document.getElementById('footer-phone-display');
  if (footerPhone) {
    footerPhone.textContent = `WhatsApp: ${formatado}`;
  }
}

// Contador Regressivo Completo (Dias, Horas, Minutos e Segundos)
function atualizarContador() {
  const alvo = new Date(dataInauguracaoISO).getTime();
  const agora = new Date().getTime();
  const diff = alvo - agora;

  const elDays = document.getElementById('cd-days');
  const elHours = document.getElementById('cd-hours');
  const elMins = document.getElementById('cd-mins');
  const elSecs = document.getElementById('cd-secs');

  if (!elDays) return;

  if (diff <= 0) {
    elDays.textContent = '00';
    elHours.textContent = '00';
    elMins.textContent = '00';
    elSecs.textContent = '00';
    return;
  }

  const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const segs = Math.floor((diff % (1000 * 60)) / 1000);

  elDays.textContent = String(dias).padStart(2, '0');
  elHours.textContent = String(horas).padStart(2, '0');
  elMins.textContent = String(mins).padStart(2, '0');
  elSecs.textContent = String(segs).padStart(2, '0');
}

// Barra de Progresso de Vagas VIP
function atualizarBarraVagas(restantes) {
  const badge = document.getElementById('vagas-badge');
  const bar = document.getElementById('vagas-bar');
  if (badge) badge.textContent = `${restantes} de 20 disponíveis`;
  const preenchido = Math.min(100, Math.max(15, ((20 - restantes) / 20) * 100 + 55));
  if (bar) bar.style.width = `${preenchido}%`;
}

// Envio do Formulário VIP + Abertura do Modal com Cupom
function enviarParaListaVip(event) {
  event.preventDefault();

  const nome = sanitizarTexto(document.getElementById('vip-nome').value);
  const interesse = sanitizarTexto(document.getElementById('vip-interesse').value);
  const obs = sanitizarTexto(document.getElementById('vip-obs').value);

  if (!nome) return;

  const linhas = [
    `Olá, Dona Beth! 👋 Sou morador(a) aqui do *Nova Palhoça*!`,
    ``,
    `Quero entrar na *Lista VIP de Inauguração (01/12)* do *Cantinho da Dona Beth* para garantir meus *15% de desconto* + 1 pregação de botão de brinde! 🎁`,
    ``,
    `👤 *Meu nome:* ${nome}`,
    `🧵 *O que mais preciso:* ${interesse}`,
    obs ? `📝 *Detalhe da peça:* ${obs}` : null,
    `📍 *Endereço da Loja:* ${ENDERECO_OFICIAL}`,
    `🎟️ *Cupom:* DONABETH15`
  ].filter(Boolean);

  const textoCodificado = encodeURIComponent(linhas.join('\n'));
  ultimaUrlWhatsAppGerada = `https://wa.me/${numeroWhatsAppAtivo}?text=${textoCodificado}`;

  atualizarBarraVagas(6);
  const modal = document.getElementById('success-modal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }

  window.open(ultimaUrlWhatsAppGerada, '_blank', 'noopener,noreferrer');
}

function reabrirWhatsAppModal() {
  if (ultimaUrlWhatsAppGerada) {
    window.open(ultimaUrlWhatsAppGerada, '_blank', 'noopener,noreferrer');
  }
}

function fecharModalSucesso() {
  const modal = document.getElementById('success-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function copiarCupom() {
  navigator.clipboard.writeText('DONABETH15').then(() => {
    const msg = document.getElementById('copy-feedback');
    if (msg) {
      msg.textContent = '✅ Código DONABETH15 copiado com sucesso!';
      msg.classList.add('text-green-700', 'font-bold');
    }
  });
}

// Copiar endereço da loja
function copyAddress() {
  navigator.clipboard.writeText(ENDERECO_OFICIAL).then(() => {
    const btn = document.getElementById('btn-copy-address');
    if (!btn) return;
    const original = btn.innerHTML;
    btn.innerHTML = '✅ Endereço Copiado!';
    setTimeout(() => {
      btn.innerHTML = original;
    }, 2500);
  });
}

// Compartilhar com um vizinho no WhatsApp
function compartilharComVizinho() {
  const texto = [
    `Vizinhos do Nova Palhoça! 🧵✨`,
    `No dia *01 de Dezembro* inaugura aqui no nosso bairro o *Cantinho da Dona Beth — Costura, Lãs e Aviamentos* (barras de calça, troca de zíper, consertos de roupas e peças em tricô).`,
    ``,
    `📍 *Endereço:* ${ENDERECO_OFICIAL} (atendimento na edícula dos fundos).`,
    ``,
    `Quem entrar na Lista VIP antes da inauguração ganha *15% de desconto* no primeiro serviço! Garanta o seu cupom: ${window.location.href}`
  ].join('\n');

  const url = `https://wa.me/?text=${encodeURIComponent(texto)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

// Chamar direto no botão flutuante
function abrirWhatsAppDireto() {
  const msg = encodeURIComponent(
    `Olá, Dona Beth! Vi a página de inauguração do Cantinho da Dona Beth (${ENDERECO_OFICIAL}) e gostaria de tirar uma dúvida sobre costura/lãs.`
  );
  window.open(`https://wa.me/${numeroWhatsAppAtivo}?text=${msg}`, '_blank', 'noopener,noreferrer');
}

document.addEventListener('DOMContentLoaded', () => {
  atualizarTextosTelefone();
  atualizarContador();
  setInterval(atualizarContador, 1000);
});
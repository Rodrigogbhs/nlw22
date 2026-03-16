# > devroast 🔥

**cole seu código. leve um esporro.**

Uma ferramenta de revisão de código brutalmente honesta que pontua o seu código de 0 a 10 e entrega um roast (na faixa) baseado no que encontrar. Sem papas na língua. Sem troféu de participação.

---

## 🖥️ Demo

> *"esse código parece que foi escrito durante uma queda de luz... em 2005."*
> — devroast, nota: **3.5 / 10** · `needs_serious_help`

![Tela 1 - Entrada de Código](./screenshots/screen1.png)
![Tela 2 - Resultado do Roast](./screenshots/screen2.png)

---

## ✨ Funcionalidades

### 🧾 Entrada de Código
- Cole qualquer trecho de código no editor estilo terminal
- **Detecção automática de linguagem** (JavaScript, Python, SQL e mais)
- Contador de linhas e syntax highlighting

### 🔥 Nota do Roast
- Recebe uma **nota de 0 a 10** com um rótulo de severidade:
  - `godlike` — limpo, elegante, impressionante
  - `acceptable` — cumpre o que promete
  - `needs_work` — alguns problemas a resolver
  - `needs_serious_help` — nossa...
  - `what_is_this` — talvez considere outra carreira?
- Uma **frase de roast** personalizada que resume o veredito

### 🔍 Análise Detalhada
Cada roast inclui um diagnóstico completo:
| Categoria | Descrição |
|---|---|
| 🔴 Crítico | Problemas que precisam ser corrigidos agora |
| 🟡 Bom | O que você acertou (sim, existe) |
| 🔵 Sugestões | Melhorias que valem considerar |

### 🛠️ Correção Sugerida
- Exibe um **diff antes/depois** com a versão corrigida do seu código
- Linhas coloridas (vermelho = removido, verde = adicionado)

### 🏆 Leaderboard da Vergonha
- Um **ranking público** dos piores códigos já enviados
- Ordenado por nota crescente — quanto menor, mais famoso você fica
- Mostra linguagem, quantidade de linhas e o veredito do roast

### 🖼️ Gerador de Imagem para Compartilhar
- Gera uma **imagem compartilhável** com sua nota e a frase do roast
- Perfeito para postar no Twitter/X e exibir sua vergonha com orgulho

---

## 🛠️ Tecnologias Utilizadas

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js + TypeScript |
| Estilização | Tailwind CSS |
| Motor de IA | Claude API (Anthropic) |
| Imagens OG | `@vercel/og` |
| Deploy | Vercel |

---

## 🚀 Como Rodar Localmente

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/devroast.git
cd devroast

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local
# Adicione sua ANTHROPIC_API_KEY no .env.local

# Rode o projeto
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) e comece a levar esporro.

---

## 🔑 Variáveis de Ambiente

```env
ANTHROPIC_API_KEY=sua_chave_aqui
```

---

## 📁 Estrutura do Projeto

```
devroast/
├── app/
│   ├── page.tsx              # Tela de entrada do código
│   ├── roast/
│   │   └── page.tsx          # Tela de resultado do roast
│   ├── leaderboard/
│   │   └── page.tsx          # Leaderboard da vergonha
│   └── api/
│       ├── roast/route.ts    # Endpoint de análise com IA
│       └── og/route.tsx      # Geração de imagem OG
├── components/
│   ├── CodeEditor.tsx
│   ├── RoastScore.tsx
│   ├── ScoreBadge.tsx
│   └── Leaderboard.tsx
└── lib/
    └── prompt.ts             # Engenharia do prompt do roast
```

---

## 🧠 Como Funciona

1. O usuário cola o código no editor
2. O código é enviado para o endpoint `/api/roast`
3. O Claude analisa e retorna:
   - Uma nota numérica (0–10)
   - Um rótulo de severidade
   - Uma frase de roast
   - Diagnóstico detalhado dos problemas
   - Uma sugestão de correção
4. Os resultados são exibidos e opcionalmente adicionados ao leaderboard
5. Uma imagem OG é gerada para compartilhamento

---

## 📸 Capturas de Tela

| Tela | Descrição |
|---|---|
| Tela 1 | Entrada de código com editor e prévia do leaderboard |
| Tela 2 | Resultado completo com nota, análise e correção |
| Tela 3 | Leaderboard da vergonha ordenado por nota |
| Tela 4 | Imagem OG para compartilhamento |

---

## 🤝 Contribuindo

PRs são bem-vindos! Se você encontrar algum tipo de código ruim que o devroast não está destruindo com eficiência suficiente, melhore o prompt ou abra uma issue.

---

## 📄 Licença

MIT — faça o que quiser, só não me culpe pelos roasts.

---

<div align="center">
  <strong>> devroast</strong><br/>
  <em>seu código merece a verdade.</em>
</div>

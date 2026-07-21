const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType,
  LevelFormat, Header, Footer, TabStopType, TabStopPosition,
  PageBreak
} = require('/home/claude/.npm-global/lib/node_modules/docx');
const fs = require('fs');

// ── COLORS ──
const C_BLUE    = '1E3A5F';
const C_ACCENT  = '2563EB';
const C_LIGHT   = 'DBEAFE';
const C_MED     = '93C5FD';
const C_GREEN   = '166534';
const C_GLIGHT  = 'DCFCE7';
const C_ORANGE  = '92400E';
const C_OLIGHT  = 'FEF3C7';
const C_RED     = 'B91C1C';
const C_RLIGHT  = 'FEE2E2';
const C_GRAY    = 'F8FAFC';
const C_BORDER  = 'CBD5E1';
const WHITE     = 'FFFFFF';

const border = { style: BorderStyle.SINGLE, size: 1, color: C_BORDER };
const borders = { top: border, bottom: border, left: border, right: border };
const noBorder = { style: BorderStyle.NONE, size: 0, color: WHITE };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

function h(text, level, color = C_BLUE) {
  const sizes = { 1: 40, 2: 30, 3: 24 };
  const spacings = { 1: { before: 360, after: 120 }, 2: { before: 280, after: 100 }, 3: { before: 200, after: 80 } };
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: sizes[level], color, font: 'Arial' })],
    spacing: spacings[level],
  });
}

function p(runs, spacing = { before: 0, after: 160 }, align = AlignmentType.LEFT) {
  const children = typeof runs === 'string'
    ? [new TextRun({ text: runs, size: 22, font: 'Arial', color: '1E293B' })]
    : runs;
  return new Paragraph({ children, spacing, alignment: align });
}

function bold(text, color = '1E293B', size = 22) {
  return new TextRun({ text, bold: true, size, font: 'Arial', color });
}

function run(text, color = '1E293B', size = 22) {
  return new TextRun({ text, size, font: 'Arial', color });
}

function bullet(text, level = 0) {
  return new Paragraph({
    numbering: { reference: 'bullets', level },
    children: [new TextRun({ text, size: 22, font: 'Arial', color: '1E293B' })],
    spacing: { before: 40, after: 40 },
  });
}

function numbered(text, level = 0) {
  return new Paragraph({
    numbering: { reference: 'numbers', level },
    children: [new TextRun({ text, size: 22, font: 'Arial', color: '1E293B' })],
    spacing: { before: 40, after: 40 },
  });
}

function divider(color = C_ACCENT) {
  return new Paragraph({
    children: [],
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color } },
    spacing: { before: 80, after: 120 },
  });
}

function spacer() {
  return new Paragraph({ children: [new TextRun('')], spacing: { before: 0, after: 160 } });
}

function infoBox(label, value, labelColor, bgColor) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2000, 7360],
    rows: [new TableRow({ children: [
      new TableCell({
        borders,
        width: { size: 2000, type: WidthType.DXA },
        shading: { fill: bgColor, type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({ children: [bold(label, labelColor)], spacing: { before: 0, after: 0 } })]
      }),
      new TableCell({
        borders,
        width: { size: 7360, type: WidthType.DXA },
        shading: { fill: C_GRAY, type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({ children: [run(value)], spacing: { before: 0, after: 0 } })]
      }),
    ]})],
  });
}

function tableHeader(cols, widths, headerBg = C_BLUE) {
  return new TableRow({
    tableHeader: true,
    children: cols.map((col, i) =>
      new TableCell({
        borders,
        width: { size: widths[i], type: WidthType.DXA },
        shading: { fill: headerBg, type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({ children: [bold(col, WHITE)], spacing: { before: 0, after: 0 } })]
      })
    )
  });
}

function tableRow(cells, widths, bg = WHITE) {
  return new TableRow({
    children: cells.map((cell, i) =>
      new TableCell({
        borders,
        width: { size: widths[i], type: WidthType.DXA },
        shading: { fill: bg, type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({ children: [run(cell)], spacing: { before: 0, after: 0 } })]
      })
    )
  });
}

// ── COVER PAGE ──
const coverPage = [
  new Paragraph({ children: [], spacing: { before: 1440, after: 0 } }),
  new Paragraph({
    children: [new TextRun({ text: '✅  TaskFlow', bold: true, size: 72, font: 'Arial', color: C_ACCENT })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 200 },
  }),
  new Paragraph({
    children: [new TextRun({ text: 'Product Requirements Document (PRD)', size: 32, font: 'Arial', color: '475569' })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 120 },
  }),
  new Paragraph({
    children: [new TextRun({ text: 'Aplicativo de Gerenciamento de Tarefas com Autenticação', size: 26, font: 'Arial', color: '94A3B8', italics: true })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 800 },
  }),
  new Table({
    width: { size: 6000, type: WidthType.DXA },
    columnWidths: [3000, 3000],
    rows: [
      new TableRow({ children: [
        new TableCell({
          borders: noBorders,
          width: { size: 3000, type: WidthType.DXA },
          shading: { fill: C_LIGHT, type: ShadingType.CLEAR },
          margins: { top: 160, bottom: 160, left: 240, right: 240 },
          children: [
            new Paragraph({ children: [bold('Versão', C_ACCENT)], spacing: { before: 0, after: 40 } }),
            new Paragraph({ children: [run('v1.0.0', '1E293B', 24)], spacing: { before: 0, after: 0 } }),
          ]
        }),
        new TableCell({
          borders: noBorders,
          width: { size: 3000, type: WidthType.DXA },
          shading: { fill: C_LIGHT, type: ShadingType.CLEAR },
          margins: { top: 160, bottom: 160, left: 240, right: 240 },
          children: [
            new Paragraph({ children: [bold('Data', C_ACCENT)], spacing: { before: 0, after: 40 } }),
            new Paragraph({ children: [run('Junho 2026', '1E293B', 24)], spacing: { before: 0, after: 0 } }),
          ]
        }),
      ]}),
    ],
    float: { horizontalAnchor: 'text', absoluteHorizontalPosition: 1680 },
  }),
  new Paragraph({ children: [new PageBreak()] }),
];

// ── DOCUMENT BODY ──
const body = [

  // 1. VISÃO GERAL
  h('1. Visão Geral do Produto', 1),
  divider(),

  h('1.1 Objetivo', 2),
  p([run('O '), bold('TaskFlow'), run(' é um aplicativo web de gerenciamento de tarefas pessoais com sistema de autenticação. O projeto tem finalidade didática: demonstrar de forma concreta como front-end, back-end e banco de dados se comunicam em uma aplicação web moderna.')]),
  spacer(),

  h('1.2 Escopo', 2),
  p('O escopo inclui:'),
  bullet('Cadastro e login de usuários com senha criptografada'),
  bullet('Criação, leitura, atualização e remoção de tarefas (CRUD completo)'),
  bullet('Categorização por prioridade: Alta, Média e Baixa'),
  bullet('Filtros por status (pendente / concluída) e prioridade'),
  bullet('Persistência de sessão via token JWT no navegador'),
  bullet('API RESTful documentada e testável'),
  spacer(),

  h('1.3 Fora do Escopo (v1.0)', 2),
  bullet('Compartilhamento de tarefas entre usuários'),
  bullet('Notificações por e-mail ou push'),
  bullet('Aplicativo mobile nativo'),
  bullet('Integração com calendários externos'),
  spacer(),

  infoBox('Público-alvo', 'Desenvolvedores iniciantes que desejam aprender a comunicação entre as três camadas de uma aplicação web.', C_ACCENT, C_LIGHT),
  spacer(),
  spacer(),

  // 2. STACK
  h('2. Stack Tecnológica', 1),
  divider(),
  p('A escolha da stack priorizou simplicidade e ampla documentação para fins didáticos.'),
  spacer(),

  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2200, 2200, 2480, 2480],
    rows: [
      tableHeader(['Camada', 'Tecnologia', 'Versão', 'Responsabilidade'], [2200, 2200, 2480, 2480]),
      tableRow(['Front-end', 'HTML + CSS + JS', 'ES2023', 'Interface e interação com o usuário'], [2200, 2200, 2480, 2480]),
      tableRow(['Back-end', 'Node.js + Express', 'v20 / v4.x', 'Lógica de negócio e API REST'], [2200, 2200, 2480, 2480], C_GRAY),
      tableRow(['Banco de Dados', 'PostgreSQL', 'v16', 'Persistência e consulta de dados'], [2200, 2200, 2480, 2480]),
      tableRow(['Autenticação', 'JWT (jsonwebtoken)', 'v9.x', 'Tokens de sessão stateless'], [2200, 2200, 2480, 2480], C_GRAY),
      tableRow(['Segurança', 'bcryptjs', 'v2.x', 'Hash seguro de senhas'], [2200, 2200, 2480, 2480]),
      tableRow(['Comunicação', 'CORS (cors)', 'v2.x', 'Controle de acesso entre origens'], [2200, 2200, 2480, 2480], C_GRAY),
    ],
  }),
  spacer(),
  spacer(),

  // 3. ARQUITETURA
  h('3. Arquitetura do Sistema', 1),
  divider(),

  h('3.1 Diagrama de Camadas', 2),
  p('A aplicação segue a arquitetura de três camadas (3-tier architecture):'),
  spacer(),

  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [3120, 3120, 3120],
    rows: [
      new TableRow({ children: [
        new TableCell({ borders, width: { size: 3120, type: WidthType.DXA }, shading: { fill: '1E40AF', type: ShadingType.CLEAR }, margins: { top: 120, bottom: 120, left: 160, right: 160 },
          children: [
            new Paragraph({ children: [new TextRun({ text: '🖥️  FRONT-END', bold: true, size: 24, font: 'Arial', color: WHITE })], spacing: { before: 0, after: 60 }, alignment: AlignmentType.CENTER }),
            new Paragraph({ children: [run('index.html', WHITE, 20)], spacing: { before: 0, after: 40 }, alignment: AlignmentType.CENTER }),
            new Paragraph({ children: [run('Fetch API → JSON', WHITE, 20)], spacing: { before: 0, after: 0 }, alignment: AlignmentType.CENTER }),
          ]
        }),
        new TableCell({ borders, width: { size: 3120, type: WidthType.DXA }, shading: { fill: 'C2410C', type: ShadingType.CLEAR }, margins: { top: 120, bottom: 120, left: 160, right: 160 },
          children: [
            new Paragraph({ children: [new TextRun({ text: '⚙️  BACK-END', bold: true, size: 24, font: 'Arial', color: WHITE })], spacing: { before: 0, after: 60 }, alignment: AlignmentType.CENTER }),
            new Paragraph({ children: [run('server.js + routes/', WHITE, 20)], spacing: { before: 0, after: 40 }, alignment: AlignmentType.CENTER }),
            new Paragraph({ children: [run('Express REST API', WHITE, 20)], spacing: { before: 0, after: 0 }, alignment: AlignmentType.CENTER }),
          ]
        }),
        new TableCell({ borders, width: { size: 3120, type: WidthType.DXA }, shading: { fill: '166534', type: ShadingType.CLEAR }, margins: { top: 120, bottom: 120, left: 160, right: 160 },
          children: [
            new Paragraph({ children: [new TextRun({ text: '🗄️  BANCO', bold: true, size: 24, font: 'Arial', color: WHITE })], spacing: { before: 0, after: 60 }, alignment: AlignmentType.CENTER }),
            new Paragraph({ children: [run('PostgreSQL', WHITE, 20)], spacing: { before: 0, after: 40 }, alignment: AlignmentType.CENTER }),
            new Paragraph({ children: [run('Tabelas SQL', WHITE, 20)], spacing: { before: 0, after: 0 }, alignment: AlignmentType.CENTER }),
          ]
        }),
      ]}),
    ],
  }),
  spacer(),

  h('3.2 Fluxo de Comunicação', 2),
  p([bold('Front-end → Back-end: '), run('Requisições HTTP via Fetch API. O front envia JSON no corpo e recebe JSON como resposta.')]),
  p([bold('Back-end → Banco: '), run('Queries SQL parametrizadas via biblioteca pg (node-postgres). O back nunca expõe o banco diretamente ao front.')]),
  p([bold('Autenticação: '), run('Após login bem-sucedido, o back-end gera um JWT que o front armazena no localStorage e envia em cada requisição protegida no header Authorization: Bearer <token>.')]),
  spacer(),

  h('3.3 Estrutura de Arquivos', 2),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [3600, 5760],
    rows: [
      tableHeader(['Arquivo', 'Responsabilidade'], [3600, 5760]),
      tableRow(['backend/server.js', 'Inicializa o Express, registra middlewares e rotas'], [3600, 5760]),
      tableRow(['backend/db.js', 'Gerencia pool de conexões com o PostgreSQL'], [3600, 5760], C_GRAY),
      tableRow(['backend/middleware/auth.js', 'Valida token JWT em rotas protegidas'], [3600, 5760]),
      tableRow(['backend/routes/auth.js', 'Endpoints de registro e login de usuários'], [3600, 5760], C_GRAY),
      tableRow(['backend/routes/tarefas.js', 'CRUD completo de tarefas (GET/POST/PUT/DELETE)'], [3600, 5760]),
      tableRow(['backend/schema.sql', 'DDL: criação das tabelas usuarios e tarefas'], [3600, 5760], C_GRAY),
      tableRow(['frontend/index.html', 'SPA completa: UI, lógica de estado e chamadas à API'], [3600, 5760]),
    ],
  }),
  spacer(),
  spacer(),

  // 4. REQUISITOS FUNCIONAIS
  h('4. Requisitos Funcionais', 1),
  divider(),

  h('4.1 Módulo de Autenticação', 2),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [800, 2600, 3560, 2400],
    rows: [
      tableHeader(['ID', 'Funcionalidade', 'Descrição', 'Critério de Aceite'], [800, 2600, 3560, 2400]),
      tableRow(['RF-01', 'Cadastro de usuário', 'Usuário informa nome, e-mail e senha. Sistema valida e persiste.', 'Retorna 201 com token JWT'], [800, 2600, 3560, 2400]),
      tableRow(['RF-02', 'Login', 'Usuário informa e-mail e senha. Sistema autentica e retorna token.', 'Retorna 200 com token e dados do usuário'], [800, 2600, 3560, 2400], C_GRAY),
      tableRow(['RF-03', 'Hash de senha', 'Senhas nunca são salvas em texto puro. Usar bcrypt com salt 10.', 'Coluna senha_hash no banco'], [800, 2600, 3560, 2400]),
      tableRow(['RF-04', 'Sessão persistente', 'Token JWT salvo no localStorage sobrevive ao reload da página.', 'Usuário permanece logado após F5'], [800, 2600, 3560, 2400], C_GRAY),
      tableRow(['RF-05', 'Logout', 'Remove token do localStorage e redireciona para login.', 'Requisições posteriores retornam 401'], [800, 2600, 3560, 2400]),
    ],
  }),
  spacer(),

  h('4.2 Módulo de Tarefas', 2),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [800, 2600, 3560, 2400],
    rows: [
      tableHeader(['ID', 'Funcionalidade', 'Descrição', 'Critério de Aceite'], [800, 2600, 3560, 2400]),
      tableRow(['RF-06', 'Listar tarefas', 'Retorna todas as tarefas do usuário autenticado, ordenadas por data.', 'Array JSON, somente tarefas do usuário logado'], [800, 2600, 3560, 2400]),
      tableRow(['RF-07', 'Criar tarefa', 'Usuário define título, descrição opcional e prioridade.', 'Retorna 201 com a tarefa criada'], [800, 2600, 3560, 2400], C_GRAY),
      tableRow(['RF-08', 'Marcar como feita', 'Checkbox alterna o campo feito entre true/false.', 'Atualização imediata na UI sem reload'], [800, 2600, 3560, 2400]),
      tableRow(['RF-09', 'Excluir tarefa', 'Remove permanentemente a tarefa após confirmação.', 'Retorna 200 e remove da lista na UI'], [800, 2600, 3560, 2400], C_GRAY),
      tableRow(['RF-10', 'Filtrar tarefas', 'Filtros por: Todas / Pendentes / Concluídas / Alta prioridade.', 'Apenas tarefas correspondentes exibidas'], [800, 2600, 3560, 2400]),
    ],
  }),
  spacer(),
  spacer(),

  // 5. REQUISITOS NÃO FUNCIONAIS
  h('5. Requisitos Não Funcionais', 1),
  divider(),

  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [1200, 2400, 5760],
    rows: [
      tableHeader(['ID', 'Categoria', 'Requisito'], [1200, 2400, 5760]),
      tableRow(['RNF-01', 'Segurança', 'Senhas armazenadas com bcrypt (cost factor 10). Nenhum dado sensível retornado pelo back-end.'], [1200, 2400, 5760]),
      tableRow(['RNF-02', 'Segurança', 'Queries SQL 100% parametrizadas para prevenir SQL Injection.'], [1200, 2400, 5760], C_GRAY),
      tableRow(['RNF-03', 'Segurança', 'Token JWT com expiração de 24 horas. Tokens inválidos retornam HTTP 403.'], [1200, 2400, 5760]),
      tableRow(['RNF-04', 'Isolamento', 'Cada usuário visualiza e manipula somente suas próprias tarefas (WHERE usuario_id = ?).'], [1200, 2400, 5760], C_GRAY),
      tableRow(['RNF-05', 'Performance', 'Índice no campo usuario_id da tabela tarefas para otimizar consultas por usuário.'], [1200, 2400, 5760]),
      tableRow(['RNF-06', 'Manutenibilidade', 'Código comentado com explicação de cada bloco para fins didáticos.'], [1200, 2400, 5760], C_GRAY),
      tableRow(['RNF-07', 'Compatibilidade', 'Front-end funcional em Chrome, Firefox e Edge modernos sem dependências externas.'], [1200, 2400, 5760]),
    ],
  }),
  spacer(),
  spacer(),

  // 6. API REFERENCE
  h('6. Referência da API', 1),
  divider(),

  h('6.1 Endpoints de Autenticação', 2),
  p([bold('POST '), run('/api/auth/registro', C_ACCENT)]),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2000, 2000, 5360],
    rows: [
      tableHeader(['Campo', 'Tipo', 'Descrição'], [2000, 2000, 5360]),
      tableRow(['nome', 'string', 'Nome completo do usuário (obrigatório)'], [2000, 2000, 5360]),
      tableRow(['email', 'string', 'E-mail único (obrigatório)'], [2000, 2000, 5360], C_GRAY),
      tableRow(['senha', 'string', 'Senha com no mínimo 6 caracteres (obrigatório)'], [2000, 2000, 5360]),
    ],
  }),
  spacer(),
  p([bold('POST '), run('/api/auth/login', C_ACCENT)]),
  p('Recebe email e senha. Retorna o token JWT e dados públicos do usuário (sem senha_hash).'),
  spacer(),

  h('6.2 Endpoints de Tarefas (requerem JWT)', 2),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [1200, 3000, 1800, 3360],
    rows: [
      tableHeader(['Método', 'Rota', 'Status', 'Descrição'], [1200, 3000, 1800, 3360]),
      tableRow(['GET', '/api/tarefas', '200 OK', 'Lista todas as tarefas do usuário autenticado'], [1200, 3000, 1800, 3360]),
      tableRow(['POST', '/api/tarefas', '201 Created', 'Cria nova tarefa com título, descrição e prioridade'], [1200, 3000, 1800, 3360], C_GRAY),
      tableRow(['PUT', '/api/tarefas/:id', '200 OK', 'Atualiza campos da tarefa (parcial via COALESCE)'], [1200, 3000, 1800, 3360]),
      tableRow(['DELETE', '/api/tarefas/:id', '200 OK', 'Remove a tarefa permanentemente'], [1200, 3000, 1800, 3360], C_GRAY),
    ],
  }),
  spacer(),
  spacer(),

  // 7. MODELO DE DADOS
  h('7. Modelo de Dados', 1),
  divider(),

  h('Tabela: usuarios', 2),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2000, 2000, 1800, 3560],
    rows: [
      tableHeader(['Coluna', 'Tipo', 'Restrição', 'Descrição'], [2000, 2000, 1800, 3560]),
      tableRow(['id', 'SERIAL', 'PRIMARY KEY', 'Identificador único auto-incrementado'], [2000, 2000, 1800, 3560]),
      tableRow(['nome', 'VARCHAR(100)', 'NOT NULL', 'Nome completo do usuário'], [2000, 2000, 1800, 3560], C_GRAY),
      tableRow(['email', 'VARCHAR(150)', 'UNIQUE, NOT NULL', 'E-mail usado para autenticação'], [2000, 2000, 1800, 3560]),
      tableRow(['senha_hash', 'VARCHAR(255)', 'NOT NULL', 'Hash bcrypt da senha'], [2000, 2000, 1800, 3560], C_GRAY),
      tableRow(['criado_em', 'TIMESTAMP', 'DEFAULT NOW()', 'Data/hora de criação do registro'], [2000, 2000, 1800, 3560]),
    ],
  }),
  spacer(),

  h('Tabela: tarefas', 2),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2000, 2000, 1800, 3560],
    rows: [
      tableHeader(['Coluna', 'Tipo', 'Restrição', 'Descrição'], [2000, 2000, 1800, 3560]),
      tableRow(['id', 'SERIAL', 'PRIMARY KEY', 'Identificador único auto-incrementado'], [2000, 2000, 1800, 3560]),
      tableRow(['titulo', 'VARCHAR(200)', 'NOT NULL', 'Título da tarefa'], [2000, 2000, 1800, 3560], C_GRAY),
      tableRow(['descricao', 'TEXT', 'NULLABLE', 'Detalhes adicionais da tarefa'], [2000, 2000, 1800, 3560]),
      tableRow(['feito', 'BOOLEAN', 'DEFAULT FALSE', 'Indica se a tarefa foi concluída'], [2000, 2000, 1800, 3560], C_GRAY),
      tableRow(['prioridade', 'VARCHAR(10)', "CHECK ('baixa','media','alta')", 'Nível de prioridade da tarefa'], [2000, 2000, 1800, 3560]),
      tableRow(['usuario_id', 'INTEGER', 'FK → usuarios(id)', 'Dono da tarefa (isolamento de dados)'], [2000, 2000, 1800, 3560], C_GRAY),
      tableRow(['criado_em', 'TIMESTAMP', 'DEFAULT NOW()', 'Data/hora de criação'], [2000, 2000, 1800, 3560]),
      tableRow(['atualizado_em', 'TIMESTAMP', 'DEFAULT NOW()', 'Data/hora da última atualização'], [2000, 2000, 1800, 3560], C_GRAY),
    ],
  }),
  spacer(),
  spacer(),

  // 8. GLOSSÁRIO
  h('8. Glossário', 1),
  divider(),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2400, 6960],
    rows: [
      tableHeader(['Termo', 'Definição'], [2400, 6960]),
      tableRow(['REST API', 'Interface de programação que usa verbos HTTP (GET, POST, PUT, DELETE) para operações em recursos.'], [2400, 6960]),
      tableRow(['JWT', 'JSON Web Token — token compacto e assinado digitalmente para autenticação stateless.'], [2400, 6960], C_GRAY),
      tableRow(['bcrypt', 'Algoritmo de hash de senha com custo computacional ajustável, resistente a ataques de força bruta.'], [2400, 6960]),
      tableRow(['CORS', 'Cross-Origin Resource Sharing — política que controla quais origens podem acessar a API.'], [2400, 6960], C_GRAY),
      tableRow(['SQL Injection', 'Ataque que insere código SQL malicioso em entradas. Prevenido com queries parametrizadas.'], [2400, 6960]),
      tableRow(['Pool de Conexões', 'Conjunto de conexões reutilizáveis ao banco de dados, evitando overhead de abrir/fechar conexão a cada query.'], [2400, 6960], C_GRAY),
      tableRow(['Middleware', 'Função que intercepta a requisição antes de chegar à rota. Usada para autenticação, logging, validação, etc.'], [2400, 6960]),
      tableRow(['SPA', 'Single Page Application — app que não recarrega a página, atualizando o DOM dinamicamente via JS.'], [2400, 6960], C_GRAY),
    ],
  }),
  spacer(),
];

// ── ASSEMBLE DOCUMENT ──
const doc = new Document({
  numbering: {
    config: [
      { reference: 'bullets', levels: [{
        level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } }
      }]},
      { reference: 'numbers', levels: [{
        level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } }
      }]},
    ]
  },
  styles: {
    default: { document: { run: { font: 'Arial', size: 22 } } },
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
      }
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          children: [
            new TextRun({ text: 'TaskFlow — PRD v1.0', size: 18, font: 'Arial', color: '94A3B8' }),
          ],
          border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: C_BORDER } },
        })]
      })
    },
    children: [...coverPage, ...body],
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync('/mnt/user-data/outputs/TaskFlow-PRD.docx', buf);
  console.log('PRD gerado com sucesso!');
}).catch(e => console.error('Erro:', e));

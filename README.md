# 📊 Gestor de Apostas Esportivas

Sistema local de gestão de apostas esportivas desenvolvido com **Spring Boot** (backend) e **React + TypeScript** (frontend).

## 🚀 Stack Tecnológico

### Backend
- **Java 17+**
- **Spring Boot 3.2.5**
- **Spring Data JPA**
- **MySQL 8.0** (via Docker)
- **Lombok**
- **Jakarta Validation**

### Frontend
- **React 18**
- **TypeScript**
- **Vite 5**
- **Tailwind CSS**
- **shadcn/ui**
- **React Router DOM**
- **TanStack Query (React Query)**
- **Axios**
- **Recharts**

---

## 📁 Estrutura do Projeto

```
gestor-apostas/
├── docker-compose.yml          # Configuração do MySQL
├── backend/                     # API Spring Boot
│   ├── pom.xml
│   └── src/main/java/com/apostas/
│       ├── model/              # Entidades JPA
│       ├── repository/         # Repositórios Spring Data
│       ├── service/            # Lógica de negócio
│       ├── controller/         # REST Controllers
│       ├── dto/                # Data Transfer Objects
│       └── config/             # Configurações (CORS, etc)
└── frontend/                    # Aplicação React
    ├── package.json
    ├── tailwind.config.js
    └── src/
        ├── components/         # Componentes React/shadcn
        ├── pages/              # Páginas da aplicação
        ├── services/           # API client e queries
        ├── types/              # TypeScript interfaces
        └── lib/                # Utilitários
```

---

## ⚙️ Pré-requisitos

Certifique-se de ter instalado:

- **Docker** e **Docker Compose** (para o banco de dados)
- **Java 17+** (para o backend)
- **Maven 3.8+** (para build do backend)
- **Node.js 20+** e **npm** (para o frontend)

---

## 🐳 Passo 1: Subir o Banco de Dados MySQL

Na raiz do projeto, execute:

```bash
docker-compose up -d
```

Isso irá:
- Criar um container MySQL 8.0
- Expor a porta **3306**
- Criar o banco de dados `apostas_db`
- Usuário: `apostas_user` / Senha: `apostas_pass`

**Verificar se o container está rodando:**
```bash
docker ps
```

**Parar o container (quando necessário):**
```bash
docker-compose down
```

---

## 🔧 Passo 2: Executar o Backend

### 2.1 Instalar dependências e compilar

```bash
cd backend
./mvnw clean install    # Linux/Mac
mvnw.cmd clean install  # Windows
```

### 2.2 Executar a aplicação

```bash
./mvnw spring-boot:run    # Linux/Mac
mvnw.cmd spring-boot:run  # Windows
```

O backend estará disponível em: **http://localhost:8080**

### Endpoints da API

#### Bankrolls (Bancas)
- `GET /api/bankrolls` - Listar todas as bancas
- `GET /api/bankrolls/{id}` - Buscar banca por ID
- `POST /api/bankrolls` - Criar nova banca
- `PUT /api/bankrolls/{id}` - Atualizar banca
- `DELETE /api/bankrolls/{id}` - Deletar banca

#### Bets (Apostas)
- `GET /api/bets` - Listar todas as apostas
- `GET /api/bets/bankroll/{bankrollId}` - Apostas por banca
- `GET /api/bets/{id}` - Buscar aposta por ID
- `POST /api/bets` - Criar nova aposta
- `PUT /api/bets/{id}` - Atualizar aposta
- `DELETE /api/bets/{id}` - Deletar aposta

#### Dashboard
- `GET /api/dashboard/{bankrollId}` - Métricas analíticas da banca

---

## 💻 Passo 3: Executar o Frontend

### 3.1 Instalar dependências

```bash
cd frontend
npm install
```

### 3.2 Executar em modo desenvolvimento

```bash
npm run dev
```

O frontend estará disponível em: **http://localhost:5173**

---

## 📊 Funcionalidades do Sistema

### 1. **Gestão de Banca (Bankroll)**
- Criar múltiplas bancas independentes
- Definir banca inicial (ex: R$ 1.000,00)
- Cálculo automático da **banca atual** (inicial + lucro/prejuízo)

### 2. **CRUD de Apostas (Bets)**
Cada aposta contém:
- Data da aposta
- Esporte e Campeonato
- Evento (ex: Flamengo x Vasco)
- Mercado (ex: Over 2.5 Gols)
- Casa de Aposta (Bet365, Betano, etc)
- Odd (cotação)
- Valor Apostado (Stake)
- **Status:**
  - `PENDING` - Pendente
  - `GREEN` - Ganhou
  - `RED` - Perdeu
  - `VOID` - Reembolsada
  - `HALF_GREEN` - Meio Green
  - `HALF_RED` - Meio Red
- **Retorno Financeiro (calculado automaticamente):**
  - Green: `(Stake × Odd) - Stake`
  - Red: `-Stake`
  - Void: `0`
  - Half Green: `[(Stake × Odd) - Stake] / 2`
  - Half Red: `-Stake / 2`

### 3. **Dashboard Analítico**
- **Cards de métricas:**
  - Banca Inicial
  - Banca Atual
  - Lucro/Prejuízo Total
  - **ROI** (Retorno sobre Investimento em %)
  - **Win Rate** (% de acertos)
- **Gráfico de linha:** Evolução da banca ao longo do tempo
- **Gráfico de pizza:** Lucro/Prejuízo por Casa de Aposta

---

## 🧪 Testando a API

Você pode usar **Postman**, **Insomnia** ou **Thunder Client** para testar os endpoints.

### Exemplo: Criar uma banca

**POST** `http://localhost:8080/api/bankrolls`

```json
{
  "name": "Banca Principal",
  "initialBalance": 1000.00
}
```

### Exemplo: Criar uma aposta

**POST** `http://localhost:8080/api/bets`

```json
{
  "bankrollId": 1,
  "betDate": "17/03/2026",
  "sport": "Futebol",
  "championship": "Brasileirão Série A",
  "event": "Flamengo x Vasco",
  "market": "Match Odds - Flamengo",
  "bookmaker": "Bet365",
  "odd": 1.85,
  "stake": 50.00,
  "status": "PENDING"
}
```

---

## 🎨 Próximos Passos (Para Desenvolvimento)

As seguintes páginas/componentes precisam ser implementadas no frontend:

### 1. **Página Dashboard** (`src/pages/Dashboard.tsx`)
- Consumir o hook `useDashboard(bankrollId)`
- Exibir cards de métricas
- Renderizar gráficos com **Recharts**

### 2. **Página de Gestão de Apostas** (`src/pages/Bets.tsx`)
- Tabela com todas as apostas
- Formulário para criar/editar apostas
- Botões de ação (editar, excluir)
- Filtros por status, casa de aposta, data

### 3. **Página de Gestão de Bancas** (`src/pages/Bankrolls.tsx`)
- Lista de bancas criadas
- Formulário para criar/editar bancas
- Exibir banca inicial e banca atual

### 4. **Componentes shadcn/ui**
Você pode adicionar componentes do shadcn/ui conforme necessário:
- `Card` - Para cards de métricas
- `Table` - Para listar apostas
- `Dialog` - Para modais de formulário
- `Button`, `Input`, `Select` - Para forms
- `Badge` - Para exibir status das apostas

---

## 🛠️ Comandos Úteis

### Backend
```bash
# Compilar sem executar testes
./mvnw clean install -DskipTests

# Executar testes
./mvnw test

# Gerar JAR
./mvnw package
```

### Frontend
```bash
# Build para produção
npm run build

# Preview da build
npm run preview

# Linter
npm run lint
```

### Docker
```bash
# Ver logs do MySQL
docker-compose logs -f mysql

# Resetar banco de dados (apaga todos os dados!)
docker-compose down -v
docker-compose up -d
```

---

## 📝 Observações Importantes

- **O sistema NÃO possui autenticação** - é para uso local pessoal
- **NÃO há calculadora de stake** - você insere o valor manualmente
- Os cálculos de lucro/prejuízo são **automáticos** baseados no status da aposta
- O Hibernate está configurado com `ddl-auto=update`, então as tabelas serão criadas automaticamente

---

## 🐛 Troubleshooting

### Erro: "Cannot connect to MySQL"
- Verifique se o Docker está rodando: `docker ps`
- Verifique se a porta 3306 não está ocupada
- Reinicie o container: `docker-compose restart`

### Erro: "Port 8080 already in use"
- Alguma aplicação já está usando a porta 8080
- Altere a porta no `application.properties`: `server.port=8081`

### Erro no frontend: "Network Error" ao chamar API
- Verifique se o backend está rodando em `http://localhost:8080`
- Verifique a configuração de CORS no `WebConfig.java`

---

## 📄 Licença

Este projeto é de uso pessoal e não possui licença definida.

---

## 🤝 Contribuições

Este é um projeto pessoal, mas sugestões e melhorias são bem-vindas!

---

**Desenvolvido com ❤️ por um apostador que cansou de planilhas no Excel**

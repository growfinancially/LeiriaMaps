# Leiria Maps — projeto inicial completo

Site de descoberta local para o concelho de Leiria, com identidade visual vermelha e branca.

## Ficheiros
- `index.html`, `styles.css`, `app.js`: site público, pesquisa, categorias, mapa e formulário de propostas.
- `admin.html`, `admin.js`: painel de administração com login, revisão de propostas e gestão de locais.
- `config.js`: configuração pública do Supabase.
- `supabase.sql`: tabelas, validações e políticas Row Level Security.

## 1. Publicar o site
1. Cria um repositório GitHub público chamado `leiria-maps`.
2. Envia todos os ficheiros desta pasta para a raiz do repositório.
3. Abre Settings → Pages.
4. Escolhe Deploy from a branch, branch `main`, pasta `/ (root)`.
5. O site ficará disponível no endereço GitHub Pages apresentado pelo GitHub.

## 2. Ligar Supabase
1. Cria um projeto Supabase.
2. No SQL Editor, executa `supabase.sql`.
3. Em Project Settings → API, copia Project URL e a chave `anon` ou `publishable`.
4. Cola os valores em `config.js`, nos campos `SUPABASE_URL` e `SUPABASE_ANON_KEY`.
5. No `app.js`, substitui as duas constantes vazias pelo mesmo URL e chave, ou altera app.js para ler `window.LEIRIA_MAPS_CONFIG` se preferires centralizar a configuração.
6. Publica novamente.

**Segurança:** apenas a chave anon/publishable pode estar no frontend. Nunca publiques `service_role`/secret key.

## 3. Criar acesso de administrador
1. No Supabase, abre Authentication → Users e cria/invita uma conta de administrador.
2. Copia o UUID do utilizador.
3. No SQL Editor executa:
   `insert into public.admins(user_id) values ('UUID-DO-UTILIZADOR');`
4. Abre `admin.html` no site e entra com o email e palavra-passe dessa conta.
5. Não existe registo público de administradores.

## 4. Como gerir
- As propostas enviadas no site entram em `business_submissions`.
- No painel `admin.html`, seleciona “Preparar publicação”.
- Confirma nome, categoria e morada.
- Acrescenta latitude e longitude para o marcador aparecer no mapa.
- Guarda. A proposta é removida da fila e o local é publicado.
- Também podes criar, editar ou eliminar locais diretamente no painel.

## 5. Dados demonstrativos
O mapa inclui alguns pontos demonstrativos em Leiria. São exemplos de locais e não uma lista comercial verificada. Confirma todos os dados antes de apresentar como recomendações oficiais. Os exemplos ficam no `app.js` e podem ser removidos quando adicionares dados reais.

## 6. Antes de lançar ao público
- Acrescentar proteção anti-spam/CAPTCHA e limites de submissão.
- Criar páginas de privacidade, termos, contacto e correção/remoção de dados.
- Verificar autorização e exatidão de moradas, contactos, horários, fotografias e descrições.
- Definir processo de moderação.
- Considerar consentimento e regras aplicáveis a dados pessoais e cookies.
- Verificar os termos de utilização do OpenStreetMap e a política do serviço público de tiles; para tráfego elevado, usar um fornecedor de tiles adequado.
- A monetização, contratos e contas de pagamento devem ser tratados com um adulto responsável, quando aplicável.

## Limitações desta versão
O código e a estrutura estão preparados, mas a plataforma só fica online e ligada aos dados depois de criares/configurares as tuas contas GitHub e Supabase. Não tenho acesso às tuas contas para publicar em teu nome. O mapa usa Leaflet/OpenStreetMap; a lista de locais deve ser preenchida e validada.

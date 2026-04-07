

## Plano: Login Admin no LegisQuest

Adicionar credenciais de administrador ao login existente. Quando o usuario logar como admin, sera redirecionado para `/admin`. Quando logar como aluno, vai para `/dashboard`.

### Mudancas

**`src/pages/Login.tsx`**:
- Adicionar verificacao de credenciais admin: `admin@legisquest.com` / `admin123`
- Se admin, redirecionar para `/admin`
- Se aluno (teste@teste.com / 123456), manter redirecionamento para `/dashboard`
- Mensagem de erro permanece para credenciais invalidas

### Credenciais

| Perfil | E-mail | Senha |
|--------|--------|-------|
| Aluno | teste@teste.com | 123456 |
| Admin | admin@legisquest.com | admin123 |


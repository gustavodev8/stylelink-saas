# Middlewares

Este diretório contém os middlewares da aplicação.

## Middlewares a serem criados:

### auth.js
- Validação de JWT
- Verificar se usuário está autenticado
- Verificar se assinatura está ativa

### upload.js
- Configuração do Multer
- Validação de tipos de arquivo
- Limite de tamanho
- Múltiplos uploads

### validation.js
- Validações de entrada
- Sanitização de dados
- Express-validator helpers

### errorHandler.js
- Tratamento centralizado de erros
- Logs de erros
- Respostas padronizadas

## Exemplo de uso:

```javascript
const { authenticate, checkSubscription } = require('../middleware/auth');

router.get('/products', authenticate, checkSubscription, productController.getAll);
```

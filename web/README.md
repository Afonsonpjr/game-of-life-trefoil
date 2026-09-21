# Versã¡¡o Web - Game of Life no Nó Trevo

Esta pasta conté¡¡m a versã¡¡o web da simulaç¡¡ã¡¡o, construí¡¡da com **Three.js**.

## Como rodar

### Opç¡¡ã¡¡o 1: Abrir diretamente

Basta abrir o arquivo `index.html` em um navegador moderno (Chrome, Edge, Firefox).

### Opç¡¡ã¡¡o 2: Servidor local

```bash
# Python
python -m http.server 8000 --directory web

# Acesse: http://localhost:8000
```

## Funcionalidades

- **Iniciar / Pausar / Resetar** a simulaç¡¡ã¡¡o.
- **Contador de cé ¡lulas vivas** em tempo real.
- **Slider de velocidade** (FPS).
- **Seleç¡¡ã¡¡o de temas** de cores.
- **Padrö¡¡¡es iniciais** pré-definidos (Glider, Glider Gun, etc.).
- **Câ¡¡mera 3D interativa**: arraste para girar, scroll para zoom.

## Estrutura

- `index.html` - Pá¡¡gina principal.
- `style.css` - Estilos e layout.
- `main.js` - Ló¡¡¡gica da simulaç¡¡ã¡¡o e renderizaç¡¡ã¡¡o 3D.

## Personalizaç¡¡ã¡¡o

Para ajustar parâ¡¡metros, edite `main.js`:

- `N` - Tamanho do grid (N x N).
- `CELL_SIZE` - Tamanho de cada cé ¡lula.
- `TUBE_RADIUS` - Raio do tubo do nó trevo.
- `themes` - Definiç¡¡ã¡¡o de temas de cores.
- `patterns` - Padrö¡¡¡es iniciais disponí¡¡veis.

## Limitaç¡¡ö¡¡¡es

- Performance pode variar dependendo do dispositivo.
- Grids muito grandes (N > 60) podem causar lentidã¡¡o.

## Pró ¡ximas melhorias

- Exportar/importar configuraç¡¡ö¡¡¡es.
- Gravaç¡¡ã¡¡o de ví ¡deo da simulaç¡¡ã¡¡o.
- Suporte a toque para dispositivos mó ¡veis.

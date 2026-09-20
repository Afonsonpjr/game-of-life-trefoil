# Game of Life no Nó Trevo (Trefoil Knot)

Simulaçııo do **Conway's Game of Life** rodando sobre a superf⁄cie de um **n‚ trevo** em 3D.

- VersÆ£o Python: `numpy` + `matplotlib` (desktop)
- VersÆ£o Web: `Three.js` (navegador, pronto para Cloudflare Pages)

![ReferŒncia](https://upload.wikimedia.org/wikipedia/commons/6/64/Trefoil_knot_conways_game_of_life.gif)

*Imagem de referencia: [Trefoil_knot_conways_game_of_life.gif](https://commons.wikimedia.org/wiki/File:Trefoil_knot_conways_game_of_life.gif) – Wikimedia Commons (CC BY-SA 4.0).*

---

## Como rodar localmente (Python)

### 1. Pr‚-requisitos

- Python 3.9 ou superior
- `pip` instalado

### 2. Instalar dependŒncias

```bash
pip install -r requirements.txt
```

### 3. Executar a simula‡Æ£o

```bash
python game_of_life_trefoil.py
```

Uma janela 3D abrirÆ¡ com a anima‡Æ£o rodando.

### 4. Gerar GIF (opcional)

No arquivo `game_of_life_trefoil.py`, altere:

```python
save_gif = False  # mude para:
save_gif = True
```

Depois rode novamente:

```bash
python game_of_life_trefoil.py
```

O arquivo `game_of_life_trefoil.gif` serÆ¡ salvo na pasta.

---

## VersÆ£o Web (Three.js)

A pasta `web/` cont‚m uma versÆ£o que roda direto no navegador:

- `web/index.html`
- `web/style.css`
- `web/main.js`

### Rodar localmente

Basta abrir `web/index.html` em um navegador moderno (Chrome, Edge, Firefox).

Ou use um servidor local simples:

```bash
# Python
python -m http.server 8000 --directory web

# Acesse: http://localhost:8000
```

### Controles

- **Iniciar / Pausar / Resetar** a simula‡Æ£o
- **Velocidade:** slider para ajustar FPS
- **C‚mera:** arraste para girar, scroll para zoom

---

## Deploy no Cloudflare Pages

Este projeto jÆ¡ estÆ¡ pronto para ser publicado como site estÆ¡tico no Cloudflare Pages.

### Passos

1. Acesse o [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. VÆ¡ para **Workers & Pages** → **Create application** → **Pages**
3. Clique em **Connect to Git**
4. Selecione o reposit‚rio: `Afonsonpjr/game-of-life-trefoil`
5. Configure:
   - **Production branch:** `main`
   - **Root directory:** `web`
   - **Build command:** (deixe em branco)
   - **Build output directory:** (deixe em branco)
6. Clique em **Save and Deploy**

O Cloudflare Pages vai gerar uma URL do tipo:

```
https://game-of-life-trefoil.<seu-subdominio>.pages.dev
```

A partir da⁄, vocŒ pode:
- Compartilhar o link
- Conectar um dom⁄nio pr‚prio
- Usar como preview de novas vers�es (criando branches e deploy por PR)

---

## Estrutura do projeto

```
.
├── game_of_life_trefoil.py   # Simulaçııo Python (matplotlib)
├── requirements.txt          # DependŒncias Python
├── README.md                 # Este arquivo
└── web/
    ├── index.html            # PÆ¡gina principal
    ├── style.css             # Estilos
    └── main.js               # L‚gica Three.js
```

---

## ReferŒncias

- [Conway's Game of Life – Wikipedia](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life)
- [Trefoil knot – Wikipedia](https://en.wikipedia.org/wiki/Trefoil_knot)
- [Trefoil_knot_conways_game_of_life.gif – Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Trefoil_knot_conways_game_of_life.gif)
- [Three.js Documentation](https://threejs.org/docs/)
- [Cloudflare Pages](https://pages.cloudflare.com/)

---

## Licen‡a

Este c‚digo ‚ distribu⁄do como exemplo educacional. Use livremente em seus projetos.

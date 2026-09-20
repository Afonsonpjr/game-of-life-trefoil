# Game of Life no Nó Trevo (Trefoil Knot)

Simula‡Æ£o do **Conway's Game of Life** rodando sobre a superf⁄cie de um **n‚ trevo** em 3D, implementada em Python com `numpy` + `matplotlib`.

![ReferŒncia](https://upload.wikimedia.org/wikipedia/commons/6/64/Trefoil_knot_conways_game_of_life.gif)

*Imagem de referŒncia: [Trefoil_knot_conways_game_of_life.gif](https://commons.wikimedia.org/wiki/File:Trefoil_knot_conways_game_of_life.gif) – Wikimedia Commons (CC BY-SA 4.0).*

---

## Como rodar localmente

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

## Estrutura do projeto

- `game_of_life_trefoil.py` – c‚digo principal da simula‡Æ£o
- `requirements.txt` – dependŒncias Python
- `README.md` – este arquivo

---

## ReferŒncias

- [Conway's Game of Life – Wikipedia](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life)
- [Trefoil knot – Wikipedia](https://en.wikipedia.org/wiki/Trefoil_knot)
- [Trefoil_knot_conways_game_of_life.gif – Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Trefoil_knot_conways_game_of_life.gif)

---

## Licen‡a

Este c‚digo ‚ distribu⁄do como exemplo educacional. Use livremente em seus projetos.

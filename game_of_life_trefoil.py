import numpy as np
import matplotlib.pyplot as plt
from matplotlib import animation
from mpl_toolkits.mplot3d import Axes3D  # noqa: F401

# =========================
# Configuraçııes
# =========================
N = 60          # tamanho do grid (N x N)
ON = 1
OFF = 0
p_on = 0.15     # probabilidade inicial de c‚lula viva
frames = 300    # nœmero de frames da anima‡Æ£o
interval = 50   # ms entre frames
save_gif = False  # mude para True para salvar GIF localmente

# =========================
# Inicializa o grid
# =========================
grid = np.random.choice([ON, OFF], size=(N, N), p=[p_on, 1 - p_on]).astype(float)

# =========================
# Regras do Jogo da Vida (com wrap toroidal)
# =========================
def step(grid):
    total = (
        np.roll(grid,  1, axis=0) + np.roll(grid, -1, axis=0) +
        np.roll(grid,  1, axis=1) + np.roll(grid, -1, axis=1) +
        np.roll(np.roll(grid,  1, axis=0),  1, axis=1) +
        np.roll(np.roll(grid,  1, axis=0), -1, axis=1) +
        np.roll(np.roll(grid, -1, axis=0),  1, axis=1) +
        np.roll(np.roll(grid, -1, axis=0), -1, axis=1)
    )
    birth = (grid == 0) & (total == 3)
    survive = (grid == 1) & ((total == 2) | (total == 3))
    return (birth | survive).astype(float)

# =========================
# Mapeamento para o n‚ trevo
# =========================
t = np.linspace(0, 2 * np.pi, N, endpoint=False)
phi = np.linspace(0, 2 * np.pi, N, endpoint=False)
T, PHI = np.meshgrid(t, phi, indexing='ij')

x0 = np.sin(T) + 2 * np.sin(2 * T)
y0 = np.cos(T) - 2 * np.cos(2 * T)
z0 = -np.sin(3 * T)

dt = T[0, 1] - T[0, 0]
dxdt = np.sin(T + dt) + 2 * np.sin(2 * (T + dt)) - x0
dydt = np.cos(T + dt) - 2 * np.cos(2 * (T + dt)) - y0
dzdt = -np.sin(3 * (T + dt)) + np.sin(3 * T)

tx = dxdt / dt
ty = dydt / dt
tz = dzdt / dt
norm_t = np.sqrt(tx**2 + ty**2 + tz**2)
tx, ty, tz = tx / norm_t, ty / norm_t, tz / norm_t

nx = np.cross(ty, np.ones_like(tz))
ny = np.cross(tz, np.ones_like(tx))
nz = np.cross(tx, np.ones_like(ty))
norm_n = np.sqrt(nx**2 + ny**2 + nz**2) + 1e-8
nx, ny, nz = nx / norm_n, ny / norm_n, nz / norm_n

R = 0.4

X = x0 + R * nx * np.cos(PHI) - R * ty * np.sin(PHI)
Y = y0 + R * ny * np.cos(PHI) - R * tz * np.sin(PHI)
Z = z0 + R * nz * np.cos(PHI) - R * tx * np.sin(PHI)

# =========================
# Anima‡Æ£o 3D
# =========================
fig = plt.figure(figsize=(8, 6))
ax = fig.add_subplot(111, projection='3d')
ax.set_facecolor('black')
fig.patch.set_facecolor('black')

alive = grid > 0.5
ax.scatter(X[alive], Y[alive], Z[alive], c='lime', s=10, depthshade=False)

ax.set_xlim(X.min(), X.max())
ax.set_ylim(Y.min(), Y.max())
ax.set_zlim(Z.min(), Z.max())
ax.axis('off')
ax.view_init(elev=20, azim=45)

def update(frame):
    global grid
    grid = step(grid)
    ax.collections.clear()
    alive = grid > 0.5
    if np.any(alive):
        ax.scatter(X[alive], Y[alive], Z[alive], c='lime', s=10, depthshade=False)
    return []

ani = animation.FuncAnimation(fig, update, frames=frames, interval=interval, blit=False)

if save_gif:
    ani.save('game_of_life_trefoil.gif', writer='pillow', fps=20)
    print('GIF salvo: game_of_life_trefoil.gif')

plt.show()

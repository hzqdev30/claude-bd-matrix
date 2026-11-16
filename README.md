<h1 align="center">backdrops</h1>
<p align="center">Animated backdrops for the Claude desktop app.<br>Pick one, and it comes back on every new session.</p>

<p align="center"><img src="docs/matrix.gif" alt="Matrix rain backdrop" width="720"></p>

## Backdrops

| | |
| :-- | :-- |
| **matrix**<br>Falling green code<br>`/backdrop matrix` | **forge**<br>Embers and heat<br>`/backdrop forge` |
| <img src="docs/matrix.png" alt="matrix" width="380"> | <img src="docs/forge.png" alt="forge" width="380"> |
| **storm**<br>Rain and clouds<br>`/backdrop storm` | **night-sky**<br>Stars and shooting stars<br>`/backdrop night-sky` |
| <img src="docs/storm.png" alt="storm" width="380"> | <img src="docs/night-sky.png" alt="night sky" width="380"> |

<details>
<summary>Animated previews of the other three</summary>
<br>
<img src="docs/forge.gif" alt="forge" width="360"> <img src="docs/storm.gif" alt="storm" width="360"> <img src="docs/night-sky.gif" alt="night sky" width="360">
</details>

> Previews are rendered from the mod's own scenes in a mock window, not screenshots of the app.

## Install

**Desktop app** (where `/plugin` does not run): click **+** next to the prompt box, then **Plugins**, **Add marketplace** with `hzqdev30/claude-bd-matrix`, then **Add plugin**.

**Terminal session:**

```
/plugin install backdrops --marketplace hzqdev30/claude-bd-matrix
```

**Shell:**

```bash
claude plugin install backdrops --marketplace hzqdev30/claude-bd-matrix
```

## Commands

| Command | Does |
| :-- | :-- |
| `/backdrop <name>` | Switch to `forge`, `matrix`, `storm` or `night-sky` |
| `/backdrop next` | Cycle to the next one |
| `/backdrop list` | List the backdrops |
| `/backdrop off` | Remove the backdrop. New sessions stay off until you pick again |

## Notes

- Your last pick is saved and applied at the start of every new session.
- Backdrops draw on the desktop and mobile apps only, not in a plain terminal.
- Scenes with motion redraw twice a second. Rain, embers and stars use CSS animation and respect reduced-motion settings.

# Game Factory

Small educational games in a block-building world. They run in any browser (Windows, macOS, Chromebook, tablets).

**Play online:** https://schmichael85.github.io/game-factory/

Each game is also a single HTML file that works offline. Download it and double-click it.

## Games

| Grade | Subject | File | What's inside |
|---|---|---|---|
| 5 | Geometry | `geometry/block-geometry.html` | angles, shapes & triangles, perimeter & area · block builder · angle cannon |
| 5 | Math | `math/math-5.html` | fractions, decimals, operations & word problems · fraction wall |
| 5 | English (for Hebrew speakers) | `english/english-5.html` | vocabulary with pronunciation, grammar, reading comprehension · spelling table |
| 2 | Shapes | `geometry/geometry-2.html` | shapes, measuring with a ruler, patterns & symmetry · block builder |
| 2 | Math | `math/math-2.html` | addition & subtraction, numbers to 100, first multiplication · tens & ones builder |
| 2 | English (for Hebrew speakers) | `english/english-2.html` | letters, first words, colors & numbers – listening first · spelling table |

Every game has:
- **Mining quest**: 3 worlds × 6 levels, from easy to challenging.
- **Race against the clock**: the questions get harder as the player gets better.
- **A hands-on mode** specific to the game.
- **A parent screen** behind a multiplication question. It shows time per mode, success by topic, weak and strong spots, and how the kid rated each mode.
- **A break reminder** after 15 minutes.

**Players:** the 👤 button opens "Who's playing?". Profiles are shared by all the games on a device. Progress stays only on that device (browser localStorage). Nothing is sent anywhere.

**English audio** uses the device's built-in voices (works offline). You need speakers or headphones.

## How it's built

```
src/
  shell.html        page layout shared by all games
  engine.css        shared look
  engine-base.js    helpers, sound, speech
  engine-core.js    players, quest, race, results, builder, spelling table, parent screen
  vocab-en.js       English word bank (used by both English games)
  games/*.js        one file per game: topics, question generators, special mode
build.py            builds every game into one self-contained HTML file
```

Edit the files in `src/`, then run `python build.py`. Don't edit the built `.html` files directly.

To add a game: create `src/games/<name>.js` (copy a similar game as a starting point), add a line to `GAMES` in `build.py`, build, and add a card to `index.html`.

## License
MIT – see [LICENSE](LICENSE).

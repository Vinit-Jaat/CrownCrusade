const socket = io();

window.isDev = false;
window.isDevStatic = false;
socket.on("init_data", (data) => {
  window.isDev = data.isDev;
  window.isDevStatic = data.isDevStatic;
});

const CARD_DATA = {
  Knight: {
    cost: 3,
    hp: 400,
    dmg: 40,
    spd: 40,
    range: 10,
    aggro: 150,
    atkSpd: 1.2,
    color: 0xcccccc,
    size: 32,
    type: "melee",
  },
  Archer: {
    cost: 3,
    hp: 150,
    dmg: 30,
    spd: 50,
    range: 90,
    aggro: 180,
    atkSpd: 1.0,
    color: 0x96fa96,
    size: 24,
    type: "ranged",
  },
  Giant: {
    cost: 5,
    hp: 1000,
    dmg: 60,
    spd: 30,
    range: 15,
    aggro: 0,
    atkSpd: 1.5,
    color: 0xc89664,
    size: 48,
    type: "melee",
    targetsTowersOnly: true,
  },
  Goblin: {
    cost: 2,
    hp: 200,
    dmg: 20,
    spd: 50,
    range: 5,
    aggro: 150,
    atkSpd: 0.8,
    color: 0x64fa64,
    size: 20,
    type: "melee",
  },
  MiniPekka: {
    cost: 4,
    hp: 350,
    dmg: 100,
    spd: 45,
    range: 10,
    aggro: 150,
    atkSpd: 1.8,
    color: 0x6464fa,
    size: 30,
    type: "melee",
  },
  Skeleton: {
    cost: 1,
    hp: 150,
    dmg: 10,
    spd: 50,
    range: 5,
    aggro: 150,
    atkSpd: 1.0,
    color: 0xdcdcdc,
    size: 16,
    type: "melee",
  },
  Musket: {
    cost: 4,
    hp: 200,
    dmg: 60,
    spd: 50,
    range: 110,
    aggro: 200,
    atkSpd: 1.1,
    color: 0xc896fa,
    size: 28,
    type: "ranged",
  },
  Valkyrie: {
    cost: 4,
    hp: 500,
    dmg: 50,
    spd: 50,
    range: 25,
    aggro: 150,
    atkSpd: 1.5,
    color: 0xfa9664,
    size: 34,
    type: "aoe",
  },
  Bomber: {
    cost: 3,
    hp: 150,
    dmg: 40,
    spd: 50,
    range: 70,
    aggro: 180,
    atkSpd: 1.4,
    color: 0x444444,
    size: 24,
    type: "aoe",
  },
  HogRider: {
    cost: 4,
    hp: 600,
    dmg: 80,
    spd: 90,
    range: 10,
    aggro: 0,
    atkSpd: 1.3,
    color: 0x8b4513,
    size: 30,
    type: "melee",
    targetsTowersOnly: true,
  },
  SkeletonArmy: {
    cost: 3,
    isSwarm: true,
    swarmCount: 6,
    spawnRadius: 35,
    spawnTroop: "Skeleton",
    color: 0xaaaaaa,
  },

  Prince: {
    cost: 5,
    hp: 800,
    dmg: 120,
    spd: 70,
    range: 15,
    aggro: 150,
    atkSpd: 1.4,
    color: 0xffff00,
    size: 34,
    type: "melee",
  },
  BabyDragon: {
    cost: 4,
    hp: 600,
    dmg: 60,
    spd: 50,
    range: 60,
    aggro: 180,
    atkSpd: 1.5,
    color: 0x00ffaa,
    size: 36,
    type: "aoe",
  },
  Wizard: {
    cost: 5,
    hp: 340,
    dmg: 90,
    spd: 45,
    range: 90,
    aggro: 200,
    atkSpd: 1.4,
    color: 0xff4444,
    size: 28,
    type: "aoe",
  },
  Balloon: {
    cost: 5,
    hp: 800,
    dmg: 300,
    spd: 35,
    range: 10,
    aggro: 0,
    atkSpd: 3.0,
    color: 0xaa2222,
    size: 40,
    type: "melee",
    targetsTowersOnly: true,
  },
  Golem: {
    cost: 8,
    hp: 2000,
    dmg: 100,
    spd: 20,
    range: 15,
    aggro: 0,
    atkSpd: 2.5,
    color: 0x888888,
    size: 52,
    type: "melee",
    targetsTowersOnly: true,
  },
  Miner: {
    cost: 3,
    hp: 600,
    dmg: 40,
    spd: 60,
    range: 10,
    aggro: 150,
    atkSpd: 1.2,
    color: 0x777777,
    size: 26,
    type: "melee",
  },
  LavaHound: {
    cost: 7,
    hp: 1800,
    dmg: 30,
    spd: 30,
    range: 15,
    aggro: 0,
    atkSpd: 1.3,
    color: 0xff5500,
    size: 50,
    type: "melee",
    targetsTowersOnly: true,
  },
  Sparky: {
    cost: 6,
    hp: 700,
    dmg: 500,
    spd: 30,
    range: 80,
    aggro: 150,
    atkSpd: 4.0,
    color: 0xffff55,
    size: 42,
    type: "aoe",
  },
  Lumberjack: {
    cost: 4,
    hp: 500,
    dmg: 80,
    spd: 80,
    range: 10,
    aggro: 150,
    atkSpd: 0.7,
    color: 0xaa6622,
    size: 30,
    type: "melee",
  },
  Bowler: {
    cost: 5,
    hp: 800,
    dmg: 80,
    spd: 40,
    range: 80,
    aggro: 180,
    atkSpd: 2.5,
    color: 0x5555ff,
    size: 44,
    type: "aoe",
  },
  Executioner: {
    cost: 5,
    hp: 600,
    dmg: 70,
    spd: 45,
    range: 90,
    aggro: 200,
    atkSpd: 2.4,
    color: 0x333333,
    size: 32,
    type: "aoe",
  },
  Bandit: {
    cost: 3,
    hp: 400,
    dmg: 80,
    spd: 80,
    range: 10,
    aggro: 150,
    atkSpd: 1.0,
    color: 0x999999,
    size: 26,
    type: "melee",
  },
  RoyalGhost: {
    cost: 3,
    hp: 500,
    dmg: 70,
    spd: 50,
    range: 10,
    aggro: 150,
    atkSpd: 1.8,
    color: 0xeeeeee,
    size: 28,
    type: "aoe",
  },
  MagicArcher: {
    cost: 4,
    hp: 250,
    dmg: 50,
    spd: 50,
    range: 120,
    aggro: 250,
    atkSpd: 1.1,
    color: 0x44ffaa,
    size: 26,
    type: "ranged",
  },
  NightWitch: {
    cost: 4,
    hp: 450,
    dmg: 90,
    spd: 45,
    range: 15,
    aggro: 150,
    atkSpd: 1.5,
    color: 0x333366,
    size: 30,
    type: "melee",
  },
  Princess: {
    cost: 3,
    hp: 120,
    dmg: 50,
    spd: 45,
    range: 160,
    aggro: 250,
    atkSpd: 3.0,
    color: 0xffaaee,
    size: 22,
    type: "aoe",
  },
  IceWizard: {
    cost: 3,
    hp: 350,
    dmg: 40,
    spd: 50,
    range: 90,
    aggro: 180,
    atkSpd: 1.5,
    color: 0x88ffff,
    size: 26,
    type: "aoe",
  },
  ElectroWizard: {
    cost: 4,
    hp: 350,
    dmg: 60,
    spd: 50,
    range: 90,
    aggro: 180,
    atkSpd: 1.8,
    color: 0xffffaa,
    size: 28,
    type: "ranged",
  },
  DartGoblin: {
    cost: 3,
    hp: 150,
    dmg: 30,
    spd: 70,
    range: 100,
    aggro: 200,
    atkSpd: 0.7,
    color: 0x44aa44,
    size: 22,
    type: "ranged",
  },
  CannonCart: {
    cost: 5,
    hp: 600,
    dmg: 90,
    spd: 50,
    range: 90,
    aggro: 180,
    atkSpd: 1.2,
    color: 0xaaaaaa,
    size: 36,
    type: "ranged",
  },
  FlyingMachine: {
    cost: 4,
    hp: 300,
    dmg: 60,
    spd: 50,
    range: 100,
    aggro: 200,
    atkSpd: 1.1,
    color: 0xddaa55,
    size: 32,
    type: "ranged",
  },
  MegaKnight: {
    cost: 7,
    hp: 1600,
    dmg: 120,
    spd: 50,
    range: 15,
    aggro: 150,
    atkSpd: 1.7,
    color: 0x222222,
    size: 46,
    type: "aoe",
  },
  RoyalGiant: {
    cost: 6,
    hp: 1400,
    dmg: 100,
    spd: 30,
    range: 90,
    aggro: 0,
    atkSpd: 1.7,
    color: 0xcc9966,
    size: 44,
    type: "ranged",
    targetsTowersOnly: true,
  },
  RamRider: {
    cost: 5,
    hp: 900,
    dmg: 80,
    spd: 70,
    range: 15,
    aggro: 0,
    atkSpd: 1.5,
    color: 0xaa5533,
    size: 36,
    type: "melee",
    targetsTowersOnly: true,
  },

  EliteBarbarian: {
    cost: 3,
    hp: 500,
    dmg: 100,
    spd: 80,
    range: 10,
    aggro: 150,
    atkSpd: 1.5,
    color: 0xddaa11,
    size: 30,
    type: "melee",
  },
  Barbarian: {
    cost: 1.25,
    hp: 300,
    dmg: 60,
    spd: 45,
    range: 10,
    aggro: 150,
    atkSpd: 1.4,
    color: 0xddaa11,
    size: 28,
    type: "melee",
  },
  Minion: {
    cost: 1,
    hp: 100,
    dmg: 30,
    spd: 60,
    range: 20,
    aggro: 150,
    atkSpd: 1.0,
    color: 0x2222ff,
    size: 20,
    type: "melee",
  },
  SpearGoblin: {
    cost: 0.6,
    hp: 80,
    dmg: 20,
    spd: 70,
    range: 90,
    aggro: 180,
    atkSpd: 1.7,
    color: 0x55ee55,
    size: 18,
    type: "ranged",
  },
  Bat: {
    cost: 0.4,
    hp: 40,
    dmg: 20,
    spd: 80,
    range: 10,
    aggro: 150,
    atkSpd: 1.1,
    color: 0x111111,
    size: 14,
    type: "melee",
  },
  FireSpirit: {
    cost: 0.5,
    hp: 50,
    dmg: 80,
    spd: 80,
    range: 10,
    aggro: 150,
    atkSpd: 1.0,
    color: 0xff5522,
    size: 16,
    type: "aoe",
  },
  Zappy: {
    cost: 1.3,
    hp: 120,
    dmg: 30,
    spd: 45,
    range: 70,
    aggro: 180,
    atkSpd: 2.0,
    color: 0x66bbff,
    size: 20,
    type: "ranged",
  },

  EliteBarbarians: {
    cost: 6,
    isSwarm: true,
    swarmCount: 2,
    spawnRadius: 20,
    spawnTroop: "EliteBarbarian",
    color: 0xddaa11,
  },
  Barbarians: {
    cost: 5,
    isSwarm: true,
    swarmCount: 4,
    spawnRadius: 25,
    spawnTroop: "Barbarian",
    color: 0xddaa11,
  },
  Minions: {
    cost: 3,
    isSwarm: true,
    swarmCount: 3,
    spawnRadius: 20,
    spawnTroop: "Minion",
    color: 0x2222ff,
  },
  MinionHorde: {
    cost: 5,
    isSwarm: true,
    swarmCount: 6,
    spawnRadius: 35,
    spawnTroop: "Minion",
    color: 0x2222ff,
  },
  SpearGoblins: {
    cost: 2,
    isSwarm: true,
    swarmCount: 3,
    spawnRadius: 20,
    spawnTroop: "SpearGoblin",
    color: 0x55ee55,
  },
  Bats: {
    cost: 2,
    isSwarm: true,
    swarmCount: 5,
    spawnRadius: 25,
    spawnTroop: "Bat",
    color: 0x111111,
  },
  FireSpirits: {
    cost: 1.5,
    isSwarm: true,
    swarmCount: 3,
    spawnRadius: 15,
    spawnTroop: "FireSpirit",
    color: 0xff5522,
  },
  Zappies: {
    cost: 4,
    isSwarm: true,
    swarmCount: 3,
    spawnRadius: 25,
    spawnTroop: "Zappy",
    color: 0x66bbff,
  },
};

window.playerDeck = [
  "Knight",
  "Archer",
  "Giant",
  "SkeletonArmy",
  "MiniPekka",
  "Skeleton",
  "Musket",
  "Valkyrie",
];

class HomeScene extends Phaser.Scene {
  constructor() {
    super("HomeScene");
  }
  create() {
    this.cameras.main.setBackgroundColor("#1e1e1e");

    this.add
      .text(225, 300, "CLASH BROS", {
        fontSize: "36px",
        fill: "#ffcc00",
        fontStyle: "bold",
      })
      .setOrigin(0.5);
    this.add
      .text(225, 350, "<— Swipe Left for Deck", {
        fontSize: "16px",
        fill: "#888888",
      })
      .setOrigin(0.5);

    const playBtn = this.add
      .rectangle(225, 550, 240, 70, 0x3296ff, 1)
      .setInteractive({ useHandCursor: true });
    this.add
      .text(225, 550, "BATTLE", {
        fontSize: "28px",
        fill: "#fff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    playBtn.on("pointerdown", () => this.scene.start("ModeSelectScene"));

    this.input.on("pointerup", (pointer) => {
      const swipeTime = pointer.upTime - pointer.downTime;
      const swipeDistX = pointer.upX - pointer.downX;
      if (swipeTime < 1000 && swipeDistX < -50) this.scene.start("DeckScene");
    });
  }
}

class ModeSelectScene extends Phaser.Scene {
  constructor() {
    super("ModeSelectScene");
  }
  create() {
    this.cameras.main.setBackgroundColor("#1e1e1e");
    this.add
      .text(225, 200, "Select Mode", {
        fontSize: "28px",
        fill: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    const randomBtn = this.add
      .rectangle(225, 350, 280, 60, 0x2e8b57, 1)
      .setInteractive({ useHandCursor: true });
    this.add
      .text(225, 350, "Random Match", { fontSize: "20px", fill: "#fff" })
      .setOrigin(0.5);
    randomBtn.on("pointerdown", () =>
      this.scene.start("WaitingScene", { mode: "random" }),
    );

    const hostBtn = this.add
      .rectangle(225, 450, 280, 60, 0x8b4513, 1)
      .setInteractive({ useHandCursor: true });
    this.add
      .text(225, 450, "Host with Code", { fontSize: "20px", fill: "#fff" })
      .setOrigin(0.5);
    hostBtn.on("pointerdown", () =>
      this.scene.start("WaitingScene", { mode: "host" }),
    );

    const joinBtn = this.add
      .rectangle(225, 550, 280, 60, 0x6464fa, 1)
      .setInteractive({ useHandCursor: true });
    this.add
      .text(225, 550, "Join with Code", { fontSize: "20px", fill: "#fff" })
      .setOrigin(0.5);
    joinBtn.on("pointerdown", () =>
      this.scene.start("WaitingScene", { mode: "join" }),
    );

    const backBtn = this.add
      .text(225, 700, "[ BACK ]", { fontSize: "20px", fill: "#ff5555" })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });
    backBtn.on("pointerdown", () => this.scene.start("HomeScene"));
  }
}

class DeckScene extends Phaser.Scene {
  constructor() {
    super("DeckScene");
  }
  create() {
    this.cameras.main.setBackgroundColor("#111111");

    // UI Elements (High Depth to stay above scrolling)
    this.add
      .text(225, 50, "YOUR DECK", {
        fontSize: "24px",
        fill: "#ffcc00",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setDepth(20);
    this.add
      .text(225, 80, "Swipe Right for Home —>", {
        fontSize: "16px",
        fill: "#888888",
      })
      .setOrigin(0.5)
      .setDepth(20);
    this.add
      .text(225, 410, "1. Tap a card above\n2. Tap a card below to swap", {
        fontSize: "14px",
        fill: "#aaaaaa",
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(20);

    // "Curtain" panel to hide collection cards scrolling under the active deck
    this.add.rectangle(0, 0, 450, 450, 0x111111).setOrigin(0, 0).setDepth(15);
    this.add
      .text(225, 470, "COLLECTION (Scroll Down)", {
        fontSize: "20px",
        fill: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setDepth(20);
    this.add.rectangle(0, 450, 450, 40, 0x111111).setOrigin(0, 0).setDepth(15);

    this.selectedSlotIndex = null;

    // Containers
    this.deckContainer = this.add.container(0, 0).setDepth(20);
    this.collectionContainer = this.add.container(0, 0).setDepth(5);

    this.refreshUI();

    // VERTICAL SCROLLING LOGIC
    let isScrolling = false;
    let startY = 0;
    let startContainerY = 0;

    this.input.on("pointerdown", (pointer) => {
      if (pointer.y > 450) {
        // Only scroll if interacting with collection area
        isScrolling = true;
        startY = pointer.y;
        startContainerY = this.collectionContainer.y;
      }
    });

    this.input.on("pointermove", (pointer) => {
      if (isScrolling) {
        let dy = pointer.y - startY;
        this.collectionContainer.y = startContainerY + dy;

        // Clamp bounds based on total 50 cards
        const totalRows = Math.ceil(Object.keys(CARD_DATA).length / 4);
        const maxScroll = -(totalRows * 110 - 400);

        if (this.collectionContainer.y > 0) this.collectionContainer.y = 0;
        if (this.collectionContainer.y < maxScroll)
          this.collectionContainer.y = maxScroll;
      }
    });

    this.input.on("pointerup", (pointer) => {
      isScrolling = false;

      const swipeTime = pointer.upTime - pointer.downTime;
      const swipeDistX = pointer.upX - pointer.downX;
      const swipeDistY = Math.abs(pointer.upY - pointer.downY);

      // Swipe Right to go Home (ensures it wasn't a vertical scroll)
      if (swipeTime < 1000 && swipeDistX > 50 && swipeDistY < 50) {
        this.scene.start("HomeScene");
      }
    });
  }

  refreshUI() {
    this.deckContainer.removeAll(true);
    this.collectionContainer.removeAll(true);

    // Render Active Deck (Top)
    for (let i = 0; i < 8; i++) {
      const cardName = window.playerDeck[i];
      const x = 60 + (i % 4) * 110;
      const y = 160 + Math.floor(i / 4) * 110;

      const isSelected = this.selectedSlotIndex === i;
      const container = this.add.container(x, y);
      const bg = this.add.rectangle(
        0,
        0,
        80,
        90,
        isSelected ? 0xffcc00 : CARD_DATA[cardName].color,
      );
      const txt = this.add
        .text(0, 0, `${cardName}\n(${CARD_DATA[cardName].cost})`, {
          fontSize: "14px",
          fill: "#000",
          align: "center",
          fontStyle: "bold",
        })
        .setOrigin(0.5);
      container.add([bg, txt]);
      container.setSize(80, 90);
      container.setInteractive({
        hitArea: new Phaser.Geom.Rectangle(-40, -45, 80, 90),
        hitAreaCallback: Phaser.Geom.Rectangle.Contains,
      });

      container.on("pointerup", (pointer) => {
        if (pointer.getDistance() < 10) {
          // Distance check prevents tap registering during scroll
          this.selectedSlotIndex = i;
          this.refreshUI();
        }
      });
      this.deckContainer.add(container);
    }

    // Render 50 Collection Cards (Bottom, Scrollable)
    const allCards = Object.keys(CARD_DATA);
    for (let i = 0; i < allCards.length; i++) {
      const cardName = allCards[i];
      const x = 60 + (i % 4) * 110;
      const y = 530 + Math.floor(i / 4) * 110; // Start lower down

      const inDeck = window.playerDeck.includes(cardName);
      const container = this.add.container(x, y);
      const visualColor = CARD_DATA[cardName].color || 0xdddddd;

      const bg = this.add.rectangle(0, 0, 80, 90, visualColor);
      const txt = this.add
        .text(0, 0, `${cardName}\n(${CARD_DATA[cardName].cost})`, {
          fontSize: "14px",
          fill: "#000",
          align: "center",
          fontStyle: "bold",
        })
        .setOrigin(0.5);
      container.add([bg, txt]);
      container.setSize(80, 90);

      if (inDeck) {
        container.setAlpha(0.3);
      } else {
        container.setInteractive({
          hitArea: new Phaser.Geom.Rectangle(-40, -45, 80, 90),
          hitAreaCallback: Phaser.Geom.Rectangle.Contains,
        });
        container.on("pointerup", (pointer) => {
          if (pointer.getDistance() < 10) {
            // Safety check
            if (this.selectedSlotIndex !== null) {
              window.playerDeck[this.selectedSlotIndex] = cardName;
              this.selectedSlotIndex = null;
              this.refreshUI();
            }
          }
        });
      }
      this.collectionContainer.add(container);
    }
  }
}

class WaitingScene extends Phaser.Scene {
  constructor() {
    super("WaitingScene");
  }
  init(data) {
    this.mode = data.mode || "random";
  }
  create() {
    this.cameras.main.setBackgroundColor("#1e1e1e");
    this.statusText = this.add
      .text(225, 400, "Connecting to server...", {
        fontSize: "24px",
        fill: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5);

    const cancelBtn = this.add
      .text(225, 700, "[ CANCEL ]", { fontSize: "20px", fill: "#ff5555" })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });
    cancelBtn.on("pointerdown", () => {
      socket.disconnect();
      socket.connect();
      this.scene.start("HomeScene");
    });

    socket.on("waiting", () =>
      this.statusText.setText("Searching for opponent..."),
    );
    socket.on("room_created", (code) =>
      this.statusText.setText(
        `Room Created!\n\nShare Code:\n[ ${code} ]\n\nWaiting for friend...`,
      ),
    );
    socket.on("error_msg", (msg) => {
      alert(msg);
      this.scene.start("ModeSelectScene");
    });
    socket.on("match_start", () => {
      this.statusText.setText("Match Found! Starting...");
      this.time.delayedCall(300, () => this.scene.start("GameScene"));
    });

    if (this.mode === "random") socket.emit("join_random");
    else if (this.mode === "host") socket.emit("create_friend_room");
    else if (this.mode === "join") {
      const code = prompt("Enter 5-Digit Room Code:");
      if (code && code.length === 5) socket.emit("join_friend_room", code);
      else this.scene.start("ModeSelectScene");
    }
  }
}

class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  create() {
    const cols = 18;
    const rows = 32;
    const tw = 25;
    const th = 25;
    const RIVER_Y = 400;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        let color;
        let isRiver = row === 15 || row === 16;
        let isBridge =
          isRiver && ((col >= 2 && col <= 4) || (col >= 13 && col <= 15));

        if (isBridge) color = (row + col) % 2 === 0 ? 0x8b4513 : 0xa0522d;
        else if (isRiver) color = (row + col) % 2 === 0 ? 0x3296ff : 0x1e90ff;
        else color = (row + col) % 2 === 0 ? 0x2e8b57 : 0x3cb371;

        this.add.rectangle(col * tw, row * th, tw, th, color).setOrigin(0, 0);
      }
    }

    this.bridges = [
      { x: 87.5, y: RIVER_Y },
      { x: 362.5, y: RIVER_Y },
    ];
    this.waterBlocks = [
      { rx: 0, ry: 375, rw: 50, rh: 50 },
      { rx: 125, ry: 375, rw: 200, rh: 50 },
      { rx: 400, ry: 375, rw: 50, rh: 50 },
    ];

    this.troops = this.add.group();
    this.towers = this.add.group();
    this.projectiles = this.add.group();

    this.debugGraphics = this.add.graphics().setDepth(200);

    this.spawnTower(225, 700, true, false, 4 * tw, 4 * th);
    this.spawnTower(87.5, 612.5, false, false, 3 * tw, 3 * th);
    this.spawnTower(362.5, 612.5, false, false, 3 * tw, 3 * th);
    this.spawnTower(225, 100, true, true, 4 * tw, 4 * th);
    this.spawnTower(87.5, 187.5, false, true, 3 * tw, 3 * th);
    this.spawnTower(362.5, 187.5, false, true, 3 * tw, 3 * th);

    // FIXED OVERLAP: HUD lowered to 825 to create a strict 25px physical gap below the 800px map
    const HUD_Y = 825;
    this.add
      .rectangle(0, HUD_Y, 450, 150, 0x111111)
      .setOrigin(0, 0)
      .setDepth(9);

    let playerDeck = [...window.playerDeck].sort(() => Math.random() - 0.5);
    this.hand = playerDeck.slice(0, 4);
    this.drawQueue = playerDeck.slice(4, 8);

    this.SLOTS = [
      { x: 75, y: HUD_Y + 55 },
      { x: 175, y: HUD_Y + 55 },
      { x: 275, y: HUD_Y + 55 },
      { x: 375, y: HUD_Y + 55 },
    ];

    this.selectedCard = null;
    this.isDragging = false;

    for (let i = 0; i < 4; i++) this.createCardUI(this.hand[i], i);

    this.currentElixir = 5;
    this.add
      .rectangle(25, HUD_Y + 120, 400, 16, 0x333333)
      .setOrigin(0, 0)
      .setDepth(10);
    this.elixirBar = this.add
      .rectangle(25, HUD_Y + 120, 400, 16, 0xff33cc)
      .setOrigin(0, 0)
      .setDepth(10);
    this.elixirText = this.add
      .text(225, HUD_Y + 128, "Elixir: 5/10", {
        fontSize: "14px",
        fill: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setDepth(11);

    this.time.addEvent({
      delay: 2000,
      callback: () => {
        if (this.currentElixir < 10) this.currentElixir++;
      },
      loop: true,
    });

    this.add.rectangle(225, 20, 70, 30, 0x000000, 0.7).setDepth(9);
    this.timerText = this.add
      .text(225, 20, "3:00", {
        fontSize: "18px",
        fill: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setDepth(10);

    const leaveBtn = this.add
      .rectangle(400, 20, 70, 30, 0xff0000, 0.7)
      .setDepth(9)
      .setInteractive({ useHandCursor: true });
    this.add
      .text(400, 20, "LEAVE", {
        fontSize: "14px",
        fill: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setDepth(10);
    leaveBtn.on("pointerdown", () => {
      socket.emit("leave_match");
      this.scene.start("ResultScene", { msg: "YOU LEFT THE MATCH" });
    });

    this.input.on("pointerdown", (pointer, gameObjects) => {
      if (gameObjects.length > 0) return;

      if (pointer.y < 800 && this.selectedCard && !this.isDragging) {
        const dropX = pointer.x;
        const dropY = pointer.y;
        const cost = this.selectedCard.getData("cost");

        if (dropY > 425 && this.currentElixir >= cost) {
          this.currentElixir -= cost;
          this.spawnTroop(
            dropX,
            dropY,
            this.selectedCard.getData("name"),
            false,
          );
          socket.emit("play_card", {
            troopName: this.selectedCard.getData("name"),
            x: dropX,
            y: dropY,
          });

          const slotIndex = this.selectedCard.getData("slotIndex");
          const nextCard = this.drawQueue.shift();
          this.drawQueue.push(this.selectedCard.getData("name"));
          this.selectedCard.destroy();
          this.selectedCard = null;
          this.createCardUI(nextCard, slotIndex);
        } else {
          if (this.selectedCard.active) {
            this.selectedCard.y = this.selectedCard.getData("homeY");
            this.selectedCard.setDepth(10);
          }
          this.selectedCard = null;
        }
      }
    });

    socket.on("opponent_played", (data) => {
      this.spawnTroop(450 - data.x, 800 - data.y, data.troopName, true);
    });
    socket.on("timer_update", (time) => {
      this.timerText.setText(
        `${Math.floor(time / 60)}:${time % 60 < 10 ? "0" : ""}${time % 60}`,
      );
    });
    socket.on("time_up", () => this.handleTimeUp());
    socket.on("opponent_disconnected", () =>
      this.scene.start("ResultScene", { msg: "OPPONENT LEFT. YOU WIN!" }),
    );
  }

  createCardUI(troopName, slotIndex) {
    const stats = CARD_DATA[troopName];
    const pos = this.SLOTS[slotIndex];
    const container = this.add.container(pos.x, pos.y);

    const bgCol = stats.color || 0xdddddd;
    const bg = this.add.rectangle(0, 0, 70, 90, bgCol);
    const txt = this.add
      .text(0, 0, `${troopName}\n(${stats.cost})`, {
        fontSize: "14px",
        fill: "#000",
        align: "center",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    container.add([bg, txt]);
    container.setSize(70, 90);
    container.setInteractive({
      hitArea: new Phaser.Geom.Rectangle(-35, -45, 70, 90),
      hitAreaCallback: Phaser.Geom.Rectangle.Contains,
      draggable: true,
    });

    container.setData({
      name: troopName,
      cost: stats.cost,
      slotIndex: slotIndex,
      homeX: pos.x,
      homeY: pos.y,
    });
    container.setDepth(10);

    container.on("pointerup", (pointer) => {
      if (!this.isDragging) {
        if (this.selectedCard === container) {
          container.y = container.getData("homeY");
          this.selectedCard = null;
        } else {
          if (this.selectedCard && this.selectedCard.active) {
            this.selectedCard.y = this.selectedCard.getData("homeY");
          }
          this.selectedCard = container;
          container.y = pos.y - 20;
        }
      }
    });

    this.input.on("dragstart", (pointer, gameObject) => {
      this.isDragging = true;
      if (
        this.selectedCard &&
        this.selectedCard !== gameObject &&
        this.selectedCard.active
      ) {
        this.selectedCard.y = this.selectedCard.getData("homeY");
        this.selectedCard.setDepth(10);
      }
      this.selectedCard = gameObject;
      gameObject.setDepth(100);
    });

    this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    this.input.on("dragend", (pointer, gameObject) => {
      this.isDragging = false;
      const dropX = gameObject.x;
      const dropY = gameObject.y;
      const cost = gameObject.getData("cost");

      if (dropY < 800 && dropY > 425 && this.currentElixir >= cost) {
        this.currentElixir -= cost;
        this.spawnTroop(dropX, dropY, gameObject.getData("name"), false);
        socket.emit("play_card", {
          troopName: gameObject.getData("name"),
          x: dropX,
          y: dropY,
        });

        const sIdx = gameObject.getData("slotIndex");
        const nextCard = this.drawQueue.shift();
        this.drawQueue.push(gameObject.getData("name"));
        gameObject.destroy();
        this.selectedCard = null;
        this.createCardUI(nextCard, sIdx);
      } else {
        gameObject.x = gameObject.getData("homeX");
        gameObject.y = gameObject.getData("homeY");
        gameObject.setDepth(10);
        this.selectedCard = null;
      }
    });
  }

  spawnTower(x, y, isKing, isEnemy, w, h) {
    const color = isEnemy ? 0xff3333 : 0x3333ff;
    const container = this.add.container(x, y);

    const body = this.add.rectangle(0, 0, w, h, color);
    const hpBg = this.add.rectangle(0, -h / 2 - 10, w, 6, 0x000000);
    const hpFg = this.add
      .rectangle(-w / 2, -h / 2 - 10, w, 6, 0x00ff00)
      .setOrigin(0, 0.5);

    container.add([body, hpBg, hpFg]);
    container.maxHp = isKing ? 2000 : 1000;
    container.hp = container.maxHp;
    container.isKing = isKing;
    container.isEnemy = isEnemy;
    container.hpBar = hpFg;

    container.stats = {
      range: isKing ? 140 : 120,
      dmg: isKing ? 50 : 75,
      atkSpd: 0.9,
      size: Math.max(w, h),
    };
    container.isActive = !isKing;
    container.lastAttackTime = 0;
    this.towers.add(container);
  }

  spawnTroop(x, y, name, isEnemy) {
    const stats = CARD_DATA[name];
    if (stats.isSwarm) {
      for (let i = 0; i < stats.swarmCount; i++) {
        let angle = (i / stats.swarmCount) * Math.PI * 2;
        let offsetX = Math.cos(angle) * stats.spawnRadius;
        let offsetY = Math.sin(angle) * stats.spawnRadius;
        this._spawnSingleUnit(
          x + offsetX,
          y + offsetY,
          stats.spawnTroop,
          isEnemy,
        );
      }
    } else {
      this._spawnSingleUnit(x, y, name, isEnemy);
    }
  }

  _spawnSingleUnit(x, y, name, isEnemy) {
    const stats = CARD_DATA[name];
    const container = this.add.container(x, y);
    const body = this.add.rectangle(0, 0, stats.size, stats.size, stats.color);
    const hpBg = this.add.rectangle(
      0,
      -stats.size / 2 - 8,
      stats.size,
      4,
      0x000000,
    );
    const hpFg = this.add
      .rectangle(-stats.size / 2, -stats.size / 2 - 8, stats.size, 4, 0x00ff00)
      .setOrigin(0, 0.5);

    container.add([body, hpBg, hpFg]);
    container.bodyRect = body;
    container.stats = stats;
    container.maxHp = stats.hp;
    container.hp = container.maxHp;
    container.isEnemy = isEnemy;
    container.lastAttackTime = 0;
    container.hpBar = hpFg;
    container.setDepth(5);
    this.troops.add(container);
  }

  spawnProjectile(x, y, target, dmg, color) {
    const proj = this.add.circle(x, y, 6, color);
    proj.target = target;
    proj.dmg = dmg;
    proj.speed = 450;
    proj.setDepth(6);
    this.projectiles.add(proj);
  }

  update(time, delta) {
    this.elixirBar.width = (this.currentElixir / 10) * 400;
    this.elixirText.setText(`Elixir: ${Math.floor(this.currentElixir)}/10`);
    const RIVER_Y = 400;

    if (window.isDev) {
      this.debugGraphics.clear();
      this.troops.getChildren().forEach((t) => {
        this.debugGraphics.lineStyle(1, 0xff0000, 0.6);
        this.debugGraphics.strokeCircle(
          t.x,
          t.y,
          t.stats.size / 2 + t.stats.range,
        );
      });
      this.towers.getChildren().forEach((t) => {
        this.debugGraphics.lineStyle(1, 0x0000ff, 0.6);
        this.debugGraphics.strokeCircle(
          t.x,
          t.y,
          t.stats.size / 2 + t.stats.range,
        );
      });
    }

    this.projectiles.getChildren().forEach((p) => {
      if (!p.target || !p.target.active) {
        p.destroy();
        return;
      }
      const dist = Phaser.Math.Distance.Between(
        p.x,
        p.y,
        p.target.x,
        p.target.y,
      );
      if (dist < 15) {
        p.target.hp -= p.dmg;
        this.checkDeath(p.target);
        p.destroy();
      } else {
        const angle = Phaser.Math.Angle.Between(
          p.x,
          p.y,
          p.target.x,
          p.target.y,
        );
        p.x += Math.cos(angle) * p.speed * (delta / 1000);
        p.y += Math.sin(angle) * p.speed * (delta / 1000);
      }
    });

    this.towers.getChildren().forEach((tower) => {
      tower.hpBar.scaleX = Math.max(0, tower.hp / tower.maxHp);

      if (window.isDevStatic) return;

      if (tower.isKing && tower.hp < tower.maxHp) tower.isActive = true;
      if (!tower.isActive) return;

      let target = null;
      let minDist = tower.stats.range;
      const tRad = tower.stats.size / 2;

      this.troops.getChildren().forEach((enemy) => {
        if (tower.isEnemy !== enemy.isEnemy) {
          const eRad = enemy.stats.size / 2;
          const dist =
            Phaser.Math.Distance.Between(tower.x, tower.y, enemy.x, enemy.y) -
            tRad -
            eRad;
          if (dist <= minDist) {
            minDist = dist;
            target = enemy;
          }
        }
      });

      if (target && time - tower.lastAttackTime > tower.stats.atkSpd * 1000) {
        tower.lastAttackTime = time;
        this.spawnProjectile(
          tower.x,
          tower.y,
          target,
          tower.stats.dmg,
          0x111111,
        );
      }
    });

    this.troops.getChildren().forEach((troop) => {
      troop.hpBar.scaleX = Math.max(0, troop.hp / troop.maxHp);
      const tRad = troop.stats.size / 2;

      this.waterBlocks.forEach((wb) => {
        let testX = troop.x;
        let testY = troop.y;
        if (troop.x < wb.rx) testX = wb.rx;
        else if (troop.x > wb.rx + wb.rw) testX = wb.rx + wb.rw;
        if (troop.y < wb.ry) testY = wb.ry;
        else if (troop.y > wb.ry + wb.rh) testY = wb.ry + wb.rh;

        let dx = troop.x - testX;
        let dy = troop.y - testY;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < tRad && dist > 0) {
          let overlap = tRad - dist;
          troop.x += (dx / dist) * overlap;
          troop.y += (dy / dist) * overlap;
        }
      });

      this.towers.getChildren().forEach((tower) => {
        const dx = troop.x - tower.x;
        const dy = troop.y - tower.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minTDist = tower.stats.size / 2 + tRad;
        if (dist < minTDist && dist > 0) {
          const overlap = minTDist - dist;
          troop.x += (dx / dist) * overlap;
          troop.y += (dy / dist) * overlap;
        }
      });

      this.troops.getChildren().forEach((other) => {
        if (troop !== other) {
          const dx = troop.x - other.x;
          const dy = troop.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = other.stats.size / 2 + tRad;
          if (dist < minDist && dist > 0.01) {
            const overlap = minDist - dist;
            troop.x += (dx / dist) * overlap * 0.1;
            troop.y += (dy / dist) * overlap * 0.1;
          }
        }
      });

      if (window.isDevStatic) return;

      let closestEnemy = null;
      let minEnemyDist = Infinity;
      if (!troop.stats.targetsTowersOnly) {
        minEnemyDist = troop.stats.aggro;
        this.troops.getChildren().forEach((enemy) => {
          if (troop.isEnemy !== enemy.isEnemy) {
            const eRad = enemy.stats.size / 2;
            const dist =
              Phaser.Math.Distance.Between(troop.x, troop.y, enemy.x, enemy.y) -
              tRad -
              eRad;
            if (dist < minEnemyDist) {
              minEnemyDist = dist;
              closestEnemy = enemy;
            }
          }
        });
      }

      let nearestTower = null;
      let minTowerDist = Infinity;
      this.towers.getChildren().forEach((tower) => {
        if (troop.isEnemy !== tower.isEnemy) {
          const dist =
            Phaser.Math.Distance.Between(troop.x, troop.y, tower.x, tower.y) -
            tRad -
            tower.stats.size / 2;
          if (dist < minTowerDist) {
            minTowerDist = dist;
            nearestTower = tower;
          }
        }
      });

      let rawTarget = nearestTower;
      if (!troop.stats.targetsTowersOnly && closestEnemy) {
        if (minEnemyDist < minTowerDist) {
          rawTarget = closestEnemy;
        }
      }

      if (!rawTarget) return;

      let moveTarget = null;
      let isTargetAnEntity = false;

      const amIOnBottom = troop.y > RIVER_Y;
      const targetOnBottom = rawTarget.y > RIVER_Y;

      const onBridgeX =
        (troop.x >= 50 && troop.x <= 125) || (troop.x >= 325 && troop.x <= 400);
      const nearRiver = Math.abs(troop.y - RIVER_Y) <= 35;

      if (amIOnBottom !== targetOnBottom) {
        const targetRad = rawTarget.stats.size / 2;
        const distToRawTarget =
          Phaser.Math.Distance.Between(
            troop.x,
            troop.y,
            rawTarget.x,
            rawTarget.y,
          ) -
          tRad -
          targetRad;

        if (distToRawTarget <= troop.stats.range) {
          moveTarget = rawTarget;
          isTargetAnEntity = true;
        } else if (nearRiver && onBridgeX) {
          moveTarget = rawTarget;
          isTargetAnEntity = true;
        } else {
          const b1 = this.bridges[0];
          const b2 = this.bridges[1];
          const d1 = Phaser.Math.Distance.Between(troop.x, troop.y, b1.x, b1.y);
          const d2 = Phaser.Math.Distance.Between(troop.x, troop.y, b2.x, b2.y);
          moveTarget = d2 < d1 ? b2 : b1;
          isTargetAnEntity = false;
        }
      } else {
        moveTarget = rawTarget;
        isTargetAnEntity = true;
      }

      let edgeToEdgeDist = Infinity;
      if (isTargetAnEntity) {
        const targetRad = moveTarget.stats.size ? moveTarget.stats.size / 2 : 0;
        edgeToEdgeDist =
          Phaser.Math.Distance.Between(
            troop.x,
            troop.y,
            moveTarget.x,
            moveTarget.y,
          ) -
          tRad -
          targetRad;
      }

      if (isTargetAnEntity && edgeToEdgeDist <= troop.stats.range) {
        if (time - troop.lastAttackTime > troop.stats.atkSpd * 1000) {
          troop.lastAttackTime = time;

          if (troop.stats.type === "ranged") {
            this.spawnProjectile(
              troop.x,
              troop.y,
              moveTarget,
              troop.stats.dmg,
              troop.stats.color,
            );
          } else if (troop.stats.type === "aoe") {
            this.tweens.add({
              targets: troop.bodyRect,
              angle: "+=360",
              duration: 300,
            });
            this.troops.getChildren().forEach((enemy) => {
              if (troop.isEnemy !== enemy.isEnemy) {
                const dist =
                  Phaser.Math.Distance.Between(
                    troop.x,
                    troop.y,
                    enemy.x,
                    enemy.y,
                  ) -
                  tRad -
                  enemy.stats.size / 2;
                if (dist <= troop.stats.range) {
                  enemy.hp -= troop.stats.dmg;
                  this.checkDeath(enemy);
                }
              }
            });
            this.towers.getChildren().forEach((tower) => {
              if (troop.isEnemy !== tower.isEnemy) {
                const dist =
                  Phaser.Math.Distance.Between(
                    troop.x,
                    troop.y,
                    tower.x,
                    tower.y,
                  ) -
                  tRad -
                  tower.stats.size / 2;
                if (dist <= troop.stats.range) {
                  tower.hp -= troop.stats.dmg;
                  this.checkDeath(tower);
                }
              }
            });
          } else {
            moveTarget.hp -= troop.stats.dmg;
            this.checkDeath(moveTarget);
          }
        }
      } else {
        const angle = Phaser.Math.Angle.Between(
          troop.x,
          troop.y,
          moveTarget.x,
          moveTarget.y,
        );
        const velocity = troop.stats.spd * (delta / 1000);
        troop.x += Math.cos(angle) * velocity;
        troop.y += Math.sin(angle) * velocity;
      }
    });
  }

  checkDeath(entity) {
    if (entity.hp <= 0) {
      if (this.towers.contains(entity)) {
        if (entity.isKing) {
          this.scene.start("ResultScene", {
            msg: entity.isEnemy
              ? "3 CROWNS! YOU WIN"
              : "OPPONENT 3 CROWNED YOU!",
          });
        } else {
          this.towers.getChildren().forEach((t) => {
            if (t.isKing && t.isEnemy === entity.isEnemy) t.isActive = true;
          });
        }
        entity.destroy();
      } else {
        entity.destroy();
      }
    }
  }

  handleTimeUp() {
    let pHealth = 0,
      eHealth = 0;
    this.towers.getChildren().forEach((t) => {
      if (t.isEnemy) eHealth += t.hp;
      else pHealth += t.hp;
    });

    if (pHealth > eHealth)
      this.scene.start("ResultScene", { msg: "TIME UP! YOU WIN!" });
    else if (eHealth > pHealth)
      this.scene.start("ResultScene", { msg: "TIME UP! YOU LOSE!" });
    else this.scene.start("ResultScene", { msg: "TIME UP! DRAW!" });
  }
}

class ResultScene extends Phaser.Scene {
  constructor() {
    super("ResultScene");
  }
  init(data) {
    this.msg = data.msg || "GAME OVER";
  }
  create() {
    this.cameras.main.setBackgroundColor("#111111");
    this.add
      .text(225, 475, this.msg, { fontSize: "28px", fill: "#ffffff" })
      .setOrigin(0.5);

    this.input.on("pointerdown", () => {
      socket.disconnect();
      socket.connect();
      this.scene.start("HomeScene");
    });
  }
}

const config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 450,
    height: 975,
  },
  scene: [
    HomeScene,
    ModeSelectScene,
    DeckScene,
    WaitingScene,
    GameScene,
    ResultScene,
  ],
};
const game = new Phaser.Game(config);

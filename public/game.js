const socket = io();

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
};

class WaitingScene extends Phaser.Scene {
  constructor() {
    super("WaitingScene");
  }
  create() {
    this.cameras.main.setBackgroundColor("#1e1e1e");
    const statusText = this.add
      .text(225, 475, "Connecting to server...", {
        fontSize: "24px",
        fill: "#ffffff",
      })
      .setOrigin(0.5);

    socket.on("waiting", () => statusText.setText("Waiting for opponent..."));
    socket.on("match_start", () => {
      statusText.setText("Match Found! Starting...");
      this.time.delayedCall(300, () => this.scene.start("GameScene"));
    });
    socket.emit("join_game");
  }
}

class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  create() {
    // --- 1. PERFECT TILE GRID (18x32 tiles, 25x25px each) ---
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

        if (isBridge) {
          color = (row + col) % 2 === 0 ? 0x8b4513 : 0xa0522d;
        } else if (isRiver) {
          color = (row + col) % 2 === 0 ? 0x3296ff : 0x1e90ff;
        } else {
          color = (row + col) % 2 === 0 ? 0x2e8b57 : 0x3cb371;
        }

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

    // --- 2. TOWER SPAWNING ---
    this.spawnTower(225, 700, true, false, 4 * tw, 4 * th);
    this.spawnTower(87.5, 612.5, false, false, 3 * tw, 3 * th);
    this.spawnTower(362.5, 612.5, false, false, 3 * tw, 3 * th);
    this.spawnTower(225, 100, true, true, 4 * tw, 4 * th);
    this.spawnTower(87.5, 187.5, false, true, 3 * tw, 3 * th);
    this.spawnTower(362.5, 187.5, false, true, 3 * tw, 3 * th);

    const HUD_Y = 800;

    this.add
      .rectangle(0, HUD_Y, 450, 150, 0x111111)
      .setOrigin(0, 0)
      .setDepth(9);

    let playerDeck = [
      "Knight",
      "Archer",
      "Giant",
      "Goblin",
      "MiniPekka",
      "Skeleton",
      "Musket",
      "Valkyrie",
    ].sort(() => Math.random() - 0.5);
    this.hand = playerDeck.slice(0, 4);
    this.drawQueue = playerDeck.slice(4, 8);

    this.SLOTS = [
      { x: 75, y: HUD_Y + 55 },
      { x: 175, y: HUD_Y + 55 },
      { x: 275, y: HUD_Y + 55 },
      { x: 375, y: HUD_Y + 55 },
    ];

    this.selectedCard = null;

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

    // --- 4. TAP-TO-SELECT AND TAP-TO-PLACE (MOBILE FRIENDLY) ---
    this.input.on("pointerdown", (pointer, gameObjects) => {
      // Ignore clicks on UI elements (cards)
      if (gameObjects.length > 0) return;

      if (pointer.y < HUD_Y && this.selectedCard) {
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
          // Deselect safely on invalid placement
          if (this.selectedCard && this.selectedCard.active) {
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
    const bg = this.add.rectangle(0, 0, 70, 90, stats.color);
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
    container.setInteractive(
      new Phaser.Geom.Rectangle(-35, -45, 70, 90),
      Phaser.Geom.Rectangle.Contains,
    );

    container.setData({
      name: troopName,
      cost: stats.cost,
      slotIndex: slotIndex,
      homeX: pos.x,
      homeY: pos.y,
    });
    container.setDepth(10);

    // Flawless Select/Deselect Toggle
    container.on("pointerdown", () => {
      if (
        this.selectedCard &&
        this.selectedCard !== container &&
        this.selectedCard.active
      ) {
        this.selectedCard.y = this.selectedCard.getData("homeY");
        this.selectedCard.setDepth(10);
      }

      if (this.selectedCard === container) {
        container.y = container.getData("homeY");
        container.setDepth(10);
        this.selectedCard = null;
      } else {
        this.selectedCard = container;
        container.y = pos.y - 20;
        container.setDepth(100);
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

      let closestEnemy = null;
      if (!troop.stats.targetsTowersOnly) {
        let minEnemyDist = troop.stats.aggro;
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

      let rawTarget = closestEnemy ? closestEnemy : nearestTower;
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
  }
}

const config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 450,
    height: 950,
  },
  scene: [WaitingScene, GameScene, ResultScene],
};
const game = new Phaser.Game(config);

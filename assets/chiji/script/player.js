var mvs = require("Matchvs");
var GLB = require("Glb");
cc.Class({
    extends: cc.Component,

    properties: {
        playerSp: {
            default: null,
            type: cc.Sprite
        },
        shieldSp: {
            default: null,
            type: cc.Sprite
        },
        explosionSp: {
            default: null,
            type: cc.Sprite
        },
        firePoint: {
            default: null,
            type: cc.Node
        },
        smokePrefab: {
            default: null,
            type: cc.Prefab
        },
        _camp: Camp.None,
        camp: {
            get() {
                return this._camp;
            },
            set(value) {
                this._camp = value;
            },
            type: Camp
        }
    },

    onLoad: function() {
        this.initPlayerFrame = this.playerSp.spriteFrame;
    },

    init: function(userId) {
        this.gravity = 1500;
        this.currentSpeed = 0;
        this.flySpeed = 600;
        this.ceilY = 430;
        this.groundY = -580;
        this.userId = userId;
        this.isShield = false;
        this.isTrack = false;
        this.shieldSp.node.active = false;
        this.explosionSp.node.active = false;
        this.playerSp.spriteFrame = this.initPlayerFrame;
        this.anim = this.node.getComponent(cc.Animation);
        this.isDied = false;
        this.beChicken = false;
    },

    update: function(dt) {
        this.currentSpeed -= dt * this.gravity;
        this.node.y += dt * this.currentSpeed;
        if (this.node.y < this.groundY) {
            this.node.y = this.groundY;
            if (this.isDied && !this.beChicken) {
                this.beChicken = true;
                this.anim.play("chicken");
            }
        }
        if (this.node.y > this.ceilY) {
            this.node.y = this.ceilY;
            this.currentSpeed = 0;
        }
    },

    getItem: function(itemType) {
        var msg = {
            action: GLB.PLAYER_GET_ITEM_EVENT,
            itemType: itemType,
            playerId: this.userId
        };
        var result = mvs.engine.sendEventEx(0, JSON.stringify(msg), 0, GLB.playerUserIds);
        if (result.result !== 0) {
            console.log("获得物品事件发送失败", result.result);
        }
    },

    getItemNotify: function(cpProto) {
        var itemType = cpProto.itemType;
        switch (itemType) {
            case ItemType.Shield:
                this.setShield(true);
                break;
            case ItemType.Track:
                this.setTrack(true);
                break;
            default:
                break;
        }
    },

    setShield: function(active) {
        this.isShield = active;
        this.shieldSp.node.active = active;
    },

    setTrack: function(active) {
        this.isTrack = active;
    },

    removeItem: function(itemType) {
        var msg = {
            action: GLB.PLAYER_REMOVE_ITEM_EVENT,
            itemType: itemType
        };
        var result = mvs.engine.sendEventEx(0, JSON.stringify(msg), 0, GLB.playerUserIds);
        if (result.result !== 0) {
            console.log("移除物品事件发送失败", result.result);
        }
    },

    removeItemNotify: function(cpProto) {
        var itemType = cpProto.itemType;
        switch (itemType) {
            case ItemType.Shield:
                this.setShield(false);
                break;
            case ItemType.Track:
                this.setTrack(false);
                break;
            default:
                break;
        }
    },

    hurt: function() {
        var msg = {
            action: GLB.PLAYER_HURT_EVENT,
            playerId: this.userId
        };
        var result = mvs.engine.sendEventEx(0, JSON.stringify(msg), 0, GLB.playerUserIds);
        if (result.result !== 0) {
            console.log("受伤事件发送失败", result.result);
        }
    },

    hurtNotify: function() {
        if (Game.GameManager.gameState !== GameState.Play) {
            return;
        }

        if (this.isShield) {
            this.setShield(false);
        } else {
            this.dead();
            clientEvent.dispatch(clientEvent.eventType.playerDead, { playerId: this.userId });
        }
    },

    dead: function() {
        this.isDied = true;
        this.shieldSp.node.active = false;
        this.anim.play('dead');
        this.currentSpeed = -1000;
        if (Math.abs(this.node.y - this.groundY) < 5) {
            if (this.isDied && !this.beChicken) {
                this.beChicken = true;
                setTimeout(function() {
                    this.anim.play("chicken");
                }.bind(this), 1000);
            }
        }
    },

    flyNotify: function() {
        this.currentSpeed = this.flySpeed;
        this.anim.play();
        // smoke
        var smoke = cc.instantiate(this.smokePrefab);
        if (smoke) {
            var worldPos = this.node.convertToWorldSpaceAR(cc.v2(0, -30));
            var localPos = this.node.parent.convertToNodeSpaceAR(worldPos);
            smoke.parent = this.node.parent;
            smoke.position = localPos;
        }
    },

    fireNotify: function() {
        if (this.isDied) {
            return;
        }
        Game.bulletManger.spawnBullet(this);
    }
});

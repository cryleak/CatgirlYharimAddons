import { autoP3Data as data } from "../../utils/data"
import Settings from "../../config"
import { stop, walk, jump, noWalk, edgeJump, renderBoxes, renderRings } from "../../utils/AutoP3Utils"
import { lavaclip, leftClick, rightClick } from "../../utils/utils"
import { swapToItem, calcYawPitch, chat, rotate, slingshot } from "../../utils/utils"
import ServerRotations from "../../utils/ServerRotations"

let inp3 = false;
let cooldown = false;
let selectedRoute = parseInt(Settings().route)
let rings = [];
let toggled = false;

rings = data.rings

register("Chat", () => {
    inp3 = true;
    if (!Settings().autop3) return
    renderRing.register()
    renderMove.register()
}).setCriteria("[BOSS] Storm: I should have known that I stood no chance.")

register("Chat", () => {
    inp3 = false;
    renderMove.unregister()
    renderRing.unregister()
}).setCriteria("[BOSS] Goldor: You have done it, you destroyed the factory…")

register("command", () => {
    data.rings = rings
    data.save()
    chat("Rings saved!")
}).setName("saverings")

register("command", () => {
    rings.pop();
    chat("Ring undone!")
}).setName("undo")

register("command", () => {
    rings = []
    data.save()
    chat("Rings cleared!")
}).setName("clearrings")

register("command", (range) => {
    rings = rings.filter(ring => {
        if (ring.route !== selectedRoute) return true;
        if (!range) { range = 2 }
        let distance = Math.sqrt(
            (Player.getX() - ring.x) ** 2 +
            (Player.getY() - ring.y) ** 2 +
            (Player.getZ() - ring.z) ** 2
        );

        return distance >= range;
    })
}).setName("removering")

register("Step", () => {
    selectedRoute = parseInt(Settings().route)
}).setFps(1)

register("command", (...args) => {
    if (!args) {
        chat("Usage: /ring §8<§7type§8> [§7height§8] [§7width§8] [§7x§8] [§7y§8] [§7z§8] [§7time§8]")
        return;
    }

    let type = args[0].toLowerCase();
    let x = Math.round(Player.getX() * 2) / 2;
    let y = Math.round(Player.getY() * 2) / 2;
    let z = Math.round(Player.getZ() * 2) / 2;
    let yaw = Player.getYaw();
    let pitch = Player.getPitch();
    let active = true
    let route = parseInt(selectedRoute)

    if (!["walk", "walk2", "jump", "jump2", "stop", "boom", "hclip", "hclip2", "bonzo", "look", "aura", "block", "block2", "bonzo2", "vclip", "edge"].includes(type)) {
        chat("Invalid ring type! Use: walk, jump, stop, boom, hclip, bonzo, look, aura, block, vclip!")
        return;
    }

    if (["vclip", "block", "block2"].includes(type)) {
        if (type === "vclip") {
            if (args.length != 4 && args.length != 2) {
                chat("Invalid Parameters! Use /ring vclip h w depth")
                return
            }
            h = parseFloat(args[1]);
            w = parseFloat(args[2]);
            depth = parseInt(args[3])
            if (!h || !w) {
                depth = parseInt(args[1])
                h = 1
                w = 1
            }
            rings.push({ type, x, y, z, w, h, depth, active, route })
        } else {
            if (args.length != 4 && args.length != 6) {
                chat("Invalid Parameters! Use /ring block/block2 h w x y z")
                return
            }
            h = parseFloat(args[1]);
            w = parseFloat(args[2]);
            lookX = parseFloat(args[3]);
            lookY = parseFloat(args[4]);
            lookZ = parseFloat(args[5]);
            if (!lookY || !lookZ) {
                h = 1
                w = 1
                lookX = parseFloat(args[1]);
                lookY = parseFloat(args[2]);
                lookZ = parseFloat(args[3]);
            }
            rings.push({ type, x, y, z, w, h, lookX, lookY, lookZ, active, route })
        }
    } else {
        h = parseFloat(args[1]);
        w = parseFloat(args[2]);
        if (!h || !w) {
            h = 1
            w = 1
        }
        rings.push({ type, x, y, z, w, h, yaw, pitch, active, route })
    }

    cooldown = true

    Client.scheduleTask(19, () => {
        cooldown = false
    })

    chat(`${type} placed!`)
}).setName("ring")

register("Command", () => {
    edgeJump.register()
}).setName("edgejump")

register("Command", () => {
    inp3 = true;
    renderMove.register()
    renderRing.register()
    chat(`P3 Started!`)
}).setName("startp3")

register("Command", () => {
    inp3 = false;
    renderMove.unregister()
    renderRing.unregister()
}).setName("stopp3")

register("Command", (yaw, pitch) => {
    if (Math.abs(yaw) > 180 || Math.abs(pitch) > 90) {
        chat(`Pitch and/or Yaw out of bounds.`)
        return
    }
    chat(`Rotating.`)
    Player.getPlayer().field_70177_z = yaw;
    Player.getPlayer().field_70125_A = pitch;
}).setName("rotating")

const renderRing = register("renderWorld", () => {
    if (!Settings().autop3) return;
    if (!inp3) return;
    rings.forEach(rings => {
        if (rings.route !== selectedRoute) return;
        if (Settings().render) {
            renderRings(rings.x, rings.y, rings.z, rings.w, rings.type)
        } else {
            renderBoxes(rings.x, rings.y, rings.z, rings.h, rings.w, rings.type)
        }

    })
}).unregister()

const renderMove = register("renderWorld", () => {
    if (!Settings().autop3) return;
    if (!inp3) return
    let playerX = Player.getX();
    let playerY = Player.getY();
    let playerZ = Player.getZ();

    rings.forEach(rings => {
        let distanceX = Math.abs(playerX - rings.x)
        let distanceY = (playerY - rings.y)
        let distanceZ = Math.abs(playerZ - rings.z)
        if (rings.route != selectedRoute) return;
        if (((distanceX > (rings.w / 2) || (distanceY > (rings.h) && distanceY >= -0.5) || distanceZ > (rings.w / 2)) && !rings.active)) {
            rings.active = true;
        }
        if (Settings().activeOnce && !rings.active) return
        if (distanceX < (rings.w / 2) && distanceY < (rings.h) && distanceY >= -0.5 && distanceZ < (rings.w / 2) && !cooldown) {
            rings.active = false
            let speed
            let yaw
            switch (rings.type) {
                case "walk":
                    chat("Walking")
                    rotate(rings.yaw, rings.pitch)
                    walk()
                    break

                case "walk2":
                    chat("Walking")
                    stop()
                    rotate(rings.yaw, rings.pitch)
                    walk()
                    break

                case "jump":
                    chat("Jumping")
                    stop()
                    rotate(rings.yaw, rings.pitch)
                    jump()
                    break

                case "jump2":
                    chat("Jumping")
                    jump()
                    break

                case "stop":
                    chat("Stopping")
                    stop()
                    noWalk()
                    break

                case "boom":
                    chat("Exploding")
                    swapToItem("Infinityboom TNT")
                    if (Settings().silentLook) {
                        ServerRotations.set(rings.yaw, rings.pitch)
                        Client.scheduleTask(() => {
                            leftClick()
                            ServerRotations.resetRotations()
                        })
                    } else {
                        Client.scheduleTask(() => {
                            leftClick()
                        })
                    }
                    break

                case "hclip":
                    chat("Hclipping")
                    slingshot(rings.yaw)
                    break

                case "hclip2":
                    chat("Hclipping")
                    slingshot(rings.yaw)
                    Client.scheduleTask(() => { walk() })
                    break

                case "vclip":
                    chat("Vclipping")
                    lavaclip(rings.depth)
                    break

                case "bonzo":
                    chat("Bonzoing")
                    swapToItem("Bonzo's Staff")
                    stop()
                    if (Settings().silentLook) {
                        ServerRotations.set(rings.yaw, rings.pitch)
                        Client.scheduleTask(1, () => {
                            rightClick()
                            ServerRotations.resetRotations()
                        })
                    } else {
                        rotate(rings.yaw, rings.pitch)
                        Client.scheduleTask(() => {
                            rightClick()
                        })
                    }
                    break

                case "bonzo2":
                    chat("Bonzoing")
                    swapToItem("Bonzo's Staff")
                    if (Settings().silentLook) {
                        ServerRotations.set(rings.yaw, rings.pitch)
                        Client.scheduleTask(1, () => {
                            rightClick()
                            ServerRotations.resetRotations()
                        })
                    } else {
                        rotate(rings.yaw, rings.pitch)
                        Client.scheduleTask(() => {
                            rightClick()
                        })
                    }
                    break

                case "look":
                    chat("Looking")
                    rotate(rings.yaw, rings.pitch)
                    break

                case "aura":
                    chat("Auraing")
                    ChatLib.command("sg toggle", true)
                    break

                case "block":
                    chat("Blocking")
                    Player.getPlayer().func_70016_h(0, Player.getPlayer().field_70181_x, 0);
                    if (!rings.lookZ || !rings.lookY || !rings.lookX) return;
                    [yaw, pitch] = calcYawPitch(rings.lookX, rings.lookY, rings.lookZ)
                    rotate(yaw, pitch)
                    break

                case "block2":
                    chat("Blocking")
                    if (!rings.lookZ || !rings.lookY || !rings.lookX) return;
                    [yaw, pitch] = calcYawPitch(rings.lookX, rings.lookY, rings.lookZ)
                    rotate(yaw, pitch)
                    walk()
                    break

                case "edge":
                    chat("Edging")
                    ChatLib.command("edgejump", true)
                    break

            }
        }
    })
}).unregister()

register("worldLoad", () => {
    inp3 = false;
    renderMove.unregister()
    renderRing.unregister()
});
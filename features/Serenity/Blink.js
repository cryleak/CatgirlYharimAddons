import Settings from "../../config"
import { chat } from "../../utils/utils"
import RenderLibV2 from "../../../RenderLibV2"
import { drawLine3d } from "../../../BloomCore/utils/Utils"

const C03PacketPlayer = Java.type("net.minecraft.network.play.client.C03PacketPlayer")
const queuedPackets = []

let lastToggle = Date.now()
let toggle = false
let startLocation

const toggleBlink = () => {
    toggle = !toggle
    if (toggle) {
        startLocation = [Player.getX(), Player.getY(), Player.getZ()]
        renderBlocks.register()
        renderText.register()
        packetCollector.register()
    } else {
        renderBlocks.unregister()
        renderText.unregister()
        packetCollector.unregister()
        while (queuedPackets.length) Client.sendPacket(queuedPackets.shift())
    }
}

register("tick", () => {
    if (!Keyboard.isKeyDown(Settings().blinkKey)) return
    if (Client.isInGui()) return
    if (Date.now() - lastToggle < 300) return
    lastToggle = Date.now()
    toggleBlink()
})

const renderBlocks = register("renderWorld", () => {
    RenderLibV2.drawEspBox(...startLocation, 1, 0, 0, 1, 1, 11, true)
    for (let i = 0; i < queuedPackets.length; i++) { // Draw line
        let packet1 = queuedPackets[i]
        let packet2 = queuedPackets[i + 1]
        if (!packet1 || !packet2) continue
        drawLine3d(packet1.func_149464_c(), packet1.func_149467_d(), packet1.func_149472_e(), packet2.func_149464_c(), packet2.func_149467_d(), packet2.func_149472_e(), 0, 1, 1, 1, 1, true)
    }
}).unregister()

const renderText = register("renderOverlay", () => {
    Renderer.scale(2)
    const text = `§cBLINK ENABLED FOR ${Date.now() - lastToggle}MS`
    Renderer.drawString(text, Renderer.screen.getWidth() / 4 - Renderer.getStringWidth(text) / 2, Renderer.screen.getHeight() / 3.8)
}).unregister()

const packetCollector = register("packetSent", (packet, event) => {
    if (packet.class.getSimpleName() === "C05PacketPlayerLook" || packet.class.getSimpleName() === "C03PacketPlayer") return
    queuedPackets.push(packet)
    cancel(event)
}).setFilteredClasses([C03PacketPlayer]).unregister()

/*
const KeyBinding = Java.type("net.minecraft.client.settings.KeyBinding")
let logStartTime = Date.now()

register("command", () => {
    FileLib.delete("./config/ChatTriggers/packetlog.json")
    Client.scheduleTask(1, () => {
        packetLogger.register()
        logStartTime = Date.now()
        chat("Starting packet log...")
        // let [yaw, pitch] = calcYawPitch({ x: 52, y: 7.5, z: 42 })
        // let [yaw, pitch] = calcYawPitch({ x: 60, y: 7.5, z: 43 })
        let [yaw, pitch] = [50, 0]
        // yaw += 45
        KeyBinding.func_74510_a(Client.getMinecraft().field_71474_y.field_74351_w.func_151463_i(), true)
        // KeyBinding.func_74510_a(Client.getMinecraft().field_71474_y.field_74370_x.func_151463_i(), true)
        rotate(yaw, pitch)
    })
    Client.scheduleTask(26, () => {
        KeyBinding.func_74510_a(Client.getMinecraft().field_71474_y.field_74351_w.func_151463_i(), false)
        KeyBinding.func_74510_a(Client.getMinecraft().field_71474_y.field_74370_x.func_151463_i(), false)
        packetLogger.unregister()
        FileLib.append("./config/ChatTriggers/packetlog.json", `\nLogged for ${Date.now() - logStartTime} milliseconds.`)
        chat("Packet log complete.")
    })
}).setName("packetlog")

const packetLogger = register("packetSent", (packet) => {
    if (packet.class.getSimpleName() === "C05PacketPlayerLook" || packet.class.getSimpleName() === "C03PacketPlayer") return
    FileLib.append("./config/ChatTriggers/packetlog.json", `\n[${packet.func_149464_c()}, ${packet.func_149467_d()}, ${packet.func_149472_e()}, ${packet.func_149465_i()}],`)
}).setFilteredClasses([C03PacketPlayer]).unregister()

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

*/
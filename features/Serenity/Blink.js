import Settings from "../../config"
import { chat } from "../../utils/utils"
import RenderLibV2 from "../../../RenderLibV2"
import { File } from "../../../BloomCore/utils/Utils"

const C03PacketPlayer = Java.type("net.minecraft.network.play.client.C03PacketPlayer")
const queuedPackets = []

let lastToggle = Date.now()
let toggle = false
let startLocation

register("tick", () => {
    if (!Keyboard.isKeyDown(Settings().blinkKey)) return
    if (Client.isInGui()) return
    if (Date.now() - lastToggle < 300) return
    lastToggle = Date.now()
    toggle = !toggle
    if (toggle) {
        startLocation = { x: Player.getX(), y: Player.getY(), z: Player.getZ() }
        renderBlocks.register()
        renderText.register()
        packetCollector.register()
    } else {
        renderBlocks.unregister()
        renderText.unregister()
        packetCollector.unregister()
        while (queuedPackets.length) Client.sendPacket(queuedPackets.shift())
    }
})

const renderBlocks = register("renderWorld", () => {
    RenderLibV2.drawEspBox(startLocation.x, startLocation.y, startLocation.z, 1, 0, 0, 1, 1, 11, true)
}).unregister()

const renderText = register("renderOverlay", () => {
    Renderer.scale(2)
    const text = `§cBLINK ENABLED FOR ${Date.now() - lastToggle}MS`
    Renderer.drawString(text, Renderer.screen.getWidth() / 4 - Renderer.getStringWidth(text) / 2, Renderer.screen.getHeight() / 3.8)
}).unregister()

const packetCollector = register("packetSent", (packet, event) => {
    queuedPackets.push(packet)
    cancel(event)
}).setFilteredClasses([C03PacketPlayer]).unregister()
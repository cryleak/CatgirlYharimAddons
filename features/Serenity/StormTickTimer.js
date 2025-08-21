import Settings from "../../config"
import { stormTickTimerGui } from "../../config"
import data from "../../utils/data"
import { onChatPacket } from "../../../BloomCore/utils/Events"


const timePerTick = 20
let ticks = null
let enabled = 0

const tickListener = register("packetReceived", (packet) => {
    if (packet.func_148890_d() > 0) return

    if (ticks <= 0) ticks = timePerTick
    ticks--
}).setFilteredClass(net.minecraft.network.play.server.S32PacketConfirmTransaction).unregister()

register("renderOverlay", () => {
    if (stormTickTimerGui.isOpen()) {
        Renderer.scale(data.stormTickTimer.scale)
        Renderer.drawStringWithShadow("§a1.00s", Renderer.screen.getWidth() * data.stormTickTimer.x, Renderer.screen.getHeight() * data.stormTickTimer.y)
        return
    }
    if (!ticks && ticks != 0) return
    Renderer.scale(data.stormTickTimer.scale)
    Renderer.drawStringWithShadow((ticks > 3 ? "§a" : "§c") + (ticks / 20).toFixed(2) + "s", Renderer.screen.getWidth() * data.stormTickTimer.x, Renderer.screen.getHeight() * data.stormTickTimer.y)
})

onChatPacket(() => {
    if (!Settings().stormTickTimerEnabled) return
    ticks = timePerTick
    tickListener.register()
}).setCriteria("[BOSS] Storm: Pathetic Maxor, just like expected.")

onChatPacket(() => {
    if (!Settings().stormTickTimerEnabled) return
    tickListener.unregister()
    ticks = null
}).setCriteria(/\[BOSS] Storm: I should have known that I stood no chance.|\[BOSS] Storm: Bahahaha! Not a single intact pillar remains!/)


register("command", () => {
    if (!Settings().stormTickTimerEnabled) return
    enabled = !enabled
    if (enabled) {
        ticks = timePerTick
        tickListener.register()
    } else {
        tickListener.unregister()
        ticks = null
    }
}).setName("stormtick")

register("worldUnload", () => {
    tickListener.unregister()
    ticks = null
})

register("dragged", (_0, _1, x, y, bn) => {
    if (!stormTickTimerGui.isOpen()) return
    if (bn === 2) return
    data.stormTickTimer.x = (x / data.stormTickTimer.scale) / Renderer.screen.getWidth()
    data.stormTickTimer.y = (y / data.stormTickTimer.scale) / Renderer.screen.getHeight()
    data.save()
})

register("scrolled", (_0, _1, dir) => {
    if (!stormTickTimerGui.isOpen()) return
    if (dir == 1) data.stormTickTimer.scale += 0.01
    else data.stormTickTimer.scale -= 0.01
    data.stormTickTimer.scale = Math.round(data.stormTickTimer.scale * 100) / 100
    ChatLib.clearChat(69420) // Prevent clogging chat by deleting the previous message
    new Message(`§0[§6Yharim§0] §7Current scale: ${data.stormTickTimer.scale}`).setChatLineId(69420).chat()
    data.save()
})
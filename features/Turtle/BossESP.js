import RenderLibV2 from "../../../RenderLibV2"
import { calcYawPitch, chat, rotate } from "../../utils/utils"
import Settings from "../../config"

const EntityWither = Java.type("net.minecraft.entity.boss.EntityWither")

let toggled = false
let toggleCooldown = false

register("tick", () => {
    if (Client.isInGui()) return
    if (!Keyboard.isKeyDown(Settings().witherAimbot)) return
    if (toggleCooldown) return
    toggleCooldown = true
    Client.scheduleTask(4, () => toggleCooldown = false)
    if (!toggled) {
        aimbot.register()
        toggled = true
        chat("Wither Aimbot on.")
    } else {
        aimbot.unregister()
        toggled = false
        chat("Wither Aimbot off.")
    }
})

register("chat", () => {
    if (!Settings().espWither) return
    render.register()
    packets.register()
}).setCriteria("[BOSS] Maxor: WELL! WELL! WELL! LOOK WHO'S HERE!")

register("chat", () => {
    render.unregister()
    packets.unregister()
}).setCriteria("[BOSS] Necron: All this, for nothing...")

register("worldUnload", () => {
    render.unregister()
    packets.unregister()
})

/*const rendersdasd = register("renderWorld", () => {
    if (!Settings().espWither) return
    const wither = World.getAllEntitiesOfType(EntityWither).find(entity => !entity.isInvisible()) // Find a Wither entity that isn't invisible
    if (!wither) return
    const rgb = [Settings().witherESPColor[0], Settings().witherESPColor[1], Settings().witherESPColor[2]]
    const alpha = Settings().witherESPColor[3] / 255
    RenderLibV2.drawInnerEspBox(wither.getRenderX(), wither.getRenderY() + 0.3, wither.getRenderZ(), 1, 2.5, ...rgb, alpha, true)
    RenderLibV2.drawEspBox(wither.getRenderX(), wither.getRenderY() + 0.3, wither.getRenderZ(), 1, 2.5, ...rgb, 1, true)
}).unregister()*/

const aimbot = register("renderWorld", () => {
    const wither = World.getAllEntitiesOfType(EntityWither).find(entity => !entity.isInvisible())
    if (!wither) return
    const [yaw, pitch] = calcYawPitch(wither.getRenderX(), wither.getRenderY(), wither.getRenderZ())
    rotate(yaw, pitch)
}).unregister()

register("command", () => {
    if (!toggled) {
        aimbot.register()
        toggled = true
        chat("Wither Aimbot on.")
    } else {
        aimbot.unregister()
        toggled = false
        chat("Wither Aimbot off.")
    }
}).setName("aimbot")

const render = register("renderWorld", () => {
    if (!Settings().espWither) return
    const rgb = [Settings().witherESPColor[0], Settings().witherESPColor[1], Settings().witherESPColor[2]]
    const alpha = Settings().witherESPColor[3] / 255
    const wither = World.getAllEntitiesOfType(EntityWither).find(entity => !entity.isInvisible()) // Find a Wither entity that isn't invisible
    if (wither) {
        RenderLibV2.drawInnerEspBox(wither.getX(), wither.getY(), wither.getZ(), 1, 3.5, ...rgb, alpha, true)
        RenderLibV2.drawEspBox(wither.getX(), wither.getY(), wither.getZ(), 1, 3.5, ...rgb, 1, true)
    } else if (x && y && z) {
        RenderLibV2.drawInnerEspBox(x, y, z, 1, 3.5, ...rgb, alpha, true)
        RenderLibV2.drawEspBox(x, y, z, 1, 3.5, ...rgb, 1, true)
    }
}).unregister()

let x
let y
let z

const packets = register("packetReceived", (packet) => {
    if (!Settings().espWither) return
    if (packet.func_179749_a().toString() !== "VILLAGER_ANGRY") return
    x = parseInt(packet.func_149220_d());
    y = parseInt(packet.func_149226_e());
    z = parseInt(packet.func_149225_f());
}).setFilteredClass(net.minecraft.network.play.server.S2APacketParticles).unregister()
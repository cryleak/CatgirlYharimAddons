import Settings from "../../config"
import { tickShiftGui } from "../../config"
import data from "../../utils/data"
import { Keybind } from "../../../KeybindFix"

const tickShiftBind = new Keybind("TickShift Toggle", Keyboard.KEY_NONE, "CatgirlYharim")
const C06PacketPlayerPosLook = Java.type("net.minecraft.network.play.client.C03PacketPlayer$C06PacketPlayerPosLook")
const C04PacketPlayerPosition = Java.type("net.minecraft.network.play.client.C03PacketPlayer$C04PacketPlayerPosition")
const C05PacketPlayerLook = Java.type("net.minecraft.network.play.client.C03PacketPlayer$C05PacketPlayerLook")
const timer = Client.getMinecraft().class.getDeclaredField("field_71428_T")
const C02PacketUseEntity = Java.type("net.minecraft.network.play.client.C02PacketUseEntity")
timer.setAccessible(true)
const movementKeys = {
    forward: Client.getMinecraft().field_71474_y.field_74351_w,
    left: Client.getMinecraft().field_71474_y.field_74370_x,
    right: Client.getMinecraft().field_71474_y.field_74366_z,
    back: Client.getMinecraft().field_71474_y.field_74368_y,
    jump: Client.getMinecraft().field_71474_y.field_74314_A
};
let tickShiftReady = false
let ticksStill = 0
let tickShiftKeyToggle = false
let lastUse = Date.now()

register("renderOverlay", () => {
    if (tickShiftGui.isOpen()) Renderer.drawStringWithShadow(`§cTICKSHIFT: 20 TICKS`, data.tickShift.x, data.tickShift.y)
    if (!Settings().tickShiftToggle || !tickShiftKeyToggle) return
    if (ticksStill > Settings().tickShiftMaxTicks) ticksStill = Settings().tickShiftMaxTicks
    Renderer.drawStringWithShadow(`§cTICKSHIFT: ${ticksStill} TICKS`, data.tickShift.x, data.tickShift.y)
})

register("tick", () => {
    if (!Settings().tickShiftToggle || !tickShiftKeyToggle || Date.now() - lastUse < 2000) {
        setGameSpeed(1) // I DON'T WANNA GET BANNED
        return
    }
    const motion = { x: Player.getPlayer().field_70159_w, z: Player.getPlayer().field_70179_y }
    if (Object.values(motion).every(motion => motion === 0) && Player.getPlayer().field_70124_G) { // Standing still
        if (ticksStill >= Settings().tickShiftMaxTicks || Player.isFlying()) return
        ticksStill++
        setGameSpeed(1)
        if (ticksStill > 0) tickShiftReady = true
    } else if (tickShiftReady) { // If TickShift is ready and you are not standing still
        ticksStill--
        if (ticksStill < 1) {
            lastUse = Date.now()
            tickShiftReady = false
        }
        if (Object.values(movementKeys).some(keybind => keybind.func_151470_d())) setGameSpeed(Settings().tickShiftSpeed)
    } else setGameSpeed(1)
})

tickShiftBind.registerKeyPress(() => {
    tickShiftReady = false
    ticksStill = 0
    tickShiftKeyToggle = !tickShiftKeyToggle
})

register("dragged", (_0, _1, x, y, bn) => { // bro fuck this shit
    if (!tickShiftGui.isOpen() || bn == 2) return
    data.tickShift.x = x / data.tickShift.scale
    data.tickShift.y = y / data.tickShift.scale
    data.save()
})

register("scrolled", (_0, _1, dir) => {
    if (!tickShiftGui.isOpen()) return
    if (dir == 1) data.tickShift.scale += 0.01
    else data.tickShift.scale -= 0.01
    data.tickShift.scale = Math.round(data.tickShift.scale * 100) / 100
    ChatLib.clearChat(69420) // Prevent clogging chat by deleting the previous message
    new Message(`§8[§bTeerene§8] §7Current scale: ${data.tickShift.scale}`).setChatLineId(69420).chat()
    data.save()
})

const setGameSpeed = (speed) => timer.get(Client.getMinecraft()).field_74278_d = speed

// i forgot when i made this but it doesn't work
/*
register("packetSent", (packet, event) => {
    if (packet instanceof C02PacketUseEntity) return
    if (!Settings().tickShiftToggle || !tickShiftKeyToggle || Date.now() - lastUse < 1500) return
    const motion = { x: Player.getPlayer().field_70159_w, z: Player.getPlayer().field_70179_y }
    if (Object.values(motion).every(motion => motion === 0) && Player.getPlayer().field_70124_G && !Player.isFlying()) cancel(event)
})
    */
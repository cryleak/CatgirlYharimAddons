import Settings from "../../config"
import { format } from "../../utils/utils";

const S2DPacketOpenWindow = Java.type("net.minecraft.network.play.server.S2DPacketOpenWindow")
const C0EPacketClickWindow = Java.type("net.minecraft.network.play.client.C0EPacketClickWindow");
const C0DPacketCloseWindow = Java.type("net.minecraft.network.play.client.C0DPacketCloseWindow");
const S2EPacketCloseWindow = Java.type("net.minecraft.network.play.server.S2EPacketCloseWindow");

let cwid = -1
let wardrobeCooldown = false
let awaitingWardrobe = false
let index = 36

function wardrobe() {
    if (!index || isNaN(index)) return
    wardrobeCooldown = true
    awaitingWardrobe = true
    clickSlot.register()
    overlay.register()
    ChatLib.command("wardrobe")
    Client.scheduleTask(19, () => { wardrobeCooldown = false })
}

const overlay = register("renderOverlay", () => {
    let text = format("Equiping Wardrobe")
    let scale = 1.5
    Renderer.scale(scale)
    Renderer.drawStringWithShadow(text, (Renderer.screen.getWidth() / scale - Renderer.getStringWidth(text)) / 2, Renderer.screen.getHeight() / scale / 2 + 16)
}).unregister()

const clickSlot = register("packetReceived", (packet, event) => {
    if (!awaitingWardrobe) return
    const title = ChatLib.removeFormatting(packet.func_179840_c().func_150254_d());
    if (!title.includes("Wardrobe")) return
    awaitingWardrobe = false
    cwid = packet.func_148901_c()
    cancel(event)
    click(index)
    clickSlot.unregister()
    overlay.unregister()
    Client.scheduleTask(() => {
        Client.sendPacket(new C0DPacketCloseWindow(cwid))
    })
}).setFilteredClass(S2DPacketOpenWindow).unregister()

register("Tick", () => {
    if (Client.isInGui()) return
    if (wardrobeCooldown) return
    if (Keyboard.isKeyDown(Settings().wdOneKeybind)) { wardrobe(); index = 36 }
    if (Keyboard.isKeyDown(Settings().wdTwoKeybind)) { wardrobe(); index = 37 }
    if (Keyboard.isKeyDown(Settings().wdThreeKeybind)) { wardrobe(); index = 38 }
    if (Keyboard.isKeyDown(Settings().wdFourKeybind)) { wardrobe(); index = 39 }
    if (Keyboard.isKeyDown(Settings().wdFiveKeybind)) { wardrobe(); index = 40 }
    if (Keyboard.isKeyDown(Settings().wdSixKeybind)) { wardrobe(); index = 41 }
    if (Keyboard.isKeyDown(Settings().wdSevenKeybind)) { wardrobe(); index = 42 }
    if (Keyboard.isKeyDown(Settings().wdEightKeybind)) { wardrobe(); index = 43 }
    if (Keyboard.isKeyDown(Settings().wdNineKeybind)) { wardrobe(); index = 44 }
})

function click(slot) {
    if (cwid === -1) return false;
    //ChatLib.chat("clicking" + " " + cwid + " " + slot)
    Client.sendPacket(new C0EPacketClickWindow(cwid, slot, 0, 0, null, 0))
    return true;
}

register("packetSent", () => {
    cwid = -1
}).setFilteredClass(C0DPacketCloseWindow)

register("packetReceived", () => {
    cwid = -1
}).setFilteredClass(S2EPacketCloseWindow)
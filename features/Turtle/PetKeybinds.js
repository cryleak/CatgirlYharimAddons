import Settings from "../../config"
import { format, chat } from "../../utils/utils";

const S2DPacketOpenWindow = Java.type("net.minecraft.network.play.server.S2DPacketOpenWindow")
const C0EPacketClickWindow = Java.type("net.minecraft.network.play.client.C0EPacketClickWindow");
const C0DPacketCloseWindow = Java.type("net.minecraft.network.play.client.C0DPacketCloseWindow");
const S2EPacketCloseWindow = Java.type("net.minecraft.network.play.server.S2EPacketCloseWindow");

let cwid = -1
let petCooldown = false
let awaitingPet = false
let toClick = 10

function pet() {
    if (!toClick || isNaN(toClick)) return
    petCooldown = true
    awaitingPet = true
    clickSlot.register()
    overlay.register()
    ChatLib.command("pets")
    Client.scheduleTask(19, () => { petCooldown = false })
}

const overlay = register("renderOverlay", () => {
    let text = format("Equiping Pet")
    let scale = 1.5
    Renderer.scale(scale)
    Renderer.drawStringWithShadow(text, (Renderer.screen.getWidth() / scale - Renderer.getStringWidth(text)) / 2, Renderer.screen.getHeight() / scale / 2 + 16)
}).unregister()

const clickSlot = register("packetReceived", (packet, event) => {
    if (!awaitingPet) return
    const title = ChatLib.removeFormatting(packet.func_179840_c().func_150254_d());
    if (!title.includes("Pet")) return
    awaitingPet = false
    cwid = packet.func_148901_c()
    cancel(event)
    click(toClick)
    clickSlot.unregister()
    overlay.unregister()
}).setFilteredClass(S2DPacketOpenWindow).unregister()

register("Tick", () => {
    if (Client.isInGui()) return
    if (petCooldown) return
    if (Keyboard.isKeyDown(Settings().petOneKeybind)) { toClick = (Settings().petOne); pet() }
    if (Keyboard.isKeyDown(Settings().petTwoKeybind)) { toClick = (Settings().petTwo); pet() }
    if (Keyboard.isKeyDown(Settings().petThreeKeybind)) { toClick = (Settings().petThree); pet() }
    if (Keyboard.isKeyDown(Settings().petFourKeybind)) { toClick = (Settings().petFour); pet() }
    if (Keyboard.isKeyDown(Settings().petFiveKeybind)) { toClick = (Settings().petFive); pet() }
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
import Settings from "../../config"
import { format, chat } from "../../utils/utils";

const S2DPacketOpenWindow = Java.type("net.minecraft.network.play.server.S2DPacketOpenWindow");
const C0DPacketCloseWindow = Java.type("net.minecraft.network.play.client.C0DPacketCloseWindow");
const S2EPacketCloseWindow = Java.type("net.minecraft.network.play.server.S2EPacketCloseWindow");
const C0EPacketClickWindow = Java.type("net.minecraft.network.play.client.C0EPacketClickWindow");

let cwid = -1
let petCooldown = false
let awaitingPet = false
let index = 10

function getPet(input) {
    if (!input || isNaN(input)) return
    index = input
    petCooldown = true
    awaitingPet = true
    clickSlot.register()
    overlay.register()
    ChatLib.command("pet")
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
    click(index)
    clickSlot.unregister()
    overlay.unregister()
}).setFilteredClass(S2DPacketOpenWindow).unregister()

function click(slot) {
    if (cwid === -1) return false;
    //ChatLib.chat("clicking" + " " + cwid + " " + slot)
    Client.sendPacket(new C0EPacketClickWindow(cwid, slot, 0, 0, null, 0))
    return true;
}

register("packetSent", () => {
    cwid = -1
    overlay.unregister()
}).setFilteredClass(C0DPacketCloseWindow)

register("packetReceived", () => {
    cwid = -1
    overlay.unregister()
}).setFilteredClass(S2EPacketCloseWindow)

register("Tick", () => {
    if (Client.isInGui()) return
    if (petCooldown) return
    if (Keyboard.isKeyDown(Settings().petOneKeybind)) { getPet(Settings().petOne) }
    if (Keyboard.isKeyDown(Settings().petTwoKeybind)) { getPet(Settings().petTwo) }
    if (Keyboard.isKeyDown(Settings().petThreeKeybind)) { getPet(Settings().petThree) }
    if (Keyboard.isKeyDown(Settings().petFourKeybind)) { getPet(Settings().petFour) }
    if (Keyboard.isKeyDown(Settings().petFiveKeybind)) { getPet(Settings().petFive) }
})
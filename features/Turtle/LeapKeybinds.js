import Settings from "../../config"
import { rightClick, swapToItem, leap } from "../../utils/utils"
import Dungeons from "../../../Atomx/skyblock/Dungeons"

const S2DPacketOpenWindow = Java.type("net.minecraft.network.play.server.S2DPacketOpenWindow")
const C0EPacketClickWindow = Java.type("net.minecraft.network.play.client.C0EPacketClickWindow");
const C0DPacketCloseWindow = Java.type("net.minecraft.network.play.client.C0DPacketCloseWindow");
const S2EPacketCloseWindow = Java.type("net.minecraft.network.play.server.S2EPacketCloseWindow");
const S2FPacketSetSlot = Java.type("net.minecraft.network.play.server.S2FPacketSetSlot");

const classes = ["Archer", "Berserk", "Mage", "Healer", "Tank"]

let cwid = -1
let leapCooldown = false
let awaitingLeap = false

function leaping() {
    leapCooldown = true
    awaitingLeap = true
    Client.scheduleTask(19, () => { leapCooldown = false })
}

register("Tick", () => {
    if (Client.isInGui()) return
    if (leapCooldown) return
    if (Keyboard.isKeyDown(Settings().tankKeybind)) { leaping(); leap("Tank") }
    if (Keyboard.isKeyDown(Settings().mageKeybind)) { leaping(); leap("Mage") }
    if (Keyboard.isKeyDown(Settings().berserkKeybind)) { leaping(); leap("Berserk") }
    if (Keyboard.isKeyDown(Settings().archerKeybind)) { leaping(); leap("Archer") }
    if (Keyboard.isKeyDown(Settings().healerKeybind)) { leaping(); leap("Healer") }
})

function leap(target) {
    const teamMembers = Dungeons.getTeamMembers()
    swapToItem("leap")
    Client.scheduleTask(0, () => rightClick())
    awaitingLeap = true

    if (classes.includes(target)) { // (Hopefully) detect if you are trying to leap to a class  
        playerName = Object.getOwnPropertyNames(teamMembers).find(playerName => teamMembers[playerName].class === target)
        if (!playerName) { chat("Class not found!"); return }
    } else playerName = player

    register("packetReceived", (packet, event) => {
        if (!awaitingLeap) return
        cwid = packet.func_148901_c()
        const title = ChatLib.removeFormatting(packet.func_179840_c().func_150254_d());
        if (!title.includes("Leap")) return
        cancel(event)
    }).setFilteredClass(S2DPacketOpenWindow)

    register("packetReceived", (packet) => {
        if (!awaitingLeap) return
        awaitingLeap = false
        const itemStack = packet.func_149174_e();
        const slot = packet.func_149173_d();
        if (![11, 12, 14, 15].includes(slot)) return
        const item = new Item(itemStack)
        items[slot] = item
        if (items.length === 4) {
            const index = items.findIndex(x => x?.getName()?.substring(2)?.toLowerCase() === playerName.toLowerCase())
            if (!index || index === -1) { chat("Player not found!"); Client.sendPacket(new C0DPacketCloseWindow(cwid)); return }
            click(index)
        }
    }).setFilteredClass(S2FPacketSetSlot)
}

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
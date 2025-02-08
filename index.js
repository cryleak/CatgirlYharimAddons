import Settings from "./config"
import "./features/Serenity/MelodyWarning"
import "./features/Serenity/Relic"
import "./features/Serenity/TerminalTimestamps"
import "./features/Serenity/Auto4"
import "./features/Serenity/AutoLeap"
import "./features/Serenity/StormTickTimer"
import "./features/Serenity/StonkSwap"
import "./features/Serenity/StonkSwapDing"
import "./features/Serenity/PartyFinderSound"
import "./features/Serenity/BlockClip"
import "./features/Serenity/AlwaysSprint"
import "./features/Serenity/BonzoStop"
import "./features/Serenity/FPSCounter"
// import "./features/Serenity/TickShift" // DO NOT USEEEEE

import "./SereneBlink/Blink"
import "./SereneBlink/BlinkRelics"

// I take no responsibilty for Turtle's incredibly schizo code. -Serenity. Nigger -Turtle
import "./features/Turtle/AutoP3"
import "./features/Turtle/LeapKeybinds"
import "./features/Turtle/WardrobeKeybinds"
import "./features/Turtle/PetKeybinds"
import "./features/Turtle/HClip"
import "./features/Turtle/VClip"
import "./features/Turtle/CoreTimer"
import "./features/Turtle/Simulation"
import "./features/Turtle/BossESP"
import "./features/Turtle/TerminalESP"
import "./features/Turtle/BarPhase"
import "./features/Turtle/getInventory"

import "./features/Shared/DragPrio"

import "./commands/pearl"
import "./commands/panes"
import "./commands/commands"

register("command", () => {
    Settings().getConfig().openGui()
}).setName("catgirlyharimaddons").setAliases("catgirlyharim", "cgy")

register("command", () => ChatLib.command("joininstance CATACOMBS_ENTRANCE")).setName("f0") // Adds a command to go into entrance cause why not

register("command", (...args) => {
    const msg = args.join(" ")
    com.chattriggers.ctjs.triggers.TriggerType.PacketReceived.triggerAll(new net.minecraft.network.play.server.S02PacketChat(new net.minecraft.util.ChatComponentText(msg), 0))
}).setName("simulatechatpackett")

/*
let confirmed = false
register("command", (index) => {
    if (!confirmed) {
        ChatLib.chat("§cAre you sure you want to proceed? This has a strong probability of selfbanning you!\n§cType this command again to continue.")
        confirmed = true
        return
    }
    confirmed = false
    sendRandomPacket(parseInt(index) ?? null)
}).setName("sendrandompacket")

const packets = [
    { packet: Java.type("net.minecraft.network.play.client.C00PacketKeepAlive"), args: ["INT"] },
    { packet: Java.type("net.minecraft.network.play.client.C01PacketChatMessage"), args: ["STRING"] },
    { packet: Java.type("net.minecraft.network.play.client.C02PacketUseEntity"), args: ["ENTITY", "HITVEC"] },
    { packet: Java.type("net.minecraft.network.play.client.C03PacketPlayer"), args: ["BOOLEAN"] },
    { packet: Java.type("net.minecraft.network.play.client.C03PacketPlayer$C04PacketPlayerPosition"), args: ["FLOAT", "FLOAT", "FLOAT", "BOOLEAN"] },
    { packet: Java.type("net.minecraft.network.play.client.C03PacketPlayer$C05PacketPlayerLook"), args: ["FLOAT", "FLOAT", "BOOLEAN"] },
    { packet: Java.type("net.minecraft.network.play.client.C03PacketPlayer$C06PacketPlayerPosLook"), args: ["FLOAT", "FLOAT", "FLOAT", "FLOAT", "FLOAT", "BOOLEAN"] },
    { packet: Java.type("net.minecraft.network.play.client.C07PacketPlayerDigging"), args: ["C07ACTION", "BLOCKPOS", "ENUMFACING"] },
    { packet: Java.type("net.minecraft.network.play.client.C08PacketPlayerBlockPlacement"), args: ["BLOCKPOS", "INT", "ITEMSTACK", "FLOAT", "FLOAT", "FLOAT"] },
    { packet: Java.type("net.minecraft.network.play.client.C09PacketHeldItemChange"), args: ["INT"] },
    { packet: Java.type("net.minecraft.network.play.client.C0APacketAnimation"), args: [] },
    { packet: Java.type("net.minecraft.network.play.client.C0BPacketEntityAction"), args: ["ENTITY", "C0BACTION"] },
    { packet: Java.type("net.minecraft.network.play.client.C0CPacketInput"), args: ["FLOAT", "FLOAT", "BOOLEAN", "BOOLEAN"] },
    { packet: Java.type("net.minecraft.network.play.client.C0DPacketCloseWindow"), args: ["INT"] },
    { packet: Java.type("net.minecraft.network.play.client.C0EPacketClickWindow"), args: ["INT", "INT", "INT", "INT", "ITEMSTACK", "SHORT"] },
    { packet: Java.type("net.minecraft.network.play.client.C0FPacketConfirmTransaction"), args: ["INT", "SHORT", "BOOLEAN"] },
    { packet: Java.type("net.minecraft.network.play.client.C10PacketCreativeInventoryAction"), args: ["INT", "ITEMSTACK"] },
    { packet: Java.type("net.minecraft.network.play.client.C11PacketEnchantItem"), args: ["INT", "INT"] },
    // { packet: Java.type("net.minecraft.network.play.client.C12PacketUpdateSign"), args: ["BLOCKPOS", "CHATCOMPONENT"] }, // no clue how to make this one work, i tried using chat component text idk
    { packet: Java.type("net.minecraft.network.play.client.C13PacketPlayerAbilities"), args: ["PLAYERCAPABILITES"] }
]
const C07Actions = [
    net.minecraft.network.play.client.C07PacketPlayerDigging.Action.ABORT_DESTROY_BLOCK,
    net.minecraft.network.play.client.C07PacketPlayerDigging.Action.DROP_ALL_ITEMS,
    net.minecraft.network.play.client.C07PacketPlayerDigging.Action.DROP_ITEM,
    net.minecraft.network.play.client.C07PacketPlayerDigging.Action.RELEASE_USE_ITEM,
    net.minecraft.network.play.client.C07PacketPlayerDigging.Action.START_DESTROY_BLOCK,
    net.minecraft.network.play.client.C07PacketPlayerDigging.Action.STOP_DESTROY_BLOCK
]
const enumFaces = [
    net.minecraft.util.EnumFacing.DOWN,
    net.minecraft.util.EnumFacing.EAST,
    net.minecraft.util.EnumFacing.NORTH,
    net.minecraft.util.EnumFacing.SOUTH,
    net.minecraft.util.EnumFacing.UP,
    net.minecraft.util.EnumFacing.WEST
]
const C0BActions = [
    net.minecraft.network.play.client.C0BPacketEntityAction$Action.OPEN_INVENTORY,
    net.minecraft.network.play.client.C0BPacketEntityAction$Action.RIDING_JUMP,
    net.minecraft.network.play.client.C0BPacketEntityAction$Action.START_SNEAKING,
    net.minecraft.network.play.client.C0BPacketEntityAction$Action.START_SPRINTING,
    net.minecraft.network.play.client.C0BPacketEntityAction$Action.STOP_SLEEPING,
    net.minecraft.network.play.client.C0BPacketEntityAction$Action.STOP_SNEAKING,
    net.minecraft.network.play.client.C0BPacketEntityAction$Action.STOP_SPRINTING
]


function sendRandomPacket(index) {
    let selectedPacket
    if (!index && index !== 0 || index >= packets.length) selectedPacket = packets[Math.floor(Math.random() * packets.length)]
    else selectedPacket = packets[index]
    const args = []
    for (let i = 0; i < selectedPacket.args.length; i++) {
        let arg = selectedPacket.args[i]
        switch (arg) {
            case "INT":
                args.push(Math.floor(Math.random() * 4294967295 - 2147483648))
                break
            case "STRING":
                var string = ""
                for (let i = 0; i < Math.ceil(Math.random() * 60000); i++) string += String.fromCharCode(Math.floor(Math.random() * 94 + 33))
                args.push(string)
                break
            case "ENTITY":
                const entities = World.getAllEntities()
                if (!entities.length) return ChatLib.chat("No entities found!")
                const entity = entities[Math.floor(Math.random() * entities.length)]
                args.push(entity.getEntity())
                break
            case "HITVEC":
                args.push(new net.minecraft.util.Vec3(Math.random() * 60000000 - 30000000, Math.random() * 60000000 - 30000000, Math.random() * 60000000 - 30000000))
                break
            case "BOOLEAN":
                args.push(Math.random() < 0.5 ? true : false)
                break
            case "FLOAT": // Float and double can be considered the same because this is CT shoutout CT
                args.push(Math.random() * 60000000 - 30000000)
                break
            case "C07ACTION":
                args.push(C07Actions[Math.floor(Math.random() * C07Actions.length)])
                break
            case "BLOCKPOS":
                args.push(new net.minecraft.util.BlockPos(Math.floor(Math.random() * 60000000 - 30000000), Math.floor(Math.random() * 60000000 - 30000000), Math.floor(Math.random() * 60000000 - 30000000)))
                break
            case "ENUMFACING":
                args.push(enumFaces[Math.floor(Math.random() * enumFaces.length)])
                break
            case "ITEMSTACK":
                let item
                const tryToGenerateRandomItem = () => { // try to generate a random item until it doesnt try an invalid itemid idk
                    try {
                        item = new Item(Math.floor(Math.random() * 500))
                    } catch (e) {
                        console.log(e)
                        tryToGenerateRandomItem()
                    }
                }
                tryToGenerateRandomItem()
                args.push(item.itemStack)
                break
            case "C0BACTION":
                args.push(C0BActions[Math.floor(Math.random() * C0BActions.length)])
                break
            case "SHORT":
                args.push(Math.floor(Math.random() * 65535 - 32768))
                break
            case "CHATCOMPONENT": // I swear to fucking god this is how you're supposed to do this man i don't fucking know why this doesn't work
                var string = ""
                for (let i = 0; i < Math.ceil(Math.random() * 60); i++) string += String.fromCharCode(Math.floor(Math.random() * 94 + 33))
                args.push((new net.minecraft.util.ChatComponentText(new java.lang.String(string))))
                break
            case "PLAYERCAPABILITES":
                const playerCapabilites = new net.minecraft.entity.player.PlayerCapabilities()
                playerCapabilites.func_75092_a(Math.random() * 60000000 - 30000000)
                playerCapabilites.func_82877_b(Math.random() * 60000000 - 30000000)
                args.push(playerCapabilites)
                break
        }

    }
    if (args.length) Client.sendPacket(new selectedPacket.packet(...args))
    else Client.sendPacket(new selectedPacket.packet())
    ChatLib.chat(`Sent packet ${selectedPacket.packet.class.getSimpleName()} with args: ${args.length === 0 ? "none" : args?.toString()}.`)
}
    */
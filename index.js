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
import "./features/Serenity/SecretSpawnTimer"
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
import { rotate } from "./utils/AutoP3Utils"
import { getDistance3D, getDistanceToCoord } from "../BloomCore/utils/Utils"

register("command", () => {
    Settings().getConfig().openGui()
}).setName("catgirlyharimaddons").setAliases("catgirlyharim", "cgy")

register("command", () => ChatLib.command("joininstance CATACOMBS_ENTRANCE")).setName("f0") // Adds a command to go into entrance cause why not

register("command", (...args) => {
    const msg = args.join(" ")
    com.chattriggers.ctjs.triggers.TriggerType.PacketReceived.triggerAll(new net.minecraft.network.play.server.S02PacketChat(new net.minecraft.util.ChatComponentText(msg), 0))
}).setName("cgysimulatechatpacket")

console.error("CT loading.")

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

register("command", () => {
    fakeBan("Cheating through the use of unfair game advantages.", "29d 23h 59m 59s", "5C4C4EAD")
}).setName("fakeban")

function fakeBan(reason, length, banid) { // skidded from some ct module on the website
    Client.getMinecraft().func_147114_u().func_147298_b().func_150718_a(new net.minecraft.util.ChatComponentText(
        "§cYou are temporarily banned for §f" + length + "§c from this server!\n\n" +
        `§7Reason: §r${reason}\n` +
        "§7Find out more: §b§nhttps://www.hypixel.net/appeal\n\n§7Ban ID: §r#"
        + banid + // iteserneity banid
        "\n§7Sharing your Ban ID may affect the processing of your appeal!"))
}

/*
const C03PacketPlayer = Java.type("net.minecraft.network.play.client.C03PacketPlayer")
register("packetSent", (packet, event) => {
    Client.scheduleTask(1, () => {
        if (event.isCancelled()) return
        let msg = "c03 "
        if (packet.func_149463_k()) {
            msg += `yaw ${packet.func_149462_g()} pitch ${packet.func_149470_h()} `
        }
        if (packet.func_149466_j()) {
            msg += `x ${packet.func_149464_c()} y ${packet.func_149467_d()} z ${packet.func_149472_e()}`
        }
        if (msg === "c03 ") return
        ChatLib.chat(msg)
    })
}).setFilteredClass(C03PacketPlayer)

register("packetReceived", (packet) => {
    Client.scheduleTask(1, () => {
        ChatLib.chat(`s08 yaw ${packet.func_148931_f()} pitch ${packet.func_148930_g()}`)
    })
}).setFilteredClass(net.minecraft.network.play.server.S08PacketPlayerPosLook)
*/

/*
register("packetReceived", (packet, event) => {
    if (packet.func_149412_c() !== Player.getPlayer().func_145782_y()) return
    const x = packet.func_149411_d() / 8000
    const y = packet.func_149410_e() / 8000
    const z = packet.func_149409_f() / 8000
    // ChatLib.chat([x, y, z].toString())
}).setFilteredClass(net.minecraft.network.play.server.S12PacketEntityVelocity)


const EntityArrow = Java.type("net.minecraft.entity.projectile.EntityArrow")
const bonzoIDS = []
const arrowIDS = []

register("packetReceived", (packet, event) => {
    const entityID = packet.func_149001_c();
    if (packet.func_148993_l() !== 78) return
    const x = packet.func_148997_d() / 32
    const y = packet.func_148998_e() / 32
    const z = packet.func_148994_f() / 32
    Client.scheduleTask(5, () => {
        try {
            const entity = World.getWorld().func_73045_a(entityID);
            const item = new EntityLivingBase(entity).getItemInSlot(4)
            const itemStack = item.itemStack
            const tag = itemStack.func_77978_p()

            if (tag === null || !tag.func_74764_b("SkullOwner")) return
            const skullOwnerTag = tag.func_74781_a("SkullOwner")

            if (!(skullOwnerTag instanceof net.minecraft.nbt.NBTTagCompound)) return
            const id = skullOwnerTag.func_74779_i("Id")

            const wrappedEntity = new Entity(entity)
            // ChatLib.chat([x, y, z].toString())
            bonzoIDS.push(entityID)
        } catch (e) {
            console.log(e)
        }
    })
        */
    /*
    if (packet.func_148993_l() !== 60) return
    arrowIDS.push(entityID)
    const x = packet.func_148997_d() / 32
    const y = packet.func_148998_e() / 32
    const z = packet.func_148994_f() / 32
    ChatLib.chat(Math.sqrt((Player.x - x) ** 2 + (Player.z - z) ** 2 + (Player.y + 1 - y) ** 2))
    console.log(`Arrow spawned at ${packet.func_148997_d() / 32} ${packet.func_148998_e() / 32} ${packet.func_148994_f() / 32} with velocity ${packet.func_149010_g() / 8000} ${packet.func_149004_h() / 8000} ${packet.func_148999_i() / 8000}`)
*/
/*
}).setFilteredClass(net.minecraft.network.play.server.S0EPacketSpawnObject)

register("packetReceived", (packet) => {
    const ids = packet.func_149098_c()
    ids.forEach(id => {
        if (!bonzoIDS.includes(id)) return
        const entity = World.getWorld().func_73045_a(id);
        const wrappedEntity = new Entity(entity)
        ChatLib.chat(getDistance3D(entity.field_70165_t, entity.field_70163_u, entity.field_70161_v, entity.field_70142_S, entity.field_70137_T, entity.field_70136_U))
    })
}).setFilteredClass(net.minecraft.network.play.server.S13PacketDestroyEntities)

register("packetReceived", (packet, event) => {
    const entityID = packet.func_149412_c()
    if (!arrowIDS.includes(entityID)) return
}).setFilteredClass(net.minecraft.network.play.server.S12PacketEntityVelocity)

register("command", (yaw, pitch) => {
    if (Number.isNaN(yaw) || Number.isNaN(pitch)) return
    rotate(parseFloat(yaw), parseFloat(pitch))
}).setName("rotate")
*/
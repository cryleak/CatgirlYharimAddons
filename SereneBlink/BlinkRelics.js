import Settings from "../config"
import { chat } from "../utils/utils"
import { getDistanceToCoord, getDistanceToEntity } from "../../BloomCore/utils/Utils"
import registerTriggerbot from "../features/Serenity/Relic"

let ticksStill = 0

const standStillTicks = 28
const ArmorStand = Java.type("net.minecraft.entity.item.EntityArmorStand")
const C04PacketPlayerPosition = Java.type("net.minecraft.network.play.client.C03PacketPlayer$C04PacketPlayerPosition")
const KeyBinding = Java.type("net.minecraft.client.settings.KeyBinding")
const orangePackets = [
    [89.48818552494049, 6, 55.45217406749725, true],
    [88.58097032771286, 6.0625, 55.06903517856081, true],
    [87.498816309353, 6.0625, 54.612015400321276, true],
    [86.32114568356045, 6, 54.11465665183678, true],
    [85.09132298405203, 6, 53.59527282304026, true],
    [83.8330252489873, 6, 53.063863298996566, true],
    [82.55918014270298, 6, 52.52588774458525, true],
    [81.27684617074672, 6, 51.98432713717679, true],
    [79.98987727759527, 6, 51.44080909060454, true],
    [78.70037771717725, 6, 50.89622228212472, true],
    [77.40949641227124, 6, 50.35105192957558, true],
    [76.11786067478712, 6, 49.80556296192759, true],
    [74.82581301706753, 6, 49.259900030415416, true],
    [73.53354045087323, 6, 48.71414211462237, true],
    [72.24114508463751, 6, 48.16833233740594, true],
    [70.94868266957135, 6, 47.622494243849054, true],
    [69.65618364583952, 6, 47.076640689568485, true],
    [68.36366463377394, 6, 46.530778693731804, true],
    [67.07113470807684, 6, 45.98491208880495, true],
    [65.77859882353624, 6, 45.43904296731456, true],
    [64.48605968546673, 6, 44.89317247178034, true],
    [63.1935187709702, 6, 44.34730122601809, true],
    [61.90097688654443, 6, 43.801429570631285, true],
    [60.60843447253722, 6, 43.25555769158945, true],
    [59.31589176937851, 6.0625, 42.70968569043196, true]
]
const redPackets = [
    [23.485512018203735, 6, 57.397353172302246, true],
    [24.352063615464257, 6, 56.92946117591761, true],
    [25.38571284880744, 6, 56.37134530044137, true],
    [26.51059740204898, 6, 55.763967181259176, true],
    [27.685296445741105, 6, 55.12969187388936, true],
    [28.887194204378453, 6, 54.48073070006328, true],
    [30.103942463100815, 5.921599998474121, 53.823751042220735, false],
    [30.790707572238603, 5.766367993957519, 53.45293423265625, false],
    [31.438084322275124, 5.535840625044555, 53.10338505151027, false],
    [32.049617664496495, 5.231523797587011, 52.773189412782905, false],
    [32.628533504666045, 5, 52.46060549816404, true],
    [33.71585894068581, 5, 51.873507311886215, true],
    [34.870050703992874, 5, 51.250304849168316, true],
    [36.06075148623942, 5, 50.60738944922443, true],
    [37.2713861951423, 5, 49.95371078430497, true],
    [38.492904829263736, 5, 49.29415537602625, true],
    [39.720366087244756, 5, 48.63139126550067, true],
    [40.951072018229986, 5, 47.96687520334481, true],
    [42.18354954088129, 5, 47.30140257548772, true],
    [43.416994352694616, 5, 46.63540766269709, true],
    [44.65096730445176, 5, 45.96912758229962, true],
    [45.88522862065172, 5, 45.30269180037073, true],
    [47.11964738385575, 5, 44.636171005395816, true]
]


register("chat", () => {
    if (Settings().blinkRelics) {
        blinkRelicRegister.register()
        renderText.register()
        packetCollector.register()
    }
    if (Settings().relicAura) relicAura.register()

}).setCriteria("[BOSS] Necron: All this, for nothing...")

register("chat", resetVariables).setCriteria("[BOSS] Wither King: You... again?")
register("worldUnload", resetVariables)

function resetVariables() {
    blinkRelicRegister.unregister()
    renderText.unregister()
    packetCollector.unregister()
    relicAura.unregister()
    ticksStill = 0
}

/*
register("command", () => {
    blinkRelicRegister.unregister()
    packetCollector.unregister()
    renderText.unregister()
    if (Settings().blinkRelics && ticksStill >= standStillTicks && getDistanceToCoord(22.925, 6, 57.700) < 0.01 && Player.getPlayer().func_110148_a(net.minecraft.entity.SharedMonsterAttributes.field_111263_d).func_111126_e() > 0.49) {
        Player.setHeldItemIndex(8)
        Client.scheduleTask(0, () => {
            redPackets.forEach(packet => Client.sendPacket(new C04PacketPlayerPosition(...packet)))
            const finalPacketPos = [redPackets[redPackets.length - 1][0], redPackets[redPackets.length - 1][1], redPackets[redPackets.length - 1][2],]
            Player.getPlayer().func_70107_b(...finalPacketPos)
            registerTriggerbot("Red")
        })
    } else chat("no")
}).setName("test")
*/


// Relic aura. This code is such a fucking mess.
const Vec3 = Java.type("net.minecraft.util.Vec3")
const relicAura = register("renderWorld", () => {
    const armorStands = World.getAllEntitiesOfType(ArmorStand)
    const entity = armorStands.find(e => new EntityLivingBase(e?.getEntity()).getItemInSlot(4)?.getNBT()?.toString()?.includes("Relic") && getDistanceToEntity(e) < 4)
    if (!entity) return
    interactWithEntity(entity.getEntity())
    relicAura.unregister()
}).unregister()

const interactWithEntity = (entity) => {
    const objectMouseOver = Client.getMinecraft().field_71476_x.field_72307_f
    const dx = objectMouseOver.xCoord - entity.field_70165_t
    const dy = objectMouseOver.yCoord - entity.field_70163_u
    const dz = objectMouseOver.zCoord - entity.field_70161_v
    const packet = new net.minecraft.network.play.client.C02PacketUseEntity(entity, new Vec3(dx, dy, dz))
    Client.sendPacket(packet)
    const helmetName = ChatLib.removeFormatting(new Item(entity.func_82169_q(3)).getName())
    if (Settings().blinkRelics) performTeleport(helmetName)
}

const blinkRelicRegister = register("tick", () => {
    if (!Player.getPlayer().field_70124_G || Player.getPlayer().field_70159_w !== 0 || Player.getPlayer().field_70179_y !== 0) ticksStill = 0
    else if (ticksStill < standStillTicks) ticksStill++
}).unregister()

const packetCollector = register("packetSent", (packet, event) => {
    if (getDistanceToCoord(90.075, 6, 55.700) < 0.01 || getDistanceToCoord(22.925, 6, 57.700) < 0.01) if (ticksStill !== 0) cancel(event)
}).setFilteredClasses([net.minecraft.network.play.client.C03PacketPlayer]).unregister()

const renderText = register("renderOverlay", () => {
    Renderer.scale(2)
    const text = `§cBLINK READY IN ${standStillTicks - ticksStill} TICKS`
    Renderer.drawString(text, Renderer.screen.getWidth() / 4 - Renderer.getStringWidth(text) / 2, Renderer.screen.getHeight() / 3.8)
}).unregister()


// This is the peak of lazy coding. It features reused code from my old RelicLook feature that has awful code. I will clean this up if I feel like it.
const performTeleport = (helmetName) => {
    blinkRelicRegister.unregister()
    packetCollector.unregister()
    renderText.unregister()

    if (Settings().relicLook) {
        if (helmetName === "Corrupted Orange Relic") {
            if (Settings().blinkRelics && ticksStill >= standStillTicks && getDistanceToCoord(90.075, 6, 55.700) < 0.01 && Player.getPlayer().func_110148_a(net.minecraft.entity.SharedMonsterAttributes.field_111263_d).func_111126_e() > 0.49) {
                Player.setHeldItemIndex(8)
                Client.scheduleTask(0, () => {
                    orangePackets.forEach(packet => Client.sendPacket(new C04PacketPlayerPosition(...packet)))
                    const finalPacketPos = [orangePackets[orangePackets.length - 1][0], orangePackets[orangePackets.length - 1][1], orangePackets[orangePackets.length - 1][2],]
                    Player.getPlayer().func_70107_b(...finalPacketPos)
                    registerTriggerbot("Orange")
                })
            } else KeyBinding.func_74510_a(Client.getMinecraft().field_71474_y.field_74351_w.func_151463_i(), true)

        } else if (helmetName === "Corrupted Red Relic") {
            if (Settings().blinkRelics && ticksStill >= standStillTicks && getDistanceToCoord(22.925, 6, 57.700) < 0.01 && Player.getPlayer().func_110148_a(net.minecraft.entity.SharedMonsterAttributes.field_111263_d).func_111126_e() > 0.49) {
                Player.setHeldItemIndex(8)
                Client.scheduleTask(0, () => {
                    redPackets.forEach(packet => Client.sendPacket(new C04PacketPlayerPosition(...packet)))
                    const finalPacketPos = [redPackets[redPackets.length - 1][0], redPackets[redPackets.length - 1][1], redPackets[redPackets.length - 1][2],]
                    Player.getPlayer().func_70107_b(...finalPacketPos)
                    registerTriggerbot("Red")
                })
            } else KeyBinding.func_74510_a(Client.getMinecraft().field_71474_y.field_74351_w.func_151463_i(), true)
        }
    }
    ticksStill = 0
}
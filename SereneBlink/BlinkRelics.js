import Settings from "../config"
import { chat } from "../utils/utils"
import { getDistanceToCoord, getDistanceToEntity, title } from "../../BloomCore/utils/Utils"
import registerTriggerbot from "../features/Serenity/Relic"

const standStillTicks = 28
const ArmorStand = Java.type("net.minecraft.entity.item.EntityArmorStand")
const C03PacketPlayer = Java.type("net.minecraft.network.play.client.C03PacketPlayer")
const C04PacketPlayerPosition = Java.type("net.minecraft.network.play.client.C03PacketPlayer$C04PacketPlayerPosition")
const KeyBinding = Java.type("net.minecraft.client.settings.KeyBinding")
const m = []
const orangePackets = [
    [89.49532717466354, 6, 55.435900926589966, true],
    [88.59915296836067, 6.0625, 55.02760376077882, true],
    [87.53016898146899, 6.0625, 54.54057442086289, true],
    [86.36683084341635, 6, 54.01055730889261, true],
    [85.15197533284594, 6, 53.45706887065439, true],
    [83.90899133361363, 6, 52.89076508678534, true],
    [82.65064917778804, 6, 52.31746412338913, true],
    [81.3839214674885, 6, 51.74034269952732, true],
    [80.11261524391439, 6, 51.161135304009, true],
    [78.838809151802, 6, 50.580788967833946, true],
    [77.56363813130916, 6, 49.99982076998808, true],
    [76.28772185983404, 6, 49.418513035630504, true],
    [75.01139868127532, 6, 48.83701991431601, true],
    [73.73485333142317, 6, 48.25542557171128, true],
    [72.45818667603069, 6, 47.67377596227566, true],
    [71.18145378780551, 6, 47.09209617714687, true],
    [69.90468473644947, 6, 46.5103999160877, true],
    [68.62789594002169, 6, 45.928694659169494, true],
    [67.3510963627835, 6, 45.34698449051168, true],
    [66.07429089922212, 6, 44.765271640043736, true],
    [64.79748222172792, 6, 44.183557325307284, true],
    [63.52067178942619, 6, 43.60184221108014, true],
    [62.243860398999445, 6, 43.02012666033102, true],
    [60.96704848543637, 6, 42.43841087124088, true],
    [59.69023628624084, 6, 41.856694952016525, true],
    [58.41342393108996, 6, 41.27497896173888, true]
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
        renderText.register()
        packetCollector.register()
    }
    if (Settings().relicAura) relicAura.register()

}).setCriteria("[BOSS] Necron: All this, for nothing...")

register("chat", resetVariables).setCriteria("[BOSS] Wither King: You... again?")
register("worldUnload", resetVariables)

function resetVariables() {
    renderText.unregister()
    packetCollector.unregister()
    relicAura.unregister()
    while (m.length) m.pop()
}

/*
register("command", () => {
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
    const entity = armorStands.find(e => new EntityLivingBase(e?.getEntity()).getItemInSlot(4)?.getNBT()?.toString()?.includes("Relic") && getDistanceToEntity(e) < 4.5)
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

register("packetSent", (packet, event) => {
    Client.scheduleTask(0, () => {
        if (event.isCancelled()) m.push(Date.now())
        else m.pop()

        while (m.length && Date.now() - m[0] > 10000) m.shift()
    })
}).setFilteredClasses([C03PacketPlayer])

const packetCollector = register("packetSent", (packet, event) => {
    if (getDistanceToCoord(90.075, 6, 55.700) < 0.05 || getDistanceToCoord(22.925, 6, 57.700) < 0.05) cancel(event)
}).setFilteredClasses([C03PacketPlayer]).unregister()

const renderText = register("renderOverlay", () => {
    Renderer.scale(2)
    const t = standStillTicks - m.length
    const text = `§cBLINK READY IN ${t <= 0 ? 0 : t} TICKS`
    Renderer.drawString(text, Renderer.screen.getWidth() / 4 - Renderer.getStringWidth(text) / 2, Renderer.screen.getHeight() / 3.8)
}).unregister()


// This is the peak of lazy coding. It features reused code from my old RelicLook feature that has awful code. I will clean this up if I feel like it.
const performTeleport = (helmetName) => {
    packetCollector.unregister()
    renderText.unregister()

    if (Settings().relicLook) {
        if (helmetName === "Corrupted Orange Relic") {
            if (Settings().blinkRelics && m.length >= standStillTicks && getDistanceToCoord(90.075, 6, 55.700) < 0.05 && Player.getPlayer().func_110148_a(net.minecraft.entity.SharedMonsterAttributes.field_111263_d).func_111126_e() > 0.49) {
                Player.setHeldItemIndex(8)
                Client.scheduleTask(0, () => {
                    rotate(40, 0) // im so fucking lazy
                    orangePackets.forEach(packet => Client.sendPacket(new C04PacketPlayerPosition(...packet)))
                    const finalPacketPos = [orangePackets[orangePackets.length - 1][0], orangePackets[orangePackets.length - 1][1], orangePackets[orangePackets.length - 1][2],]
                    Player.getPlayer().func_70107_b(...finalPacketPos)
                    registerTriggerbot("Orange")
                })
            } else KeyBinding.func_74510_a(Client.getMinecraft().field_71474_y.field_74351_w.func_151463_i(), true)

        } else if (helmetName === "Corrupted Red Relic") {
            if (Settings().blinkRelics && m.length >= standStillTicks && getDistanceToCoord(22.925, 6, 57.700) < 0.05 && Player.getPlayer().func_110148_a(net.minecraft.entity.SharedMonsterAttributes.field_111263_d).func_111126_e() > 0.49) {
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
}

function rotate(yaw, pitch) {
    const player = Player.getPlayer()
    player.field_70177_z = yaw
    player.field_70125_A = pitch
}
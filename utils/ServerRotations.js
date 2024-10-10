class ServerRotations {
    constructor() {
        register("packetSent", (packet, event) => {
            if (this.sending) return
            if (!this.yaw || !this.pitch || Player.getPlayer().field_70154_o) return
            if (this.yaw == packet.func_149462_g() && this.pitch == packet.func_149470_h()) return
            if (!event.isCancelled()) cancel(event)
            this.sending = true
            let wasOnGround = packet.func_149465_i()
            if (this.yaw && this.pitch) {
                if (packet.class.getSimpleName() == "C05PacketPlayerLook") Client.sendPacket(
                    new net.minecraft.network.play.client.C03PacketPlayer$C05PacketPlayerLook(
                        this.yaw,
                        this.pitch,
                        wasOnGround
                    )
                )
                else Client.sendPacket(
                    new net.minecraft.network.play.client.C03PacketPlayer$C06PacketPlayerPosLook(
                        Player.getX(),
                        Player.getPlayer().func_174813_aQ().field_72338_b,
                        Player.getZ(),
                        this.yaw,
                        this.pitch,
                        wasOnGround
                    )
                )
            }
            if (this.resetRot) {
                this.resetRot = false
                this.yaw = null
                this.pitch = null
            }
            this.sending = false
        }).setPacketClasses([net.minecraft.network.play.client.C03PacketPlayer])

        register("renderEntity", (entity) => {
            if (entity.getEntity() != Player.getPlayer() || !this.yaw || !this.pitch || Player.getPlayer().field_70154_o) return
            Player.getPlayer().field_70761_aq = this.yaw
            Player.getPlayer().field_70759_as = this.yaw
        })

        register("gameUnload", this.reset)
    }

    set(y, p) {
        this.yaw = y
        this.pitch = p
    }

    reset() {
        this.yaw = null
        this.pitch = null
    }

    resetRotations() {
        this.set(Player.getYaw(), Player.getPitch())
        this.resetRot = true
    }

}

export default new ServerRotations()